const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const axios = require("axios");

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/gif0", async (req, res) => {
  // TODO: Validate the token and that
  console.log(req.body);

  const { text, response_url } = req.body;

  res.send({
    text: `Loading gifs for ${text} ...`,
  });

  const { data: giphySearchResponse } = await axios.get(
    "https://api.giphy.com/v1/gifs/search",
    {
      params: {
        api_key: "yf0xX299HlpDo760hrbWL99dBeQiWnPf",
        q: text,
        limit: 1,
      },
    }
  );

  try {
    const secondPost = {
      blocks: [
        {
          type: "image",
          title: {
            type: "plain_text",
            text: "Please enjoy this photo of a " + text,
          },
          block_id: "image4",
          image_url: giphySearchResponse.data[0].images.original.url,
          alt_text: text,
        },
      ],
      response_type: "ephemeral",
      replace_original: "true",
    };

    await axios.post(response_url, secondPost);
  } catch (ex) {
    console.error(ex);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
