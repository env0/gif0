const axios = require("axios");

const searchForGif = async ({ text, index }) => {
  const { data: giphySearchResponse } = await axios.get(
    "https://api.giphy.com/v1/gifs/search",
    {
      params: {
        api_key: "yf0xX299HlpDo760hrbWL99dBeQiWnPf",
        q: text,
        offset: index,
        limit: 1,
      },
    }
  );

  const { images } = giphySearchResponse.data[0];

  return { sendUrl: images.original.url, previewUrl: images.downsized.url };
};

// const getNextGif;
// const getPrevGif;

module.exports = {
  searchForGif,
};
