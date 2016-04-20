import Slack from 'slack-node';

module.exports = (config) => {
  console.log(Slack);
  const slack = new Slack(config.SlackApiKey)

}
