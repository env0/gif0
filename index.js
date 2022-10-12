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

app.command("/gif0", async ({ ack, say, body, ...props }) => {
  // console.log("got request", props);
  await ack({ text: "Getting your gifs ..." });

  const gifUrl = await searchForGif(body.text);

  // TODO: all the "says" are public!!
  const secondPost = {
    blocks: [
      {
        type: "image",
        title: {
          type: "plain_text",
          text: "Please enjoy this photo of a " + body.text,
        },
        block_id: "image4",
        image_url: gifUrl,
        alt_text: body.text,
      },
      {
        type: "actions",
        block_id: "actions1",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Next",
            },
            value: JSON.stringify({ text: body.text, index: 0 }),
            action_id: "next_button",
          },
          {
            // Prev should be disabled on first gif :/
            type: "button",
            text: {
              type: "plain_text",
              text: "Prev",
            },
            value: "prev",
            action_id: "prev_button",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Send",
            },
            value: "send",
            action_id: "send_button",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Cancel",
            },
            value: "cancel",
            action_id: "cancel_button",
          },
        ],
      },
    ],
  };

  await say(secondPost);
});

app.action("next_button", async ({ ack, say, body }) => {
  // Acknowledge action request
  const { text, index } = JSON.parse(body.actions[0].value);
  console.log(text, index);
  await ack();
  await say("Request approved 👍");
});

app.action("prev_button", async ({ ack, say }) => {
  // Acknowledge action request
  await ack();
  await say("Request approved 👍");
});

app.action("send_button", async ({ ack, say }) => {
  // Acknowledge action request
  await ack();
  await say("Request approved 👍");
});

app.action("cancel_button", async ({ ack, say }) => {
  // Acknowledge action request
  await ack();
  await say("Request approved 👍");
});

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
