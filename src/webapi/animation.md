# Web Animations API

> MDN: https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API

## 常见对象

### KeyframeEffect

关键帧效果对象表示一个动画的效果，类似于 CSS 中的 `@keyframes`，用来给 `Animation` 对象指定动哪些属性、每一帧取什么值。它只描述效果，不负责播放。播放、暂停、跳转、结束通知都由持有它的 `Animation` 处理。

多数场景用 `element.animate()` 更方便，直接 new 主要用在复用同一段效果、预先准备效果，或者要单独改效果本身的时候。

构造函数：

````typescript
new KeyframeEffect(target, keyframes)
new KeyframeEffect(target, keyframes, options)
new KeyframeEffect(sourceKeyFrames)
````

| 参数 | 说明 |
|------|------|
| `target` | 作用的元素，或 `null`。传 `null` 时不产生视觉变化，计时照常进行，之后给 `effect.target` 赋值就能补上 |
| `keyframes` | 关键帧数组，或按属性给数组的对象，格式与 `element.animate()` 的第一个参数相同；传 `null` 得到空效果 |
| `options` | 数字表示时长（毫秒）；对象可写 `duration`、`delay`、`endDelay`、`iterations`、`iterationStart`、`direction`、`fill`、`easing`、`composite`、`pseudoElement` |
| `sourceKeyFrames` | 只传这一个参数时是克隆，得到独立的效果对象 |

构造出来只是一个效果，页面不会有变化，要挂到 `Animation` 上再播放：

```js
const effect = new KeyframeEffect(
  box,
  [
    { transform: 'translateX(0)' },
    { transform: 'translateX(240px)', offset: 0.6 },
    { transform: 'translateX(120px)' },
  ],
  { duration: 600, easing: 'ease-out', fill: 'both' },
)

// 第二个参数是时间轴，不是 options；省略时默认 document.timeline
const animation = new Animation(effect, document.timeline)
animation.play()
```

`options` 可以省略，但 `duration` 默认是 `0`，动画会立刻结束。只给时长时直接写数字：
```js
new KeyframeEffect(box, [{ opacity: 0 }, { opacity: 1 }], 300)
```

建好之后还能改：

| 操作 | 写法 | 说明 |
|------|------|------|
| 换元素 | `effect.target = anotherElement` | 立刻作用到新元素，旧元素不再被这个效果改样式；CSS 动画和过渡生成的效果，`target` 只能读 |
| 换关键帧 | `effect.setKeyframes(keyframes)` | 正在播的动画不重置，按当前进度取新值；格式不对抛 `TypeError`，原关键帧保持不变 |
| 改时长 | `effect.updateTiming({ duration: 1200 })` | 会连带改变播放状态：缩短到当前时间之前停在结束状态，把已结束的动画拉长会重新跑起来 |

读进度用 `getComputedTiming()`，它比 `getTiming()` 多出 `endTime`、`activeDuration`、`progress`、`currentIteration`，并把 `'auto'` 解析成具体值。

```js
const animation = box.animate({ opacity: [1, 0.4] }, 300)
animation.effect instanceof KeyframeEffect // true
```

`animation.effect` 也可以整个换掉，`currentTime` 不会重置。赋值为 `null` 后动画不再产生视觉输出：

```js
animation.effect = new KeyframeEffect(box, otherKeyframes, { duration: 400 })
```

常见函数

| 函数名 | 描述 | 返回值 |
|-|-|-|
| `KeyframeEffect.getKeyframes` | 获取关键帧定义 | Keyframes 定义 |
| `KeyframeEffect.setKeyframes` | 重新设置关键帧 | - |
| `KeyframeEffect.getComputedTiming()` | 获取当前播放的时间信息 | `endTime`、`activeDuration`、`progress`、`currentIteration` |

### Timeline

时间轴是动画的时间来源。动画不自己计时，播放时从时间轴读当前时刻，再换算成本次播放的进度。挂在同一条时间轴上的动画共用一个时钟，天然同步。

`Animation` 的第二个参数和 `element.animate()` 的 `timeline` 选项都是挂时间轴的地方，不挂时间轴的动画不会走。

时间轴不止一种，进度可以由文档时间、滚动位置或元素的可见区间驱动：

````typescript
document.timeline                      // 文档默认时间轴
new DocumentTimeline()                 // 与 document.timeline 等价，零点在 timeOrigin
new DocumentTimeline({ originTime })   // 把零点挪到指定时刻
new ScrollTimeline({ source, axis })   // 滚动位置驱动
new ViewTimeline({ subject, axis })    // 元素可见区间驱动
````

`AnimationTimeline` 是这几个的父类，本身不能 new。

| 时间轴 | 由什么驱动 | 说明 |
|------|-----------|------|
| `document.timeline` | 文档时间 | 毫秒，从 `performance.timeOrigin` 起算；每个 document 一份，随文档存活，`document.open()` 之后也还是它 |
| `DocumentTimeline` | 文档时间 | 给 `originTime` 可以换零点，不给就等价于 `document.timeline` |
| `ScrollTimeline` | 滚动容器的滚动位置 | `source` 是滚动容器，`axis` 默认 `'block'`，可选 `'inline'`、`'x'`、`'y'` |
| `ViewTimeline` | 元素在滚动容器里的可见区间 | `subject` 是要观察的元素，`axis` 默认 `'block'` |

读时间和换零点：

```js
document.timeline.currentTime // 页面打开至今的毫秒数

// 以当前时刻为零点的自定义时间轴，currentTime 从 0 开始
const timeline = new DocumentTimeline({
  originTime: document.timeline.currentTime,
})
```

把动画挂到滚动时间轴上，进度跟着滚动走：

```js
const scrollTimeline = new ScrollTimeline({ source: scroller, axis: 'block' })
const effect = new KeyframeEffect(box, [{ opacity: 0 }, { opacity: 1 }], { fill: 'both' })
const animation = new Animation(effect, scrollTimeline)
```

这里的时间来自滚动位置，滚到底进度到 1，动画走完。

| 成员 | 说明 |
|------|------|
| `currentTime` | 时间轴上的当前时刻（毫秒），只读；时间轴不活跃时为 `null` |
| `duration` | `ScrollTimeline`、`ViewTimeline` 固定返回 `100%` 的 `CSSUnitValue`，文档时间轴返回 `null` |
| `Animation.timeline` | 动画挂在哪条时间轴上；读一直可以，写入只有部分浏览器支持 |

`document.timeline` 和 `DocumentTimeline` 从 Chrome 84、Firefox 75、Safari 13.1 起可用。
`document.timeline` 就是当前文档的时间轴对象，记录了页面从打开到当前为止的时间走向，

### Animation

动画对象是播放器，持有 `KeyframeEffect`，管时间和状态：播放、暂停、跳转、调速、结束通知。效果决定动什么，`Animation` 决定怎么播、播到哪。

`element.animate()` 一步就把效果、时间轴和播放都建好了。自己 new 主要用在要手动接管播放、拼一条独立的时间轴，或者把同一段效果换着元素反复用的时候。

构造函数：
````typescript
new Animation()
new Animation(effect)
new Animation(effect, timeline)
````

| 参数 | 说明 |
|------|------|
| `effect` | 要播放的效果，目前只有 `KeyframeEffect` 一种；默认 `null`，传 `null` 时动画不产生视觉输出 |
| `timeline` | 时间轴，默认 `document.timeline`；传 `null` 表示不挂在任何时间轴上，动画自己不会走 |

new 出来不会自己播：

```js
const animation = new Animation(effect) // 时间轴默认 document.timeline
animation.play()
```

常用函数

| 函数名 | 描述 | 返回值 |
|-|-|-|
| `Animation.play()` | 开始或继续播放；已经结束的动画会从头重播 | - |
| `Animation.pause()` | 暂停，`currentTime` 停住不动 | - |
| `Animation.reverse()` | 反转播放方向，从当前位置往回走；没播过的动画从结尾开始 | - |
| `Animation.finish()` | 跳到当前方向的结尾；播放速度为 `0`，或者正放且无限迭代时抛 `InvalidStateError` | - |
| `Animation.cancel()` | 清掉效果，`currentTime`、`startTime` 都变成 `null` | - |
| `Animation.updatePlaybackRate(rate)` | 先对齐当前位置再改速，避免画面跳一下；结果要等 `ready` | - |
| `Animation.commitStyles()` | 把当前样式写进内联样式 | - |
| `Animation.persist()` | 阻止动画被自动回收 | - |

播放状态

| 成员 | 说明 |
|------|------|
| `playState` | `'idle'`、`'running'`、`'paused'`、`'finished'`，只读 |
| `currentTime` | 当前时间（毫秒），可读写，赋值即跳转；没有时间轴或还没播过时为 `null` |
| `playbackRate` | 播放速度，负数倒放，`0` 等于停住 |
| `startTime` | 在时间轴上的起始时刻，暂停或未开始时为 `null` |
| `pending` | 是否在等挂起任务（如开始播放）完成 |
| `finished` | 播放结束的 Promise；每次重新播放都会换一个新的，别长期缓存 |
| `ready` | 挂起任务处理完时 resolve 的 Promise |
| `effect` | 当前效果，可读写；置为 `null` 后动画不再产生视觉输出 |

`Animation` 构造函数从 Chrome 75、Firefox 48、Safari 13.1 起可用，Edge 随 Chromium 到 79。`finished`、`ready`、`persist()`、`replaceState` 到 Chrome 84 才有，`updatePlaybackRate()` 从 Chrome 76 开始。

## 常见用法

`element.animate()` 用 JavaScript 创建动画，返回一个 `Animation` 对象。可以暂停、跳转、改速度，也能在结束时拿到通知。CSS 动画和 CSS 过渡同样归这套模型管理，所以页面上的动画都能用同一组接口操作。

````javascript
const dom = document.getElementById('box')
const animation = dom.animate(
  [ // 关键帧定义，类似于 @keyframes
    { backgroundColor: 'red' },
    { backgroundColor: 'green', offset: 0.3 },
    { backgroundColor: 'yellow' }
  ],
  {
    duration: 1000, // 动画时长 1000 ms
    easing: 'linear', // 运行曲线
    iterations: Infinity, // 播放次数
  }
)
animation.play() // animate() 已自动播放，再调一次不会重播
````

`new Animation(effect, timeline)` 只负责把效果挂到时间轴上，关键帧要先由 `KeyframeEffect` 建好；`timeline` 省略时用 `document.timeline`

````javascript
const effect = new KeyframeEffect(
  dom, // 动画作用的元素
  [
    { backgroundColor: 'red' },
    { backgroundColor: 'green', offset: 0.3 },
    { backgroundColor: 'yellow' }
  ],
  {
    duration: 1000, // 动画时长 1000 ms
    easing: 'linear', // 运行曲线
    iterations: Infinity, // 播放次数
  }
)

const animation = new Animation(effect) // 时间轴默认 document.timeline
animation.play() // 新动画不会自动播放
````

## 为什么用它

CSS 动画适合固定的、由样式驱动的效果。需要按数据生成关键帧、播放到一半改方向、或者等上一段结束再开始下一段时，CSS 写起来很绕，WAAPI 直接给一个可操作的对象。

| 对比项 | CSS 动画 | Web Animations API |
|--------|----------|--------------------|
| 定义方式 | `@keyframes` 加样式 | JS 传关键帧对象 |
| 动态生成 | 改类名或样式表 | 运行时拼关键帧 |
| 控制方式 | `animation-play-state` 等属性 | `play()`、`pause()`、跳转、调速 |
| 结束通知 | `animationend` 事件 | `finished` Promise |
| 没有 JS 时 | 照常播放 | 不可用 |

样式能解决的优先用 CSS，交互里需要精细控制的部分再交给 WAAPI。

---

## 核心接口

| 接口 | 作用 |
|------|------|
| `Element.animate(keyframes, options)` | 创建动画的快捷方式，返回 `Animation` |
| `KeyframeEffect` | 描述动画作用在哪个元素、哪些属性、哪几帧 |
| `Animation` | 播放控制、时间、状态和事件 |
| `document.timeline` | 文档默认时间轴 |
| `document.getAnimations()` | 取页面上所有动画，包括 CSS 动画和过渡 |

手动组装 effect 和 Animation：

```js
const effect = new KeyframeEffect(box, keyframes, timing)
const animation = new Animation(effect, document.timeline)
animation.play()
```

多数场景用 `element.animate()` 就够。

---

## 基本用法

```js
const animation = box.animate(
  [
    { transform: 'translateX(0)', opacity: 1 },
    { transform: 'translateX(240px)', opacity: 0.4 },
  ],
  {
    duration: 600,
    easing: 'ease-in-out',
    iterations: Infinity,
    direction: 'alternate',
    fill: 'both',
  },
)
```

关键帧数组里每个对象是一帧。CSS 属性写成驼峰（`backgroundColor`），带单位的值写成字符串。`offset`（0 到 1）指定这一帧的位置，`easing` 单独调整这一段的曲线。

也可以用一个对象描述多组值：

```js
box.animate({ opacity: [1, 0.4] }, 300)
```

只给一个值时，起点取元素当前的计算值：

```js
box.animate({ opacity: 0.4 }, 300)
```

常用选项：

| 选项 | 默认值 | 说明 |
|------|--------|------|
| `duration` | `0` | 单次播放时长，单位毫秒 |
| `delay` | `0` | 开始前的等待时间 |
| `endDelay` | `0` | 结束后到标记完成之间的间隔 |
| `iterations` | `1` | 播放次数，可以传 `Infinity` |
| `iterationStart` | `0` | 从第几轮开始 |
| `direction` | `'normal'` | `'reverse'`、`'alternate'`、`'alternate-reverse'` |
| `fill` | `'none'` | 动画时间之外的样式表现 |
| `easing` | `'linear'` | 支持 `cubic-bezier()`、`steps()` |
| `composite` | `'replace'` | `'add'`、`'accumulate'`，用于叠加多段动画 |

---

## 控制动画

| 成员 | 作用 |
|------|------|
| `play()` / `pause()` | 播放、暂停 |
| `reverse()` | 反向播放 |
| `finish()` | 直接跳到结尾 |
| `cancel()` | 取消，回到初始状态 |
| `currentTime` | 当前时间，赋值即跳转 |
| `playbackRate` | 播放速度，`2` 表示两倍速 |
| `playState` | `'idle'`、`'running'`、`'paused'`、`'finished'` |
| `finished` | 播放结束的 Promise |
| `onfinish` / `oncancel` | 完成、取消的回调 |

拖进度条时先暂停再改时间，否则动画会在新位置继续往前走：

```js
animation.pause()
animation.currentTime = 300
```

用 `finished` 串联两段动画。取消会让它变成拒绝状态，要接住：

```js
try {
  await slideIn.finished
  await fadeIn.finished
} catch (error) {
  // 被 cancel() 打断
}
```

---

## fill 与收尾

`fill` 决定动画时间范围外的样式：

| 值 | 延迟期间 | 结束后 |
|----|----------|--------|
| `'none'` | 不应用 | 回到原样 |
| `'backwards'` | 应用第一帧 | 回到原样 |
| `'forwards'` | 不应用 | 停在最后一帧 |
| `'both'` | 应用第一帧 | 停在最后一帧 |

`fill: 'forwards'` 会让最后一帧长期压着普通样式（`!important` 除外），之后写样式或做交互容易冲突。要把它落到元素上，用 `commitStyles()` 写进内联样式，再取消动画：

```js
animation.commitStyles()
animation.cancel()
```

`fill: 'none'` 的动画结束后会被浏览器自动移除，`getAnimations()` 里也不再出现。需要保留这个对象继续操作时，先调用 `persist()`。

---

## 和 CSS 动画互通

`document.getAnimations()` 会把页面上正在播放的动画都返回，包括 CSS 声明的 `@keyframes` 动画和 `transition` 过渡。它们同样是 `Animation` 对象：

```js
const [animation] = document.getAnimations()
animation.pause()
animation.currentTime = 500
```

取单个元素身上的动画：

```js
el.getAnimations()
```

CSS 动画由样式变化驱动，改了 `animation-name` 之类的属性后旧对象会被替换掉，代码里不要长期缓存它。

---

## 性能

WAAPI 不决定动画跑在哪个线程。`transform` 和 `opacity` 一般交给合成器，不触发布局和重绘；`width`、`left`、`background-color` 这类属性每帧都要回到主线程计算。动画尽量用 `transform` 和 `opacity` 表达。

---

## 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|----------|
| Chrome | 36 |
| Firefox | 48 |
| Safari | 13.1 |
| Edge | 79 |

`Element.animate()` 已进入 Baseline 可用范围。`commitStyles()`、`pseudoElement`、`ViewTimeline` 是后来补充的接口，用前先检测：

```js
if (typeof Animation.prototype.commitStyles === 'function') {
  animation.commitStyles()
}
```

---

## 注意事项

1. `duration` 用毫秒，CSS 里的 `0.6s` 在这里写 `600`
2. 不传 `duration` 时默认是 `0`，动画会立刻结束
3. `cancel()` 会让 `finished` 以 `AbortError` 拒绝，记得处理
4. 串联动画用 `finished`，不要用 `setTimeout` 估算时间
5. 无限迭代的动画调用 `finish()` 会抛错

---

## 相关资源

- [MDN: Web Animations API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API)
- [MDN: 使用 Web Animations API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API)
- [W3C: Web Animations Level 1](https://www.w3.org/TR/web-animations-1/)

---

## 在线示例

六个示例按顺序看：先拿到 Animation 对象，再处理结束状态；然后把效果对象拆出来、换关键帧，最后换时间轴和手动改时间。

<Demo src="/demos/webapi/animation/01-basic.html" title="01 基础用法 — animate() 与播放控制" height="300px" />

<Demo src="/demos/webapi/animation/02-fill-finished.html" title="02 fill 与 finished — 播完停在哪、怎么知道结束" height="290px" />

<Demo src="/demos/webapi/animation/03-keyframe-effect.html" title="03 KeyframeEffect — 效果与播放分离，可以换目标" height="320px" />

<Demo src="/demos/webapi/animation/04-set-keyframes.html" title="04 setKeyframes — 换一组动作，动画不重播" height="300px" />

<Demo src="/demos/webapi/animation/05-scroll-timeline.html" title="05 时间轴 — ScrollTimeline 让滚动驱动进度" height="280px" />

<Demo src="/demos/webapi/animation/06-current-time.html" title="06 currentTime — 手动拖到任意一帧" height="260px" />

