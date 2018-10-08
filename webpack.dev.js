const path                 = require('path');
const merge                = require('webpack-merge');
const common               = require('./webpack.common.js');
const webpack              = require('webpack');


module.exports = merge(common, {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dev'),
        filename: 'bundle.js',
        library: 'NLGAMap',
        libraryTarget: 'var'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './',
        publicPath: '/dev/',
        openPage: 'dev',
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});