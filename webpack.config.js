const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const bundleOutputDir = './wwwroot/dist';

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    return [{
        stats: { modules: false },
        entry: { 
            'index': './ClientApp/index.jsx',
            'page': './ClientApp/page.jsx' 
        },
        resolve: { extensions: ['.js', '.jsx'] },
        output: {
            path: path.join(__dirname, bundleOutputDir),
            filename: '[name].js',
            publicPath: '/dist/'
        },
        module: {
            rules: [{ 
                    test: /\.jsx?$/, include: /ClientApp/, use: {
                    loader: 'babel-loader',
                    options: {
                        sourceMap: true,
                        presets: ['env', 'react'].concat(isDevBuild? ['react-hmre']: []),
                        plugins: ['transform-class-properties']
                    }
                }},
                { test: /\.scss$/, use: isDevBuild ? [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ] : ExtractTextPlugin.extract({
                    fallbackLoader: "style-loader",
                    loader: "css-loader!sass-loader",
                })},
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' }
            ]
        },
        plugins: [
            // new CheckerPlugin(),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/vendor-manifest.json')
            })
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
            // Plugins that apply in production builds only
            new webpack.optimize.UglifyJsPlugin(),
            new ExtractTextPlugin('site.css')
        ])
    }];
};