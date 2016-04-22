export function joinStream(twitchy, slack, slackToken, userName, channel) {
  return new Promise(function(resolve, reject) {
    twitchy._get(`streams/${userName}`, function(err, res) {
      const streamInfo = res.body;
      if (streamInfo.stream) {
        slack.channels.setTopic({
          token: slackToken,
          channel,
          topic: `${streamInfo.stream.channel.display_name} - ${streamInfo.stream.game}`
        }, () => {});
        resolve(streamInfo.stream);
      }
      else {
        reject(new Error(`No stream found for ${userName}`));
      }
    });
  })
}
