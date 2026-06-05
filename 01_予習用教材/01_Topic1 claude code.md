# Claude Codeとは何か

Code w/ Claude Tokyo 2026.06.10 技術英語リーディング帳 — Topic 1

これまでの AI は、コードについて「教えてくれる」相手でした。エラーを貼れば直し方を説明し、書き方を聞けば例を返す——でも、実際にファイルを開いて直すのは自分。Claude Code は、その一線を越えます。あなたの **codebase(プロジェクト全体のコード)** を自分で読み、**files を編集し**、**commands を実行する**。つまり「コードを説明する相棒」ではなく「コードを動かす相棒」です。これが **agentic coding tool** の意味で、ターミナルでも IDE でもブラウザでも、あなたの作業の中に入ってきます。

---

## 重要語彙 11語

|#|Term|一般的な意味|今回の講演文脈での意味|語源・由来メモ|
|---|---|---|---|---|
|1|agentic coding tool|(辞書に載らない造語的表現)代理人のように自律的に動く道具|コードベースを読み・編集し・コマンド実行して開発を進める Claude Code そのもの|agent(代理人)+ -ic(〜的な)+ tool(道具)|
|2|codebase|(プロジェクトの)コード全体|Claude が読み・理解する対象のコード全体|code + base(土台)|
|3|edit files|ファイルを編集する|Claude が実際にコードを変更すること|—|
|4|run commands|コマンドを実行する|テスト・ビルド・確認などを Claude が実行すること|—|
|5|proactive workflow|先を見越した作業の流れ|AIが問題に気づき先に動く作業の流れ|pro-(前へ)+ act(動く)+ work + flow|
|6|reactive|反応の、受け身の|人が起点でないと動かない受動型|re-(返して)+ act(動く)|
|7|routines|決まった手順、日課|prompt+repo+connector+trigger を決めて自動実行する新機能|route(道筋)+ -ine。「決まった道筋」|
|8|trigger|引き金、きっかけ|routine をいつ起動するか(時間/イベント)|trigger(銃の引き金)|
|9|context|文脈、状況|成功のため Claude へ渡す情報全体(repo・docs・tools)|con-(共に)+ text(織られたもの)|
|10|steer|舵をとる、操縦する|走っている Claude を誘導する|古英語 steor(舵)|
|11|steerability|操縦性、舵の利き具合|実行中に見て・方向修正できる度合い|steer(舵をとる)+ -ability(できること)|

---

## English Reading Passage

Claude Code is an **agentic coding tool**. It reads your **codebase**, **edits files**, and **runs commands**, so it takes part in your work instead of only answering questions about code. The talk argues that such a tool should feel more like a teammate: instead of waiting for you to press enter, a teammate notices when something breaks and acts on its own. This is the idea of a **proactive workflow**, in contrast to a **reactive** one that only responds after you ask. To make this practical, the new **routines** feature lets you define a prompt, the repos and connectors to use, and a **trigger** that starts the session — on a schedule, through an API call, or on a GitHub event. Two things then decide how well it works: the **context** you give it, and its **steerability**, since you can open a running session to **steer** or resume it. The goal is simple: move Claude Code from a tool you drive step by step into a teammate that acts for you.

**日本語訳:** Claude Code は **agentic coding tool(自律的にコーディングする道具)** だ。あなたの **codebase(プロジェクト全体のコード)** を読み、**files を編集し(edit files)**、**commands を実行する(run commands)**——だからコードについて答えるだけでなく、あなたの作業そのものに加わる。講演は、そうした道具は「teammate(仲間)」のように感じられるべきだと説く。あなたが Enter を押すのを待つのではなく、teammate は何かが壊れたら気づいて自分で動く。これが、頼まれてから反応するだけの **reactive(受け身)** ではない **proactive workflow(先を見越した作業の流れ)** という発想だ。それを実用にするのが新機能 **routines(ルーティン)** で、prompt(指示文)、使う repo(リポジトリ)と connector(接続部品)、そしてセッションを始める **trigger(起動のきっかけ)**——スケジュール、API 呼び出し、または GitHub イベント——を決められる。出来を左右するのは2つ、あなたが渡す **context(文脈・前提情報)** と、その **steerability(操縦できる度合い)** だ。動いているセッションを開いて **steer(方向修正)** したり再開できるからだ。目指すのはシンプルで、Claude Code を「一手ずつ操作する道具」から「あなたの代わりに動く仲間」へ変えることだ。

---

## この教材が効く講演

|講演名|関係度|効く理由|
|---|:-:|---|
|Build a proactive agent workflow with Claude Code|◎|本教材の直接の対象。routines・trigger・context・steerability がそのまま使える|
|What's new in Claude Code|◎|Claude Code の基本語彙(agentic coding, codebase, commands)を共有|
|Beyond the basics with Claude Code|◎|subagent・workflow・connector など応用語彙が重なる|
|The expanding toolkit|○|connector / MCP / tool use が routines の context 設計に直結|
|How to get to production faster with Claude Managed Agents|○|managed infrastructure・常時稼働の発想を共有|
|Build a production-ready agent with Claude Managed Agents|○|proactive agent の本番化という延長線上|
|The prompting playbook|△|routine の prompt 設計・steerability に prompting が効く|

---

## 使用ソースとリンク

|ソース名|種別|使った理由|URLまたは資料名|
|---|---|---|---|
|Claude Code Overview|Anthropic公式Docs|agentic coding / codebase / edit files / run commands の定義確認|https://code.claude.com/docs/en/overview|
|Claude Code 製品ページ|Anthropic公式|connector・MCP・対応モデル等の事実確認|https://claude.com/product/claude-code|
|Build a proactive agent workflow with Claude Code(講演書き起こし)|ユーザー提供資料 / 講演動画|routines・trigger・context・steerability・実例の根拠|入力資料3 / https://www.youtube.com/watch?v=eSP7PLTXNy8|
|統合ソースマップ v1|ユーザー提供資料|語彙選定・他講演との関係づけの基礎|入力資料2|
|Code w/ Claude Tokyo 公式ページ|Claude公式イベントページ|対象日・セッション構成の確認|https://claude.com/code-with-claude/tokyo|