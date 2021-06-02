const { Listener } = require('discord-akairo');

class VoiceStateUpdateListener extends Listener {
  constructor() {
    super('voiceStateUpdate', {
      emitter: 'client',
      event: 'voiceStateUpdate'
    });
  }

  async exec(oldState, newState) {
    if (oldState.channel == null && newState.member.id == "750451961739870319") {
      this.client.giotts = false;
    }
    else if (newState.channel == null && newState.member.id == "750451961739870319") {
      this.client.giotts = true;
    }
  }
}

module.exports = VoiceStateUpdateListener;