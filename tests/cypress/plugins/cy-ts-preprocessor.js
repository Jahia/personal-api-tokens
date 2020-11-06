const wp = require("@cypress/webpack-preprocessor");

const webpackOptions = {
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            // {
            //     test: /\.(graphql|gql)$/,
            //     exclude: /node_modules/,
            //     loader: 'graphql-tag/loader'
            //   },
            {
                test: /\.ts$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: "ts-loader",
                    },
                ],
            },
        ],
    },
};

const options = {
    webpackOptions,
};

module.exports = wp(options);
