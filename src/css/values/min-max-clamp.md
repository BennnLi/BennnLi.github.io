# min() / max() / clamp()

> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/min()
> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/max()
> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/clamp()

`min()`、`max()` 和 `clamp()` 是 CSS 值与单位模块 Level 4 引入的数学函数，用于在不同条件下取最合适的值。

---

## 为什么需要 min() / max() / clamp()？

以前实现响应式值需要媒体查询：

```css
/* 以前的写法：需要媒体查询 */
.container {
  width: 90%;
}

@media (min-width: 1200px) {
  .container {
    width: 1200px;
  }
}
```

`min()`、`max()` 和 `clamp()` 让这变得一行代码：

```css
/* 现在的写法：一行代码 */
.container {
  width: min(90%, 1200px);
}
```

---

## 语法

### min()

```css
min(value1, value2, ...)
```

取**最小**值。

### max()

```css
max(value1, value2, ...)
```

取**最大**值。

### clamp()

```css
clamp(min, preferred, max)
```

取**中间**值，限定范围。等价于 `max(min, min(preferred, max))`。

---

## 实际运用

### 1. 流体字号

```css
h1 {
  font-size: clamp(1.5rem, 4vw + 0.5rem, 3rem);
}

p {
  font-size: clamp(0.875rem, 1.2vw, 1.125rem);
}
```

### 2. 响应式容器宽度

```css
.container {
  width: clamp(320px, 90vw, 1200px);
  margin: 0 auto;
}
```

### 3. 响应式间距

```css
.section {
  padding: clamp(1rem, 5vw, 4rem) clamp(1rem, 5vw, 2rem);
}
```

### 4. 响应式 Grid 间距

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: clamp(1rem, 2vw, 2rem);
}
```

---

## 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 79 |
| Firefox | 75 |
| Safari | 13.1 |
| Edge | 79 |

Baseline 2020，全浏览器可用。

---

## 注意事项

1. `min()` 取最小值，`max()` 取最大值
2. `clamp()` 取中间值，限定范围
3. 可以混合使用不同单位（px、rem、vw 等）
4. 可以嵌套使用
5. 性能良好，浏览器会缓存计算结果

---

## 相关资源

- [MDN: min()](https://developer.mozilla.org/en-US/docs/Web/CSS/min)
- [MDN: max()](https://developer.mozilla.org/en-US/docs/Web/CSS/max)
- [MDN: clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)
- [CSS Values and Units Module Level 4](https://www.w3.org/TR/css-values-4/)

---

## 在线示例

<Demo src="/demos/css/values/min-max-clamp/01-basic.html" title="基础用法 — min()、max()、clamp() 对比" height="360px" />
