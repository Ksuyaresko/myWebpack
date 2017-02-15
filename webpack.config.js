var path = require('path');
var webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var HTMLWebpackPlugin = require('html-webpack-plugin');

const DEVELOPMENT = process.env.NODE_ENV === 'development';
const PRODUCTION = process.env.NODE_ENV === 'production';

const entry = PRODUCTION
	?	[
			'./src/index.js'
		]
	:	[
			'./src/index.js',
			'webpack/hot/dev-server',
			'webpack-dev-server/client?http://localhost:8080'
		];

const plugins = PRODUCTION
	? 	[
			new webpack.optimize.UglifyJsPlugin(),
			new ExtractTextPlugin('style.css'),
			new HTMLWebpackPlugin({
				template: 'index-template.html'
			})
		]
	: 	[
			new webpack.HotModuleReplacementPlugin()
		];

const extractSass = new ExtractTextPlugin({
	filename: "[name].css",
	disable: process.env.NODE_ENV === "development"
});

plugins.push(
	new webpack.DefinePlugin({
		DEVELOPMENT: JSON.stringify(DEVELOPMENT),
		PRODUCTION: JSON.stringify(PRODUCTION)
	})
);
plugins.push(extractSass);


module.exports = {
	devtool: 'source-map',
	entry: entry,
	plugins: plugins,
	externals: {
		jquery: 'jQuery' //jquery is external and available at the global variable jQuery
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'url-loader',
				options: {
					name: 'images/[name].[ext]'
				}
			},
			{
				test: /\.scss$/,
				loader: extractSass.extract({
					loader: [{
						loader: "css-loader"
					}, {
						loader: "sass-loader"
					}],
					// use style-loader in development
					fallbackLoader: "style-loader"
				})
			}

		]
	},
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: PRODUCTION ? '' : '/dist/',
		filename: PRODUCTION ? 'bundle.min.js' : 'bundle.js'
	}
};
