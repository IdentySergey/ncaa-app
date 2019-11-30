webpack = require('webpack');
path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

webpackConfig = {
    context: __dirname,
    entry: [
        './view/react/app.js',
        './view/styles/app.scss'
    ],
    output: {
        filename: 'bundles.js',
        path: __dirname + '/static'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/],
                loader: "babel-loader",
                query: {
                    presets: ['es2015', 'react', 'stage-0', 'stage-1']
                }
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    loader: "css-loader!sass-loader",
                }),
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'})
            },
            {
                test: /\.woff2?$|\.ttf$|\.eot$|\.svg$|\.png|\.jpe?g|\.gif$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'styles.css',
            allChunks: true
        }),
        //new webpack.optimize.UglifyJsPlugin()
    ]
};

module.exports = webpackConfig;