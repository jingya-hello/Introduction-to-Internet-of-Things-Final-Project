/*
  action :
  {
    "type": "postback",
    "label": "Buy",
    "data": "action=buy&itemid=123"
  },
*/
export const button = ({
  altText,
  thumbnailImageUrl,
  title,
  text,
  actions
}) => ({
  type: "template",
  altText: altText || "Button",
  template: {
    type: "buttons",
    thumbnailImageUrl,
    title,
    text,
    actions
  }
});

export const confirm = ({ text, actions, altText }) => ({
  type: "template",
  altText,
  template: {
    type: "confirm",
    text,
    actions
  }
});

export const carouselItem = ({ thumbnailImageUrl, title, text, actions }) =>
  thumbnailImageUrl
    ? {
        thumbnailImageUrl,
        title,
        text,
        actions
      }
    : { title, text, actions };

export const carousel = ({ altText, columns }) => ({
  type: "template",
  altText,
  template: {
    type: "carousel",
    columns
  }
});
