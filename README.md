# 牧口祐也研究室 ウェブサイト

日本大学生物資源科学部海洋生物資源科学科 牧口祐也准教授の研究室ウェブサイトです。

## 技術スタック

- **静的サイトジェネレーター**: Hugo
- **テーマ**: カスタムテーマ（Hugo Academic風）
- **ホスティング**: Netlify / Vercel
- **バージョン管理**: Git / GitHub

## プロジェクト構造

```
makiguchi-lab/
├── config.toml          # Hugo設定ファイル
├── content/             # コンテンツファイル（Markdown）
│   ├── _index.md       # ホームページ
│   ├── profile.md      # プロフィール
│   ├── research.md     # 研究内容
│   └── publications.md # 研究業績
├── layouts/             # レイアウトテンプレート
│   ├── _default/       
│   │   └── baseof.html # ベーステンプレート
│   └── index.html      # ホームページテンプレート
├── static/              # 静的ファイル
│   ├── css/
│   │   └── custom.css  # カスタムCSS
│   ├── js/
│   │   └── main.js     # JavaScript
│   └── img/            # 画像ファイル
└── README.md           # このファイル
```

## セットアップ

1. **Hugoのインストール**
   ```bash
   # macOS
   brew install hugo
   
   # Windows (Chocolatey)
   choco install hugo
   ```

2. **リポジトリのクローン**
   ```bash
   git clone [your-repository-url]
   cd makiguchi-lab
   ```

3. **ローカルサーバーの起動**
   ```bash
   hugo server -D
   ```
   ブラウザで http://localhost:1313 にアクセス

## コンテンツの更新方法

### 新しいページの追加
```bash
hugo new [section]/[filename].md
```

### 既存ページの編集
1. `content/`フォルダ内の対応するMarkdownファイルを編集
2. 保存すると自動的にブラウザがリロードされます

### 画像の追加
1. 画像を`static/img/`フォルダに配置
2. Markdownで参照: `![代替テキスト](/img/filename.jpg)`

## デプロイ

### Netlifyへのデプロイ

1. GitHubにプッシュ
2. Netlifyでリポジトリを連携
3. ビルドコマンド: `hugo --minify`
4. 公開ディレクトリ: `public`

### 手動デプロイ
```bash
hugo --minify
# publicフォルダの内容をサーバーにアップロード
```

## カスタマイズ

### カラーテーマの変更
`static/css/custom.css`の`:root`セクションで色を調整：
```css
:root {
  --primary-color: #8B956D;
  --secondary-color: #D4A574;
  /* その他の色設定 */
}
```

### メニューの追加
`config.toml`でメニュー項目を追加：
```toml
[[menu.main]]
  name = "新しいページ"
  url = "/new-page/"
  weight = 70
```

## トラブルシューティング

- **ページが表示されない**: `draft: false`を確認
- **スタイルが適用されない**: ブラウザキャッシュをクリア
- **画像が表示されない**: パスが正しいか確認

## ライセンス

MIT License

## 連絡先

質問や問題がある場合は、makiguchi.yuya@nihon-u.ac.jp までご連絡ください。