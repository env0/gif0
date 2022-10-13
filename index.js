const { App } = require("@slack/bolt");
const { searchForGif } = require("./giphy-client");

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

app.command("/gif0", async ({ ack, respond, body, client }) => {
  await ack({ text: "Getting your gif ..." });
  const { text, channel_id, user_id } = body;
  const firstPost = await getGifPost({ text, index: 0 });
  await client.chat.postEphemeral({
    channel: channel_id,
    user: user_id,
    ...firstPost,
  });
});

app.action("next_button", async ({ ack, respond, body, ...props }) => {
  const { text, index } = JSON.parse(body.actions[0].value);
  await ack();
  const nextPost = await getGifPost({ text, index });
  // await respond(nextPost);
  await client.chat.postEphemeral({
    channel: body.channel_id,
    user: body.user_id,
    ...nextPost,
  });
});

app.action("prev_button", async ({ ack, respond, body }) => {
  const { text, index } = JSON.parse(body.actions[0].value);
  await ack();
  const nextPost = await getGifPost({ text, index });
  await respond(nextPost);
});

app.action("send_button", async ({ ack, body, say }) => {
  const { text, sendUrl } = JSON.parse(body.actions[0].value);
  await ack();
  const publicPost = getImagePost({ text, url: sendUrl });
  // TODO: Send as
  await say({ ...publicPost });
});

app.action("cancel_button", async ({ ack, say }) => {
  await ack();
  await say("Request approved 👍");
});

const getImagePost = ({ text, url }) => ({
  text,
  blocks: [
    {
      type: "image",
      title: { type: "plain_text", text },
      block_id: "image4",
      image_url: url,
      alt_text: text,
    },
  ],
});

const getPostWithButtons = ({ text, index, sendUrl, previewUrl }) => {
  const post = getImagePost({ text, url: previewUrl });
  post.blocks.push({
    type: "actions",
    block_id: "actions1",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Prev",
        },
        value: JSON.stringify({ text, index: Math.max(0, index - 1) }),
        action_id: "prev_button",
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Next",
        },
        value: JSON.stringify({ text, index: index + 1 }),
        action_id: "next_button",
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Send",
        },
        value: JSON.stringify({ text, sendUrl }),
        action_id: "send_button",
        style: "primary",
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Cancel",
        },
        value: "cancel",
        action_id: "cancel_button",
        style: "danger",
      },
    ],
  });
  return post;
};

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
