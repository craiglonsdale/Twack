import slack from 'slack';
import Twitchy from 'twitchy';
import irc from 'tmi.js';
import * as twitch from './lib/twitch';

module.exports = (config) => {
  let twackId = null;
  let twackChannel = null;
  const token = config.SlackApiKey;
  const twack = slack.rtm.client();
  const twitchy = new Twitchy({
    key: config.TwitchClientId,
    secret: config.TwitchClientSecret,
    access_token: config.TwitchApiKey
  });
  const twitchIrc = new irc.client({
    options: {
      debug: true
    },
    connection: {
      cluster: 'aws',
      reconnect: true
    }
  });
  twitchIrc.connect()
    .then(data => console.log(`Joined: ${data}`))
    .catch(err => console.log(`Error: ${err}`));
  twitchIrc.on('chat', (channel, user, message, self) => {
    slack.chat.postMessage({
      token,
      channel: twackChannel,
      text: `[${channel}] <${user.username}>: ${message}`
    }, () => {});
  });
  twitchy.auth((err, access_token) => {
    if (!err) {
      console.log(`Authed using token: ${access_token}`);
    }
  });
  // Get a copy of twack's slack ID
  twack.started(payload => twackId = payload.self.id);
  // On message
  twack.message((msg) => {
    if (msg.text && !msg.subtype) {
      const [idReference, command, twitchUser] = msg.text.match(/\S+/g);
      if (idReference.includes(twackId)) {
        switch (command.toLowerCase()) {
          case 'join':
            twackChannel = msg.channel;
            joinChannel(twitchy, twitchIrc, slack, token, msg);
            break;
          default:
            console.log('???');
        }
      }
    }
  });
  twack.listen({token});
}

function joinChannel(twitchy, twitchIrc, slack, token, msg) {
  const [idReference, command, twitchUser] = msg.text.match(/\S+/g);
  twitch.joinStream(twitchy, slack, token, twitchUser, msg.channel)
    .then(stream => {
      twitchIrc.join(`#${stream.channel.display_name}`);
    })
    .catch(err => {
      console.log(`Failure ${err}`);
    });
}
