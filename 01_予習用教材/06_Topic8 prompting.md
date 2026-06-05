# プロンプトを「直す」技術と、ボトルネックが動いた組織 — AI前提のつくり方

Code w/ Claude Tokyo 2026.06.10 技術英語リーディング帳 — Topic 8

## 導入

Topic 8 には二つの顔があります。一つは、実務のプロンプトはゼロから書く美しい完成品ではなく、複数人が継ぎ足し policy も tone も古い継ぎ当ても混在した文章なので、**eval(評価)** を起点に **failure mode(失敗モード)** を一つずつ潰して「直す」という技術。もう一つは、その技術を回すチームそのものの話で、コードを書く速度が上がった結果 **bottleneck(隘路)** が移動し、かつて engineering **bandwidth(処理能力)** を守るために置いた計画やレビューの慣習が「静かに機能しなくなる」という変化です。前者では、命じても外部の実行能力（**capability**）は増えずツール付与が要る、賢いモデルは古い強すぎる指示に過剰反応（**overfit** 的な挙動）する、といった教訓が出ます。後者では、新しい隘路は **verification(検証)** に移り、自動化で早期に捕まえる **shift left** や、製品感覚を養う **dogfooding(自社製品の実利用)**、コードを **source of truth(信頼の源泉)** にする運用、そして古い処理を捨てる許可を含む **forcing function(強制力のある原則)** が語られます。共通する芯は、**growth mindset(成長思考)** で「この型はまだ目的を果たしているか」を絶えず問い直す姿勢です。

## 重要語彙

|#|Term|一般的な意味|今回の講演文脈での意味|語源・由来メモ|
|---|---|---|---|---|
|1|eval (evaluation)|「評価」|変更が本当に改善につながったかを測る仕組み。改善の起点|evaluate「価値を見積もる」|
|2|failure mode|句的表現：失敗の出方・型|プロンプトが崩れる具体的な不具合パターン|工学の「故障モード」|
|3|hygiene (general hygiene)|「衛生」|プロンプト全体を整える基本のお掃除|ギリシャ語 hygies「健康な」|
|4|output contract|句的表現：出力の取り決め|出力形式を約束として明示する設計|contract「契約」|
|5|overfit|「過適合する」|機械学習の厳密語ではなく比喩。古い強すぎる指示や一部ケースに過剰反応する様|統計の overfitting から転用|
|6|capability|「能力」|モデルやシステムが実際に遂行できる能力。外部実行能力は指示では増えない|capable「〜できる」|
|7|generate–evaluate–repair loop|句的表現：生成→評価→修復の反復|生成・評価・修復を独立プロンプトで回す方式。流れが決め打ちなら厳密には workflow、LLM自身が動的に決めるなら agent|Anthropic は workflow と agent を区別|
|8|bottleneck|「隘路、ボトルネック」|全体の速度を律する制約。今は移動し続けている|瓶の首の細さから|
|9|bandwidth|「帯域幅、処理できる量」|エンジニアが捌ける作業量。コードを書く速度だけが主制約ではなくなった|通信の「帯域」由来|
|10|verification|「検証、確認」|量が増えた今の新しい隘路。正しさの担保|verify「真と確かめる」|
|11|shift left|句的表現：工程の前倒し|不具合を源流に近い段階で自動的に捕まえる発想|工程図の「左＝早い段階」|
|12|dogfooding|句的表現：自社製品を自分で使う|製品感覚を養うために作り手が日常使いすること|"eat your own dog food"|
|13|source of truth|句的表現：唯一の正しい参照元|最も正しいと信じる単一の拠り所。ここではコード|DB用語 single source of truth|
|14|forcing function|句的表現：強制力のある仕掛け|チームに望ましい行動を必ず起こさせる原則|設計・行動経済学の用語|
|15|growth mindset|句的表現：成長思考|型や前提を絶えず見直し更新し続ける姿勢|心理学者 Dweck の概念|

## English Reading Passage

Working with Claude becomes truly AI-native when one habit reshapes both the prompt and the team: a **growth mindset** that keeps asking whether each old practice still earns its place. On the craft side, good prompting is rarely written from scratch. You debug an existing prompt with an **eval**, clean it up with basic prompt **hygiene**, and fix its **failure modes** one at a time. The key lesson is that instructions alone do not create new **capabilities** — when a task requires external action or reliable verification, you give the model tools or split the work into a generate–evaluate–repair loop. On the team side, the **bottleneck** has moved. Coding throughput is no longer the only constraint, so **verification**, review, and ownership become more important, and code can become the practical **source of truth**.

**日本語訳:** Claudeを使う営みが本当に **AI-native(AI前提)** になるのは、一つの習慣がプロンプトとチームの両方を組み替えるときだ。それは、古い慣習の一つひとつに「まだ存在価値があるか」を問い続ける **growth mindset(成長思考)** である。技術の側では、良いプロンプトはゼロから書くことはまれだ。既存のプロンプトを **eval(評価)** でデバッグし、基本のプロンプト **hygiene(お掃除)** で整え、その **failure modes(失敗モード)** を一つずつ直していく。核心となる教訓は、指示だけでは新しい **capabilities(実行能力)** は生まれないということ——外部への働きかけや確実な検証が要る仕事では、モデルにツール(tool)を与えるか、「生成→評価→修復」の loop(反復) に分ける。チームの側では、**bottleneck(隘路)** が移動した。コードを書く速度(coding throughput)だけが唯一の制約ではなくなり、**verification(検証)**・レビュー・責任範囲の整理がより重要になって、コードが実務上の **source of truth(唯一の正しい参照元)** になりうる。

## この教材が効く講演

|講演名|関係度|効く理由|
|---|:-:|---|
|The prompting playbook|◎|本教材の主資料の一つ。eval・hygiene・failure mode・output contract・tool付与・tradeoff明示が登場|
|Running an AI-native engineering org|◎|本教材の主資料の一つ。bottleneck移動・verification・dogfooding・source of truth・forcing function の核|
|Building AI-native at enterprise scale (monday.com / Doctolib / Delivery Hero)|○|AI-native組織を企業規模の事例で補強。東京6/10本編ではなくLondon録画・関連セッション扱い|
|From one person to 80: Scaling a hypergrowth engineering org with Claude Code|○|組織スケールの事例。Topic 1(Claude Code)ともまたがる。London録画・関連セッション扱い|
|Stop babysitting your agents|△|自律化・orchestration の思想は近い。eval/outcome まで強く紐づけるなら書き起こし根拠が必要|

## 使用ソースとリンク

|ソース名|種別|使った理由|URLまたは資料名|
|---|---|---|---|
|The prompting playbook（講演）|講演|本文・語彙のうち prompting 側の根拠|書き起こし／録画 https://www.youtube.com/watch?v=G2B0YWuJUgI|
|Running an AI-native engineering org（講演, Fiona Fung）|講演|本文・語彙のうち AI-native org 側の根拠|書き起こし／録画 https://www.youtube.com/watch?v=IA5LWIGqnyM|
|Prompt engineering overview|公式Docs|success criteria・eval・examples・XML構造化の裏取り|https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview|
|Building effective agents|公式Blog|workflow vs agent の区別、agentic system の設計原則、単純で組み合わせ可能なパターンの裏取り|https://www.anthropic.com/engineering/building-effective-agents|
|統合ソースマップ v1|ユーザー資料|Topic分類・効く講演・優先度の設計根拠|ユーザー提供資料|

## 付録：Code w/ Claude セッション録画リンク（Topic横断の参照用）

Topic 8 で直接使うのは上2本（The prompting playbook / Running an AI-native engineering org）ですが、他トピックの教材化に向けた参照用に、提供された録画リンクをまとめておきます。

| セッション                                                      | 主に効く Topic | 録画URL                                       |
| ---------------------------------------------------------- | ---------- | ------------------------------------------- |
| Running an AI-native engineering org                       | 8          | https://www.youtube.com/watch?v=IA5LWIGqnyM |
| The prompting playbook                                     | 8          | https://www.youtube.com/watch?v=G2B0YWuJUgI |
| The expanding toolkit                                      | 5          | https://www.youtube.com/watch?v=KLCuxMDZSDg |
| Memory and dreaming for self-learning agents               | 4          | https://www.youtube.com/watch?v=RtywqDFBYnQ |
| How to get to production faster with Claude Managed Agents | 3          | https://www.youtube.com/watch?v=zenIB7XLZxQ |
| Build a production-ready agent with Claude Managed Agents  | 3          | https://www.youtube.com/watch?v=jWWsLe4Gh5Y |
| Build a proactive agent workflow with Claude Code          | 1          | https://www.youtube.com/watch?v=eSP7PLTXNy8 |
| Evaluating and improving Replit Agent at scale             | 6          | https://www.youtube.com/watch?v=snroDwX1-JU |
| The thinking lever                                         | 7          | https://www.youtube.com/watch?v=T7KqH7kYnE4 |