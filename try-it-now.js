/*
 * 动态改写右上角 "Try It Now" 按钮的跳转地址。
 * Mintlify 的 navbar.primary 是静态配置(全站只有一个写死的 href),
 * 无法区分产品、也读不到 URL 参数,所以在这里按运行时逻辑改写。
 *
 * 规则(先判产品,再判来源):
 *   1) 路径含 document-crop  => Document Crop,否则 => xParse
 *   2) from 参数(不区分大小写)含 "sem" => 走注册页(带 redirect),否则 => 直达控制台
 * from 参数在落地时存入 sessionStorage,避免站内切页(SPA)后丢失。
 */
(function () {
  var BASE = 'https://www.textin.ai';

  var LINKS = {
    xparse: {
      def: BASE + '/console/recognition/robot_markdown_beta?service=pdf_to_markdown',
      sem: BASE + '/user/register?redirect=%2Fconsole%2Frecognition%2Frobot_markdown_beta%3Fservice%3Dpdf_to_markdown'
    },
    crop: {
      def: BASE + '/console/recognition/robot_process?service=crop_enhance_image',
      sem: BASE + '/user/register?redirect=%2Fconsole%2Frecognition%2Frobot_process%3Fservice%3Dcrop_enhance_image'
    }
  };

  var FROM_KEY = 'tin_docs_from';

  // 读取 from:优先当前 URL,其次会话缓存(处理 SPA 切页后 URL 掉参的情况)
  function getFrom() {
    try {
      var v = new URLSearchParams(location.search).get('from');
      if (v !== null) {
        sessionStorage.setItem(FROM_KEY, v);
        return v;
      }
      return sessionStorage.getItem(FROM_KEY);
    } catch (e) {
      try { return new URLSearchParams(location.search).get('from'); } catch (_) { return null; }
    }
  }

  function isSem() {
    var f = getFrom();
    return !!f && f.toLowerCase().indexOf('sem') !== -1;
  }

  function currentProduct() {
    return location.pathname.toLowerCase().indexOf('document-crop') !== -1 ? 'crop' : 'xparse';
  }

  function computeTarget() {
    var group = LINKS[currentProduct()];
    if (!isSem()) return group.def;
    // 命中 sem:在注册链接上带回当前页的 from 原值(URL 编码),用于来源归因
    var url = group.sem;
    var from = getFrom();
    if (from) url += (url.indexOf('?') === -1 ? '?' : '&') + 'from=' + encodeURIComponent(from);
    return url;
  }

  // 定位所有 "Try It Now" 按钮(Mintlify 桌面导航栏 + 移动菜单各一个,
  // 都要改)。先按文案匹配,兜底按原始 href 关键字匹配。
  function findButtons() {
    var result = [];
    var anchors = document.querySelectorAll('a');
    for (var i = 0; i < anchors.length; i++) {
      var t = (anchors[i].textContent || '').trim().toLowerCase();
      if (t === 'try it now') result.push(anchors[i]);
    }
    if (result.length === 0) {
      var fb = document.querySelectorAll('a[href*="robot_markdown_beta"], a[href*="robot_process"], a[href*="user/register"]');
      for (var j = 0; j < fb.length; j++) result.push(fb[j]);
    }
    return result;
  }

  function apply() {
    var btns = findButtons();
    var url = computeTarget();
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].getAttribute('href') !== url) btns[i].setAttribute('href', url);
    }
  }

  // 首次执行 + 监听 SPA 路由/重渲染(节流,避免频繁触发)
  var scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () { scheduled = false; apply(); });
  }

  function init() {
    apply();
    if (document.body) {
      new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    }
    window.addEventListener('popstate', schedule);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
