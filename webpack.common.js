const path = require('path');

module.exports = {
    entry: {
        NLGAMap: ['./src/entry.js']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)\/(?!leaflet-piemarker)/,
                use: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/env', {
                                loose: true,
                                modules: false,
                                useBuiltIns: false,
                                debug: false
                            }]
                        ],
                        plugins: [
                            '@babel/syntax-object-rest-spread',
                            '@babel/plugin-proposal-object-rest-spread'
                        ]
                    }
                }]
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            },
            {
                test: /\.jst$/, 
                use: ['underscore-template-loader']
            },
        ]
      }
};