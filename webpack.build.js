const PACKAGE              = require('./package.json');
const path                 = require('path');
const webpack              = require('webpack');
const merge                = require('webpack-merge');
const common               = require('./webpack.common.js');
const UglifyJSPlugin       = require('uglifyjs-webpack-plugin');
const saveLicense          = require('uglify-save-license');


module.exports = merge(common, {
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].min.js',
        library: '[name]',
        libraryTarget: 'var'
    },
    externals: {
        leaflet: 'L'
    },
    plugins: [
        new UglifyJSPlugin({
            uglifyOptions: {
                output: {
                    comments: saveLicense
                }
            }
        }),
        new webpack.DefinePlugin({
            'VERSION': JSON.stringify(PACKAGE.version),
    	    'process.env': {
                'NODE_ENV': JSON.stringify('production')
    	    }
        })
    ]
});