const { App } = require("@slack/bolt");
const { searchForGif } = require("./src/giphy-client");
const {
  getImagePost,
  getPostWithButtons,
} = require("./src/slack-post-generator");

// TODO: https://slack.dev/bolt-js/deployments/aws-lambda

const app = new App({
  signingSecret: "cf8ce22204234354de0bd0949d9665d3",
  token: "xoxb-1550164649716-4207517095345-nDh4Mnn9vSbTJi9Hvbz4nUpN",
  unhandledRequestHandler: async ({ logger, response }) => {
    logger.info(
      "Acknowledging this incoming request because 2 seconds already passed..."
    );
    // acknowledge it anyway!
    response.writeHead(200);
    response.end();
  },
});

const getGifPost = async ({ text, index }) => {
  const { sendUrl, previewUrl } = await searchForGif({ text, index });
  return getPostWithButtons({ text, index, sendUrl, previewUrl });
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

app.action("send_button", async ({ ack, body, say, respond }) => {
  const { actions, user } = body;
  const { text, sendUrl } = JSON.parse(actions[0].value);
  await ack();
  const publicPost = getImagePost({ text, url: sendUrl });
  console.log(body);
  await Promise.all([
    respond({ delete_original: true }), // delete the "only visible to you" post, make room for the public one

    // TODO: Send as user
    say({
      ...publicPost,
      username: user.username,
      as_user: true,
    }),
  ]);
});

app.action("cancel_button", async ({ ack, respond }) => {
  await ack();
  await respond("Gif search canceled");
});

const start = async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log("⚡️ Bolt app is running!");
  } catch (ex) {
    console.error(ex);
    process.exit(-1);
  }
};

start();
