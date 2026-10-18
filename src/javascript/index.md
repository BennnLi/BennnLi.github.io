# JavaScript

> 内容待整理

按 **ECMAScript 版本**组织，从 ES6 开始，每个版本构成一个小节。小节内部可继续拆分具体特性。

## 版本对照

| 小节 | 规范版本 | 发布年份 |
|------|----------|----------|
| ES6 | ECMAScript 2015（第 6 版） | 2015 |
| ES7 | ECMAScript 2016（第 7 版） | 2016 |
| ES8 | ECMAScript 2017（第 8 版） | 2017 |
| ES9 | ECMAScript 2018（第 9 版） | 2018 |
| ES10 | ECMAScript 2019（第 10 版） | 2019 |
| ES11 | ECMAScript 2020（第 11 版） | 2020 |
| ES12 | ECMAScript 2021（第 12 版） | 2021 |
| ES13 | ECMAScript 2022（第 13 版） | 2022 |
| ES14 | ECMAScript 2023（第 14 版） | 2023 |
| ES15 | ECMAScript 2024（第 15 版） | 2024 |
| ES16 | ECMAScript 2025（第 16 版） | 2025 |
| ES17 | ECMAScript 2026（第 17 版） | 2026 |

> 命名规律：**ES(n) 对应年份 2009 + n**（ES6 → 2015，ES17 → 2026）。
> 后续新版本按同样方式追加小节即可。

## 目录约定

每个版本小节一个目录，示例放在其中的 `example/` 下：

```
JavaScript/
├── readme.md          ← 本页
├── es6/
│   ├── readme.md      ← ES6 小节
│   └── example/       ← 可运行示例
├── es7/
│   ├── readme.md
│   └── example/
└── ...
```

## 什么是 ECMAScript 和 JavaScript
简单的说 JavaScript 是语言，ECMAScript 是 JavaScript 的执行标准

### JavaScript
JavaScript 最早由 Netspace 在 1995 年设计，今天的 JavaScript 讲的是一套完整的运行环境，包括

1. 宿主环境 API：浏览器提供的 DOM，BOM，fetch，console 等；Nodejs 提东的 fs，http，process 等
2. 引擎：V8（Chrome/Nodejs），JavaScriptCore（Safari 的 JS 引擎）等

所以当我们说 JavaScript 编程时，实际上说的是写 JavaScript 语法 + 宿主环境提供的 API

### ECMAScript
ECMAScript 是 JavaScript 的语言规范文档，

1. 1995 年 Netspace 推出了 JavaScript，微软随后推出了 JScript，两者语法相似但完全不兼容。
2. 1996 年 Netspace 将 JavaScript 提交给了 Ecma international 来进行标准化，但 JavaScript 是 Sun（后来被 Oracle 收购）的商标，Ecma 不能直接用这个名字作为标准名称
3. 1997 年，Ecma 发布了 ECMAScript（ECMA-262），这个名称成为了这门语言的官方标准

所以 ECMAScript 是为了在标准化层面有一个**中立、可被各方接受**的名称。日常中讨论语言版本、标准时用 ECMAScript 更准确，比如 ES6/ES2015 指的是 ECMAScript 标准的第 6 版，而不是某个浏览器的 JavaScript


## ECMAScript 标准的维护者 Ecma International
1. Ecma International 及“欧洲计算机制造商协会”，是一个非盈利性组织，旨在为欧洲计算机系统制定标准，如今已经发展成了一个制定标准的机构
2. 而 ECMAScript 具体由 Ecma 下的 **TC39（Technical Committee 39） 技术委员会**负责维护和制定
3. TC39 由浏览器厂商（Google、Apple、Mozilla、Microsoft 等）、Nodejs 代表、学术机构等开发者组成，负责讨论、设计和批准新的语言特性
4. 新特性需经过 Stage 0 - Stage 4 五个阶段，达到 Stage 4 后才会被纳入下一版标准