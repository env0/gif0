const { App } = require("@slack/bolt");
const { searchForGif } = require("./giphy-client");

// TODO: https://slack.dev/bolt-js/deployments/aws-lambda

const app = new App({
  signingSecret: "cf8ce22204234354de0bd0949d9665d3",
  token: "xoxb-1550164649716-4207517095345-nDh4Mnn9vSbTJi9Hvbz4nUpN",
});

app.command("/gif0", async ({ ack, say, body, ...props }) => {
  // console.log("got request", props);
  await ack({ text: "Getting your gifs ..." });

  const gifUrl = await searchForGif(body.text);

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
    ],
  };

  await say(secondPost);
});

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
