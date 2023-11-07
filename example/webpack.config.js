const webpack = require("@nativescript/webpack");
const path = require("path");

module.exports = (env) => {
  webpack.init(env);
  webpack.chainWebpack((config) => {
    config.resolve.modules.clear().add(path.resolve(__dirname, "./node_modules")).end();
    
    config.devServer.hotOnly(true);
    config.devServer.hot(true);
  });
  return webpack.resolveConfig();
};