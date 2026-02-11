/**
 * Teams UN-Style Translation Bot
 * Main bot entry point
 */

const { TeamsActivityHandler, MessageFactory, CardFactory } = require('botbuilder');
const TranslationEngine = require('./translation-engine');
const AudioRouter = require('./audio-router');
const MeetingManager = require('./meeting-manager');

class UNTranslatorBot extends TeamsActivityHandler {
  constructor() {
    super();
    
    this.translator = new TranslationEngine();
    this.audioRouter = new AudioRouter();
    this.meetingManager = new MeetingManager();
    
    // Handle bot added to meeting
    this.onMembersAdded(async (context, next) => {
      await this.handleMeetingJoin(context);
      await next();
    });
    
    // Handle messages (language selection, commands)
    this.onMessage(async (context, next) => {
      await this.handleMessage(context);
      await next();
    });
    
    // Handle meeting events
    this.onTeamsMeetingStart(async (context) => {
      await this.handleMeetingStart(context);
    });
    
    this.onTeamsMeetingEnd(async (context) => {
      await this.handleMeetingEnd(context);
    });
  }
  
  /**
   * Bot joins meeting - send language selection prompt
   */
  async handleMeetingJoin(context) {
    const meetingId = context.activity.conversation.id;
    
    // Initialize meeting
    await this.meetingManager.createMeeting(meetingId);
    
    // Send welcome message with language selector
    const card = this.createLanguageSelectionCard();
    await context.sendActivity({ attachments: [card] });
    
    console.log(`[Bot] Joined meeting: ${meetingId}`);
  }
  
  /**
   * Handle incoming messages (language selection, commands)
   */
  async handleMessage(context) {
    const text = context.activity.text?.trim().toLowerCase();
    const userId = context.activity.from.id;
    const userName = context.activity.from.name;
    const meetingId = context.activity.conversation.id;
    
    // Language selection
    if (text && ['de', 'en', 'es', 'fr', 'german', 'english', 'spanish', 'french'].includes(text)) {
      const lang = this.parseLanguageCode(text);
      await this.meetingManager.setUserLanguage(meetingId, userId, lang, userName);
      
      const langName = this.getLanguageName(lang);
      await context.sendActivity(`✅ ${userName}, you will hear the meeting in ${langName}`);
      
      console.log(`[Bot] ${userName} selected ${langName}`);
      return;
    }
    
    // Status command
    if (text === '/status') {
      const status = await this.meetingManager.getMeetingStatus(meetingId);
      await context.sendActivity(this.formatStatus(status));
      return;
    }
    
    // Help command
    if (text === '/help') {
      await context.sendActivity(this.getHelpText());
      return;
    }
  }
  
  /**
   * Meeting started - begin audio processing
   */
  async handleMeetingStart(context) {
    const meetingId = context.activity.conversation.id;
    
    console.log(`[Bot] Meeting started: ${meetingId}`);
    
    // Start audio stream processing
    await this.startAudioProcessing(meetingId, context);
    
    // Notify participants
    await context.sendActivity('🎙️ **Translation active!** Speak in any language and others will hear in their preferred language.');
  }
  
  /**
   * Meeting ended - cleanup
   */
  async handleMeetingEnd(context) {
    const meetingId = context.activity.conversation.id;
    
    console.log(`[Bot] Meeting ended: ${meetingId}`);
    
    // Stop audio processing
    await this.stopAudioProcessing(meetingId);
    
    // Cleanup
    await this.meetingManager.endMeeting(meetingId);
    
    // Send summary
    const summary = await this.meetingManager.getMeetingSummary(meetingId);
    await context.sendActivity(this.formatSummary(summary));
  }
  
  /**
   * Start audio stream processing
   */
  async startAudioProcessing(meetingId, context) {
    // Get meeting participants
    const participants = await this.meetingManager.getParticipants(meetingId);
    
    // Subscribe to audio streams
    for (const participant of participants) {
      this.audioRouter.subscribeToParticipant(
        participant.id,
        async (audio, speakerId) => {
          await this.handleAudioChunk(meetingId, speakerId, audio);
        }
      );
    }
  }
  
  /**
   * Handle audio chunk from a speaker
   */
  async handleAudioChunk(meetingId, speakerId, audioBuffer) {
    try {
      // Get speaker info
      const speaker = await this.meetingManager.getParticipant(meetingId, speakerId);
      if (!speaker || !speaker.language) {
        return; // Speaker hasn't selected language yet
      }
      
      // Transcribe audio
      const transcript = await this.translator.transcribe(audioBuffer, speaker.language);
      if (!transcript || transcript.trim().length === 0) {
        return; // No speech detected
      }
      
      console.log(`[Translation] ${speaker.name} (${speaker.language}): ${transcript}`);
      
      // Get all other participants
      const participants = await this.meetingManager.getParticipants(meetingId);
      
      // Translate and send to each participant in their language
      for (const participant of participants) {
        if (participant.id === speakerId) {
          continue; // Don't translate for the speaker
        }
        
        if (!participant.language) {
          continue; // Participant hasn't selected language
        }
        
        if (participant.language === speaker.language) {
          // Same language - send original audio
          await this.audioRouter.sendAudio(participant.id, audioBuffer);
          continue;
        }
        
        // Translate
        const translation = await this.translator.translate(
          transcript,
          speaker.language,
          participant.language
        );
        
        // Synthesize
        const translatedAudio = await this.translator.synthesize(
          translation,
          participant.language
        );
        
        // Send to participant
        await this.audioRouter.sendAudio(participant.id, translatedAudio);
        
        // Send caption (visual backup)
        await this.sendCaption(
          participant.id,
          `${speaker.name} (${this.getLanguageName(speaker.language)}): ${translation}`
        );
        
        console.log(`[Translation] → ${participant.name} (${participant.language}): ${translation}`);
      }
      
    } catch (error) {
      console.error('[Bot] Error handling audio chunk:', error);
    }
  }
  
  /**
   * Stop audio processing
   */
  async stopAudioProcessing(meetingId) {
    await this.audioRouter.unsubscribeAll();
  }
  
  /**
   * Send caption to participant
   */
  async sendCaption(participantId, text) {
    // Implementation depends on Teams API for per-participant messaging
    // For now, log it
    console.log(`[Caption] ${participantId}: ${text}`);
  }
  
  /**
   * Create language selection adaptive card
   */
  createLanguageSelectionCard() {
    return CardFactory.adaptiveCard({
      type: 'AdaptiveCard',
      version: '1.4',
      body: [
        {
          type: 'TextBlock',
          text: '🌍 Select Your Language',
          size: 'Large',
          weight: 'Bolder'
        },
        {
          type: 'TextBlock',
          text: 'Choose the language you want to hear during this meeting:',
          wrap: true
        },
        {
          type: 'ActionSet',
          actions: [
            {
              type: 'Action.Submit',
              title: '🇩🇪 German',
              data: { language: 'de' }
            },
            {
              type: 'Action.Submit',
              title: '🇺🇸 English',
              data: { language: 'en' }
            },
            {
              type: 'Action.Submit',
              title: '🇪🇸 Spanish',
              data: { language: 'es' }
            },
            {
              type: 'Action.Submit',
              title: '🇫🇷 French',
              data: { language: 'fr' }
            }
          ]
        }
      ]
    });
  }
  
  /**
   * Parse language code from user input
   */
  parseLanguageCode(text) {
    const map = {
      'de': 'de', 'german': 'de', 'deutsch': 'de',
      'en': 'en', 'english': 'en',
      'es': 'es', 'spanish': 'es', 'español': 'es',
      'fr': 'fr', 'french': 'fr', 'français': 'fr'
    };
    return map[text.toLowerCase()] || 'en';
  }
  
  /**
   * Get language name
   */
  getLanguageName(code) {
    const names = {
      'de': 'German',
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French'
    };
    return names[code] || code;
  }
  
  /**
   * Format meeting status
   */
  formatStatus(status) {
    let text = `📊 **Meeting Status**\n\n`;
    text += `Participants: ${status.participantCount}\n`;
    text += `Active translations: ${status.activeLanguages.join(', ')}\n\n`;
    
    text += `**Participants:**\n`;
    for (const p of status.participants) {
      const lang = p.language ? this.getLanguageName(p.language) : 'Not selected';
      text += `- ${p.name}: ${lang}\n`;
    }
    
    return text;
  }
  
  /**
   * Format meeting summary
   */
  formatSummary(summary) {
    return `📝 **Meeting Summary**\n\n` +
           `Duration: ${summary.duration} minutes\n` +
           `Participants: ${summary.participantCount}\n` +
           `Languages: ${summary.languages.join(', ')}\n` +
           `Total translations: ${summary.translationCount}`;
  }
  
  /**
   * Get help text
   */
  getHelpText() {
    return `**UN Translation Bot Commands:**\n\n` +
           `/status - Show meeting status\n` +
           `/help - Show this message\n` +
           `\nOr type a language name to select: German, English, Spanish, French`;
  }
}

module.exports = UNTranslatorBot;
