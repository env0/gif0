const axios = require("axios");

const searchForGif = async (text) => {
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

  return giphySearchResponse.data[0].images.original.url;
};

module.exports = {
  searchForGif,
};
