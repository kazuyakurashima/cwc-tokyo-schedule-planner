/* 予習教材 R1b — 単語チェック & マイ単語（localStorageのみ・DB非依存）
   保存キー: cwc_tokyo_2026_prep_words（既存 day1/day2 キーとは別名前空間・§8.3）
   語彙ID: term slug（§8.2 方式B）。データは window.PREP_DATA（prep-data.js）。 */
(function () {
  'use strict';
  var KEY = 'cwc_tokyo_2026_prep_words';

  function load() {
    try {
      var a = JSON.parse(localStorage.getItem(KEY) || '[]');
      return new Set(Array.isArray(a) ? a : []);
    } catch (e) { return new Set(); } // 破損時は空集合（既存値は破壊しない）
  }
  function save(set) {
    try { localStorage.setItem(KEY, JSON.stringify(Array.from(set))); }
    catch (e) { /* プライベートブラウズ等の書込失敗は握りつぶす（NFR-P8） */ }
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  var checked = load();

  function countTopic(t) {
    if (!window.PREP_DATA) return 0;
    return window.PREP_DATA.vocab.filter(function (v) { return v.topic == t && checked.has(v.id); }).length;
  }
  function updateCounters() {
    document.querySelectorAll('.vcount').forEach(function (c) {
      var el = c.querySelector('.vcount-n'); if (el) el.textContent = countTopic(c.getAttribute('data-topic'));
    });
    document.querySelectorAll('.tcard-prog').forEach(function (c) {
      var el = c.querySelector('.p-n'); if (el) el.textContent = countTopic(c.getAttribute('data-topic'));
    });
  }

  function setBtn(btn, tr, on) {
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (tr) tr.classList.toggle('ck-on', on);
  }

  // 教材ページ: 語彙行のチェック
  function wireVocab() {
    document.querySelectorAll('tr[data-wid]').forEach(function (tr) {
      var id = tr.getAttribute('data-wid');
      var btn = tr.querySelector('.vck');
      if (!btn) return;
      setBtn(btn, tr, checked.has(id));
      btn.addEventListener('click', function () {
        if (checked.has(id)) checked.delete(id); else checked.add(id);
        save(checked);
        setBtn(btn, tr, checked.has(id));
        updateCounters();
      });
    });
  }

  // マイ単語ページ: 書き出しボタンの活性/非活性
  function updateActions(n) {
    ['mw-csv', 'mw-print'].forEach(function (id) {
      var b = document.getElementById(id); if (b) b.disabled = (n === 0);
    });
  }

  // CSV 書き出し (R1c・§8.4: UTF-8 BOM・ヘッダ＋チェック語)
  function csvCell(s) { return '"' + String(s == null ? '' : s).replace(/"/g, '""') + '"'; }
  function exportCsv() {
    var data = window.PREP_DATA; if (!data) return;
    var items = data.vocab.filter(function (v) { return checked.has(v.id); });
    if (!items.length) return;
    var rows = [['topic_no', 'topic_title', 'term', 'general_meaning', 'talk_meaning', 'etymology'].map(csvCell).join(',')];
    items.forEach(function (v) {
      var tt = (data.topics[v.topic] || {}).title || '';
      rows.push([v.topic, tt, v.term, v.general, v.talk, v.root].map(csvCell).join(','));
    });
    var csv = '﻿' + rows.join('\r\n') + '\r\n'; // BOM + CRLF（Excel互換）
    try {
      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'cwc-tokyo-my-words.csv';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    } catch (e) { /* ダウンロード不可環境では無視 */ }
  }

  // マイ単語ページ: チェック済みを集約表示
  function renderMyWords() {
    var root = document.getElementById('mywords');
    if (!root) return;
    var data = window.PREP_DATA;
    var items = (data ? data.vocab : []).filter(function (v) { return checked.has(v.id); });
    var cnt = document.getElementById('mw-count'); if (cnt) cnt.textContent = items.length;
    updateActions(items.length);

    if (!items.length) {
      root.innerHTML = '<div class="mw-empty"><i class="ti ti-bookmark-off" aria-hidden="true"></i>' +
        'まだ単語がありません。教材で覚えたい単語に <i class="ti ti-circle" aria-hidden="true"></i> を付けると、ここにまとまります。' +
        '<a class="mw-empty-cta" href="/prep/">教材トップへ</a></div>';
      return;
    }
    // トピック番号順 → 出現順（PREP_DATA.vocab はその順）
    var byTopic = {};
    items.forEach(function (v) { (byTopic[v.topic] = byTopic[v.topic] || []).push(v); });
    var html = '';
    Object.keys(byTopic).sort(function (a, b) { return a - b; }).forEach(function (t) {
      var tm = (data.topics && data.topics[t]) || {};
      html += '<div class="mw-grp"><div class="mw-grp-h"><span class="mw-grp-no">Topic ' + t + '</span>' + esc(tm.title || '') +
        '<span class="mw-grp-c">' + byTopic[t].length + '語</span></div>';
      byTopic[t].forEach(function (v) {
        html += '<div class="mw-row" data-wid="' + esc(v.id) + '">' +
          '<div class="mw-main"><span class="mw-term">' + esc(v.term) + '</span>' +
          '<span class="mw-mean">' + esc(v.talk || v.general || '') + '</span></div>' +
          '<button class="mw-rm" type="button" aria-label="マイ単語から削除"><i class="ti ti-x" aria-hidden="true"></i></button></div>';
      });
      html += '</div>';
    });
    root.innerHTML = html;
    root.querySelectorAll('.mw-rm').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var row = btn.closest('[data-wid]'); if (!row) return;
        checked.delete(row.getAttribute('data-wid'));
        save(checked);
        renderMyWords();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    wireVocab();
    updateCounters();
    renderMyWords();
    var csvBtn = document.getElementById('mw-csv');
    if (csvBtn) csvBtn.addEventListener('click', exportCsv);
    var prBtn = document.getElementById('mw-print');
    if (prBtn) prBtn.addEventListener('click', function () { window.print(); });
  });
})();
