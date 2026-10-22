# Web API

> Web API 是浏览器等宿主环境向 JavaScript 暴露的接口集合，不属于 ECMAScript 语言本身。

---

## 一、Web API 是什么

ECMAScript 只规定语法、类型、原型和执行模型。操作页面、发请求、读写文件这些能力由宿主环境提供，比如浏览器、Node.js、Deno。

```
┌──────────────────────────────────────────┐
│              宿主环境（浏览器）            │
│                                          │
│   ┌──────────────────────────────┐       │
│   │        Web API               │       │  DOM、fetch、Storage、Canvas…
│   └──────────────────────────────┘       │
│   ┌──────────────────────────────┐       │
│   │        ECMAScript            │       │  语法、内置对象、执行模型
│   └──────────────────────────────┘       │
└──────────────────────────────────────────┘
```

平时写的前端代码，就是 ECMAScript 语法加上宿主注入的 Web API：

```js
// 语言内核：各环境表现一致
const list = [1, 2, 3].map((n) => n * 2)

// Web API：只有浏览器（或类浏览器环境）提供
document.querySelector('.item')
const res = await fetch('/api/list')
```

换成 Node.js，注入的就是 `fs`、`http`、`process`，没有 `document`。

> 本目录只整理宿主提供的接口；语言版本的演进（ES6 到 ES17）见 [JavaScript](/javascript)。

---

## 二、为什么单独整理

| 原因 | 说明 |
|------|------|
| **迭代节奏不同** | 语言每年一版（ES2015+），Web API 则由各规范独立演进，随时可能新增或废弃 |
| **依赖运行环境** | 同一个 API 可能只在 HTTPS（安全上下文）下可用，或仅桌面端提供 |
| **跨浏览器差异大** | 名称、参数、返回值都可能有前缀或实验性实现，需做特性检测 |
| **与框架无关** | 不管用什么框架，最后调用的都是这些原生接口；理解了它们，框架的行为就不难看懂 |

---

## 三、主要分类

Web API 很多，按能力域大致分这几类：

| 分类 | 代表接口 | 典型用途 |
|------|----------|----------|
| **DOM 与页面** | `document`、`Element`、`Event`、`MutationObserver` | 查找/修改节点、事件绑定、观察 DOM 变化 |
| **BOM 与浏览器控制** | `window`、`location`、`history`、`navigator` | 跳转、前进后退、读取浏览器与设备信息 |
| **网络请求** | `fetch`、`XMLHttpRequest`、`WebSocket`、`EventSource` | 数据请求、长连接、服务端推送 |
| **数据存储** | `localStorage`、`sessionStorage`、`IndexedDB`、`Cache API` | 本地缓存、离线数据、会话状态 |
| **观察者** | `IntersectionObserver`、`ResizeObserver`、`PerformanceObserver` | 懒加载、尺寸监听、性能采集 |
| **图形与媒体** | Canvas 2D、WebGL、WebGPU、SVG、Web Audio、MediaStream | 绘图、3D 渲染、音视频处理、摄像头 |
| **文件与剪贴板** | `File`、`Blob`、`FileReader`、`Clipboard API`、Drag and Drop | 上传预览、文件解析、复制粘贴 |
| **并发与离线** | `Worker`、`Service Worker`、`BroadcastChannel` | 后台计算、离线缓存、多页面通信 |
| **性能与调度** | `Performance`、`requestAnimationFrame`、`requestIdleCallback`、`scheduler.postTask` | 性能测量、逐帧动画、任务优先级 |
| **安全与密码** | `crypto.subtle`、`Credentials`、`Permissions`、WebAuthn | 加解密、登录凭证、权限申请、无密码登录 |
| **设备与系统** | `Geolocation`、`Bluetooth`、`USB`、`Notification`、`Fullscreen`、`Share` | 定位、外设、通知、全屏、系统分享 |

---

## 四、标准由谁制定

Web API 的标准由几个组织分别维护：

| 组织 | 负责范围 | 备注 |
|------|----------|------|
| **TC39** | ECMAScript 语言标准 | 只规定语言内核，不涉及宿主 API |
| **WHATWG** | HTML、DOM、Fetch、URL、Streams、Web Storage、WebSocket | 采用「活标准」（Living Standard），持续更新、无版本号 |
| **W3C** | CSS、SVG、WebRTC、WebCrypto、Pointer Events、WebAuthn、WebGPU | 沿用传统流程：工作草案 → 候选推荐 → 推荐标准 |
| **Khronos Group** | WebGL | 图形接口的事实标准组织 |
| **IETF** | HTTP、WebSocket 等协议本身 | WHATWG/W3C 规范会引用其协议定义 |

> WHATWG 的规范只有一个最新版，随时修订；W3C 的规范有明确的阶段和版本快照。判断某个特性算不算已标准化，先看它属于哪类规范，再看浏览器的实现进度。

---

## 五、判断 API 是否可用

浏览器支持情况差异大，用之前先做特性检测

```js
// 1. 属性存在性
if ('fetch' in window) {
  /* 可用 */
}

// 2. 类型判断，避免同名属性不是函数
if (typeof navigator.clipboard?.writeText === 'function') {
  await navigator.clipboard.writeText('hello')
}

// 3. serviceWorker 可用
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}

// 4. 样式能力检测
if ('CSS' in window && CSS.supports('selector(:has(a))')) {
  /* 支持 :has() */
}
```

```css
/* 样式侧同样可以优雅降级 */
@supports (display: grid) {
  .layout { display: grid; }
}
```

> `https://` 和 `localhost` 算安全上下文。`crypto.subtle`、Service Worker、剪贴板写入、Geolocation 这些能力只在安全上下文里提供。

---

## 六、兼容性与演进

- 支持情况查 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API) 的浏览器兼容表和 [caniuse.com](https://caniuse.com)。MDN 的数据来自 [browser-compat-data](https://github.com/mdn/browser-compat-data)。
- 补齐能力：优先用官方 polyfill，比如 `core-js` 补语言特性、`whatwg-fetch` 补 `fetch`；`WebGL` 这类没法 polyfill 的只能降级。
- 渐进增强：先保证基础功能可用，再在支持的环境里叠加体验。
- 关注规范仓库：比如 [whatwg/fetch](https://github.com/whatwg/fetch)、[w3c/webcomponents](https://github.com/w3c/webcomponents)，能看出某个特性是在讨论中，还是准备废弃。

---

## 七、本目录的约定

写法跟 CSS、JavaScript 两部分保持一致：一页讲一个 API 或一类 API，页面按下面的顺序组织：

1. 作用：解决什么问题，什么时候该用
2. 语法和接口：方法、属性、参数表
3. 示例：可运行代码，能演示的用 `<Demo>` 嵌入
4. 兼容性与坑：浏览器差异、安全上下文要求、常见误用
5. 参考链接

示例 HTML 放在 `src/public/demos/` 下对应的路径，页面里这样嵌入：

```md
<Demo src="/demos/webapi/fetch/01-basic.html" title="fetch 基本用法" height="420px" />
```

---

## 八、参考链接

- [MDN Web API 索引](https://developer.mozilla.org/zh-CN/docs/Web/API)
- [WHATWG 规范总览](https://spec.whatwg.org/)
- [W3C 标准列表](https://www.w3.org/TR/)
- [web-platform-tests（跨浏览器测试套件）](https://github.com/web-platform-tests/wpt)
- [caniuse：浏览器支持情况](https://caniuse.com)
- [Chrome for Developers：Web 平台文档](https://developer.chrome.com/docs/web-platform)
