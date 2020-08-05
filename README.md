# JerryGo
* Goban application easy to access from Twitter
* An implementation example of [jsIGO](https://github.com/mimami24i/jsIGO) created by [mimami24i](https://github.com/mimami24i)

# Current Ver.
ver 0.01a

# 概要
* Twitter等のSNSを通じて対局・検討が可能な碁盤アプリケーションです。
* 棋譜情報は完全にURLに含有されているため、棋譜データをサーバーに保管する必要はありません。
* Twitterカードに用いられる画像は、サーバーに保存されます。
* メインエンジンとして、[mimami24i](https://github.com/mimami24i)さんによって作成された[jsIGO](https://github.com/mimami24i/jsIGO)を用いています。
* 万波奈穂棋士による「#1日1ツイートで囲碁ルールを説明したら何日で伝えられるか」企画に合わせて、碁石をゼリーの画像に置き換えたものをデフォルトとして使用しています。

# Example
* https://korintje.com/html/jerrygo/ にて動作しています。
* 着手後、画面下の「盤面をTwitterに貼る」を選択することで、棋譜情報と盤面画像へのリンクがクリップボードにコピーされます。

# 使用言語
* JavaScript
* PHP
* CSS

# 依存ライブラリ
* jsIGO
* jQuery

# 主な機能
* 棋譜画像付きTwitterカード
* 5, 6, 9, 19路盤のサポート 
* 基本的な棋譜操作[一手戻る/一手進む/最初から]



# License
* Free to use under the BSD license.

# Credit:
* korintje@protonmail.com
