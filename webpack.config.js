const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : 'development';
const version = require('./package.json').version;

module.exports = {
    mode: NODE_ENV,
    entry: './src/index.ts',
    output: {
        path: `${__dirname}/dist/${version}`,
        publicPath: '/',
        filename: 'responsive-values.js'
    },
    resolve: {
        plugins: [new TsconfigPathsPlugin()],
        extensions: ['.ts', '.js', '.scss']
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                resolve: {
                    extensions: ['.ts', '.js', '.json'],
                },
                use: 'ts-loader',
            },
            {
                test: /\.ts$/,
                enforce: 'pre',
                use: [
                    {
                        loader: 'tslint-loader',
                        options: { /* Loader options go here */ }
                    }
                ]
            }
        ]
    },
    devtool: NODE_ENV === 'production' ? undefined : 'source-map'
};
