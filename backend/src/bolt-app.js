const { App, AwsLambdaReceiver } = require("@slack/bolt");
const { searchForGif } = require("./giphy-client");
const { getImagePost, getPostWithButtons } = require("./slack-post-generator");

const signingSecret = process.env.SLACK_APP_SIGNING_SECRET;
const token = process.env.SLACK_APP_TOKEN;

const getApp = (config) => {
  const app = new App({
    signingSecret,
    token,
    unhandledRequestHandler: async ({ logger, response }) => {
      logger.info(
        "Acknowledging this incoming request because 2 seconds already passed..."
      );
      // acknowledge it anyway!
      response.writeHead(200);
      response.end();
    },
    ...config,
  });

  const getGifPost = async ({ text, index }) => {
    const { sendUrl, previewUrl } = await searchForGif({ text, index });
    return getPostWithButtons({ text, index, sendUrl, previewUrl });
  };

  const getSlackUserDetails = async ({ id, username }, client) => {
    const {
      profile: { image_48 },
    } = await client.users.profile.get({ user: id });

    return {
      username: username,
      icon_url: image_48,
    };
  };

  app.command("/gif0", async ({ ack, respond, body }) => {
    await ack();
    const { text } = body;
    const firstPost = await getGifPost({ text, index: 0 });
    await respond(firstPost);
  });

  app.action("next_button", async ({ ack, respond, body, ...props }) => {
    const { text, index } = JSON.parse(body.actions[0].value);
    await ack();
    const nextPost = await getGifPost({ text, index });
    await respond(nextPost);
  });

  app.action("prev_button", async ({ ack, respond, body }) => {
    const { text, index } = JSON.parse(body.actions[0].value);
    await ack();
    const nextPost = await getGifPost({ text, index });
    await respond(nextPost);
  });

  app.action("send_button", async ({ ack, body, say, respond, client }) => {
    const { actions, user } = body;
    const { text, sendUrl } = JSON.parse(actions[0].value);
    await ack();
    const publicPost = getImagePost({ text, url: sendUrl });
    const userDetails = await getSlackUserDetails(user, client);

    await Promise.all([
      respond({ delete_original: true }), // delete the "only visible to you" post, make room for the public one
      say({
        ...publicPost,
        ...userDetails,
      }),
    ]);
  });

  app.action("cancel_button", async ({ ack, respond }) => {
    await ack();
    await respond("Gif search canceled");
  });

  return app;
};

const getLambdaConfig = () => {
  return {
    receiver: new AwsLambdaReceiver({
      signingSecret,
    }),
  };
};

module.exports = {
  getApp,
  getLambdaConfig,
};
