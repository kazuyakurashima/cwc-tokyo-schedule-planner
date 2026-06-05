# 評価(Eval)とは何か — 「最後のチェック」ではなく「毎日良くするエンジン」

Code w/ Claude Tokyo 2026.06.10 技術英語リーディング帳 — Topic 6

AIシステムを変えたとき、いちばん危ういのは「なんとなく良くなった気がする」という感覚です。本当に改善したのか、別の場所を壊しただけなのかは、測らないと分かりません。ここで効くのが **evaluation(評価。略して eval)** です。eval には2つの顔があります。出荷前に走らせる **offline eval(オフライン評価)**——出してよいか止めるかを決める門番。そしてもう一つが、本番運用後の **online eval(オンライン評価)**——実ユーザーが残す **trace(トレース=実行の記録)** やABテスト、人間のレビューを手がかりに、毎日エージェントを直し続ける改善ループです。eval を「出荷直前の最後の合否判定」で終わらせず、改善のエンジンに変える——これが Topic 6 の核心です。

## 重要語彙

|#|Term|一般的な意味|今回の講演文脈での意味|語源・由来メモ|
|---|---|---|---|---|
|1|eval / evaluation|評価、査定|自分の用途に合わせて作る、出力品質を測る仕組み|ラテン語 valere(価値がある)|
|2|benchmark|基準、指標|モデル同士を比べる汎用テスト。eval(自分用)と区別|測量の基準点(bench mark)|
|3|offline eval|—|出荷前の評価。自社用途の eval suite で出荷可否を判定|off-line=本番から切り離す|
|4|online eval|—|出荷後、trace・ABテスト・レビューで直す改善ループ|on-line=本番稼働中|
|5|trace|足跡、記録|エージェント1回の実行の全記録|trace=たどった跡|
|6|trace clustering|—|似た trace をまとめ、失敗の塊を見つける|cluster=群れ|
|7|AB testing|—|2案を出し分けて優劣を測る検証|A案/B案の対比|
|8|regression|後退、退行|変更で前より悪くなること|regress=後ろへ戻る|
|9|failure mode|失敗の型|どう失敗するかのパターン。1つずつ潰す|工学の故障様式から|
|10|green field|更地|テストも枠組みも無い白紙状態。評価が難しい|何も建っていない野原|
|11|production quality|本番品質|デモでなく実サービスで使える水準|—|

## English Reading Passage

When you change an AI system, the real question is whether it actually got better — and at scale, "vibes" are not enough. A good setup rests on two pillars. The first is **offline eval**: a custom eval suite run before shipping, which stops a release if there is a major **regression**. The second is **online eval**: every session in production leaves a **trace**, and millions of them show what users really do. Because one trace is hard to debug, the key move is **trace clustering** — grouping similar failures so a recurring **failure mode** stands out. Important or controversial fixes can then be checked with **AB testing** when needed, since results are rarely clean and human judgment still decides. This is hard because **vibe coding** starts from a **green field** with no tests, so grading cannot just run a fixed test set. The takeaway: do not treat evaluation as a last check before shipping; treat it as an engine that ships a better, **production quality** agent every day.

**日本語訳:** AIシステムを変えたとき、本当の問いは「実際に良くなったのか」です——そして大規模になると「雰囲気」では足りません。良い仕組みは2本の柱に支えられます。1つ目は **offline eval(オフライン評価)**——出荷前に走らせる、自社用途に合わせた eval suite で、重大な **regression(後退)** があれば出荷を止めます。2つ目は **online eval(オンライン評価)**——本番の各セッションは **trace(トレース)** を残し、その何百万件もが「ユーザーが実際に何をしているか」を示します。1本の trace は単体ではデバッグが難しいため、鍵となるのが **trace clustering(トレースのクラスタリング)**——似た失敗をまとめ、繰り返す **failure mode(失敗の型)** を浮かび上がらせることです。影響が大きい修正や判断が割れる修正は、必要に応じて **AB testing(ABテスト)** で検証します。結果はきれいに白黒つくことが稀なので、最後は人間の判断が決めます。これが難しいのは、**vibe coding(自然言語からアプリを作る開発)** が **green field(更地)** から始まりテストが無いため、採点が固定のテストを走らせるだけでは済まないからです。要点は、評価を「出荷直前の最後のチェック」と捉えず、毎日より良い **production quality(本番品質)** のエージェントを出荷する「エンジン」と捉えることです。

## この教材が効く講演

|講演名|関係度|効く理由|
|---|:-:|---|
|Evaluating and improving Replit Agent at scale|◎|offline/online の二本柱、trace clustering、AB testing、green field を本番事例で語る。本トピックの中核|
|The prompting playbook|◎|eval suite を v0 から作り、failure mode を1つずつ潰す実演。offline eval 側の手本|
|The capability curve|○|モデル能力の伸びを benchmark/eval で測り、production quality に届くかを論じる|
|Stop babysitting your agents|○|outcome rubric にエージェントが自分の出力を反復チェック=eval的発想|
|Caching, harnesses, and advisors: Building on Claude at GitHub scale|○|GitHub規模の production quality / reliability の運用語彙が拾える|
|Build a production-ready agent with Claude Managed Agents|△|production-ready の判断に eval の語が絡む|

## 使用ソースとリンク

| ソース名                                                    | 種別                          | 使った理由                                                                            | URLまたは資料名                                                                                     |
| ------------------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Evaluating and improving Replit Agent at scale(講演書き起こし) | イベント講演                      | offline/online二本柱・trace clustering・AB testing・green field の一次出典                  | https://www.youtube.com/watch?v=snroDwX1-JU                                                   |
| The prompting playbook(講演書き起こし)                         | イベント講演                      | eval suite・failure mode・regression など offline eval 側語彙の出典                        | https://www.youtube.com/watch?v=G2B0YWuJUgI                                                   |
| Demystifying evals for AI agents                        | Anthropic公式Engineering Blog | eval定義・regression eval・production monitoring・ABテスト・人間評価の関係を整理した一次級の公式解説。本教材の中心根拠 | https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents                        |
| Using the Evaluation Tool                               | Anthropic公式Docs             | Console上でのeval操作の補足                                                              | https://docs.claude.com/en/docs/test-and-evaluate/eval-tool                                   |
| Building effective agents                               | Anthropic公式Blog             | reliability・production品質の思想                                                      | https://www.anthropic.com/engineering/building-effective-agents                               |
| Code w/ Claude セッション一覧(SF)                              | イベント公式ページ                   | 該当講演の特定                                                                          | https://claude.com/code-with-claude/session/sf-evaluating-and-improving-replit-agent-at-scale |