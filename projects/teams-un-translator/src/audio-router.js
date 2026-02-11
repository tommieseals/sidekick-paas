/**
 * Audio Router
 * Handles per-participant audio routing
 */

const EventEmitter = require('events');

class AudioRouter extends EventEmitter {
  constructor() {
    super();
    
    // Participant audio streams
    this.streams = new Map();
    
    // Audio callbacks per participant
    this.callbacks = new Map();
  }
  
  /**
   * Subscribe to a participant's audio
   * @param {string} participantId - Participant ID
   * @param {Function} callback - Called with (audioBuffer, participantId)
   */
  subscribeToParticipant(participantId, callback) {
    this.callbacks.set(participantId, callback);
    console.log(`[AudioRouter] Subscribed to ${participantId}`);
  }
  
  /**
   * Unsubscribe from a participant
   */
  unsubscribeFromParticipant(participantId) {
    this.callbacks.delete(participantId);
    console.log(`[AudioRouter] Unsubscribed from ${participantId}`);
  }
  
  /**
   * Unsubscribe from all participants
   */
  async unsubscribeAll() {
    this.callbacks.clear();
    this.streams.clear();
    console.log('[AudioRouter] Unsubscribed from all participants');
  }
  
  /**
   * Receive audio from a participant
   * This would be called by Teams audio stream handler
   * @param {string} participantId - Who spoke
   * @param {Buffer} audioBuffer - Audio data
   */
  async receiveAudio(participantId, audioBuffer) {
    const callback = this.callbacks.get(participantId);
    if (callback) {
      try {
        await callback(audioBuffer, participantId);
      } catch (error) {
        console.error(`[AudioRouter] Error in callback for ${participantId}:`, error);
      }
    }
  }
  
  /**
   * Send audio to a specific participant
   * This would send translated audio back via Teams
   * @param {string} participantId - Who to send to
   * @param {Buffer} audioBuffer - Translated audio
   */
  async sendAudio(participantId, audioBuffer) {
    // In real implementation, this would:
    // 1. Get the participant's Teams audio stream
    // 2. Write the audio buffer to their stream
    // 3. Handle buffering/timing to sync with video
    
    console.log(`[AudioRouter] Sending ${audioBuffer.length} bytes to ${participantId}`);
    
    // TODO: Implement actual Teams audio streaming
    // For now, just log
    this.emit('audioSent', { participantId, size: audioBuffer.length });
  }
  
  /**
   * Get active streams
   */
  getActiveStreams() {
    return Array.from(this.streams.keys());
  }
  
  /**
   * Get statistics
   */
  getStats() {
    return {
      activeSubscriptions: this.callbacks.size,
      activeStreams: this.streams.size
    };
  }
}

module.exports = AudioRouter;
