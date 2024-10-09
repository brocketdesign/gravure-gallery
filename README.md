# Gravure Gallery - MERN Application

## Description (English)
Gravure Gallery is a modern web application built with the MERN stack (MongoDB, Express, React, Node.js) to showcase images of famous Japanese gravure models. The images are scraped, stored, and managed in a MongoDB database, each with a title, tags, and URL. Users can browse the latest added images with infinite scroll and search by tags or keywords.

### Features:
- **Latest Images Page**: Displays the latest added images with infinite scroll.
- **Image Details Page**: Shows the image with related images based on tags, also featuring infinite scroll for related content.
- **Search Functionality**: Users can search images by tags or keywords, with search results displayed in an infinite scroll format.
- **Multilingual Support**: The app supports both English and Japanese languages.
- **SEO Optimized**: All pages include necessary SEO metadata and are optimized for search engines and social media.
- **Google Tag Manager**: Easily integrate Google Tag via environment variables for all pages.
- **Disclaimer and Contact Pages**: The app includes a disclaimer page explaining the ownership of the content and a contact page with a functional contact form.
- **Modern Design**: Built with Tailwind CSS for a clean, responsive user interface.

## Installation
1. Clone the repository.
2. Navigate to the `server` folder and run `npm install` to install backend dependencies.
3. Navigate to the `client` folder and run `npm install` to install frontend dependencies.
4. Set up your environment variables:
   - For the backend, create a `.env` file in the `server` folder with the necessary configurations (MongoDB URI, Google Tag ID, Email credentials).
   - For the frontend, create a `.env` file in the `client` folder with the `REACT_APP_GOOGLE_TAG_ID`.
5. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```
6. Start the frontend server:
   ```bash
   cd client
   npm start
   ```

## Technologies Used:
- **MongoDB**: Database for storing image metadata.
- **Express.js**: Backend framework for API and routing.
- **React.js**: Frontend library for building the user interface.
- **Node.js**: Backend JavaScript runtime.
- **Tailwind CSS**: CSS framework for styling and responsive design.
- **i18next**: Library for internationalization and language support.
- **React Helmet**: For SEO optimization.
- **React Infinite Scroll Component**: For implementing infinite scrolling on pages.

---

# グラビアギャラリー - MERNアプリケーション

## 説明 (日本語)
グラビアギャラリーは、MERNスタック（MongoDB、Express、React、Node.js）を使用して構築された、著名な日本のグラビアモデルの画像を表示するモダンなウェブアプリケーションです。画像はスクレイピングされ、タイトル、タグ、URL付きでMongoDBデータベースに保存・管理されます。ユーザーは、最新の画像を無限スクロールで閲覧し、タグやキーワードで検索することができます。

### 機能:
- **最新画像ページ**: 無限スクロールで最新の画像を表示します。
- **画像詳細ページ**: タグに基づいて関連画像を表示し、関連コンテンツの無限スクロールも備えています。
- **検索機能**: ユーザーはタグやキーワードで画像を検索でき、検索結果は無限スクロール形式で表示されます。
- **多言語対応**: アプリは英語と日本語の両方をサポートしています。
- **SEO最適化**: すべてのページに必要なSEOメタデータが含まれており、検索エンジンやSNSに最適化されています。
- **Googleタグマネージャー**: 環境変数を使用して、すべてのページにGoogleタグを簡単に追加できます。
- **免責事項および連絡ページ**: 免責事項ページでは、コンテンツの所有権に関する説明を行い、連絡フォーム付きの連絡ページも用意しています。
- **モダンなデザイン**: Tailwind CSSを使用して、クリーンでレスポンシブなユーザーインターフェースを構築しています。

## インストール方法
1. リポジトリをクローンします。
2. `server`フォルダに移動し、`npm install`を実行してバックエンドの依存関係をインストールします。
3. `client`フォルダに移動し、`npm install`を実行してフロントエンドの依存関係をインストールします。
4. 環境変数を設定します:
   - バックエンドの場合、`server`フォルダに必要な設定（MongoDB URI、GoogleタグID、メールの認証情報）を含む `.env` ファイルを作成します。
   - フロントエンドの場合、`client`フォルダに`REACT_APP_GOOGLE_TAG_ID`を含む `.env` ファイルを作成します。
5. バックエンドサーバーを起動します:
   ```bash
   cd server
   npm run dev
   ```
6. フロントエンドサーバーを起動します:
   ```bash
   cd client
   npm start
   ```

## 使用技術:
- **MongoDB**: 画像のメタデータを保存するデータベース。
- **Express.js**: APIとルーティングのためのバックエンドフレームワーク。
- **React.js**: ユーザーインターフェースを構築するためのフロントエンドライブラリ。
- **Node.js**: バックエンドのJavaScriptランタイム。
- **Tailwind CSS**: スタイリングとレスポンシブデザインのためのCSSフレームワーク。
- **i18next**: 国際化と言語サポートのためのライブラリ。
- **React Helmet**: SEO最適化のために使用。
- **React Infinite Scroll Component**: ページの無限スクロールを実装するために使用。
