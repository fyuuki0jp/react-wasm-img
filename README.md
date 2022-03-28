# react-wasm-img

rustで作成した画像処理モジュールをwebassemblyとしてフロントエンドと結合し、webworkerで動作させるdemoプログラム
reactとstyledcomponentsを用いて画面をレンダリングしている。

# demo URL
https://fyuuki0jp.github.io/react-wasm-img/

# 開発手順
1. 当リポジトリをクローンする
2. クローンしたディレクトリをVSCodeのDevContainerで開く
3. 開き終わったらターミナルで下記を実行する
```
cd wasm_component
wasm-pack build
yarn
```
4. あとはコード編集をしていける。

# ビルド手順
## development
```
yarn run build-dev
```
## product
```
yarn run build-prod
```
# github pagesへのデプロイ手順
```
yarn run build-dev
yarn run deploy
```
# ローカルでの動作テスト
```
yarn run start
```
