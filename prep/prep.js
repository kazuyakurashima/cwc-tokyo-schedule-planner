/* 予習教材 R1b — 単語チェック & マイ単語（localStorageのみ・DB非依存）
   保存キー: cwc_tokyo_2026_prep_words（既存 day1/day2 キーとは別名前空間・§8.3）
   語彙ID: term slug（§8.2 方式B）。データは window.PREP_DATA（prep-data.js）。 */
(function () {
  'use strict';
  var KEY = 'cwc_tokyo_2026_prep_words';
  var PLAN_KEY_DAY1 = 'cwc_tokyo_2026_day1';
  var DAY1_SESSIONS = [
    { id: 'm1', s: '10:30', e: '11:00' },
    { id: 'b1', s: '10:30', e: '11:00' },
    { id: 'w1', s: '10:30', e: '11:15' },
    { id: 'm2', s: '11:15', e: '11:45' },
    { id: 'b2', s: '11:15', e: '11:45' },
    { id: 'w2', s: '11:30', e: '12:15' },
    { id: 'm3', s: '12:00', e: '12:30' },
    { id: 'b3', s: '12:00', e: '12:30' },
    { id: 'w3', s: '12:30', e: '13:15' },
    { id: 'w4', s: '13:30', e: '14:15' },
    { id: 'm4', s: '13:50', e: '14:20' },
    { id: 'b4', s: '13:50', e: '14:20' },
    { id: 'w5', s: '14:30', e: '15:15' },
    { id: 'm5', s: '14:35', e: '15:05' },
    { id: 'b5', s: '14:35', e: '15:05' },
    { id: 'm6', s: '15:20', e: '15:50' },
    { id: 'b6', s: '15:20', e: '15:50' },
    { id: 'w6', s: '15:30', e: '16:15' },
    { id: 'm7', s: '16:05', e: '16:35' },
    { id: 'b7', s: '16:05', e: '16:35' },
    { id: 'w7', s: '16:30', e: '17:15' },
    { id: 'm8', s: '16:50', e: '17:20' },
    { id: 'b8', s: '16:50', e: '17:20' },
    { id: 'w8', s: '17:30', e: '18:15' },
    { id: 'm9', s: '17:35', e: '18:05' }
  ];

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
  function loadPlan() {
    try {
      var a = JSON.parse(localStorage.getItem(PLAN_KEY_DAY1) || '[]');
      return new Set(Array.isArray(a) ? a : []);
    } catch (e) { return new Set(); }
  }
  function savePlan(set) {
    try { localStorage.setItem(PLAN_KEY_DAY1, JSON.stringify(Array.from(set))); }
    catch (e) { /* localStorage unavailable: leave the UI optimistic only until reload */ }
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function min(t) {
    var p = t.split(':').map(Number);
    return p[0] * 60 + p[1];
  }
  function overlaps(a, b) {
    return min(a.s) < min(b.e) && min(a.e) > min(b.s);
  }
  function findSession(id) {
    return DAY1_SESSIONS.find(function (s) { return s.id === id; });
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

  function setPlanBtn(btn, on) {
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.innerHTML = on
      ? '<i class="ti ti-circle-check-filled" aria-hidden="true"></i><span>参加予定</span>'
      : '<i class="ti ti-circle-plus" aria-hidden="true"></i><span>参加する</span>';
  }

  function refreshPlanButtons() {
    var plan = loadPlan();
    document.querySelectorAll('.talk-plan[data-plan-id]').forEach(function (btn) {
      setPlanBtn(btn, plan.has(btn.getAttribute('data-plan-id')));
    });
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

  function wirePlannerButtons() {
    document.querySelectorAll('.talk-plan[data-plan-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-plan-id');
        var plan = loadPlan();
        if (plan.has(id)) {
          plan.delete(id);
        } else {
          var target = findSession(id);
          if (target) {
            DAY1_SESSIONS.forEach(function (s) {
              if (s.id !== id && overlaps(target, s)) plan.delete(s.id);
            });
          }
          plan.add(id);
        }
        savePlan(plan);
        refreshPlanButtons();
      });
    });
    refreshPlanButtons();
    window.addEventListener('storage', function (e) {
      if (e.key === PLAN_KEY_DAY1) refreshPlanButtons();
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
        'まだ単語がありません。教材で覚えたい単語に <i class="ti ti-bookmark" aria-hidden="true"></i> を付けると、ここにまとまります。' +
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
    wirePlannerButtons();
    updateCounters();
    renderMyWords();
    var csvBtn = document.getElementById('mw-csv');
    if (csvBtn) csvBtn.addEventListener('click', exportCsv);
    var prBtn = document.getElementById('mw-print');
    if (prBtn) prBtn.addEventListener('click', function () { window.print(); });

    // 日本語訳トグル（既定=表示。読み手が任意で隠して腕試し・#1）
    var jaT = document.querySelector('.ja-toggle');
    if (jaT) jaT.addEventListener('click', function () {
      var pass = document.getElementById('ja-pass'); if (!pass) return;
      var hidden = pass.classList.toggle('ja-hidden');
      jaT.setAttribute('aria-expanded', hidden ? 'false' : 'true');
      var t = jaT.querySelector('.ja-toggle-t'); if (t) t.textContent = hidden ? '訳を表示' : '訳を隠して読む';
      var ic = jaT.querySelector('.ti'); if (ic) { ic.classList.toggle('ti-eye-off', !hidden); ic.classList.toggle('ti-eye', hidden); }
    });
  });
})();
