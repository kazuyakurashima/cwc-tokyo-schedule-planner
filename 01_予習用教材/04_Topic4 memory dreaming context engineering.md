# エージェントは「記憶」でどう賢くなるのか

Code w/ Claude Tokyo 2026.06.10 技術英語リーディング帳 — Topic 4

人間が一晩寝ると前日の経験が整理されて記憶に定着するように、AIエージェントも「過去の作業から得た知見を、次に活かしやすい形で残す」ことができたら、毎回ゼロから説明し直す必要がなくなります。Topic 4 のテーマは、まさにその「経験を次回に持ち越せるエージェント」を支える仕組みです。エージェントがセッションを越えて参照できる **memory(記憶)**、その記憶をエージェント本体の作業とは別に非同期で整理する **dreaming(ドリーミング)**、そしてそもそもモデルに何を渡すかを設計する **context engineering(文脈設計)** の3つが核になります。Anthropic はこれを、エージェントが過去のセッションから共通の **pattern(パターン)** や **mistake(失敗)** を見つけ出し、整理された memory store を次回以降のエージェントが使えるようにする仕組みとして説明しています。ここで言う「学ぶ」はモデルの重みを再学習することではなく、記憶と文脈を整理して次の仕事に活かしやすくすることだと理解すると、当日の講演がぐっと聞き取りやすくなります。

### 重要語彙

|#|Term|一般的な意味|今回の講演文脈での意味|語源・由来メモ|
|---|---|---|---|---|
|1|memory|記憶、思い出|セッションを越えて残る情報。エージェントが読み書きするファイル群|ラテン語 memoria(記憶）から|
|2|dreaming|夢を見ること|過去セッションを見直し、パターンと失敗を抽出して記憶を整理・改善する裏側の処理|睡眠中の記憶整理になぞらえた命名|
|3|context engineering|文脈の設計|モデルに渡す情報を取捨選択し、有限の文脈枠を最適に使う技術|context(共に織る）+ engineering|
|4|self-learning agent|—|自分の経験から改善していくエージェント（モデルの重みを再学習する意味ではない）|self(自身）+ learning|
|5|memory store|—|記憶の保存場所。セッションに attach して使い、1セッションに最大8つまで付けられる|store は「貯蔵庫」|
|6|finite context|有限の文脈|context window には上限があるという制約|finite(限りある）はラテン語 finis(終わり）から|
|7|pattern|模様、型|複数のエージェントに共通して現れる傾向や失敗の型|古フランス語 patron(手本）から|
|8|curation|選別、管理|記憶から重複や古い情報を取り除き整える作業|ラテン語 curare(世話する）から|
|9|permission scope / access scope|—|あるエージェントが記憶ストアを読み書きできる範囲。公式Docsでは read_write / read_only で指定する|scope は「範囲、視野」|
|10|concurrency|同時並行|多数のエージェントが同じ記憶に同時アクセスする状況|con(共に）+ currere(走る）|
|11|out-of-band|帯域外の、本流とは別の|通常のエージェント作業とは別経路で走る非同期処理|通信用語で「通常経路の外」|
|12|version history|変更履歴|記憶の変更ごとに残る immutable なバージョン。監査・復元・redact に使える（保持期間に制約あり）|—|
|13|knowledge base|知識ベース|単なる作業メモを越え、整理された知識ベースのように機能する蓄積|—|
|14|high-signal|情報価値が高い|ノイズが少なく、覚える価値が高い情報|signal-to-noise(信号対雑音）の比喩|

### English Reading Passage

As models improve, agents can run for hours, but one thing stays unsolved: continuous self-learning. Because a model has only a **finite context**, **context engineering** — deciding what information to put in front of the model — matters a lot. **Memory** extends this across time: it is the primitive that lets a **self-learning agent** improve from its own experience, learning success criteria, common **mistakes**, and which strategies work. Claude models memory as a file system, so it can use familiar tools to keep it organized. But a single agent only sees its own task, so it misses what other agents have already learned. That is why Anthropic built **dreaming** — an **out-of-band** process that runs in the background, looks across many recent sessions, finds shared **patterns** and repeated mistakes, and does **curation** to remove duplicates and stale entries. It produces a separate, refreshed memory store that future agents can review or attach to their sessions, turning scattered memories into a more organized, **high-signal** **knowledge base**.

**日本語訳:** モデルが賢くなり、エージェントは何時間も実行できるようになりましたが、ひとつ未解決の課題が残っています。それが継続的な自己学習です。モデルが扱える文脈は **finite context(有限の文脈)** なので、何をモデルの前に置くかを決める **context engineering(文脈設計)** が非常に重要になります。**memory(記憶)** はこれを時間方向に拡張するもので、**self-learning agent(自己学習エージェント)** が自らの経験から改善することを可能にする基本機能です。成功条件、よくある **mistakes(失敗)**、どの戦略が有効かを学びます。Claude は記憶をファイルシステムとしてモデル化するため、使い慣れたツールで整理できます。しかし単一のエージェントは自分のタスクしか見えず、他のエージェントが既に学んだことを取りこぼします。だからこそ Anthropic は **dreaming(ドリーミング)** を作りました。これは背景で走る **out-of-band(本流とは別の)** な処理で、直近の多数のセッションを横断して見渡し、共通の **patterns(パターン)** や繰り返される失敗を見つけ、重複や古いエントリを取り除く **curation(選別)** を行います。そして将来のエージェントがレビューしたりセッションに attach したりできる、独立した刷新済みの記憶ストアを生み出し、散らばった記憶をより整理された **high-signal(情報価値が高い)** な **knowledge base(知識ベース)** へと変えます。

### この教材が効く講演

|講演名|関係度|効く理由|
|---|---|---|
|Memory and dreaming for self-learning agents|◎|Topic 4 の中心。memory / dreaming / context engineering の語彙と概念がそのまま登場する|
|Stop babysitting your agents|○|自律化・記憶を介した自己改善が議論され、dreaming や outcome 設計と重なる|
|How to get to production faster with Claude Managed Agents|△|memory store や multi-agent の前提知識として効く|
|Build a production-ready agent with Claude Managed Agents|△|memory store の実装文脈で version history や access scope が触れられる|

### 使用ソースとリンク

| ソース名                                                                           | 種別              | 使った理由                                                          | URLまたは資料名                                                                         |
| ------------------------------------------------------------------------------ | --------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Effective context engineering for AI agents                                    | Anthropic公式Blog | context engineering / finite context / high-signal tokens の概念  | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents |
| New in Claude Managed Agents: dreaming, outcomes, and multiagent orchestration | Claude公式Blog    | dreaming / memory / self-improving agents の公式発表                | https://claude.com/blog/new-in-claude-managed-agents                              |
| Dreams                                                                         | Claude API Docs | dreaming の実装仕様、入力ストアを変更しない点、出力ストア、非同期処理                        | https://platform.claude.com/docs/en/managed-agents/dreams                         |
| Using agent memory                                                             | Claude API Docs | memory store、read/write access、version history、concurrency の仕様 | https://platform.claude.com/docs/en/managed-agents/memory                         |
| Memory and dreaming for self-learning agents（講演書き起こし）                          | ユーザー提供資料        | 講演の文脈・demo・語彙の対応づけ                                             | 提供資料（書き起こし）https://www.youtube.com/watch?v=RtywqDFBYnQ                            |
| 統合ソースマップ v1                                                                    | ユーザー提供資料        | Topic 4 該当語彙・効く講演の選定                                           | 提供資料                                                                              |