/*
 * 给底部 footer 的社交图标(GitHub / Discord)内联补上文字标签。
 *
 * Mintlify 的 footer.socials 只渲染纯图标(图标 + 一个 sr-only 隐藏文字),
 * 这里按需求在每个图标旁边加上可见的名字。根目录 .js 由 Mintlify 自动
 * 注入(与 try-it-now.js / discord-float.js 同一机制)。
 *
 * 定位方式:只认那种"带 sr-only 文字"的 socials 链接,避开导航栏里本来
 * 就带文字的 GitHub 链接。
 */
(function () {
  var STYLE_ID = 'textin-footer-social-labels-style';

  // sr-only 文字(小写) -> 展示名
  var LABELS = { github: 'GitHub', discord: 'Discord', x: 'X', twitter: 'Twitter', linkedin: 'LinkedIn', youtube: 'YouTube' };

  var CSS =
    'a[data-tin-social-labeled]{display:inline-flex;align-items:center;gap:8px;}' +
    'a[data-tin-social-labeled] .tin-social-label{font-size:14px;font-weight:500;color:#4b5563;' +
    'white-space:nowrap;transition:color .2s ease;}' +
    'a[data-tin-social-labeled]:hover .tin-social-label{color:#111827;}' +
    'html.dark a[data-tin-social-labeled] .tin-social-label{color:#9ca3af;}' +
    'html.dark a[data-tin-social-labeled]:hover .tin-social-label{color:#d1d5db;}';

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  function labelOne(a) {
    if (a.getAttribute('data-tin-social-labeled')) return;
    var sr = a.querySelector('span.sr-only');
    if (!sr) return; // 只处理纯图标型 socials(排除导航栏那种已带文字的)
    var key = (sr.textContent || '').trim().toLowerCase();
    // 只给已知社交图标加文字;像 Mintlify "Powered by" 那种长句 sr-only 跳过
    if (!LABELS.hasOwnProperty(key)) return;
    var text = LABELS[key];
    var span = document.createElement('span');
    span.className = 'tin-social-label';
    span.textContent = text;
    a.appendChild(span);
    a.setAttribute('data-tin-social-labeled', '1');
  }

  function apply() {
    // 只处理底部 footer 内、带 sr-only 文字的 socials 图标链接,
    // 避开导航栏/logo 等其它带 sr-only 的链接
    var anchors = document.querySelectorAll('#footer a > span.sr-only, footer a > span.sr-only');
    for (var i = 0; i < anchors.length; i++) labelOne(anchors[i].parentNode);
  }

  function init() {
    injectStyle();
    apply();
    if (document.body) {
      new MutationObserver(function () {
        apply();
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
