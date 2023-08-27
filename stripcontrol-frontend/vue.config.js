module.exports = {
  pluginOptions: {
    quasar: {
      importStrategy: "kebab",
      rtlSupport: false,
    },
  },
  transpileDependencies: ["quasar"],
  devServer: {
    host: "localhost",
    port: 8090,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
      },
    },
  },
};
