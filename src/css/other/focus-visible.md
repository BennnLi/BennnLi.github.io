# :focus-visible

> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible

`:focus-visible` 是 CSS 选择器 Level 4 引入的伪类，只在用户通过键盘（Tab）导航时匹配，鼠标点击时不匹配。

---

## 为什么需要 :focus-visible？

传统的 `:focus` 伪类在鼠标点击时也会匹配，导致按钮显示蓝框：

```css
/* 传统写法：鼠标点击时也显示焦点环 */
button:focus {
  outline: 2px solid #1a73e8;
}
```

`:focus-visible` 解决了这个问题：

```css
/* 新写法：只在键盘导航时显示焦点环 */
button:focus-visible {
  outline: 2px solid #1a73e8;
}
```

---

## 语法

```css
:focus-visible { ... }
```

- `:focus-visible` — 只在用户通过键盘导航时匹配
- 鼠标点击时不匹配

---

## 与 :focus 的区别

| 伪类 | 匹配时机 | 用途 |
|------|----------|------|
| `:focus` | 任何时候获得焦点 | 需要始终显示焦点样式的场景 |
| `:focus-visible` | 只在键盘导航时 | 避免鼠标点击时显示焦点环 |

---

## 实际运用

### 1. 按钮焦点样式

```css
button:focus-visible {
  outline: 2px solid #1a73e8;
  outline-offset: 2px;
}

button:focus:not(:focus-visible) {
  outline: none;
}
```

### 2. 链接焦点样式

```css
a:focus-visible {
  outline: 2px solid #1a73e8;
  outline-offset: 2px;
  border-radius: 2px;
}
```

### 3. 表单输入框

```css
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid #1a73e8;
  outline-offset: -1px;
  border-color: #1a73e8;
}
```

### 4. 全局基础样式

```css
/* 全局：键盘导航时显示焦点环 */
:focus-visible {
  outline: 2px solid #1a73e8;
  outline-offset: 2px;
}

/* 全局：鼠标点击时隐藏焦点环 */
:focus:not(:focus-visible) {
  outline: none;
}
```

---

## 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 86 |
| Firefox | 85 |
| Safari | 15.4 |
| Edge | 86 |

Baseline 2022，全浏览器可用。

---

## 注意事项

1. `:focus-visible` 只在键盘导航时匹配
2. 鼠标点击时不匹配，避免显示焦点环
3. 可以与 `:focus` 组合使用
4. 对无障碍性很重要，键盘用户需要看到焦点位置
5. 可以全局设置，也可以针对特定元素设置

---

## 相关资源

- [MDN: :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)
- [CSS Selectors Level 4](https://www.w3.org/TR/selectors-4/#the-focus-visible-pseudo)

---

## 在线示例

<Demo src="/demos/css/other/focus-visible/01-basic.html" title="基础用法 — :focus-visible 基础" height="360px" />
