const path                 = require('path');
const merge                = require('webpack-merge');
const common               = require('./webpack.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack              = require('webpack');


module.exports = merge(common, {
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
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        })
    ]
});