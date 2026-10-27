// Mintlify 会在全站页面可交互后加载本文件；站内导航由诸葛 SDK 自动采集。
(function () {
  if (window.zhuge || document.getElementById('zhuge-js')) return;

  // 保留 SDK 的初始化队列协议，先配置再异步加载。
  window.zhuge = [
    [
      '_init',
      'ea505ff234c6450caf517b3344821768',
      {
        superProperty: { appName: 'textin-docs-global' },
        autoTrack: true,
        duration: true,
        openLanding: true,
        // 默认仅采集落地页滚动；全站采集需覆盖同站跳转、刷新和已有会话。
        alwaysLanding: true,
      },
    ],
  ];

  var script = document.createElement('script');
  var date = new Date();
  var version = date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString();
  script.id = 'zhuge-js';
  script.async = true;
  script.src = 'https://zhugeio-sdk.intsig.net/zhuge.js?v=' + version;
  script.onerror = function () {
    console.warn('诸葛 IO SDK 加载失败');
  };
  document.head.appendChild(script);
})();
