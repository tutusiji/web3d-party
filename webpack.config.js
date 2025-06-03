const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js", // 输出文件名
    path: path.resolve(__dirname, "dist"), // 输出目录
    publicPath: "/", // 修改为根路径，适合本地开发
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader", // 添加这一行
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      // 确保HTML中的资源路径正确
      favicon: "./public/logo.svg"
    }),
    new webpack.DefinePlugin({
      "process.env.PUBLIC_URL": JSON.stringify(""),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 3001, // 修改端口为3001
    hot: true,
    historyApiFallback: true, // 对于SPA应用路由
  },
  stats: {
    errorDetails: true,
  },
};
