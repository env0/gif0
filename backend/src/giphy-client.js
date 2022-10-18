const axios = require("axios");

const searchForGif = async ({ text, index }) => {
  const { data: giphySearchResponse } = await axios.get(
    "https://api.giphy.com/v1/gifs/search",
    {
      params: {
        api_key: process.env.GIPHY_API_KEY,
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
    sendUrl: images.downsized.url, // not using original because Slack will not show preview for big images
    previewUrl: images.fixed_height_downsampled.url, // fixed_height lets the button stay in the same place
  };
};

module.exports = {
  searchForGif,
};
