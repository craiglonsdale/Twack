import slack from 'slack';
import Twitchy from 'twitchy';

module.exports = (config) => {
  let twackId = null;
  const twack = slack.rtm.client();
  const twitchy = new Twitchy({
    key: config.TwitchClientId,
    secret: config.TwitchClientSecret,
    access_token: config.TwitchApiKey
  });
  const token = config.SlackApiKey;
  twitchy.auth((err, access_token) => {
    if (!err) {
      console.log(`Authed using token: ${access_token}`);
    }
  });
  twack.started(payload => {
    twackId = payload.self.id
  });
  twack.message((msg) => {
    const match = msg.text.match(/\S+/g);
    if (match && match[0].includes(twackId)) {
      twitchy._get(`streams/${match[1]}`, (err, res) => {
        const streamInfo = res.body;
        if (streamInfo.stream) {
          slack.channels.setTopic({token,
            channel: msg.channel,
            topic: `${streamInfo.stream.channel.display_name} - ${streamInfo.stream.game}`}, (err, data) => {
          });
        }
      });
    }
  });
  twack.listen({token});
}
