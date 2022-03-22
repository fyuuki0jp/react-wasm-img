FROM rust:1.59-buster

# 必要なパッケージがある場合インストール
# RUN apt install ~~~
RUN apt-get update
RUN apt-get -y install git nodejs npm
RUN apt-get clean
# RUN rustup component add rls rust-analysis rust-src rustfmt clippy
RUN npm install -g yarn n && n latest
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
RUN rm -rf /var/lib/apt/lists/*
