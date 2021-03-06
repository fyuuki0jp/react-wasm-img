const path = require("path");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const createStyledComponentsTransformer = require('typescript-styled-components-plugin').default;

module.exports = {
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".wasm"]
    },
    mode: process.env.WEBPACK_ENV,
    output: {
        //  出力ファイルのディレクトリ名
        path: `${__dirname}/dist`,
        // 出力ファイル名
        filename: "index.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: "ts-loader",
                    options: {
                        getCustomTransformers: (program) => ({
                            before: [
                                createStyledComponentsTransformer(program, {
                                    setComponentId: true,
                                    setDisplayName: true,
                                    minify: true,
                                }),
                            ],
                        }),
                    },
                }],
            },
            {
                test: /\.ts?$/,
                use: [{
                    loader: "ts-loader",
                }],
            },
            {
                test: /\.wasm$/,
                type: "webassembly/async"
            }
        ]
    },
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300,
        poll: 500
    },
    experiments: {
        asyncWebAssembly: true,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src/index.html")
        }),
        new WasmPackPlugin({
            crateDirectory: path.join(__dirname, "wasm_component")
        })
    ]
};