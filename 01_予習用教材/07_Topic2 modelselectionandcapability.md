# 一番賢いモデルではなく、仕事に合うモデルを選ぶ

Code w/ Claude Tokyo 2026.06.10 技術英語リーディング帳 — Topic 2

モデル選びは「一番賢いものを選べばいい」という話ではありません。同じ仕事でも、賢さ・速度・コストのあいだには **tradeoff(取捨選択)** があります。性能を伸ばすレバーには、モデルの基礎能力を高める **train time compute(訓練時の計算量)** と、答える瞬間＝**inference time(推論時)** に追加の計算やトークンを使う **test time compute(推論時に使う追加計算量)** があります。後者を増やすと、難しいタスクでは品質や正答率が上がることがありますが、**latency(応答遅延)** とコストも増えます。また、努力量を最大まで上げても、タスクによっては伸びが小さくなる **diminishing returns(逓減する効果)** が現れます。だから常に最強のモデルを選ぶ必要はありません。複雑な推論や高度なコーディングなら大きいモデルから、単純な分類・抽出・大量処理なら小さいモデルから試し、最後は **eval(評価)** で測って決めるのが基本です。

## 重要語彙（8語）

|#|Term|一般的な意味|今回の講演文脈での意味|語源・由来メモ|
|---|---|---|---|---|
|1|tradeoff|トレードオフ、取捨選択|賢さ・速度・コストの何を取り何を諦めるか|trade(交換)+ off|
|2|train time compute|訓練時の計算量|モデルの基礎能力を高めるため訓練段階で投入する計算資源|compute は computation(計算)の省略|
|3|test time compute|推論時に使う追加計算量|inference time に使う追加の計算。思考やツール使用などの形をとる|test time=「本番で試される時」|
|4|inference time|推論時|モデルが答えを出す時点|infer(推し量る)+ -ence|
|5|latency|応答遅延、遅さ|答えが返るまでの待ち時間。考えさせるほど長くなる|ラテン語 latere「隠れている」|
|6|diminishing returns|逓減する効果|努力を増やしても、タスクによっては伸びが小さくなること|経済学の用語。diminish はラテン語 minus「より少なく」|
|7|eval|評価|出来をテストで確かめる仕組み|evaluation の省略|
|8|rule of thumb|経験則、目安|ざっくりした実用的な目安|親指で大まかに測った慣習が由来とされる|

## English Reading Passage

Choosing a model is a **tradeoff** between intelligence, speed, and cost. Anthropic raises capability with two levers. **Train time compute** improves the model's base capability during training, while **test time compute** is extra compute used at **inference time**, often by letting the model spend more tokens thinking, calling tools, or working through a task before it answers. More tokens tend to raise quality and accuracy on hard problems, but they also raise **latency** and cost, and the gains often show **diminishing returns** at the highest effort. So the goal is not always the smartest model. The best way to choose is not to guess but to build hard **eval** sets and measure each option. A useful **rule of thumb** from the docs: for complex reasoning or coding, start with a larger model; for simple, high-volume, or low-latency tasks, a smaller one is often enough.

**日本語訳:** モデル選びは、賢さ・速度・コストのあいだの **tradeoff(取捨選択)** です。Anthropic は二つのレバーで能力を高めます。**train time compute(訓練時の計算量)** は訓練段階でモデルの基礎能力を高め、**test time compute(推論時に使う追加計算量)** は **inference time(推論時)** に使う追加の計算で、多くの場合、答える前にモデルにより多くのトークンを使って考えさせたり、ツールを呼ばせたり、タスクを順に進めさせたりする形をとります。トークンが多いほど難問では品質と正答率が上がる傾向がありますが、**latency(応答遅延)** とコストも増え、最も高い努力度ではしばしば **diminishing returns(逓減する効果)** が現れます。ですから目指すべきは常に一番賢いモデルとは限りません。選ぶ最良の方法は、勘に頼らず、難しい **eval(評価)** のセットを作って各選択肢を測ることです。Docs で語られる役立つ **rule of thumb(経験則)** はこうです。複雑な推論やコーディングなら大きいモデルから始め、単純・大量・低遅延の仕事なら小さいモデルで十分なことが多い。

## この教材が効く講演

|講演名|関係度|効く理由|
|---|:-:|---|
|Picking the right model (Workshop)|◎|tradeoff・eval を使ったモデル選定・latency・rule of thumb が直結|
|The capability curve (Main)|◎|train/test time compute による能力の伸びが主題|
|The thinking lever (Breakout)|◎|test time compute・inference time・diminishing returns を深掘り|
|Getting more out of the Claude Platform (Main)|○|モデルと設定の選び方の横断的理解に効く|

## 使用ソースとリンク

| ソース名                        | 種別       | 使った理由                                                                         | URLまたは資料名                                                            |
| --------------------------- | -------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| The thinking lever（講演書き起こし） | 講演       | train/test time compute（思考・ツール使用を含む）・inference time・diminishing returns の文脈確認 | 提供資料（書き起こし）https://www.youtube.com/watch?v=T7KqH7kYnE4               |
| Choosing the right model    | Docs     | tradeoff・latency・cost と「複雑なら高性能／単純・低遅延なら小型」の整理                                | https://docs.claude.com/en/docs/about-claude/models/choosing-a-model |
| Models overview             | Docs     | Opus/Sonnet/Haiku・モデル能力の整理                                                    | https://docs.claude.com/en/docs/about-claude/models/overview         |
| 統合ソースマップ v1                 | ユーザー提供資料 | Topic 2 の語彙・効く講演・構成の土台                                                        | 提供資料（統合ソースマップ v1）                                                    |