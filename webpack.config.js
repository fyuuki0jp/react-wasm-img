const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const createStyledComponentsTransformer = require('typescript-styled-components-plugin').default;

module.exports = {
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".wasm"]
    },
    mode: 'development',
    output: {
        //  出力ファイルのディレクトリ名
        path: `${__dirname}/public/js`,
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
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "public/index.html")
        }),
        new WasmPackPlugin({
            crateDirectory: path.join(__dirname, "wasm_component")
        })
    ]
};