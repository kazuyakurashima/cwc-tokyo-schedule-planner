// 予習教材 R1a 検証スクリプト。 使い方: node prep/test.mjs
// 1) プランナーの prepLinks() を index.html から抽出して挙動を検証
// 2) 生成済み prep/*.html の不変条件（必須セクション・関連性ラベル・優劣語の不使用）を検証
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(DIR, '..');
let fail = 0;
const ok = (cond, msg) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`); if (!cond) fail++; };

// ---- 1) prepLinks() を実ソースから取り出して評価（ロジックの二重化を避ける） ----
const idx = readFileSync(join(ROOT, 'index.html'), 'utf8');
const grab = (re, name) => { const m = idx.match(re); if (!m) throw new Error(`extract failed: ${name}`); return m[0]; };
const escSrc = grab(/const esc=s=>[^\n]*/, 'esc');
const minSrc = grab(/const PREP_TOPICS_MIN=\{[\s\S]*?\};/, 'PREP_TOPICS_MIN');
const ordSrc = grab(/const PREP_ORD=\{[^}]*\};/, 'PREP_ORD');
const plSrc  = grab(/function prepLinks\(x\)\{[\s\S]*?\n\}/, 'prepLinks');
const prepLinks = new Function(`${escSrc}\n${minSrc}\n${ordSrc}\n${plSrc}\nreturn prepLinks;`)();

ok(prepLinks({}) === '', 'prep なし → 空文字');
ok(prepLinks({ prep: [] }) === '', 'prep 空配列 → 空文字');
ok(prepLinks({ prep: [{ topic: 99, rel: '◎' }] }) === '', '未知トピック → 空文字');

const both = prepLinks({ prep: [{ topic: 7, rel: '◎' }, { topic: 2, rel: '◎' }] });
ok(both.includes('/prep/topic-7.html') && both.includes('/prep/topic-2.html'), '複数トピックのリンク生成');

const sorted = prepLinks({ prep: [{ topic: 6, rel: '○' }, { topic: 2, rel: '◎' }] });
ok(sorted.indexOf('topic-2') < sorted.indexOf('topic-6'), '◎ が ○ より先に並ぶ（関連性順）');
ok(/href="\/prep\/topic-\d\.html"/.test(both), 'リンクは絶対パス /prep/topic-N.html');

// ---- 2) 生成済みページの不変条件 ----
for (let n = 1; n <= 8; n++) {
  const html = readFileSync(join(DIR, `topic-${n}.html`), 'utf8');
  ok(html.includes('このトピックの概要'), `topic-${n}: 概要セクション`);
  ok(html.includes('class="vocab"'), `topic-${n}: 重要語彙テーブル`);
  ok(html.includes('English Reading Passage'), `topic-${n}: 英文セクション`);
  ok(html.includes('この講演を聞くなら覚える単語'), `topic-${n}: 対象講演セクション`);
  ok(html.includes('class="talk-ttl"'), `topic-${n}: 講演が1件以上`);
  // 講演の優劣を想起させる語を使っていない（FR-P2 / DoD §12.1）
  ok(!/最重要の講演|重要な講演|重要の講演/.test(html), `topic-${n}: 優劣を想起させる語なし`);
  // 関連性ラベルのいずれかを使用
  ok(/一番沿っている講演|内容が近い講演|関連のある講演/.test(html), `topic-${n}: 関連性ラベルを使用`);
  ok(html.includes('rel="noopener"'), `topic-${n}: 外部リンクに rel=noopener`);
}

// ハブ
const hub = readFileSync(join(DIR, 'index.html'), 'utf8');
ok((hub.match(/class="tcard /g) || []).length === 8, 'ハブに8トピックカード');
ok(/最重要/.test(hub) && /重要/.test(hub) && /追いたい/.test(hub), 'ハブに3分類');
ok((hub.match(/tcard-prog/g) || []).length === 8, 'ハブに覚えた語の進捗表示8件');

// ---- 3) R1b: 単語チェック & マイ単語 ----
const PREP_DATA = JSON.parse(readFileSync(join(DIR, 'prep-data.js'), 'utf8').replace(/^window\.PREP_DATA=/, '').replace(/;\s*$/, ''));
const ids = PREP_DATA.vocab.map(v => v.id);
ok(new Set(ids).size === ids.length, 'prep-data: 語彙IDが一意（slug衝突なし）');
ok(ids.every(id => /^t[1-8]-[a-z0-9-]+$/.test(id)), 'prep-data: 語彙IDが term slug 形式 (t{n}-slug)');
ok(PREP_DATA.vocab.every(v => v.term && v.topic), 'prep-data: 各語に term/topic');

for (let n = 1; n <= 8; n++) {
  const html = readFileSync(join(DIR, `topic-${n}.html`), 'utf8');
  const rows = (html.match(/<tr data-wid="/g) || []).length;
  const btns = (html.match(/class="vck"/g) || []).length;
  const cnt = PREP_DATA.vocab.filter(v => v.topic === n).length;
  ok(rows === cnt && btns === cnt, `topic-${n}: チェック行=ボタン=語数 (${cnt})`);
  ok(html.includes('この端末のブラウザにのみ'), `topic-${n}: localStorage前提の注記（NFR-P8）`);
  ok(html.includes('/prep/my-words.html'), `topic-${n}: マイ単語への導線`);
  ok(!html.includes('cwc_tokyo_2026_prep_words'), `topic-${n}: 保存キーはHTMLに直書きしない`);
}

const mw = readFileSync(join(DIR, 'my-words.html'), 'utf8');
ok(mw.includes('id="mywords"'), 'my-words: #mywords コンテナ');
ok(mw.includes('prep-data.js') && mw.includes('prep.js'), 'my-words: データ＋ロジック読込');

const pj = readFileSync(join(DIR, 'prep.js'), 'utf8');
ok(pj.includes('cwc_tokyo_2026_prep_words'), 'prep.js: 保存キー cwc_tokyo_2026_prep_words');
ok(pj.includes('cwc_tokyo_2026_day1'), 'prep.js: Day1プランナー保存キーと連携');
ok(!pj.includes('cwc_tokyo_2026_day2'), 'prep.js: Day2保存キーには触れない');
ok(/function overlaps/.test(pj) && /plan\.delete/.test(pj), 'prep.js: 参加追加時に時間重複を置き換える');

for (let n = 1; n <= 8; n++) {
  const html = readFileSync(join(DIR, `topic-${n}.html`), 'utf8');
  ok(html.includes('class="talk-plan"'), `topic-${n}: 講演リストに参加ボタン`);
}

// ---- 4) R1c: 書き出し（CSV / 印刷PDF）----
ok(mw.includes('id="mw-csv"') && mw.includes('id="mw-print"'), 'my-words: CSV/印刷ボタン');
ok(pj.includes('﻿'), 'prep.js: CSV に UTF-8 BOM');
ok(/topic_no[\s\S]*topic_title[\s\S]*term[\s\S]*general_meaning[\s\S]*talk_meaning[\s\S]*etymology/.test(pj), 'prep.js: CSV ヘッダ（§8.4 スキーマ）');
ok(pj.includes('window.print()'), 'prep.js: 印刷（window.print）');
ok(/@media\s*print/.test(readFileSync(join(DIR, 'prep.css'), 'utf8')), 'prep.css: 印刷スタイル（@media print）');

console.log(`\n${fail === 0 ? 'ALL PASS' : fail + ' FAILED'}`);
process.exit(fail === 0 ? 0 : 1);
