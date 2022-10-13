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

  // to log all image versions
  // console.log(Object.keys(images).map((k) => [k, images[k].url]));

  return {
    sendUrl: images.downsized.url,
    previewUrl: images.fixed_height_downsampled.url,
  };
};

module.exports = {
  searchForGif,
};
