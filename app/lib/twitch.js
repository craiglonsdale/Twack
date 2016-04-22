export function joinStream(twitchy, slack, token, userName, channel) {
  return new Promise(function(resolve, reject) {
    twitchy._get(`streams/${userName}`, function(err, res) {
      const streamInfo = res.body;
      if (streamInfo.stream) {
        slack.channels.setTopic({
          token: token,
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

export function leaveStream(slack, token, channel) {
  return slack.channels.setTopic({
    token: token,
    channel,
    topic: 'No current stream'
  }, () => {});
}
