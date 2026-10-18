# :nth-child(of S)

> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child

`:nth-child(of S)` 是 CSS 选择器 Level 4 的新语法，允许在 `:nth-child()` 中添加一个**过滤选择器**，只在匹配该选择器的元素中计数。

---

## 为什么需要 :nth-child(of S)？

传统的 `:nth-child()` 是按照**所有兄弟元素**的位置来计数的，无法根据元素的类型或类名来筛选：

```css
/* 传统写法：选中第 2 个 li，但不区分是否是 .active */
li:nth-child(2) { background: #f0f0f0; }

/* 如果要选中第 2 个 .active 的 li，以前做不到 */
```

`:nth-child(of S)` 解决了这个问题：

```css
/* 新写法：只在 .active 元素中计数，选中第 2 个 */
li:nth-child(2 of .active) { background: #f0f0f0; }
```

---

## 语法

```css
:nth-child(an+b of selector-list)
```

- `an+b`：计数公式（如 `2`、`2n`、`2n+1`、`odd`、`even`）
- `of selector-list`：过滤选择器，只在匹配的元素中计数

---

## 对比示例

### 传统 :nth-child()

```css
/* 选中第 2 个 li（不管是否是 .active） */
li:nth-child(2) { background: #f0f0f0; }
```

```html
<ul>
  <li>第 1 个 li</li>
  <li class="active">第 2 个 li（选中）</li>
  <li>第 3 个 li</li>
  <li class="active">第 4 个 li</li>
</ul>
```

### 新语法 :nth-child(of S)

```css
/* 选中第 2 个 .active 的 li */
li:nth-child(2 of .active) { background: #f0f0f0; }
```

```html
<ul>
  <li>第 1 个 li</li>
  <li class="active">第 2 个 li</li>
  <li>第 3 个 li</li>
  <li class="active">第 4 个 li（选中）</li>
</ul>
```

---

## 实际运用

### 1. 表格中隔行变色（只对数据行）

```css
/* 只在 .data-row 中隔行变色，跳过表头 */
tr:nth-child(even of .data-row) {
  background: #f8f9fa;
}
```

```html
<table>
  <tr class="header"><th>姓名</th><th>年龄</th></tr>
  <tr class="data-row"><td>张三</td><td>25</td></tr>
  <tr class="data-row"><td>李四</td><td>30</td></tr>
  <tr class="data-row"><td>王五</td><td>28</td></tr>
</table>
```

### 2. 列表中选中第 N 个特定项

```css
/* 选中第 3 个 .item 元素 */
.item:nth-child(3 of .item) {
  border-left: 3px solid #1a73e8;
}

/* 选中每 3 个 .item 中的第 1 个 */
.item:nth-child(3n+1 of .item) {
  font-weight: bold;
}
```

### 3. 混合元素列表中选中特定类型

```css
/* 在混合元素中选中第 2 个 .card */
.card:nth-child(2 of .card) {
  transform: scale(1.05);
}

/* 选中奇数个 .active 元素 */
.active:nth-child(odd of .active) {
  color: red;
}
```

### 4. 选中最后 N 个特定元素

```css
/* 选中最后 1 个 .visible 元素 */
.visible:nth-last-child(1 of .visible) {
  border-bottom: none;
}

/* 选中倒数第 2 个 .item */
.item:nth-last-child(2 of .item) {
  margin-bottom: 0;
}
```

---

## 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 111 |
| Firefox | 113 |
| Safari | 15.4 |
| Edge | 111 |

Baseline 2023，全浏览器可用。

---

## 注意事项

1. `of selector-list` 是**过滤器**，不影响元素在 DOM 中的位置
2. 计数仍然基于**所有兄弟元素**的位置，只是跳过不匹配的元素
3. `selector-list` 可以是任意有效的 CSS 选择器
4. 可以与 `:nth-last-child()` 一起使用
5. 不能与 `:nth-of-type()` 一起使用（`of` 语法是 `:nth-child` 独有的）

---

## 相关资源

- [MDN: :nth-child()](https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child)
- [CSS Selectors Level 4](https://www.w3.org/TR/selectors-4/#the-nth-child-pseudo)

---

## 在线示例

<Demo src="/demos/css/selectors/nth-child-of/01-basic.html" title="基础用法 — 在特定类中选中第 N 个元素" height="360px" />

<Demo src="/demos/css/selectors/nth-child-of/02-table-rows.html" title="表格隔行变色 — 只对数据行隔行变色，跳过表头" height="360px" />

<Demo src="/demos/css/selectors/nth-child-of/03-mixed-elements.html" title="混合元素 — 在混合元素中选中特定类型" height="360px" />

<Demo src="/demos/css/selectors/nth-child-of/04-even-odd.html" title="奇偶选择 — 在特定类中选中奇偶元素" height="360px" />

<Demo src="/demos/css/selectors/nth-child-of/05-last-child.html" title="最后 N 个 — 选中最后 N 个特定元素" height="360px" />
