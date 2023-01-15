module.exports = (webpack) =>
  webpack.chainWebpack(
    (config) => {
      config.module
        .rule("bundle-solid-navigation")
        .test(/\.(|t|j)sx?$/)
        .include.add(/node_modules(.*[/\\])+solid-navigation/)
        .end()
        .use("babel-loader")
        .loader("babel-loader")
        .before("ts-loader")
        .options({
          babelrc: false,
          configFile: false,
          presets: [
            [
              "babel-preset-solid",
              {
                moduleName: "@nativescript-community/solid-js",
                generate: "universal",
              },
            ],
            "@babel/typescript",
          ],
        });
    },
    {
      order: 0,
    }
  );
