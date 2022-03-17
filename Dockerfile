FROM rust:1.59-buster

# 必要なパッケージがある場合インストール
# RUN apt install ~~~
RUN apt-get update && \
    apt-get -y install git nodejs npm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    rustup component add rls rust-analysis rust-src rustfmt clippy && \
    cargo install cargo-edit cargo-watch && \
    npm install -g yarn n && n latest && \
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh