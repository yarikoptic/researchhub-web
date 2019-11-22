const withCSS = require("@zeit/next-css");
const withTM = require("next-transpile-modules");
const withPlugins = require("next-compose-plugins");
const path = require("path");
const withSourceMaps = require("@zeit/next-source-maps");

module.exports = withPlugins(
  [
    [withCSS],
    [withSourceMaps],
    [
      withTM,
      {
        transpileModules: ["@quantfive/js-web-config"],
      },
    ],
  ],
  {
    env: {
      INFURA_RINKEBY_ENDPOINT:
        "https://rinkeby.infura.io/v3/a7ccde5d021c48e1a0525dfd6e58490f",
      INFURA_MAINNET_ENDPOINT:
        "https://mainnet.infura.io/v3/a7ccde5d021c48e1a0525dfd6e58490f",
    },
    webpack: (config) => {
      // Fixes npm packages that depend on `fs` module
      config.node = {
        fs: "empty",
      };

      config.resolve.alias["~"] = path.resolve(__dirname);

      return config;
    },
  }
);
