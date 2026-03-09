"""
PROJECT LEGION - LinkedIn Scraper with Persistent Chrome Profile
Uses logged-in session from chrome-automation profile for better access
"""
import asyncio
import random
from typing import List, Dict, Optional
from datetime import datetime
from pathlib import Path
import json
import re

try:
    from loguru import logger
except ImportError:
    import logging
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter('%(asctime)s | %(levelname)s | %(message)s'))
        logger.addHandler(handler)

from playwright.async_api import async_playwright, Page, BrowserContext, TimeoutError as PlaywrightTimeout


class LinkedInScraper:
    """LinkedIn scraper using persistent Chrome profile with logged-in session"""
    
    PROFILE_PATH = Path.home() / "job-hunter-system/data/chrome-automation"
    SCREENSHOTS_DIR = Path.home() / "job-hunter-system/data/screenshots"
    
    def __init__(self, headless: bool = True):
        self.headless = headless
        self.playwright = None
        self.context: BrowserContext = None
        self.page: Page = None
        self.logged_in = False
        
        # Ensure directories exist
        self.SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)
    
    async def setup(self):
        """Initialize browser with persistent profile"""
        self.playwright = await async_playwright().start()
        
        logger.info(f"LinkedIn: Using Chrome profile at {self.PROFILE_PATH}")
        
        # Use persistent context to load cookies/login from existing Chrome profile
        self.context = await self.playwright.chromium.launch_persistent_context(
            user_data_dir=str(self.PROFILE_PATH),
            headless=self.headless,
            viewport={'width': 1920, 'height': 1080},
            locale='en-US',
            timezone_id='America/Chicago',
            args=[
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-notifications',
                '--disable-infobars',
            ],
        )
        
        # Anti-detection scripts
        await self.context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
            Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
            Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
            window.chrome = { runtime: {} };
        """)
        
        # Get or create page
        pages = self.context.pages
        if pages:
            self.page = pages[0]
        else:
            self.page = await self.context.new_page()
        
        logger.info("LinkedIn: Browser initialized with persistent profile")
    
    async def teardown(self):
        """Cleanup browser"""
        try:
            if self.context:
                await self.context.close()
            if self.playwright:
                await self.playwright.stop()
        except Exception as e:
            logger.debug(f"LinkedIn: Teardown warning: {e}")
    
    async def human_delay(self, min_ms: int = 500, max_ms: int = 2000):
        """Human-like delay"""
        await asyncio.sleep(random.uniform(min_ms, max_ms) / 1000)
    
    async def human_scroll(self, distance: int = None):
        """Human-like scroll"""
        if distance is None:
            distance = random.randint(300, 700)
        await self.page.evaluate(f"window.scrollBy({{ top: {distance}, behavior: 'smooth' }})")
        await self.human_delay(300, 800)
    
    async def check_login_status(self) -> bool:
        """Check if we're logged into LinkedIn"""
        try:
            await self.page.goto("https://www.linkedin.com/feed/", wait_until='domcontentloaded', timeout=30000)
            await self.human_delay(2000, 3000)
            
            # Check for login indicators
            url = self.page.url
            
            if '/login' in url or '/checkpoint' in url:
                logger.warning("LinkedIn: Not logged in (redirected to login)")
                return False
            
            # Look for feed elements that only exist when logged in
            try:
                await self.page.wait_for_selector('.feed-shared-update-v2', timeout=5000)
                logger.info("LinkedIn: Logged in (found feed)")
                return True
            except:
                pass
            
            # Alternative: check for profile icon
            try:
                await self.page.wait_for_selector('.global-nav__me', timeout=3000)
                logger.info("LinkedIn: Logged in (found profile nav)")
                return True
            except:
                pass
            
            logger.warning("LinkedIn: Login status unclear")
            return False
            
        except Exception as e:
            logger.error(f"LinkedIn: Login check failed: {e}")
            return False
    
    async def save_screenshot(self, name: str):
        """Save debug screenshot"""
        try:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            path = self.SCREENSHOTS_DIR / f"linkedin_{name}_{timestamp}.png"
            await self.page.screenshot(path=str(path))
            logger.info(f"LinkedIn: Screenshot saved to {path}")
            return str(path)
        except Exception as e:
            logger.debug(f"LinkedIn: Screenshot failed: {e}")
            return None
    
    async def search_jobs_guest(self, query: str, location: str = "Remote") -> List[Dict]:
        """Search LinkedIn jobs without login (guest/public view)"""
        jobs = []
        
        # Build search URL (guest-accessible)
        keywords = query.replace(' ', '%20')
        loc = location.replace(' ', '%20')
        search_url = f"https://www.linkedin.com/jobs/search?keywords={keywords}&location={loc}&f_WT=2"  # f_WT=2 = Remote
        
        logger.info(f"LinkedIn: Searching (guest): {query} in {location}")
        
        try:
            await self.page.goto(search_url, wait_until='domcontentloaded', timeout=30000)
            await self.human_delay(2000, 4000)
            
            # Scroll to load jobs
            for _ in range(3):
                await self.human_scroll()
            
            # Look for job cards (guest view uses different selectors)
            selectors = [
                '.base-card',
                '.job-search-card',
                '.jobs-search__results-list li',
                '[data-tracking-control-name="public_jobs_jserp-result"]'
            ]
            
            job_cards = []
            for selector in selectors:
                job_cards = await self.page.query_selector_all(selector)
                if job_cards:
                    logger.info(f"LinkedIn: Found {len(job_cards)} jobs with selector: {selector}")
                    break
            
            if not job_cards:
                logger.warning("LinkedIn: No job cards found")
                await self.save_screenshot("no_jobs")
                return []
            
            # Extract job data
            for i, card in enumerate(job_cards[:20]):
                try:
                    job = await self._extract_job_from_card(card, i)
                    if job:
                        jobs.append(job)
                        await self.human_delay(50, 150)
                except Exception as e:
                    logger.debug(f"LinkedIn: Card {i} extraction failed: {e}")
                    continue
            
            logger.info(f"LinkedIn: Extracted {len(jobs)} jobs")
            return jobs
            
        except Exception as e:
            logger.error(f"LinkedIn: Guest search failed: {e}")
            await self.save_screenshot("error")
            return []
    
    async def search_jobs_logged_in(self, query: str, location: str = "Remote") -> List[Dict]:
        """Search LinkedIn jobs while logged in (more data available)"""
        jobs = []
        
        # Build logged-in search URL
        keywords = query.replace(' ', '%20')
        loc = location.replace(' ', '%20')
        search_url = f"https://www.linkedin.com/jobs/search/?keywords={keywords}&location={loc}&f_WT=2"
        
        logger.info(f"LinkedIn: Searching (logged in): {query} in {location}")
        
        try:
            await self.page.goto(search_url, wait_until='domcontentloaded', timeout=30000)
            await self.human_delay(2000, 4000)
            
            # Wait for job list
            try:
                await self.page.wait_for_selector('.jobs-search__results-list', timeout=15000)
            except:
                # Try alternative selectors
                try:
                    await self.page.wait_for_selector('.scaffold-layout__list-container', timeout=10000)
                except:
                    logger.warning("LinkedIn: Job list not found")
                    await self.save_screenshot("no_list")
            
            # Scroll to load more
            for _ in range(3):
                await self.human_scroll(500)
            
            # Find job cards (logged-in view)
            selectors = [
                '.job-card-container',
                '.jobs-search-results__list-item',
                '.scaffold-layout__list-item',
                'li.jobs-search-results__list-item'
            ]
            
            job_cards = []
            for selector in selectors:
                job_cards = await self.page.query_selector_all(selector)
                if job_cards:
                    logger.info(f"LinkedIn: Found {len(job_cards)} jobs (selector: {selector})")
                    break
            
            if not job_cards:
                # Fall back to guest search
                logger.warning("LinkedIn: Logged-in search failed, trying guest mode")
                return await self.search_jobs_guest(query, location)
            
            # Extract job data
            for i, card in enumerate(job_cards[:25]):
                try:
                    job = await self._extract_job_logged_in(card, i)
                    if job:
                        jobs.append(job)
                        await self.human_delay(50, 150)
                except Exception as e:
                    logger.debug(f"LinkedIn: Card {i} failed: {e}")
                    continue
            
            logger.info(f"LinkedIn: Extracted {len(jobs)} jobs (logged in)")
            return jobs
            
        except Exception as e:
            logger.error(f"LinkedIn: Logged-in search failed: {e}")
            await self.save_screenshot("error_logged_in")
            return []
    
    async def _extract_job_from_card(self, card, index: int) -> Optional[Dict]:
        """Extract job data from a guest-view card"""
        try:
            # Title
            title_elem = await card.query_selector('.base-search-card__title, h3, .job-search-card__title')
            title = await title_elem.inner_text() if title_elem else None
            if not title:
                return None
            
            # Company
            company_elem = await card.query_selector('.base-search-card__subtitle, h4, .job-search-card__company-name, a[data-tracking-control-name*="company"]')
            company = await company_elem.inner_text() if company_elem else "Unknown"
            
            # Location
            loc_elem = await card.query_selector('.job-search-card__location, .job-card-container__metadata-item')
            location = await loc_elem.inner_text() if loc_elem else "Remote"
            
            # URL
            link_elem = await card.query_selector('a.base-card__full-link, a[href*="/jobs/view/"]')
            url = await link_elem.get_attribute('href') if link_elem else ""
            
            # Extract job ID from URL
            job_id = "unknown"
            if url:
                match = re.search(r'/jobs/view/(\d+)', url)
                if match:
                    job_id = match.group(1)
            
            # Posted date
            time_elem = await card.query_selector('time')
            posted = None
            if time_elem:
                posted = await time_elem.get_attribute('datetime')
            
            return {
                "id": f"linkedin-{job_id}",
                "title": title.strip(),
                "company": company.strip(),
                "location": location.strip(),
                "url": url if url.startswith('http') else f"https://www.linkedin.com{url}",
                "platform": "LinkedIn",
                "posted_date": posted or datetime.now().isoformat(),
                "description": "",
                "salary": None,
                "remote": "remote" in location.lower() or True  # We filtered for remote
            }
            
        except Exception as e:
            logger.debug(f"LinkedIn: Extract card {index} error: {e}")
            return None
    
    async def _extract_job_logged_in(self, card, index: int) -> Optional[Dict]:
        """Extract job data from logged-in view card"""
        try:
            # Title (logged-in has different structure)
            title_elem = await card.query_selector('.job-card-list__title, .artdeco-entity-lockup__title, strong')
            title = await title_elem.inner_text() if title_elem else None
            if not title:
                return None
            
            # Company
            company_elem = await card.query_selector('.job-card-container__company-name, .artdeco-entity-lockup__subtitle span, .job-card-container__primary-description')
            company = await company_elem.inner_text() if company_elem else "Unknown"
            
            # Location
            loc_elem = await card.query_selector('.job-card-container__metadata-item, .job-card-container__metadata-wrapper li')
            location = await loc_elem.inner_text() if loc_elem else "Remote"
            
            # URL - logged in view uses data attributes or href
            url = ""
            link = await card.query_selector('a[href*="/jobs/view/"]')
            if link:
                url = await link.get_attribute('href')
            
            # Try to get from card itself
            if not url:
                job_id_attr = await card.get_attribute('data-job-id')
                if job_id_attr:
                    url = f"https://www.linkedin.com/jobs/view/{job_id_attr}/"
            
            # Job ID
            job_id = "unknown"
            if url:
                match = re.search(r'/jobs/view/(\d+)', url)
                if match:
                    job_id = match.group(1)
            
            # Salary (sometimes shown for logged-in users)
            salary = None
            salary_elem = await card.query_selector('.job-card-container__salary-info, [data-test-job-salary]')
            if salary_elem:
                salary = await salary_elem.inner_text()
            
            return {
                "id": f"linkedin-{job_id}",
                "title": title.strip(),
                "company": company.strip(),
                "location": location.strip(),
                "url": url if url.startswith('http') else f"https://www.linkedin.com{url}",
                "platform": "LinkedIn",
                "posted_date": datetime.now().isoformat(),
                "description": "",
                "salary": salary.strip() if salary else None,
                "remote": True
            }
            
        except Exception as e:
            logger.debug(f"LinkedIn: Extract logged-in card {index} error: {e}")
            return None
    
    async def search(self, query: str, location: str = "Remote") -> List[Dict]:
        """Main search method - auto-detects login status"""
        await self.setup()
        
        try:
            # Check if we're logged in
            self.logged_in = await self.check_login_status()
            
            if self.logged_in:
                logger.info("LinkedIn: Using logged-in search (more data)")
                jobs = await self.search_jobs_logged_in(query, location)
            else:
                logger.info("LinkedIn: Using guest search (public jobs)")
                jobs = await self.search_jobs_guest(query, location)
            
            return jobs
            
        except Exception as e:
            logger.error(f"LinkedIn: Search failed: {e}")
            await self.save_screenshot("fatal_error")
            return []
        finally:
            await self.teardown()


async def test_linkedin_scraper():
    """Test the LinkedIn scraper"""
    print("="*80)
    print("LINKEDIN SCRAPER TEST")
    print("="*80)
    
    scraper = LinkedInScraper(headless=True)
    
    # Test search
    jobs = await scraper.search("Python Developer", "Remote")
    
    print(f"\nFound {len(jobs)} jobs\n")
    print("-"*80)
    
    for i, job in enumerate(jobs[:10], 1):
        print(f"{i}. {job['title']}")
        print(f"   Company:  {job['company']}")
        print(f"   Location: {job['location']}")
        print(f"   URL:      {job['url'][:70]}...")
        if job.get('salary'):
            print(f"   Salary:   {job['salary']}")
        print()
    
    return jobs


if __name__ == "__main__":
    jobs = asyncio.run(test_linkedin_scraper())
    print(f"\n✅ Test complete: {len(jobs)} jobs extracted")
