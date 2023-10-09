# SkillHub

社内勉強会の開催を活発にする web アプリ。

<img width="1100" alt="image" src="https://github.com/YoshiYoshiPro/SkillHub-3C1R/assets/106864912/9e42c487-1d22-4bf4-9a40-d79a607aaa7d">
<img width="833" alt="image" src="https://github.com/YoshiYoshiPro/SkillHub-3C1R/assets/106864912/af146b23-c6eb-4efd-8537-d89d0433adda">
<img width="843" alt="image" src="https://github.com/YoshiYoshiPro/SkillHub-3C1R/assets/106864912/56c3be4e-e516-4986-a0c8-eeac2cc49108">

## 主な機能：

- プロフィール機能（名前、メールアドレス、SNS のリンク、ひとこと、入社歴、会社内の所属、興味のある技術、業務経験のある技術、得意な技術、アイコン画像）
- タグ検索機能（技術のハッシュダグが存在しており、検索ボックスから技術を検索すると、その技術に興味のある社員がグラフとともに一覧表示されます）
- 勉強会ルームの通知（自分が興味のある技術の勉強会が開催される場合は通知が届きます）
- 勉強会自動開催機能（ユーザー側が勉強会を開催するのではなく、アプリ側が任意の技術に興味のある人数が一定数いる場合、自動的に勉強会開催の旨の投稿をタイムラインにします）
- いいね機能（自動的に投稿されたものにユーザーはいいねをつけることができます。一定数のいいねがついた投稿に関しては、開催を検討します）

## 技術スタック

- React（CRA）
- FastAPI
- PostgreSQL
- Docker（Docker compose）

## ブランチ運用

- main
- feature/<対応内容>

例）feature/login_form

## 開発環境

`./backend`ディレクトリに移動して、
コンテナのビルド（開発をはじめて行う時）

```
make build    （docker compose build）
```

キャッシュなしでビルドしたいときは

```
make build-no-cache   （docker compose build --no-cache）
```

コンテナ起動（開発を開始する毎）

```
make up   （docker compose up -d）
```

念の為、コンテナの起動確認

```
docker compose ps
```

もし、エラーが発生している場合でログ確認

```
make logs   （docker compose logs）
```

コンテナ停止

```
make down   （docker compose down）
```

**postgreSQL コンテナに入って DB モード起動（以下 2 つの作業を一気に）**

```
make psql
```

~~postgreSQL コンテナに入る方法~~

```
docker container exec -it postgres-db bash
```

~~DB モード起動~~

```
psql -U postgres
```

テーブル確認

```
\dt
```

## テーブルの運用

- テーブルの変更を行いたい場合は`./backend/fastapi/migration/models.py`に移動して、編集を行う
- `./backend`に移動して、アプリコンテナに入る

```
docker compose exec fastapi sh
```

- migration ファイルの生成のために、以下のコマンドを実行する。

```
alembic revision --autogenerate -m "create tables"
```

- --autogenerate オプションをつけることで、models.py を元にすでにある migration ファイルとの差分の migration ファイルを作成してくれる

- migration の実行を行う。

```
alembic upgrade head
```

## vscode 拡張設定

`.vscode`ディレクトリ下に`settings.json`で保存時に各言語のフォーマットや設定を走らせるように設定した。
`.vscode`ディレクトリ下に`extensions.json`で設定してほしい拡張機能を設定しておいたので、vscode 上の拡張機能画面で`@recommended`を検索すると、一覧で表示される。
