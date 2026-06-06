// 予習教材 静的ページ生成 (R1a) — 原本Markdown(§8.1 source)を入力に prep/*.html を生成する。
// 使い方: node prep/build.mjs   （REQUIREMENTS_PREP.md §8.6 の構造ゆれ吸収方針に準拠）
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(DIR, '..');

const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7.5' fill='%23181816'/%3E%3Cpath d='M16 3.5l2.6 8.1L26 7.5l-4.1 7.4 8.1 2.6-8.1 2.6 4.1 7.4-7.4-4.1L16 31l-2.6-7.6-7.4 4.1 4.1-7.4L2 17.5l8.1-2.6L6 7.5l7.4 4.1L16 3.5z' fill='%23D85A30'/%3E%3Ccircle cx='16' cy='17.5' r='4.3' fill='%23F4A180'/%3E%3C/svg%3E";
const ICONS = "https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css";

// ---- 関連性ラベル (REL_LABELS / §8.7。講演の優劣ではなくトピックとの関連性) ----
const REL = {
  // 単色スケール（#8）: 関連性の強弱を coral 単色＋塗りの濃淡で示す（種類ではなく程度）
  '◎': { label: 'このトピックに一番沿っている講演', grp: 'g-near', icon: 'ti-circle-filled' },
  '○': { label: 'このトピックに内容が近い講演', grp: 'g-close', icon: 'ti-circle-dot' },
  '△': { label: 'このトピックに関連のある講演', grp: 'g-rel', icon: 'ti-circle' },
};
const REL_ORDER = ['◎', '○', '△'];

// ---- トピック設定 (§8.1 PREP_TOPICS) ----
// tier: must=最重要 / high=重要 / opt=可能であれば追いたい (§5・確定)
// talks: 関連性rel + 当日6/10の日時(10June.md正典)。時刻のない参考録画は date:null。
const T = (rel, title, time, stage) => ({ rel, title, date: time ? '6/10' : null, time, stage });
const REC = (rel, title, note) => ({ rel, title, date: null, time: null, stage: note || '参考録画' });

const PREP_TOPICS = {
  1: { tier: 'must', title: 'Claude Codeとは何か',
    summary: 'コードを読み・編集し・実行する「自律的な相棒」。routines・trigger・context・steerability。',
    source: '01_予習用教材/01_Topic1 claude code.md',
    talks: [
      T('◎', 'Build a proactive agent workflow with Claude Code', '16:30 – 17:15', 'Workshop'),
      T('◎', "What's new in Claude Code", '10:30 – 11:00', 'Main stage'),
      T('◎', 'Beyond the basics with Claude Code', '11:30 – 12:15', 'Workshop'),
      T('○', 'The expanding toolkit', '11:15 – 11:45', 'Breakout stage'),
      T('○', 'How to get to production faster with Claude Managed Agents', '12:00 – 12:30', 'Main stage'),
      T('○', 'Build a production-ready agent with Claude Managed Agents', '14:30 – 15:15', 'Workshop'),
      T('△', 'The prompting playbook', '17:30 – 18:15', 'Workshop'),
    ] },
  2: { tier: 'high', title: 'モデル選定と能力',
    summary: '一番賢いモデルではなく仕事に合うモデルを。tradeoff・test time compute・eval。',
    source: '01_予習用教材/07_Topic2 modelselectionandcapability.md',
    talks: [
      T('◎', 'Picking the right model', '10:30 – 11:15', 'Workshop'),
      T('◎', 'The capability curve', '15:20 – 15:50', 'Main stage'),
      T('◎', 'The thinking lever', '13:50 – 14:20', 'Breakout stage'),
      T('○', 'Getting more out of the Claude Platform', '16:50 – 17:20', 'Main stage'),
    ] },
  3: { tier: 'must', title: 'Claude Managed Agents',
    summary: 'エージェントを長時間・非同期に動かす土台。primitive・sandbox・observability。',
    source: '01_予習用教材/02_Topic3 claudemanagedagents.md',
    talks: [
      T('◎', 'How to get to production faster with Claude Managed Agents', '12:00 – 12:30', 'Main stage'),
      T('◎', 'Build a production-ready agent with Claude Managed Agents', '14:30 – 15:15', 'Workshop'),
      T('○', 'Memory and dreaming for self-learning agents', '10:30 – 11:00', 'Breakout stage'),
      T('△', 'Stop babysitting your agents', '12:30 – 13:15', 'Workshop'),
      T('△', 'The expanding toolkit', '11:15 – 11:45', 'Breakout stage'),
    ] },
  4: { tier: 'high', title: 'Memory / Dreaming / Context Engineering',
    summary: '経験を次回に持ち越すエージェント。memory・dreaming・context engineering。',
    source: '01_予習用教材/04_Topic4 memory dreaming context engineering.md',
    talks: [
      T('◎', 'Memory and dreaming for self-learning agents', '10:30 – 11:00', 'Breakout stage'),
      T('○', 'Stop babysitting your agents', '12:30 – 13:15', 'Workshop'),
      T('△', 'How to get to production faster with Claude Managed Agents', '12:00 – 12:30', 'Main stage'),
      T('△', 'Build a production-ready agent with Claude Managed Agents', '14:30 – 15:15', 'Workshop'),
    ] },
  5: { tier: 'must', title: 'Tool use / MCP / Skills / Subagents',
    summary: 'モデルに「道具」を持たせる。tool use・MCP・skill・subagent。',
    source: '01_予習用教材/03_Topic5 tool use mcp skills subagents.md',
    talks: [
      T('◎', 'The expanding toolkit', '11:15 – 11:45', 'Breakout stage'),
      T('◎', 'Beyond the basics with Claude Code', '11:30 – 12:15', 'Workshop'),
      T('○', 'Build a production-ready agent with Claude Managed Agents', '14:30 – 15:15', 'Workshop'),
      T('○', 'Stop babysitting your agents', '12:30 – 13:15', 'Workshop'),
      T('△', 'Memory and dreaming for self-learning agents', '10:30 – 11:00', 'Breakout stage'),
    ] },
  6: { tier: 'high', title: 'Eval / ベンチマーク',
    summary: '評価は出荷前の門番＋毎日直す改善エンジン。offline/online・trace clustering。',
    source: '01_予習用教材/05_Topic6 evals benchmarks.md',
    talks: [
      REC('◎', 'Evaluating and improving Replit Agent at scale', '参考録画 (SF)'),
      T('◎', 'The prompting playbook', '17:30 – 18:15', 'Workshop'),
      T('○', 'The capability curve', '15:20 – 15:50', 'Main stage'),
      T('○', 'Stop babysitting your agents', '12:30 – 13:15', 'Workshop'),
      REC('○', 'Caching, harnesses, and advisors: Building on Claude at GitHub scale', '参考録画'),
    ] },
  7: { tier: 'opt', title: 'Extended Thinking',
    summary: 'どれだけ深く考えるかを調整する。extended thinking・effort・adaptive thinking。',
    source: '01_予習用教材/08_Topic7 extendedthinking.md',
    talks: [
      T('◎', 'The thinking lever', '13:50 – 14:20', 'Breakout stage'),
      T('○', 'The capability curve', '15:20 – 15:50', 'Main stage'),
      T('○', 'Picking the right model', '10:30 – 11:15', 'Workshop'),
    ] },
  8: { tier: 'opt', title: 'Prompting ＆ AI-native org',
    summary: 'プロンプトを「直す」技術と、ボトルネックが動いた組織。eval・verification・dogfooding。',
    source: '01_予習用教材/06_Topic8 prompting.md',
    talks: [
      T('◎', 'The prompting playbook', '17:30 – 18:15', 'Workshop'),
      T('◎', 'Running an AI-native engineering org', '14:35 – 15:05', 'Breakout stage'),
      REC('○', 'Building AI-native at enterprise scale (monday.com / Doctolib / Delivery Hero)', '参考録画 (London)'),
      REC('○', 'From one person to 80: Scaling a hypergrowth engineering org with Claude Code', '参考録画 (London)'),
    ] },
};

const TIER_META = {
  must: { lab: 'まず押さえたい', pill: '最重要', sub: '当日の中核。基礎語彙が他トピックでも繰り返し登場します。', cls: 'tier-must' },
  high: { lab: 'できれば予習', pill: '重要', sub: '実務に直結。時間が取れれば押さえておきたいトピックです。', cls: 'tier-high' },
  opt:  { lab: '余力があれば追いたい', pill: '追いたい', sub: '深掘り・関連トピック。余裕があれば。', cls: 'tier-opt' },
};

// ---- ユーティリティ ----
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// **bold** を <strong> へ（先にエスケープ済みの文字列に適用）
const bold = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

// Markdown見出し配列 → {level,title,start,end}
function sections(lines) {
  const heads = [];
  lines.forEach((ln, i) => {
    const m = ln.match(/^(#{1,6})\s+(.*\S)\s*$/);
    if (m) heads.push({ level: m[1].length, title: m[2].trim(), start: i });
  });
  heads.forEach((h, i) => { h.end = i + 1 < heads.length ? heads[i + 1].start : lines.length; });
  return heads;
}
const findSec = (heads, re) => heads.find(h => re.test(h.title));

// 連続する表(| 区切り)行を抽出して {header, rows}
function parseTable(bodyLines) {
  const tbl = [];
  let started = false;
  for (const ln of bodyLines) {
    if (/^\s*\|/.test(ln)) { tbl.push(ln); started = true; }
    else if (started) break; // 表が途切れたら終了
  }
  const cells = ln => ln.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(c => c.trim());
  const isSep = row => row.every(c => /^:?-{2,}:?$/.test(c) || c === '');
  const rows = tbl.map(cells).filter(r => !isSep(r));
  if (!rows.length) return { header: [], rows: [] };
  return { header: rows[0], rows: rows.slice(1) };
}

// ---- 1教材をパース ----
function parseTopic(n) {
  const meta = PREP_TOPICS[n];
  const raw = readFileSync(join(ROOT, meta.source), 'utf8');
  const lines = raw.split(/\r?\n/);
  const heads = sections(lines);

  const h1 = heads.find(h => h.level === 1);
  const title = h1 ? h1.title : meta.title;

  const vocabH = findSec(heads, /重要語彙/);
  const passageH = findSec(heads, /English Reading Passage|Reading Passage/i);
  const srcH = findSec(heads, /使用ソース/);

  // 概要: 先頭〜重要語彙の手前。見出し/区切り/字幕行を除外し段落化
  const introEnd = vocabH ? vocabH.start : (passageH ? passageH.start : lines.length);
  const introRaw = lines.slice(h1 ? h1.start + 1 : 0, introEnd).filter(ln => {
    const t = ln.trim();
    if (!t) return true; // 空行は段落区切りとして保持
    if (/^#{1,6}\s/.test(t)) return false;          // 見出し(## 導入 等)除外
    if (/^---+$/.test(t)) return false;             // 区切り
    if (/リーディング帳|Code w\/ Claude/.test(t)) return false; // 字幕行
    return true;
  });
  const introParas = introRaw.join('\n').split(/\n\s*\n/).map(p => p.replace(/\n/g, ' ').trim()).filter(Boolean);

  // 重要語彙テーブル
  let vocab = [];
  if (vocabH) {
    const { header, rows } = parseTable(lines.slice(vocabH.start + 1, vocabH.end));
    // 列特定: '#' があれば term=1.. 、無ければ先頭=term
    const hasNo = /^#$|番号/.test((header[0] || '').trim());
    const seen = {};
    rows.forEach(r => {
      const no = hasNo ? r[0] : '';
      const term = hasNo ? r[1] : r[0];
      const general = hasNo ? r[2] : r[1];
      const talk = hasNo ? r[3] : r[2];
      const root = hasNo ? r[4] : r[3];
      if (!term) return;
      // §8.2 方式B: term slug（行順変更に強い安定ID）。同一トピック内の衝突は -2,-3 を付す
      let slug = term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-+/g, '-') || 'term';
      seen[slug] = (seen[slug] || 0) + 1;
      if (seen[slug] > 1) slug += '-' + seen[slug];
      vocab.push({ id: `t${n}-${slug}`, no, term, general: general || '', talk: talk || '', root: root || '' });
    });
  }

  // English passage + 日本語訳
  let en = '', ja = '';
  if (passageH) {
    const body = lines.slice(passageH.start + 1, passageH.end).join('\n').trim();
    const idx = body.search(/\*\*日本語訳/);
    if (idx >= 0) {
      en = body.slice(0, idx).trim();
      ja = body.slice(idx).replace(/^\*\*日本語訳[:：]?\*\*/, '').replace(/^\*\*日本語訳[:：]?/, '').trim();
    } else { en = body; }
  }

  // 使用ソース
  let sources = [];
  if (srcH) {
    const { header, rows } = parseTable(lines.slice(srcH.start + 1, srcH.end));
    rows.forEach(r => {
      const name = r[0] || '', kind = r[1] || '', url = r[r.length - 1] || '';
      const m = url.match(/https?:\/\/[^\s)]+/);
      sources.push({ name, kind, url: m ? m[0] : '' });
    });
  }

  return { n, title, meta, introParas, vocab, en, ja, sources };
}

// ---- レンダリング ----
function navBar(topicNo) {
  const prev = topicNo > 1 ? topicNo - 1 : null;
  const next = topicNo < 8 ? topicNo + 1 : null;
  return `<nav class="nav">
    <a class="navlink" href="/prep/"><i class="ti ti-layout-grid" aria-hidden="true"></i>予習トップ</a>
    <a class="navlink" href="/prep/my-words.html"><i class="ti ti-bookmarks" aria-hidden="true"></i>マイ単語</a>
    <a class="navlink" href="/#day1"><i class="ti ti-calendar" aria-hidden="true"></i>プランナーへ戻る</a>
    <span class="nav-sp"></span>
    ${prev ? `<a class="navlink" href="/prep/topic-${prev}.html" aria-label="前のトピック"><i class="ti ti-chevron-left" aria-hidden="true"></i>Topic ${prev}</a>` : ''}
    ${next ? `<a class="navlink" href="/prep/topic-${next}.html" aria-label="次のトピック">Topic ${next}<i class="ti ti-chevron-right" aria-hidden="true"></i></a>` : ''}
  </nav>`;
}

function talksSection(meta) {
  const groups = REL_ORDER.map(rel => {
    const items = meta.talks.filter(t => t.rel === rel);
    if (!items.length) return '';
    const r = REL[rel];
    const rows = items.map(t => {
      const rec = !t.time;
      // ステージ種別に応じたスタイルクラス
      const stgCls = rec ? 'stg-rec'
        : /Main/i.test(t.stage) ? 'stg-main'
        : /Breakout/i.test(t.stage) ? 'stg-brk'
        : /Workshop/i.test(t.stage) ? 'stg-ws' : '';
      const meta = rec
        ? `<div class="talk-meta"><span class="talk-stg ${stgCls}">${esc(t.stage)}</span></div>`
        : `<div class="talk-meta">
            <span class="talk-time"><span class="talk-date">${esc(t.date)}</span><span class="talk-clock">${esc(t.time)}</span></span>
            <span class="talk-stg ${stgCls}">${esc(t.stage)}</span>
          </div>`;
      return `<div class="talk${rec ? ' talk-rec' : ''}">
        ${meta}
        <div class="talk-ttl">${esc(t.title)}</div>
      </div>`;
    }).join('\n');
    return `<div class="talks-grp">
      <div class="talks-grp-h ${r.grp}"><i class="ti ${r.icon}" aria-hidden="true"></i>${esc(r.label)}</div>
      ${rows}
    </div>`;
  }).join('\n');
  return `<section class="sec">
    <h2 class="sec-h"><i class="ti ti-microphone" aria-hidden="true"></i>この講演を聞くなら覚える単語</h2>
    <p class="talks-intro">下記の講演を聞く予定なら、<strong>上の「重要語彙」</strong>を覚えておくと当日の聞き取りがぐっと楽になります。<br>並びは<strong>トピックとの関連性</strong>の順で、講演自体の優劣ではありません。</p>
    ${groups}
    <a class="talks-back" href="/#day1"><i class="ti ti-arrow-left" aria-hidden="true"></i>プランナーで参加予定を決める</a>
  </section>`;
}

// 空欄（空文字 or ダッシュのみ）判定：欠損に見せず空白にする（#3）
const emptyCell = s => !s || /^[—–\-ー]+$/.test(String(s).trim());
function vocabTable(vocab) {
  // 列順: 用語 → 講演文脈での意味（主役）→ 一般的な意味（従）→ 語源（従）
  const body = vocab.map(v => `<tr data-wid="${esc(v.id)}">
    <td class="ck-cell"><button class="vck" type="button" aria-pressed="false" aria-label="覚えたい単語に登録／解除"><i class="ti ti-bookmark" aria-hidden="true"></i></button></td>
    <td class="term-cell" data-label="用語"><span class="term">${esc(v.term)}</span></td>
    <td class="v-talk" data-label="講演での意味">${esc(v.talk)}</td>
    <td class="v-gen${emptyCell(v.general) ? ' is-empty' : ''}" data-label="一般的な意味">${emptyCell(v.general) ? '' : esc(v.general)}</td>
    <td class="v-root${emptyCell(v.root) ? ' is-empty' : ''}" data-label="語源・由来">${emptyCell(v.root) ? '' : esc(v.root)}</td>
  </tr>`).join('\n');
  return `<table class="vocab">
    <thead><tr><th class="th-ck"><span class="sr-only">覚えたい</span></th><th>用語</th><th>今回の講演文脈での意味</th><th class="th-sub">一般的な意味</th><th class="th-sub">語源・由来</th></tr></thead>
    <tbody>${body}</tbody>
  </table>`;
}

// URLからドメインのみ抽出（出典の出所表示・生URLは出さない・#5）
const domainOf = url => { try { return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]; } catch (e) { return ''; } };
function sourcesList(sources) {
  const items = sources.map(s => {
    const dom = s.url ? domainOf(s.url) : '';
    const inner = `<span class="src-n">${esc(s.name)}</span>${s.kind ? `<span class="src-k">${esc(s.kind)}</span>` : ''}${dom ? `<span class="src-d">${esc(dom)}<i class="ti ti-external-link" aria-hidden="true"></i></span>` : ''}`;
    return s.url
      ? `<li><a class="src-row" href="${esc(s.url)}" target="_blank" rel="noopener">${inner}</a></li>`
      : `<li><span class="src-row">${inner}</span></li>`;
  }).join('\n');
  return `<details class="sources-wrap">
    <summary class="sources-sum"><i class="ti ti-link" aria-hidden="true"></i>出典・参考リンク<span class="sources-c">${sources.length}</span></summary>
    <ul class="sources">${items}</ul>
  </details>`;
}

function footer() {
  return `<footer class="foot">
    <div>非公式の個人制作による予習教材です。語彙・英文・出典は教材本文に基づきます。セッション名・時間・タイトルは<a href="https://claude.com/code-with-claude/tokyo" target="_blank" rel="noopener">公式ページ</a>を正とし、差異がある場合は公式を優先してください。</div>
    <div class="note"><i class="ti ti-device-mobile" aria-hidden="true"></i><span>「覚えたい単語」のチェックは<strong>この端末のブラウザにのみ</strong>保存されます。別の端末・ブラウザには引き継がれず、ブラウザのデータ消去やプライベートブラウズでは保持されないことがあります。</span></div>
    <div class="note"><i class="ti ti-info-circle" aria-hidden="true"></i><span>This is an unofficial personal study aid for Code with Claude Tokyo. Talk titles and times are from the official event page.</span></div>
  </footer>`;
}

function page({ title, desc, body, topicNo }) {
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}"><link rel="icon" href="${FAVICON}">
<link rel="stylesheet" href="${ICONS}">
<link rel="stylesheet" href="/prep/prep.css">
<script defer src="/prep/prep-data.js"></script>
<script defer src="/prep/prep.js"></script>
</head>
<body>
${navBar(topicNo)}
${body}
${footer()}
</body>
</html>`;
}

function renderTopic(t) {
  const tm = TIER_META[t.meta.tier];
  const body = `<main class="wrap ${tm.cls}">
  <div class="eyebrow">技術英語リーディング帳 · Topic ${t.n}<span class="badge">${esc(tm.pill)}</span></div>
  <h1 class="page-t">${esc(t.title)}</h1>

  <section class="sec intro">
    <h2 class="sec-h"><i class="ti ti-bulb" aria-hidden="true"></i>このトピックの概要<span class="mini"><i class="ti ti-clock" aria-hidden="true"></i>約1分</span></h2>
    ${t.introParas.map(p => `<p>${bold(p)}</p>`).join('\n')}
  </section>

  <section class="sec">
    <h2 class="sec-h"><i class="ti ti-vocabulary" aria-hidden="true"></i>重要語彙<span class="mini vcount" data-topic="${t.n}"><i class="ti ti-bookmark" aria-hidden="true"></i>覚えたい <span class="vcount-n">0</span> / ${t.vocab.length}</span></h2>
    <p class="vocab-hint"><i class="ti ti-bookmark" aria-hidden="true"></i> を付けた単語は <a href="/prep/my-words.html">マイ単語</a> にまとまります（この端末のみ保存）。</p>
    ${vocabTable(t.vocab)}
  </section>

  <section class="sec">
    <h2 class="sec-h"><i class="ti ti-book-2" aria-hidden="true"></i>英文リーディング</h2>
    <p class="passage-lab">English Reading Passage</p>
    <div class="passage en" lang="en">${bold(t.en)}</div>
    ${t.ja ? `<div class="ja-head">
      <p class="passage-lab">日本語訳</p>
      <button class="ja-toggle" type="button" aria-expanded="true" aria-controls="ja-pass"><i class="ti ti-eye-off" aria-hidden="true"></i><span class="ja-toggle-t">訳を隠して読む</span></button>
    </div>
    <div class="passage ja" id="ja-pass">${bold(t.ja)}</div>` : ''}
    ${sourcesList(t.sources)}
  </section>

  ${talksSection(t.meta)}
  </main>`;
  return page({
    title: `Topic ${t.n} ${t.title} — CwC Tokyo 予習`,
    desc: t.meta.summary,
    body,
    topicNo: t.n,
  });
}

function renderHub(topics) {
  const tierBlock = (tier) => {
    const tm = TIER_META[tier];
    const items = topics.filter(t => t.meta.tier === tier);
    const cards = items.map(t => `<a class="tcard ${tm.cls}" href="/prep/topic-${t.n}.html">
      <span class="tcard-no">TOPIC ${t.n}</span>
      <span class="tcard-t">${esc(t.title)}</span>
      <span class="tcard-sum">${esc(t.meta.summary)}</span>
      <span class="tcard-prog" data-topic="${t.n}"><i class="ti ti-bookmark" aria-hidden="true"></i>覚えたい <span class="p-n">0</span> / ${t.vocab.length} 語</span>
    </a>`).join('\n');
    return `<section class="tier ${tm.cls}">
      <div class="tier-lab">${esc(tm.lab)}<span class="pill">${esc(tm.pill)}</span></div>
      <p class="tier-sub">${esc(tm.sub)}</p>
      <div class="topics">${cards}</div>
    </section>`;
  };
  const body = `<main class="wrap">
    <div class="eyebrow">Code with Claude Tokyo · 2026.06.10</div>
    <h1 class="page-t">予習教材 — 技術英語リーディング帳</h1>
    <p class="hub-lead">当日の英語講演にそなえる予習集です。各トピックは「概要1分 → 重要語彙 → 英文と訳 → この講演を聞くなら覚える単語」の順に読めます。まずは<strong>最重要</strong>から。</p>
    ${['must', 'high', 'opt'].map(tierBlock).join('\n')}
  </main>`;
  // hub には前後ナビ不要 → topicNo=0 でナビの前後を出さない
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>予習教材 — Code with Claude Tokyo 2026</title>
<meta name="description" content="Code with Claude Tokyo 2026 (6/10) の英語講演にそなえる予習教材。トピック別の重要語彙と英文リーディング。"><link rel="icon" href="${FAVICON}">
<link rel="stylesheet" href="${ICONS}">
<link rel="stylesheet" href="/prep/prep.css">
<script defer src="/prep/prep-data.js"></script>
<script defer src="/prep/prep.js"></script>
</head>
<body>
<nav class="nav">
  <a class="navlink" href="/prep/my-words.html"><i class="ti ti-bookmarks" aria-hidden="true"></i>マイ単語</a>
  <a class="navlink" href="/#day1"><i class="ti ti-calendar" aria-hidden="true"></i>プランナーへ戻る</a>
  <span class="nav-sp"></span>
</nav>
${body}
${footer()}
</body>
</html>`;
}

// ---- マイ単語ページ (R1b) ----
function renderMyWords() {
  const body = `<main class="wrap">
    <div class="eyebrow">予習教材 · マイ単語</div>
    <h1 class="page-t">マイ単語リスト</h1>
    <p class="hub-lead">各教材で覚えたい単語に <i class="ti ti-bookmark" aria-hidden="true"></i> を付けると、ここに集まります（<span id="mw-count">0</span> 語）。この端末のブラウザにのみ保存されます。</p>
    <div class="mw-actions" id="mw-actions">
      <button class="mw-btn" id="mw-csv" type="button"><i class="ti ti-download" aria-hidden="true"></i>CSVで書き出し</button>
      <button class="mw-btn" id="mw-print" type="button"><i class="ti ti-printer" aria-hidden="true"></i>印刷 / PDFで保存</button>
    </div>
    <div id="mywords" class="mywords"></div>
  </main>`;
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>マイ単語 — Code with Claude Tokyo 2026 予習</title>
<meta name="description" content="予習教材でチェックした「覚えたい単語」のマイリスト。"><link rel="icon" href="${FAVICON}">
<link rel="stylesheet" href="${ICONS}">
<link rel="stylesheet" href="/prep/prep.css">
<script defer src="/prep/prep-data.js"></script>
<script defer src="/prep/prep.js"></script>
</head>
<body>
<nav class="nav">
  <a class="navlink" href="/prep/"><i class="ti ti-layout-grid" aria-hidden="true"></i>予習トップ</a>
  <a class="navlink" href="/#day1"><i class="ti ti-calendar" aria-hidden="true"></i>プランナーへ戻る</a>
  <span class="nav-sp"></span>
</nav>
${body}
${footer()}
</body>
</html>`;
}

// ---- 実行 ----
const topics = [];
for (let n = 1; n <= 8; n++) {
  const t = parseTopic(n);
  topics.push(t);
  writeFileSync(join(DIR, `topic-${n}.html`), renderTopic(t));
  console.log(`topic-${n}.html  ← ${t.meta.source}  (語彙${t.vocab.length}語 / ソース${t.sources.length}件 / EN${t.en.length}字)`);
}
writeFileSync(join(DIR, 'index.html'), renderHub(topics));

// PREP_DATA（マイ単語・ハブ進捗の描画用・§8.2/§8.5）
const data = {
  topics: Object.fromEntries(topics.map(t => [t.n, { title: t.meta.title, tier: t.meta.tier }])),
  vocab: topics.flatMap(t => t.vocab.map(v => ({ id: v.id, topic: t.n, term: v.term, general: v.general, talk: v.talk, root: v.root }))),
};
writeFileSync(join(DIR, 'prep-data.js'), 'window.PREP_DATA=' + JSON.stringify(data) + ';\n');
writeFileSync(join(DIR, 'my-words.html'), renderMyWords());
console.log(`index.html (hub) + my-words.html + prep-data.js (${data.vocab.length}語) generated. topics:`, topics.length);
