const getImagePost = ({ text, url }) => ({
  text,
  blocks: [
    {
      type: "image",
      title: { type: "plain_text", text },
      block_id: "gif_result_image_1",
      image_url: url,
      alt_text: text,
    },
  ],
});

const getPostWithButtons = ({ text, index, sendUrl, previewUrl }) => {
  const post = getImagePost({ text, url: previewUrl });
  post.blocks.push({
    type: "actions",
    block_id: "gif_search_actions_1",
    elements: [
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
    ],
  });
  return post;
};

module.exports = {
  getPostWithButtons,
  getImagePost,
};
