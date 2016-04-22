import slack from 'slack';
import Twitchy from 'twitchy';
import irc from 'tmi.js';

module.exports = (config) => {
  let twackId = null;
  let twackChannel = null;
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
    .then(data => console.log(`Joined: ${data}`));
  twitchIrc.on('chat', (channel, user, message, self) => {
    slack.chat.postMessage({
      token,
      channel: twackChannel,
      text: `[${channel}] <${user.username}>: ${message}`
    }, () => {});
  });
  const token = config.SlackApiKey;
  twitchy.auth((err, access_token) => {
    if (!err) {
      console.log(`Authed using token: ${access_token}`);
    }
  });
  twack.started(payload => twackId = payload.self.id);
  twack.message((msg) => {
    if (msg.text) {
      const match = msg.text.match(/\S+/g);
      if (match && match[0].includes(twackId)) {
        twitchy._get(`streams/${match[1]}`, (err, res) => {
          const streamInfo = res.body;
          twackChannel = msg.channel;
          if (streamInfo.stream) {
            slack.channels.setTopic({
              token,
              channel: msg.channel,
              topic: `${streamInfo.stream.channel.display_name} - ${streamInfo.stream.game}`
            }, () => {});
            twitchIrc.join(`#${streamInfo.stream.channel.display_name}`);
          }
        });
      }
    }
  });
  twack.listen({token});
}
