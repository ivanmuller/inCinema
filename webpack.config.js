const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
processEnvironment = process.env.NODE_ENV || 'development';
const isProduction = processEnvironment === 'production';

require('dotenv').config({ path: '.env.' + processEnvironment });

module.exports = (env) => {
  //this is in set in package.json
  const CSSExtract = new MiniCssExtractPlugin({ filename: 'styles.css' });
  return {
    mode: processEnvironment,
    entry: ['@babel/polyfill', './src/app.js'],
    output: {
      path: path.join(__dirname, 'public', 'dist'),
      filename: 'bundle.js',
      publicPath: '/',
      assetModuleFilename: 'dist/[hash][ext][query]'
    },
    resolve: {
      alias: {
        "@root": path.resolve(__dirname, 'src/'),
      },
    },
    module: {
      rules: [
        {
          loader: 'babel-loader',
          test: /\.js$/,
          exclude: /node_modules/
        }, 
        {
          test: /\.s?css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        }
      ]
    },
    plugins: [
      CSSExtract,
      new webpack.DefinePlugin({
        'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
        'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
        'process.env.FIREBASE_DATABASE_URL': JSON.stringify(process.env.FIREBASE_DATABASE_URL),
        'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
        'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
        'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
        'process.env.FIREBASE_APP_ID': JSON.stringify(process.env.FIREBASE_APP_ID),
        'process.env.FIREBASE_MEASUREMENT_ID': JSON.stringify(process.env.FIREBASE_MEASUREMENT_ID),
        'process.env.MOVIEDB_KEY': JSON.stringify(process.env.MOVIEDB_KEY)
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: path.join(__dirname, 'public/index.html'),
        title: processEnvironment,
        favicon: 'src/images/favicon.png',
        filename: 'index.html'
      })
      //,new BundleAnalyzerPlugin()
    ],
    devtool: isProduction ? false : 'inline-source-map',
    devServer: {
      static: {
        directory: path.join(__dirname, 'public', 'dist'),
        publicPath: '/'
      },
      compress: true,
      port: 8000,
      host: 'local-ipv4',
      historyApiFallback: true,
      hot: true
    }
  }
}