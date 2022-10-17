const { getApp, getLambdaConfig } = require("./src/bolt-app");

const { IS_LOCAL } = process.env;
let handler;

const startLambdaApp = () => {
  const extraConfig = getLambdaConfig();
  getApp(extraConfig);

  handler = async (event, context, callback) => {
    const handler = await extraConfig.receiver.start();
    return handler(event, context, callback);
  };
};

const startLocalApp = async () => {
  try {
    const app = getApp();
    await app.start(process.env.PORT || 3000);
    console.log("⚡️ Bolt app is running!");
  } catch (ex) {
    console.error(ex);
    process.exit(-1);
  }
};

IS_LOCAL ? startLocalApp() : startLambdaApp();

module.exports = {
  handler,
};
