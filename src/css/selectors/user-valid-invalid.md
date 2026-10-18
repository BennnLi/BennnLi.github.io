# :user-valid / :user-invalid

> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/:user-valid
> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/:user-invalid

`:user-valid` 和 `:user-invalid` 是 CSS 选择器 Level 4 的新伪类，只在用户**交互后**才匹配验证状态，避免页面加载时就显示验证样式。

---

## 为什么需要 :user-valid / :user-invalid？

传统的 `:valid` 和 `:invalid` 伪类在页面加载时就会匹配，导致表单一打开就显示红色边框：

```css
/* 传统写法：页面加载时就显示验证状态 */
input:valid { border-color: green; }
input:invalid { border-color: red; }  /* 一打开页面就是红色 */
```

`:user-valid` 和 `:user-invalid` 解决了这个问题：

```css
/* 新写法：只在用户交互后才显示验证状态 */
input:user-valid { border-color: green; }
input:user-invalid { border-color: red; }  /* 用户输入后才变红 */
```

---

## 语法

```css
:user-valid { ... }
:user-invalid { ... }
```

- `:user-valid` — 用户交互后，输入**有效**时匹配
- `:user-invalid` — 用户交互后，输入**无效**时匹配

---

## 与 :valid / :invalid 的区别

| 伪类 | 匹配时机 | 用途 |
|------|----------|------|
| `:valid` / `:invalid` | 页面加载时立即匹配 | 需要立即显示验证状态的场景 |
| `:user-valid` / `:user-invalid` | 用户交互后才匹配 | 避免初始状态显示验证样式 |

---

## 实际运用

### 1. 表单验证样式

```css
/* 只在用户输入后才显示验证状态 */
input:user-valid {
  border-color: #28a745;
  background-color: #f8fff8;
}

input:user-invalid {
  border-color: #dc3545;
  background-color: #fff8f8;
}

/* 避免初始状态显示红色 */
input:invalid {
  /* 不设置边框颜色，保持默认 */
}
```

### 2. 邮箱验证

```css
input[type="email"]:user-valid {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

input[type="email"]:user-invalid {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}
```

### 3. 密码强度提示

```css
input[type="password"]:user-valid {
  border-color: #28a745;
}

input[type="password"]:user-invalid {
  border-color: #dc3545;
}

/* 密码强度提示文字 */
input[type="password"]:user-invalid + .hint {
  color: #dc3545;
  display: block;
}

input[type="password"]:user-valid + .hint {
  color: #28a745;
  display: block;
}
```

### 4. 表单提交按钮状态

```css
/* 表单有效时，提交按钮可用 */
form:user-valid button[type="submit"] {
  background: #28a745;
  cursor: pointer;
}

/* 表单无效时，提交按钮禁用 */
form:user-invalid button[type="submit"] {
  background: #ccc;
  cursor: not-allowed;
}
```

---

## 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 119 |
| Firefox | 88 |
| Safari | 16.4 |
| Edge | 119 |

Baseline 2023，全浏览器可用。

---

## 注意事项

1. `:user-valid` 和 `:user-invalid` 只在用户**交互后**才匹配
2. 交互方式包括：输入、选择、提交表单等
3. 页面加载时不会触发，避免初始状态显示验证样式
4. 可以与 `:valid`、`:invalid` 组合使用
5. 在 `<form>` 元素上也可以使用，表示表单整体验证状态

---

## 相关资源

- [MDN: :user-valid](https://developer.mozilla.org/en-US/docs/Web/CSS/:user-valid)
- [MDN: :user-invalid](https://developer.mozilla.org/en-US/docs/Web/CSS/:user-invalid)
- [CSS Selectors Level 4](https://www.w3.org/TR/selectors-4/#user-valid-pseudo)

---

## 在线示例

<Demo src="/demos/css/selectors/user-valid-invalid/01-basic.html" title="基础用法 — 用户输入后显示验证状态" height="360px" />

<Demo src="/demos/css/selectors/user-valid-invalid/02-email.html" title="邮箱验证 — 邮箱格式验证样式" height="360px" />

<Demo src="/demos/css/selectors/user-valid-invalid/03-password.html" title="密码验证 — 密码强度提示" height="360px" />

<Demo src="/demos/css/selectors/user-valid-invalid/04-form-state.html" title="表单状态 — 表单整体验证状态" height="360px" />

<Demo src="/demos/css/selectors/user-valid-invalid/05-vs-valid.html" title="对比 :valid — :user-valid 与 :valid 的区别" height="360px" />
