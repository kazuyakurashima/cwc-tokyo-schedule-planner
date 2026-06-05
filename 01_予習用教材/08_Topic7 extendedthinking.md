# Extended Thinking とは何か — Claudeがどれだけ深く考えるかを調整する仕組み

Code w/ Claude Tokyo 2026.06.10 技術英語リーディング帳 — Topic 7

人間は問題によって考える時間を変えます。「10+10は?」なら即答するし、博士レベルの難問なら長く考え込む。Claudeも同じように、課題の難しさに応じて費やす**token(トークン)**の量を変えることで、答えの質を上げられます。学習時の計算量を増やしてモデルを賢くする**train time compute(学習時計算)**に対し、回答時にトークンを多く使って賢く答えるのが**test time compute(推論時計算)**です。この「どれだけ丁寧に考え、どれだけ多くの出力・ツール呼び出し・思考トークンを使うか」を調整する行動シグナルが**effort(努力度)**で、その比喩が**thinking lever(思考のレバー)**です。注意したいのは、思考を単純にON/OFFする**toggle(切り替えスイッチ)**は努力度を細かく調整する指標としては粗すぎるということ。トグルをオフにするのは、考える深さを少し下げるのではなく、extended thinking という追加推論モード自体を無効にする操作だからです。むしろClaude自身が、いつ・どれだけ考えるかを選ぶ**adaptive thinking(適応的思考)**へと設計は進んでいます。

## 重要語彙

|#|Term|一般的な意味|今回の講演文脈での意味|語源・由来メモ|
|---|---|---|---|---|
|1|extended thinking|拡張された思考|Claudeに深く考えさせる機能。回答前にトークンを使って推論する|extend=外へ伸ばす|
|2|reasoning|推論、筋道立てた思考|答える前に問題を段階的に考えるプロセス|reason=理由・道理|
|3|token|しるし、記号、最小単位|テキストを処理する単位。思考や生成に多く費やすほど深く考える|—|
|4|effort|努力、骨折り|回答文・ツール呼び出し・拡張思考を含む出力全体への行動シグナル(low〜max、モデルにより xhigh あり)|—|
|5|toggle|切り替えスイッチ|extended thinking モードのON/OFF。努力度を細かく調整する指標としては粗い|—|
|6|adaptive thinking|適応的な思考|adaptive モードを有効にすると、いつ・どれだけ考えるかをモデル自身が選ぶ|adapt=適応する|
|7|tool|道具、ツール|Claudeが外部世界と接する手段(web検索、MCP等)|—|
|8|budget|予算|思考や出力に使うトークン量の上限・目安(max_tokens はハード上限、task budget はベータ)|—|
|9|test time compute|—|推論時(回答時)にトークンを多く使って性能を上げる手法|test time=本番稼働時の意|
|10|train time compute|—|学習時の計算量。モデルを大きくして賢くする手法|—|
|11|diminishing marginal returns|限界収益逓減|努力度を上げても性能向上が頭打ちになる現象|経済学用語|

## English Reading Passage

When you ask a hard question, Claude can think before it answers. This is **extended thinking**: the model uses extra **tokens** to **reason** through a problem step by step, and harder problems get better answers when the model thinks more. Developers can guide how much effort Claude applies by setting an **effort** level, from low to max. Effort is not only about thinking; it shapes the whole response, including text, **tool** calls, and thinking tokens. A simple on/off **toggle** is too coarse to control this, because turning it off does not gently lower the effort — it disables the extended thinking mode itself. A better design is **adaptive thinking**, where Claude decides for itself when to think and how much — the way a person naturally thinks more on a hard task and less on an easy one. The ideal is to give Claude a **budget** of tokens and let it spend that effort wisely on its own.

**日本語訳:** 難しい質問をすると、Claudeは答える前に考えることができる。これが**extended thinking(拡張思考)**だ。モデルは余分な**tokens(トークン)**を使って問題を一歩ずつ**reason(推論)**し、難しい問題ほど、より多く考えたときに良い答えが出る。開発者は**effort(努力度)**のレベルをlowからmaxまで設定して、Claudeがどれだけ力を注ぐかを導ける。effortは思考だけに関わるのではなく、テキスト・**tool(ツール)**呼び出し・思考トークンを含む応答全体を左右する。単純なオン/オフの**toggle(切り替えスイッチ)**でこれを制御するのは粗すぎる。オフにしても努力度がなだらかに下がるのではなく、extended thinking モード自体が無効になってしまうからである。より良い設計は**adaptive thinking(適応的思考)**で、いつ・どれだけ考えるかをClaude自身が決める——人が難しい課題ではよく考え、簡単な課題ではあまり考えないのと同じように。理想は、Claudeにトークンの**budget(予算)**を与え、その努力を自分で賢く配分させることだ。

## この教材が効く講演

|講演名|関係度|効く理由|
|---|---|---|
|The thinking lever|◎|本トピックの中心講演。effort・adaptive thinking・test time compute の全語彙が登場|
|The capability curve|○|モデル能力の伸びと test time compute / benchmark の関係を扱う|
|Picking the right model|○|大きいモデル×低effort vs 小さいモデル×高effort の判断軸に直結|
|The prompting playbook|△|adaptive thinking を使ったスケジューリング最適化の実演がある|
|Stop babysitting your agents|△|自律実行とトークン・時間配分の設計思想が重なる|

講演動画リンク（参考）

- The thinking lever: https://www.youtube.com/watch?v=T7KqH7kYnE4
- The prompting playbook: https://www.youtube.com/watch?v=G2B0YWuJUgI
- Build a proactive agent workflow with Claude Code: https://www.youtube.com/watch?v=eSP7PLTXNy8
- Build a production-ready agent with Claude Managed Agents: https://www.youtube.com/watch?v=jWWsLe4Gh5Y
- How to get to production faster with Claude Managed Agents: https://www.youtube.com/watch?v=zenIB7XLZxQ
- The expanding toolkit: https://www.youtube.com/watch?v=KLCuxMDZSDg
- Memory and dreaming for self-learning agents: https://www.youtube.com/watch?v=RtywqDFBYnQ
- Running an AI-native engineering org: https://www.youtube.com/watch?v=IA5LWIGqnyM
- Evaluating and improving Replit Agent at scale: https://www.youtube.com/watch?v=snroDwX1-JU

## 使用ソースとリンク

|ソース名|種別|使った理由|URLまたは資料名|
|---|---|---|---|
|The thinking lever（講演書き起こし／動画）|講演|Topic 7 該当講演。語彙・文脈の一次情報|https://www.youtube.com/watch?v=T7KqH7kYnE4|
|Effort|公式Docs|effort が出力全体への行動シグナルであること・level（low〜max、xhigh）の確認|https://platform.claude.com/docs/en/build-with-claude/effort|
|Adaptive thinking|公式Docs|adaptive モードでモデルが思考量を判断する仕様の確認|https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking|
|Building with extended thinking|公式Docs|extended thinking / interleaved thinking の定義確認|https://platform.claude.com/docs/en/build-with-claude/extended-thinking|
|Task budgets (beta)|公式Docs|budget がトークン予算であることの確認|https://platform.claude.com/docs/en/build-with-claude/task-budgets|
|統合ソースマップ v1|ユーザー提供資料|トピック範囲・効く講演・優先度の特定|統合ソースマップ v1（Topic 7該当部分）|