# モデルに「道具」を持たせるとは何か — Tool Use / MCP / Skills / サブエージェント

Code w/ Claude Tokyo 2026.06.10 技術英語リーディング帳 — Topic 5

去年まで、モデルを賢く動かすための足場（scaffolding）は開発者が自分で組む必要があった。どのツールを呼ぶか選ぶ **router(振り分け装置)**、失敗時にやり直す **retry loop(再試行ループ)**、出力を検証する **validator(検証器)** — そういった配管を何百行も書いてから、ようやく本来作りたいものに取りかかれた。Topic 5 のテーマは、その配管の多くが今やモデルのツール利用能力・Claude Code・Claude Managed Agents・SDK・サーバー側ツールなどに吸収されつつあり、代わりに開発者は「どの道具・文脈・権限・ワークフローを持たせるか」に集中しやすくなった、という転換だ。モデルは単なる入出力の箱ではなく、その周りに広がっていく **toolkit(道具一式)** として捉える。具体的には、モデルが自分でツールを選ぶ **tool use(ツール利用)**、外部サービスへの標準的な接続口 **MCP(モデル文脈プロトコル)**、再利用可能な手順書 **skill(スキル)**、そして大きな仕事を分担させる **subagent(下位エージェント)** — これらが連なって一つの仕事を成し遂げる仕組みを、当日の英語講演で耳にすることになる。

## 重要語彙

※ 下記のうち English Reading Passage で太字にして取り上げたのは、トピックの中心となる語です。残りの output schema・hook・context management・front door は、講演で耳にする周辺語として表のみに載せています。

|#|Term|一般的な意味|今回の講演文脈での意味|語源・由来メモ|
|---|---|---|---|---|
|1|scaffolding|足場、骨組み|昔は自分で組んだ周辺コード。今はモデル・Claude Code・Managed Agents 等に吸収されつつある|scaffold（建築の足場）。完成すれば外す一時的構造、という含み|
|2|tool use|道具の使用|モデルが外部機能を呼び出す力。今は自分でツールを選ぶ|—|
|3|tool routing|ツールの振り分け|どのツールを渡すか人が事前に選ぶこと。今は基本形ではなく、過剰だと逆効果。ただし大規模ツール群では tool search 等の設計は残る|route（経路を決める）|
|4|retry loop|再試行の繰り返し|失敗時にやり直す仕組み。今はエラーを文脈に戻せば、Claudeが再試行や別手段を選ぶことがある|—|
|5|output schema|出力の構造定義|ツールが返す値の形。これも渡すと賢く動く。※Claude APIのstrict tool useは主に入力スキーマを保証|schema（型）。ギリシャ語 skhēma「形」|
|6|hook|引っかけ、フック|ツール呼び出しの前後に処理を差し込む仕掛け|釣り針の hook。処理を「引っかける」点|
|7|context management|文脈の管理|長く動くための文脈の保ち方。今は数行の設定で済む|—|
|8|MCP (Model Context Protocol)|—|外部サービスへつなぐ共通の接続規格|Protocol：ギリシャ語 prōtokollon → 取り決め|
|9|MCP server|MCPサーバー|データ・ツール・ワークフローを MCP 経由で公開するサーバー|—|
|10|skill|技能、スキル|エージェントに持たせる再利用できる手順書|—|
|11|subagent / multi-agent orchestration|下位エージェント／複数エージェントの統率|親が別のエージェントを生み、分担・連携させること|orchestration：オーケストラの指揮 → 全体の統率|
|12|credential vault|認証情報の金庫|トークンをClaudeに見せず安全に保管・注入する仕組み|vault：地下金庫。ラテン語 volvere「丸く囲う」|
|13|sandbox|砂場、隔離環境|Claudeが安全にコードを動かす隔離環境（Managed Agents/code execution）。Claude Codeのローカル実行とは区別|子供の砂場 → 外に影響しない実験場の比喩|
|14|code execution|コードの実行|Claudeが自分の環境でコードを書いて動かすこと|—|
|15|front door (for agents)|（エージェント用の）正面玄関|あらゆるソフトがエージェント向けの入口を持つ将来像|—|

## English Reading Passage

A year ago, an agent meant heavy **scaffolding** around the model — a **router** to narrow tools, **retry loops** for failures. Today much of that work has moved into Claude's tool-use layer, Claude Code, and Managed Agents. With **tool use**, Claude reads each tool's description and decides when to call it; manual **tool routing** is no longer the default, and over-routing can make agents brittle. When a tool fails and the error returns to the conversation, Claude can often adjust and try another path. From there, the toolkit reaches outward. Through **MCP**, an agent connects to outside services like Linear or GitHub: in Managed Agents a private **MCP server** is reached over a tunnel, and credentials are referenced from a **credential vault** so Claude never handles raw tokens. A **skill** gives the agent reusable instructions for a task — Claude Code already ships with one for these APIs. In Managed Agents, code runs inside an isolated **sandbox**, and **multi-agent orchestration** lets a coordinator delegate specialized work to **subagents** and gather their results. The lesson: spend less effort rebuilding generic plumbing, and more on what tools, context, and permissions your agent should have.

**日本語訳:** 1年前、エージェントを作るとはモデルの周りに重い **scaffolding(足場)** を組むことだった。ツールを絞り込む **router(振り分け装置)** や、失敗に備える **retry loops(再試行ループ)** だ。今日では、その多くがClaudeのツール利用層・Claude Code・Managed Agents へと移っている。**tool use(ツール利用)** において、Claudeは各ツールの説明を読み、いつ呼ぶかを判断する。手動の **tool routing(ツールの振り分け)** はもはや基本形ではなく、過剰にやるとエージェントを脆くしうる。ツールが失敗してエラーが会話に戻されれば、Claudeはしばしば調整して別の手を試す。そこから道具一式は外へと広がっていく。**MCP(モデル文脈プロトコル)** を通じて、エージェントはLinearやGitHubのような外部サービスに接続する。Managed Agents では、私設の **MCP server(MCPサーバー)** はトンネル経由で到達でき、認証情報は **credential vault(認証情報の金庫)** から参照されるので、Claudeが生のトークンを扱うことはない。**skill(スキル)** は、ある作業のための再利用できる手順書をエージェントに与える — Claude Codeは、これらのAPI向けのものを既に同梱している。Managed Agents では、コードは隔離された **sandbox(隔離環境)** の中で動き、**multi-agent orchestration(複数エージェントの統率)** によって、統率役は **subagents(下位エージェント)** に専門の作業を任せ、結果をまとめられる。教訓はこうだ。汎用的な配管を組み直す労力を減らし、エージェントにどの道具・文脈・権限を持たせるかに力を注ごう。

## この教材が効く講演

|講演名|関係度|効く理由|
|---|---|---|
|The expanding toolkit|◎|tool use・context management・code execution・computer useを「before/after」で扱い、scaffoldingがモデルに吸収される流れを直接説明する中核講演|
|Claude Code応用（Beyond basics 等）|◎|hook、MCP接続、skill、Claude Code固有のツール活用が登場し、本トピックの語彙が頻出|
|Production-ready agent / Stop babysitting|○|MCP server・credential vault・sandbox・multi-agent orchestrationが実装レベルで語られ、subagent連携の具体像が掴める|
|Memory and dreaming|△|memory storeやcontext管理に触れ、ツール群と組み合わさる文脈で関連する|

## 使用ソースとリンク

| ソース名                                        | 種別       | 使った理由                                                                | URLまたは資料名                                                 |
| ------------------------------------------- | -------- | -------------------------------------------------------------------- | --------------------------------------------------------- |
| The expanding toolkit（Lucas講演）              | 講演書き起こし  | tool use/context management/code execution/computer useの定義と実例の一次情報   | 提供資料（書き起こし） / https://www.youtube.com/watch?v=KLCuxMDZSDg |
| Claude Managed Agents（Michael & Harrison講演） | 講演書き起こし  | MCP・credential vault・skill・multi-agent orchestration・sandboxの説明の一次情報 | 提供資料（書き起こし） / https://www.youtube.com/watch?v=zenIB7XLZxQ |
| Claude Managed Agents ワークショップ               | 講演書き起こし  | MCP tunnel・outcome・memory store・subagent生成の実装文脈の一次情報                 | 提供資料（書き起こし） / https://www.youtube.com/watch?v=jWWsLe4Gh5Y |
| 統合ソースマップ v1                                 | ユーザー提供資料 | Topic 5該当講演の選定根拠                                                     | 統合ソースマップ v1                                               |
| Anthropic 公式 Docs（MCP / Skills / Tool use）  | 公式Docs   | 用語の標準的定義の裏取り                                                         | docs.claude.com                                           |