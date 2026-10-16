/*
 * 右侧 Discord 社区悬浮入口 —— 完整复刻海外主站(textin_web_source_next)的
 * CommunityHelp 组件:一颗 "Get help" 胶囊按钮,点击展开同款面板
 * (标题 / Discord 卡片 / 二维码 / 常见话题 / 页脚)。
 *
 * 文档站是 Mintlify,搬不了 React,这里用纯 JS 还原结构、样式与交互
 * (点外部关闭、Esc 关闭)。根目录 .js 由 Mintlify 自动注入(与
 * try-it-now.js 同一机制),无需在 docs.json 里显式引用。
 *
 * 文案 / 链接 / 二维码均与主站保持一致;主站的来源归因、焦点管理等
 * 营销/无障碍细节做了精简。
 */
(function () {
  var ROOT_ID = 'textin-discord-float';
  var INVITE_URL = 'https://discord.gg/jMhEUyxEa3'; // 主站 DISCORD_INVITE_URL
  var QR_LINK_URL = 'https://discord.gg/pRabr4UjH'; // 主站 DISCORD_QR_URL
  var QR_IMG = '/images/community/discord-qr.png';

  // Discord 图标(Simple Icons, CC0),与主站 DiscordIcon 同一路径
  var DISCORD_ICON =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />' +
    '</svg>';

  // 常见话题(与主站 helpTopics 一致):label + 图标 path
  var TOPIC_PATHS = {
    code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18',
    question:
      'M9 9a3 3 0 1 1 4.5 2.6c-1 .6-1.5 1.4-1.5 2.4m0 3v.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    pricing: 'M3 8h18M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm2 11h4',
    team: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.9M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7-8a4 4 0 0 1 0 8',
  };
  var TOPICS = [
    { label: 'API & integration', icon: 'code' },
    { label: 'Product questions', icon: 'question' },
    { label: 'Volume pricing', icon: 'pricing' },
    { label: 'Partnerships', icon: 'team' },
  ];

  var R = '#' + ROOT_ID;
  var CSS = [
    R + '{position:fixed;right:24px;bottom:23.333vh;z-index:900;color:#171c2f;font-size:14px;',
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;line-height:1.5;',
    '--help-glow-color:rgba(113,99,239,0.18);}',
    R + ' button{cursor:pointer;}',
    R + ' svg{display:block;flex-shrink:0;width:20px;height:20px;}',
    R + ' a,' + R + ' button{-webkit-tap-highlight-color:transparent;}',
    R + ' a:focus-visible,' + R + ' button:focus-visible{outline:2px solid #5965ef;outline-offset:4px;}',
    // 暗色主题(Mintlify html.dark)下的默认态
    'html.dark ' + R + '{--help-glow-color:rgba(156,141,255,0.4);}',
    'html.dark ' + R + ' .tdf-trigger{color:#fff;background:rgba(9,12,24,0.48);border-color:rgba(164,153,255,0.5);}',
    // 触发按钮
    R + ' .tdf-trigger{position:relative;display:flex;gap:10px;align-items:center;justify-content:center;',
    'touch-action:none;cursor:grab;',
    'min-height:48px;margin-left:auto;padding:12px 20px;color:#242943;font:inherit;font-weight:600;',
    'background:rgba(255,255,255,0.62);border:1px solid rgba(113,99,239,0.4);border-radius:999px;',
    'box-shadow:0 6px 24px rgba(21,27,61,0.12),0 0 20px var(--help-glow-color);',
    '-webkit-backdrop-filter:blur(16px) saturate(140%);backdrop-filter:blur(16px) saturate(140%);',
    'transition:background-color .32s ease,color .32s ease,border-color .32s ease,box-shadow .32s ease;}',
    R + '[data-dragging="1"] .tdf-trigger{cursor:grabbing;transition:none;}',
    R + ' .tdf-trigger:hover,' + R + ' .tdf-trigger[aria-expanded="true"]{color:#fff;background:#5865f2;',
    'border-color:#5865f2;box-shadow:0 8px 28px rgba(58,65,167,0.26);}',
    // 面板
    R + ' .tdf-panel{position:absolute;right:0;bottom:64px;width:400px;max-width:calc(100vw - 32px);',
    'max-height:calc(66.667vh - 84px);overflow:auto;',
    'background:radial-gradient(ellipse 360px 230px at 100% 0%,#e7e7ff,transparent),#fff;',
    'border:1px solid rgba(255,255,255,0.8);border-radius:20px;',
    'box-shadow:0 20px 64px rgba(18,25,63,0.2),0 4px 16px rgba(18,25,63,0.06);',
    'animation:tdf-enter 260ms cubic-bezier(0.22,1,0.36,1);overscroll-behavior:none;}',
    R + ' .tdf-panel a{text-decoration:none;}',
    // 拖到顶部空间不够时,面板改为向下展开
    R + ' .tdf-panel.tdf-panel-below{top:64px;bottom:auto;}',
    // header
    R + ' .tdf-header{position:relative;padding:24px 24px 22px;}',
    R + ' .tdf-eyebrow{padding-right:32px;color:#65708f;font-weight:600;font-size:11px;line-height:18px;letter-spacing:1.2px;}',
    R + ' .tdf-header h2{margin:12px 0 8px;color:#10182e;font-weight:600;font-size:26px;line-height:1.25;letter-spacing:-0.65px;}',
    R + ' .tdf-header p{margin:0;color:#68728a;font-size:13px;line-height:1.65;}',
    // 关闭按钮
    R + ' .tdf-close{position:absolute;top:16px;right:16px;display:grid;width:32px;height:32px;padding:0;',
    'color:#727d97;background:transparent;border:0;border-radius:50%;place-items:center;',
    'transition:color .2s ease,background-color .2s ease;}',
    R + ' .tdf-close svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-linecap:round;stroke-width:1.5;}',
    R + ' .tdf-close:hover{color:#343c62;background:rgba(108,117,198,0.1);}',
    // content
    R + ' .tdf-content{padding:0 20px 20px;}',
    R + ' .tdf-community{display:grid;grid-template-columns:minmax(0,1fr) 104px;gap:16px;align-items:center;',
    'padding:18px;background:linear-gradient(120deg,#f0efff,#ebedff);border-radius:14px;}',
    R + ' .tdf-communityInfo{min-width:0;}',
    R + ' .tdf-communityInfo p{margin:10px 0 14px;color:#69718e;font-size:12px;line-height:1.65;}',
    R + ' .tdf-communityTitle{display:flex;gap:8px;align-items:center;}',
    R + ' .tdf-communityTitle svg{width:24px;height:24px;color:#6762ef;}',
    R + ' .tdf-communityTitle h3{margin:0;color:#17213e;font-weight:600;font-size:14px;line-height:1.4;}',
    R + ' .tdf-join{display:inline-flex;gap:16px;align-items:center;justify-content:center;min-height:40px;',
    'padding:9px 14px;color:#fff;font-weight:600;font-size:13px;line-height:20px;',
    'background:linear-gradient(110deg,#6a5af1,#5366ef);border-radius:9px;box-shadow:0 4px 12px rgba(87,99,237,0.12);',
    'transition:box-shadow .24s ease,filter .24s ease;}',
    R + ' .tdf-join:hover{color:#fff;box-shadow:0 6px 18px rgba(87,99,237,0.26);filter:brightness(1.08);}',
    R + ' .tdf-join:hover .tdf-joinArrow{transform:translate(2px,-2px);}',
    R + ' .tdf-joinArrow{transition:transform .24s ease;}',
    R + ' .tdf-scan{display:flex;flex-direction:column;gap:6px;align-items:center;color:#69718e;font-size:11px;line-height:18px;}',
    R + ' .tdf-scan a{display:block;overflow:hidden;background:#fff;border-radius:9px;transition:box-shadow .2s ease;}',
    R + ' .tdf-scan a:hover{box-shadow:0 0 0 2px rgba(103,98,239,0.2);}',
    R + ' .tdf-scan img{display:block;width:104px;height:104px;object-fit:contain;}',
    // resources
    R + ' .tdf-resources{margin-top:24px;padding:0 4px;}',
    R + ' .tdf-resources h3{margin:0 0 10px;color:#28324c;font-weight:600;font-size:14px;line-height:21px;}',
    R + ' .tdf-topics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 12px;margin:0;padding:0;',
    'color:#34405e;font-size:13px;line-height:20px;list-style:none;}',
    R + ' .tdf-topics li{display:flex;gap:8px;align-items:center;min-height:46px;}',
    R + ' .tdf-topicIcon{display:grid;flex-shrink:0;width:32px;height:32px;color:#6665c1;background:#f2f1ff;',
    'border-radius:9px;place-items:center;}',
    R + ' .tdf-topicIcon svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5;}',
    R + ' .tdf-footer{padding:14px 24px;color:#68728a;font-size:11px;line-height:1.65;background:#fbfcff;border-top:1px solid #edf0f7;}',
    // 动画
    '@keyframes tdf-enter{from{transform:translateY(8px);opacity:0;}to{transform:translateY(0);opacity:1;}}',
    // 窄屏
    '@media (max-width:480px){' + R + '{right:16px;bottom:calc(48px + env(safe-area-inset-bottom,0px));}',
    R + ' .tdf-panel{width:calc(100vw - 32px);max-width:400px;}',
    R + ' .tdf-community{gap:12px;padding:14px;}}',
    '@media (max-width:360px){' + R + ' .tdf-community{grid-template-columns:1fr;}',
    R + ' .tdf-scan{flex-direction:row;gap:12px;justify-content:flex-start;}',
    R + ' .tdf-topics{grid-template-columns:1fr;}}',
    '@media (prefers-reduced-motion:reduce){' + R + ' .tdf-panel{animation:none;}' + R + ' .tdf-joinArrow{transition:none;}}',
  ].join('');
  var topicsHtml = TOPICS.map(function (t) {
    return (
      '<li><span class="tdf-topicIcon"><svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="' + TOPIC_PATHS[t.icon] + '" /></svg></span><span>' + t.label + '</span></li>'
    );
  }).join('');

  var PANEL_HTML =
    '<section class="tdf-panel" id="textin-community-help" role="dialog" aria-labelledby="textin-community-title">' +
      '<header class="tdf-header">' +
        '<div class="tdf-eyebrow">TEXTIN.AI COMMUNITY</div>' +
        '<button type="button" class="tdf-close" aria-label="Close help">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>' +
        '</button>' +
        '<h2 id="textin-community-title">Talk to the team</h2>' +
        '<p>Real answers from the people who build TextIn — not a ticket queue.</p>' +
      '</header>' +
      '<div class="tdf-content">' +
        '<div class="tdf-community">' +
          '<div class="tdf-communityInfo">' +
            '<div class="tdf-communityTitle">' + DISCORD_ICON + '<h3>TextIn on Discord</h3></div>' +
            '<p>1,000 credits on signup. Credits never expire.</p>' +
            '<a class="tdf-join" href="' + INVITE_URL + '" target="_blank" rel="noopener noreferrer">' +
              '<span>Join Discord</span><span class="tdf-joinArrow" aria-hidden="true">↗</span>' +
            '</a>' +
          '</div>' +
          '<div class="tdf-scan">' +
            '<a href="' + QR_LINK_URL + '" target="_blank" rel="noopener noreferrer" aria-label="Join TextIn on Discord">' +
              '<img src="' + QR_IMG + '" width="104" height="104" alt="Scan to join the TextIn Discord community" />' +
            '</a>' +
            '<span>Scan to join</span>' +
          '</div>' +
        '</div>' +
        '<div class="tdf-resources">' +
          '<h3>What people ask about</h3>' +
          '<ul class="tdf-topics">' + topicsHtml + '</ul>' +
        '</div>' +
      '</div>' +
      '<footer class="tdf-footer">Usually online 10am–6pm GMT+8 · No question too small</footer>' +
    '</section>';

  function injectStyle() {
    if (document.getElementById(ROOT_ID + '-style')) return;
    var style = document.createElement('style');
    style.id = ROOT_ID + '-style';
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  var isOpen = false;
  var rootEl = null;
  var triggerEl = null;

  var POS_KEY = 'textin_discord_float_top'; // 记住拖动后的垂直位置(px, 相对视口顶部)
  var MARGIN = 16; // 距视口上下边的最小留白
  var DRAG_THRESHOLD = 4; // 位移超过该值才算"拖动"而非"点击"

  function readSavedTop() {
    try {
      var v = parseFloat(localStorage.getItem(POS_KEY));
      return isNaN(v) ? null : v;
    } catch (e) {
      return null;
    }
  }
  function saveTop(v) {
    try { localStorage.setItem(POS_KEY, String(Math.round(v))); } catch (e) {}
  }

  // 把容器定位改为 top 控制;clamp 到视口内。传 null 时用保存值,无保存值则保持默认(靠 CSS bottom)
  function applyTop(top) {
    if (!rootEl) return;
    if (top == null) {
      var saved = readSavedTop();
      if (saved == null) return; // 没拖过:沿用 CSS 里的 bottom 默认定位
      top = saved;
    }
    var h = rootEl.offsetHeight || 48;
    var max = window.innerHeight - h - MARGIN;
    if (max < MARGIN) max = MARGIN;
    top = Math.max(MARGIN, Math.min(top, max));
    rootEl.style.top = top + 'px';
    rootEl.style.bottom = 'auto';
    return top;
  }

  // 面板展开方向:上方空间不够则向下展开
  function placePanel(panel) {
    var rect = triggerEl.getBoundingClientRect();
    var needAbove = Math.min(window.innerHeight * 0.6, 520);
    panel.classList.toggle('tdf-panel-below', rect.top < needAbove + MARGIN);
  }

  function setOpen(open) {
    if (!rootEl) return;
    isOpen = open;
    triggerEl.setAttribute('aria-expanded', open ? 'true' : 'false');
    var existing = rootEl.querySelector('.tdf-panel');
    if (open && !existing) {
      triggerEl.insertAdjacentHTML('beforebegin', PANEL_HTML);
      var panel = rootEl.querySelector('.tdf-panel');
      placePanel(panel);
      rootEl.querySelector('.tdf-close').addEventListener('click', function () {
        setOpen(false);
      });
    } else if (!open && existing) {
      existing.remove();
    }
  }

  // 拖拽:按住触发按钮上下移动容器位置
  var drag = null;
  function enableDrag() {
    triggerEl.addEventListener('pointerdown', function (e) {
      if (e.button != null && e.button !== 0) return;
      var startTop = rootEl.getBoundingClientRect().top;
      drag = { y: e.clientY, startTop: startTop, moved: false, id: e.pointerId };
      try { triggerEl.setPointerCapture(e.pointerId); } catch (_) {}
    });
    triggerEl.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dy = e.clientY - drag.y;
      if (!drag.moved && Math.abs(dy) < DRAG_THRESHOLD) return;
      if (!drag.moved) {
        drag.moved = true;
        rootEl.setAttribute('data-dragging', '1');
        if (isOpen) setOpen(false); // 拖动时先收起面板
      }
      applyTop(drag.startTop + dy);
    });
    function endDrag(e) {
      if (!drag) return;
      try { triggerEl.releasePointerCapture(drag.id); } catch (_) {}
      if (drag.moved) {
        var finalTop = applyTop(parseFloat(rootEl.style.top));
        if (finalTop != null) saveTop(finalTop);
        justDragged = true; // 让紧跟的 click 被抑制
      }
      rootEl.removeAttribute('data-dragging');
      drag = null;
    }
    triggerEl.addEventListener('pointerup', endDrag);
    triggerEl.addEventListener('pointercancel', endDrag);
    // 拖动结束后抑制紧跟的 click(避免拖完误开面板)
    triggerEl.addEventListener('click', function (e) {
      if (justDragged) { e.preventDefault(); e.stopImmediatePropagation(); justDragged = false; }
    }, true);
  }
  var justDragged = false;

  // 点击面板外部 / 按 Esc 关闭
  function onPointerDown(e) {
    if (isOpen && rootEl && !rootEl.contains(e.target)) setOpen(false);
  }
  function onKeyDown(e) {
    if (isOpen && e.key === 'Escape') setOpen(false);
  }

  function injectButton() {
    if (document.getElementById(ROOT_ID)) {
      rootEl = document.getElementById(ROOT_ID);
      triggerEl = rootEl.querySelector('.tdf-trigger');
      return;
    }
    if (!document.body) return;
    rootEl = document.createElement('div');
    rootEl.id = ROOT_ID;
    triggerEl = document.createElement('button');
    triggerEl.type = 'button';
    triggerEl.className = 'tdf-trigger';
    triggerEl.setAttribute('aria-haspopup', 'dialog');
    triggerEl.setAttribute('aria-controls', 'textin-community-help');
    triggerEl.setAttribute('aria-expanded', 'false');
    triggerEl.innerHTML = DISCORD_ICON + '<span>Get help</span>';
    triggerEl.addEventListener('click', function () {
      setOpen(!isOpen);
    });
    rootEl.appendChild(triggerEl);
    document.body.appendChild(rootEl);
    isOpen = false;
    enableDrag();
    applyTop(null); // 恢复上次拖动位置(若有)
  }

  function init() {
    injectStyle();
    injectButton();
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    // 视口变化时把按钮重新 clamp 回可见范围
    window.addEventListener('resize', function () {
      if (readSavedTop() != null) applyTop(parseFloat(rootEl && rootEl.style.top) || readSavedTop());
    });
    // SPA 切页/重渲染后节点被移除则补回(与 try-it-now.js 同样思路)
    if (document.body) {
      new MutationObserver(function () {
        if (!document.getElementById(ROOT_ID)) {
          isOpen = false;
          injectButton();
        }
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
