var webpack = require('webpack');
var path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const extractText = new ExtractTextPlugin({
  filename: "[name].css"
})

var webpackConfig = {
  devtool: 'source-map',
  devServer: {
    compress: true,
    port: 9000,
    hot: true
  },
  entry: {
    index: './src/index.jsx'
  },
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.jsx', '.scss']
  },
}

webpackConfig.output = {
  path: path.join(__dirname, 'dist'),
  filename: '[name].js',
};

webpackConfig.module = {
  rules: [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'react-hot-loader'
        },
        {
          loader: 'babel-loader',
          options: {
            presets: ['react' , 'es2015', 'stage-2'],
            plugins: ["transform-object-rest-spread"]
          }
        }
      ]
    },
    {
      test: /\.scss$/,
      use: extractText.extract({
        use: [
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
        ],
        fallback: "style-loader"
      })
    },
    {
      test: /\.(hbs|handlebars)$/,
      use: [
        {
          loader: 'handlebars-loader'
        }
      ]
    },
    {
      test: /\.(jpg|png|gif|svg)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          }
        }
      ]
    }
  ]
};

webpackConfig.plugins = [
  new webpack.ProvidePlugin({
    mapboxgl: 'mapbox-gl'
  }),
  extractText,
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new HtmlWebpackPlugin({
    title: 'Mario',
    filename: 'index.html',
    template: 'src/index.hbs'
  })
]

module.exports = webpackConfig
