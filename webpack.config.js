const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const port = process.env.PORT || 3000;

module.exports = {
  entry: "./src/index.tsx",
  devServer: {
    port: port,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },
      {
        // test: /\.(sa|sc|c)ss$/i,
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "file-loader",
        options: {
          name: "assets/img/[name].[ext]?[hash]",
          esModule: false,
        },
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    alias: {
      "@src": path.resolve(__dirname, "src"),
      "@api": path.resolve(__dirname, "src/api"),
      "@container": path.resolve(__dirname, "src/container"),
      "@presenter": path.resolve(__dirname, "src/presenter"),
      "@entities": path.resolve(__dirname, "src/domain/entities"),
      "@useCase": path.resolve(__dirname, "src/domain/useCase"),
      "@recoil": path.resolve(__dirname, "src/recoil"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
    },
    extensions: [".jsx", ".tsx", ".ts", ".js", ".json"],
  },
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
    }),
    // new MiniCssExtractPlugin({ filename: "css/style.css" }),
  ],
};
