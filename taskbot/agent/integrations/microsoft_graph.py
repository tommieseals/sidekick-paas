"""
Microsoft Graph API Integration for TaskBot
Provides access to Office 365: Outlook, Calendar, OneDrive, Excel, SharePoint, Teams
"""

import os
import json
import base64
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import httpx


class MicrosoftGraphClient:
    """Microsoft Graph API client for Office 365 automation."""
    
    BASE_URL = "https://graph.microsoft.com/v1.0"
    AUTH_URL = "https://login.microsoftonline.com"
    
    def __init__(self):
        self.tenant_id = os.getenv("AZURE_TENANT_ID")
        self.client_id = os.getenv("AZURE_CLIENT_ID")
        self.client_secret = os.getenv("AZURE_CLIENT_SECRET")
        self.access_token: Optional[str] = None
        self.token_expires: Optional[datetime] = None
        
    async def _get_token(self) -> str:
        """Get or refresh OAuth2 access token."""
        if self.access_token and self.token_expires and datetime.now() < self.token_expires:
            return self.access_token
            
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.AUTH_URL}/{self.tenant_id}/oauth2/v2.0/token",
                data={
                    "grant_type": "client_credentials",
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "scope": "https://graph.microsoft.com/.default"
                }
            )
            response.raise_for_status()
            data = response.json()
            
            self.access_token = data["access_token"]
            self.token_expires = datetime.now() + timedelta(seconds=data["expires_in"] - 60)
            return self.access_token
    
    async def _request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        """Make authenticated request to Graph API."""
        token = await self._get_token()
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.request(
                method,
                f"{self.BASE_URL}{endpoint}",
                headers=headers,
                **kwargs
            )
            response.raise_for_status()
            return response.json() if response.content else {}
    
    # ==================== OUTLOOK EMAIL ====================
    
    async def list_emails(
        self,
        user_id: str = "me",
        folder: str = "inbox",
        top: int = 25,
        filter_unread: bool = False,
        search: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        List emails from a user's mailbox.
        
        Args:
            user_id: User ID or 'me' for service account
            folder: Mail folder (inbox, sentitems, drafts, etc.)
            top: Number of messages to return
            filter_unread: Only return unread messages
            search: Search query string
        """
        params = {"$top": top, "$orderby": "receivedDateTime desc"}
        
        if filter_unread:
            params["$filter"] = "isRead eq false"
        if search:
            params["$search"] = f'"{search}"'
            
        result = await self._request(
            "GET",
            f"/users/{user_id}/mailFolders/{folder}/messages",
            params=params
        )
        return result.get("value", [])
    
    async def get_email(self, user_id: str, message_id: str) -> Dict[str, Any]:
        """Get a specific email with full content."""
        return await self._request("GET", f"/users/{user_id}/messages/{message_id}")
    
    async def send_email(
        self,
        user_id: str,
        to: List[str],
        subject: str,
        body: str,
        cc: Optional[List[str]] = None,
        bcc: Optional[List[str]] = None,
        attachments: Optional[List[Dict[str, Any]]] = None,
        html: bool = True
    ) -> Dict[str, Any]:
        """
        Send an email.
        
        Args:
            user_id: Sender user ID
            to: List of recipient email addresses
            subject: Email subject
            body: Email body content
            cc: CC recipients
            bcc: BCC recipients
            attachments: List of {name, content_bytes, content_type}
            html: Whether body is HTML
        """
        message = {
            "subject": subject,
            "body": {
                "contentType": "HTML" if html else "Text",
                "content": body
            },
            "toRecipients": [{"emailAddress": {"address": addr}} for addr in to]
        }
        
        if cc:
            message["ccRecipients"] = [{"emailAddress": {"address": addr}} for addr in cc]
        if bcc:
            message["bccRecipients"] = [{"emailAddress": {"address": addr}} for addr in bcc]
        if attachments:
            message["attachments"] = [
                {
                    "@odata.type": "#microsoft.graph.fileAttachment",
                    "name": att["name"],
                    "contentType": att.get("content_type", "application/octet-stream"),
                    "contentBytes": base64.b64encode(att["content_bytes"]).decode()
                }
                for att in attachments
            ]
            
        return await self._request(
            "POST",
            f"/users/{user_id}/sendMail",
            json={"message": message}
        )
    
    async def reply_to_email(
        self,
        user_id: str,
        message_id: str,
        body: str,
        reply_all: bool = False
    ) -> Dict[str, Any]:
        """Reply to an email."""
        endpoint = "replyAll" if reply_all else "reply"
        return await self._request(
            "POST",
            f"/users/{user_id}/messages/{message_id}/{endpoint}",
            json={"comment": body}
        )
    
    async def move_email(
        self,
        user_id: str,
        message_id: str,
        destination_folder: str
    ) -> Dict[str, Any]:
        """Move email to another folder."""
        return await self._request(
            "POST",
            f"/users/{user_id}/messages/{message_id}/move",
            json={"destinationId": destination_folder}
        )
    
    # ==================== CALENDAR ====================
    
    async def list_events(
        self,
        user_id: str = "me",
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        top: int = 50
    ) -> List[Dict[str, Any]]:
        """
        List calendar events.
        
        Args:
            user_id: User ID
            start_date: Start of date range (default: now)
            end_date: End of date range (default: 7 days from now)
            top: Max events to return
        """
        start = start_date or datetime.now()
        end = end_date or (datetime.now() + timedelta(days=7))
        
        result = await self._request(
            "GET",
            f"/users/{user_id}/calendarView",
            params={
                "startDateTime": start.isoformat() + "Z",
                "endDateTime": end.isoformat() + "Z",
                "$top": top,
                "$orderby": "start/dateTime"
            }
        )
        return result.get("value", [])
    
    async def create_event(
        self,
        user_id: str,
        subject: str,
        start: datetime,
        end: datetime,
        attendees: Optional[List[str]] = None,
        location: Optional[str] = None,
        body: Optional[str] = None,
        is_online_meeting: bool = False
    ) -> Dict[str, Any]:
        """Create a calendar event."""
        event = {
            "subject": subject,
            "start": {
                "dateTime": start.isoformat(),
                "timeZone": "UTC"
            },
            "end": {
                "dateTime": end.isoformat(),
                "timeZone": "UTC"
            }
        }
        
        if attendees:
            event["attendees"] = [
                {"emailAddress": {"address": addr}, "type": "required"}
                for addr in attendees
            ]
        if location:
            event["location"] = {"displayName": location}
        if body:
            event["body"] = {"contentType": "HTML", "content": body}
        if is_online_meeting:
            event["isOnlineMeeting"] = True
            event["onlineMeetingProvider"] = "teamsForBusiness"
            
        return await self._request("POST", f"/users/{user_id}/events", json=event)
    
    async def delete_event(self, user_id: str, event_id: str) -> None:
        """Delete a calendar event."""
        await self._request("DELETE", f"/users/{user_id}/events/{event_id}")
    
    # ==================== ONEDRIVE ====================
    
    async def list_files(
        self,
        user_id: str = "me",
        path: str = "/",
        top: int = 100
    ) -> List[Dict[str, Any]]:
        """List files in OneDrive."""
        if path == "/":
            endpoint = f"/users/{user_id}/drive/root/children"
        else:
            endpoint = f"/users/{user_id}/drive/root:{path}:/children"
            
        result = await self._request("GET", endpoint, params={"$top": top})
        return result.get("value", [])
    
    async def get_file_content(self, user_id: str, file_path: str) -> bytes:
        """Download file content from OneDrive."""
        token = await self._get_token()
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/users/{user_id}/drive/root:{file_path}:/content",
                headers={"Authorization": f"Bearer {token}"},
                follow_redirects=True
            )
            response.raise_for_status()
            return response.content
    
    async def upload_file(
        self,
        user_id: str,
        file_path: str,
        content: bytes,
        content_type: str = "application/octet-stream"
    ) -> Dict[str, Any]:
        """Upload a file to OneDrive (up to 4MB, use upload_large_file for bigger)."""
        token = await self._get_token()
        async with httpx.AsyncClient() as client:
            response = await client.put(
                f"{self.BASE_URL}/users/{user_id}/drive/root:{file_path}:/content",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": content_type
                },
                content=content
            )
            response.raise_for_status()
            return response.json()
    
    async def create_sharing_link(
        self,
        user_id: str,
        item_id: str,
        link_type: str = "view",
        scope: str = "anonymous"
    ) -> Dict[str, Any]:
        """Create a sharing link for a file."""
        return await self._request(
            "POST",
            f"/users/{user_id}/drive/items/{item_id}/createLink",
            json={"type": link_type, "scope": scope}
        )
    
    # ==================== EXCEL ====================
    
    async def get_excel_worksheets(
        self,
        user_id: str,
        file_path: str
    ) -> List[Dict[str, Any]]:
        """Get list of worksheets in an Excel file."""
        result = await self._request(
            "GET",
            f"/users/{user_id}/drive/root:{file_path}:/workbook/worksheets"
        )
        return result.get("value", [])
    
    async def read_excel_range(
        self,
        user_id: str,
        file_path: str,
        worksheet: str,
        range_address: str
    ) -> Dict[str, Any]:
        """
        Read data from an Excel range.
        
        Args:
            file_path: Path to Excel file in OneDrive
            worksheet: Worksheet name
            range_address: Range like "A1:D10" or "A:D"
        """
        return await self._request(
            "GET",
            f"/users/{user_id}/drive/root:{file_path}:/workbook/worksheets/{worksheet}/range(address='{range_address}')"
        )
    
    async def write_excel_range(
        self,
        user_id: str,
        file_path: str,
        worksheet: str,
        range_address: str,
        values: List[List[Any]]
    ) -> Dict[str, Any]:
        """
        Write data to an Excel range.
        
        Args:
            values: 2D array of values to write
        """
        return await self._request(
            "PATCH",
            f"/users/{user_id}/drive/root:{file_path}:/workbook/worksheets/{worksheet}/range(address='{range_address}')",
            json={"values": values}
        )
    
    async def add_excel_table(
        self,
        user_id: str,
        file_path: str,
        worksheet: str,
        range_address: str,
        has_headers: bool = True
    ) -> Dict[str, Any]:
        """Create a table from a range."""
        return await self._request(
            "POST",
            f"/users/{user_id}/drive/root:{file_path}:/workbook/worksheets/{worksheet}/tables/add",
            json={"address": range_address, "hasHeaders": has_headers}
        )
    
    # ==================== SHAREPOINT ====================
    
    async def list_sharepoint_sites(self, search: Optional[str] = None) -> List[Dict[str, Any]]:
        """List SharePoint sites."""
        params = {}
        if search:
            params["search"] = search
        result = await self._request("GET", "/sites", params=params)
        return result.get("value", [])
    
    async def get_sharepoint_lists(self, site_id: str) -> List[Dict[str, Any]]:
        """Get lists in a SharePoint site."""
        result = await self._request("GET", f"/sites/{site_id}/lists")
        return result.get("value", [])
    
    async def get_list_items(
        self,
        site_id: str,
        list_id: str,
        top: int = 100
    ) -> List[Dict[str, Any]]:
        """Get items from a SharePoint list."""
        result = await self._request(
            "GET",
            f"/sites/{site_id}/lists/{list_id}/items",
            params={"$expand": "fields", "$top": top}
        )
        return result.get("value", [])
    
    async def create_list_item(
        self,
        site_id: str,
        list_id: str,
        fields: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Create an item in a SharePoint list."""
        return await self._request(
            "POST",
            f"/sites/{site_id}/lists/{list_id}/items",
            json={"fields": fields}
        )
    
    # ==================== TEAMS ====================
    
    async def list_teams(self, user_id: str = "me") -> List[Dict[str, Any]]:
        """List Teams the user is a member of."""
        result = await self._request("GET", f"/users/{user_id}/joinedTeams")
        return result.get("value", [])
    
    async def list_channels(self, team_id: str) -> List[Dict[str, Any]]:
        """List channels in a Team."""
        result = await self._request("GET", f"/teams/{team_id}/channels")
        return result.get("value", [])
    
    async def send_channel_message(
        self,
        team_id: str,
        channel_id: str,
        content: str,
        content_type: str = "html"
    ) -> Dict[str, Any]:
        """Send a message to a Teams channel."""
        return await self._request(
            "POST",
            f"/teams/{team_id}/channels/{channel_id}/messages",
            json={
                "body": {
                    "contentType": content_type,
                    "content": content
                }
            }
        )
    
    async def create_online_meeting(
        self,
        user_id: str,
        subject: str,
        start: datetime,
        end: datetime,
        attendees: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Create a Teams online meeting."""
        meeting = {
            "subject": subject,
            "startDateTime": start.isoformat() + "Z",
            "endDateTime": end.isoformat() + "Z"
        }
        
        if attendees:
            meeting["participants"] = {
                "attendees": [
                    {"emailAddress": {"address": addr}}
                    for addr in attendees
                ]
            }
            
        return await self._request("POST", f"/users/{user_id}/onlineMeetings", json=meeting)
    
    # ==================== USERS ====================
    
    async def get_user(self, user_id: str) -> Dict[str, Any]:
        """Get user profile information."""
        return await self._request("GET", f"/users/{user_id}")
    
    async def list_users(
        self,
        top: int = 100,
        filter_str: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """List users in the organization."""
        params = {"$top": top}
        if filter_str:
            params["$filter"] = filter_str
        result = await self._request("GET", "/users", params=params)
        return result.get("value", [])
    
    async def get_user_photo(self, user_id: str) -> bytes:
        """Get user's profile photo."""
        token = await self._get_token()
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/users/{user_id}/photo/$value",
                headers={"Authorization": f"Bearer {token}"}
            )
            response.raise_for_status()
            return response.content


# Convenience functions for TaskBot integration
_client: Optional[MicrosoftGraphClient] = None


def get_client() -> MicrosoftGraphClient:
    """Get or create the Microsoft Graph client."""
    global _client
    if _client is None:
        _client = MicrosoftGraphClient()
    return _client


# Export all major functions
async def list_emails(**kwargs):
    return await get_client().list_emails(**kwargs)

async def send_email(**kwargs):
    return await get_client().send_email(**kwargs)

async def list_events(**kwargs):
    return await get_client().list_events(**kwargs)

async def create_event(**kwargs):
    return await get_client().create_event(**kwargs)

async def list_files(**kwargs):
    return await get_client().list_files(**kwargs)

async def upload_file(**kwargs):
    return await get_client().upload_file(**kwargs)

async def read_excel_range(**kwargs):
    return await get_client().read_excel_range(**kwargs)

async def write_excel_range(**kwargs):
    return await get_client().write_excel_range(**kwargs)

async def send_channel_message(**kwargs):
    return await get_client().send_channel_message(**kwargs)
