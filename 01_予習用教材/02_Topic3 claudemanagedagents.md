# Claude Managed Agents とは何か — エージェントを「長時間・非同期に動かす」ための土台

Code w/ Claude Tokyo 2026.06.10 技術英語リーディング帳 — Topic 3

エージェントに長時間・非同期に働いてもらうには、賢いモデルだけでは足りません。安全な鍵となる**credentials(認証情報)**、エージェントがコードやツールを実行する**sandbox(隔離された実行環境)**、いま何をしているか追える**observability(可観測性)**といった、地味だが欠かせない裏方が要ります。これまで開発者は、この裏方を一つひとつ自分で組む必要がありました。**Claude Managed Agents(エージェント実行に必要な基盤を Anthropic 側で管理する仕組み)**は、そのための一連の API です。開発者は Agent・Environment・Session・Events といった**primitive(基本部品)**を組み合わせ、配管工事ではなく自分のプロダクトづくりに集中できます。

## 重要語彙

|#|Term|一般的な意味|今回の講演文脈での意味|語源・由来メモ|
|---|---|---|---|---|
|1|managed agents|管理された代理人|Anthropic がホスト・管理するエージェント実行基盤|manage は手 manus 由来|
|2|bottleneck|瓶の首、隘路|性能を頭打ちにする一番の制約。今はモデルではなく基盤|瓶の細い首が流量を制限する比喩|
|3|infrastructure|基盤、下部構造|エージェントを支える認証・実行環境・監視などの裏方|infra(下)+ structure(構造)|
|4|prompt|指示文、促すもの|モデルへの入力。ただしそれ「だけ」では本番は動かない|promptus(差し出された)由来|
|5|primitive|原始的なもの、基本要素|組み合わせて使う最小の部品|primus(最初の)から|
|6|sandbox|砂場|エージェントがコードやツールを走らせる隔離環境|安全に遊ぶ砂場の比喩|
|7|credentials|資格、信任状|外部システムにアクセスする鍵|credere(信じる)由来|
|8|identity|同一性、身元|どのユーザー・どの権限で外部にアクセスするかを示す身元|idem(同じ)由来|
|9|session|会議、ひとまとまりの時間|ユーザーと Claude のひと続きの対話|sedere(座る)由来|
|10|events|出来事|セッション中にやり取りされる一つひとつの動作|evenire(起こる)由来|
|11|event stream|出来事の流れ|やり取りを時系列で流すログ|stream は流れる川の比喩|
|12|spawn|産み出す、生成する|子エージェントを立ち上げて作業を委譲(delegate)する|元は魚が産卵する意|
|13|observability|観測可能性|中で何が起きているか見られること|observe + -ability|

## English Reading Passage

The bottleneck for capable agents is no longer the model's intelligence but the **infrastructure** around it. An agent needs more than a **prompt**: **credentials** to reach private systems, an **identity** for who it is, and a **sandbox** to run in. **Managed agents** is a set of API endpoints that handles all of this for you, offering **primitives** you can pick and combine, so you build your product instead of the plumbing. You open a **session**, your users send **events**, and Claude streams its work back through an **event stream**. It can even **spawn** other agents to share the work. Above all, the value is **observability** — a console where you watch what each agent is doing and why, which, together with sandboxing and scoped permissions, helps make them practical and governable in production.

**日本語訳:** 高い能力をもつエージェントの **bottleneck(ボトルネック)** は、もはやモデルの **intelligence(知能)** ではなく、その周りの **infrastructure(基盤)** です。エージェントには **prompt(指示文)** 以上のものが要ります。私設システムに届く **credentials(認証情報)** 、自分が誰かを示す **identity(同一性)** 、そして動くための **sandbox(隔離実行環境)** です。 **managed agents(運用まで面倒を見るエージェント基盤)** は、これらすべてを肩代わりする API 群で、選んで組み合わせられる **primitives(基本部品)** を提供します。だから配管工事ではなく自分のプロダクトづくりに集中できます。 **session(セッション)** を開き、ユーザーが **events(イベント)** を送ると、Claude は作業を **event stream(イベントの流れ)** で返します。必要なら別のエージェントを **spawn(生成)** して作業を分担させることもできます。そして何より価値があるのが **observability(可観測性)** ——各エージェントが今・なぜ何をしているかを見られるコンソールで、これが sandbox や権限の制限と合わさって、本番で実用的かつ統制可能にしてくれます。

## この教材が効く講演

|講演名|関係度|効く理由|
|---|---|---|
|How to get to production faster with Claude Managed Agents|◎|本トピックの中核。primitive・event stream・self-hosted sandbox・MCP tunnel・パートナー登壇まで全て該当|
|Build a production-ready agent with Claude Managed Agents|◎|同内容をハンズオンで再構成。session・agent・environment・events を実コードで確認できる|
|Memory and dreaming for self-learning agents|○|memory store・multi-agent が managed agents 上の機能として語られ、語彙が重なる|
|Stop babysitting your agents|△〜○|outcome や human-in-the-loop など「監視せず任せる」設計思想は重なるが、主題は Claude Code 寄り|
|The expanding toolkit|△|「足場がモデル側に移る」という共通テーマ。tool use・context管理の前提理解に役立つ|

## 使用ソースとリンク

| ソース名                                                                                             | 種別       | 使った理由                                                 | URLまたは資料名                                                     |
| ------------------------------------------------------------------------------------------------ | -------- | ----------------------------------------------------- | ------------------------------------------------------------- |
| Claude Managed Agents 基調講演 書き起こし（How to get to production faster with Claude Managed Agents）     | 講演書き起こし  | primitive・event stream・パートナー登壇・新機能の一次情報               | 提供資料 Document 2 / https://www.youtube.com/watch?v=zenIB7XLZxQ |
| Claude Managed Agents 技術ディープダイブ 書き起こし（Build a production-ready agent with Claude Managed Agents） | 講演書き起こし  | agent/environment/session/events の具体構成と console 操作の確認 | 提供資料 Document 3 / https://www.youtube.com/watch?v=jWWsLe4Gh5Y |
| Memory and dreaming for self-learning agents                                                     | 講演       | memory store・dreaming・multi-agent の語彙確認               | https://www.youtube.com/watch?v=RtywqDFBYnQ                   |
| The expanding toolkit                                                                            | 講演       | 「足場がモデル側に移る」共通テーマの確認                                  | https://www.youtube.com/watch?v=KLCuxMDZSDg                   |
| 統合ソースマップ v1                                                                                      | ユーザー提供資料 | トピック該当範囲と「効く講演」選定の基準                                  | 提供資料 Document 1                                               |
| Claude Managed Agents: get to production 10x faster                                              | 公式 Blog  | composable APIs・sandbox/credential/tracing の位置づけの裏取り  | https://claude.com/blog/claude-managed-agents                 |
| Claude Managed Agents overview                                                                   | 公式 Docs  | 「長時間・非同期」「ステートフル」「multi-agent はリサーチプレビュー」の確認          | https://platform.claude.com/docs/en/managed-agents/overview   |