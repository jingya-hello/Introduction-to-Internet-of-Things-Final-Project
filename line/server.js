var linebot = require("linebot");
var express = require("express");
var path = require("path");
import _ from "lodash";
import { button, carousel, carouselItem } from "./template";
import keywords from "./utils/keywords";
import config from "./config";

const DOMAIN = config.DOMAIN;
const IMAGEMAP = id => `${DOMAIN}/images/imagemaps/${id}/`;

var bot = linebot({
  channelId: config.channelId,
  channelSecret: config.channelSecret,
  channelAccessToken: config.channelAccessToken
});

const pushKeywords = (switchObjs, e) => {
  Object.keys(keywords).map(keyword => {
    Object.assign(switchObjs, { [keyword]: () => keywords[keyword](e) });
  });
};

const pushContact = (switchObjs, event) => {};

const pushEventFunc = (switchObjs, event) => {
  Object.assign(switchObjs, {
    ["@bye"]: () => {
      console.log(event.source.type);
      if (event.source.type === "room") {
        bot.leaveRoom(event.source.roomId);
      } else if (event.source.type === "group") {
        bot.leaveGroup(event.source.groupId);
      }
    }
  });
};
bot.on("join", function(event) {
  event
    .reply([
      {
        type: "text",
        text: "歡迎加入Sleeping Helper"
      }
    ])
    .then(() => console.log("Reply done"))
    .catch(err => console.log(err));
});

export const switchObjs = {};

bot.on("message", function(event) {
  pushAstroCrawler(switchObjs, event);
  pushKeywords(switchObjs, event);
  pushEventFunc(switchObjs, event);
  const userText = event.message.text || "";
  console.log(userText);
  const func =
    switchObjs[userText] ||
    switchObjs[
      Object.keys(keywords).find(
        keyword =>
          userText.indexOf(keyword) > -1 &&
          ["a", "b", "c", "d"].indexOf(keyword.toLowerCase()) < 0
      )
    ];

  if (func) {
    func(event);
  } else {
    if (event.source.type === "user") {
      const reply = button({
        altText: "SLEEPING HELPER",
        thumbnailImageUrl: `${DOMAIN}/images/icon.PNG`,
        text: "Sleeping Helper是一款幫助大眾偵測睡眠品質的產品，我們致力於協助了解您的睡眠狀況、分析並改善!",
        actions: [
          {
            type: "message",
            label: "睡眠品質分析",
            text: "睡眠品質分析"
          },
          {
            type: "message",
            label: "呼吸中止症風險評估",
            text: "呼吸中止症風險評估"
          }
        ]
      });
      event
        .reply(reply)
        .then(() => console.log("Reply done"))
        .catch(err => console.log(err));
    }
  }
});

const app = express();
const linebotParser = bot.parser();
app.use("/", express.static(path.join(__dirname, "./public")));
app.post("/", linebotParser);

var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});
