/**
 * Meeting Manager
 * Manages meeting state and participants
 */

class MeetingManager {
  constructor() {
    // In-memory store (would use Redis/database in production)
    this.meetings = new Map();
  }
  
  /**
   * Create a new meeting
   */
  async createMeeting(meetingId) {
    this.meetings.set(meetingId, {
      id: meetingId,
      startTime: Date.now(),
      participants: new Map(),
      translationCount: 0,
      active: true
    });
    
    return this.meetings.get(meetingId);
  }
  
  /**
   * Get meeting
   */
  async getMeeting(meetingId) {
    return this.meetings.get(meetingId);
  }
  
  /**
   * Set user language preference
   */
  async setUserLanguage(meetingId, userId, language, userName) {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) {
      throw new Error(`Meeting not found: ${meetingId}`);
    }
    
    meeting.participants.set(userId, {
      id: userId,
      name: userName,
      language,
      joinedAt: Date.now()
    });
  }
  
  /**
   * Get participant
   */
  async getParticipant(meetingId, userId) {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) return null;
    
    return meeting.participants.get(userId);
  }
  
  /**
   * Get all participants
   */
  async getParticipants(meetingId) {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) return [];
    
    return Array.from(meeting.participants.values());
  }
  
  /**
   * Get meeting status
   */
  async getMeetingStatus(meetingId) {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) {
      return { error: 'Meeting not found' };
    }
    
    const participants = Array.from(meeting.participants.values());
    const activeLanguages = [...new Set(
      participants
        .filter(p => p.language)
        .map(p => p.language)
    )];
    
    return {
      meetingId,
      participantCount: participants.length,
      activeLanguages,
      participants,
      translationCount: meeting.translationCount
    };
  }
  
  /**
   * End meeting
   */
  async endMeeting(meetingId) {
    const meeting = this.meetings.get(meetingId);
    if (meeting) {
      meeting.active = false;
      meeting.endTime = Date.now();
    }
  }
  
  /**
   * Get meeting summary
   */
  async getMeetingSummary(meetingId) {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) {
      return { error: 'Meeting not found' };
    }
    
    const duration = meeting.endTime 
      ? Math.round((meeting.endTime - meeting.startTime) / 60000) 
      : 0;
    
    const participants = Array.from(meeting.participants.values());
    const languages = [...new Set(
      participants
        .filter(p => p.language)
        .map(p => p.language)
    )];
    
    return {
      meetingId,
      duration,
      participantCount: participants.length,
      languages,
      translationCount: meeting.translationCount
    };
  }
  
  /**
   * Increment translation count
   */
  incrementTranslations(meetingId) {
    const meeting = this.meetings.get(meetingId);
    if (meeting) {
      meeting.translationCount++;
    }
  }
}

module.exports = MeetingManager;
