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

console.log(`\n${fail === 0 ? 'ALL PASS' : fail + ' FAILED'}`);
process.exit(fail === 0 ? 0 : 1);
