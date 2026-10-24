# Web File API

Web File API 让 Web 应用能安全地读取用户提供的文件，以及其中的内容。

当需要用户提供文件时，Web 应用使用 `<input type="file" />` 让用户选一个文件。选完之后，选中的文件集是 `FileList` 对象；从里面取出单个 `File` 对象，它代表一个文件，提供元数据和内容的访问。

## 常见对象

### FileList

通过 `<input type="file" />` 选文件后，`element.files` 得到的就是 `FileList`。它类似数组但不是数组：

````html
<html lang="zh-CN">
<body>
    <input id="file" type="file" />
    <script>
        const input = document.querySelector('#file')
        input.addEventListener('change', (e) => {
            const files = e.target.files // FileList 对象
            console.log(files instanceof FileList, files instanceof Array) // true, false
        })
    </script>
</body>
</html>
````

`FileList` 可以遍历，用 `[...]` 转成数组，也可以直接通过索引取 `File`：

````js
const fileList = input.files
const fileArray = [...fileList]
const file = fileList[0]
````

选多个文件时给 `<input>` 加 `multiple`；给 `<input>` 加 `webkitdirectory` 可选整个目录，此时每个 `File` 的 `webkitRelativePath` 会有值，记录文件在所选目录中的相对路径。

 常用属性和方法：

| 属性 / 方法 | 说明 |
|------|------|
| `length` | 文件数量 |
| `item(index)` | 按索引取 `File`，等价于 `files[index]` |

---

### Blob

`Blob` 是二进制数据块，`File` 继承自它。文件内容最终都落在 `Blob` 上，日常主要做两件事：读出内容，或者用 `URL.createObjectURL()` 变成临时链接给 `<img>`、`<video>` 用。

| 属性 | 说明 |
|------|------|
| `size` | 字节数 |
| `type` | MIME 类型，如 `'text/plain'`、`'image/png'` |

| 方法 | 说明 |
|------|------|
| `blob.text()` | 读成字符串，返回 Promise |
| `blob.arrayBuffer()` | 读成 ArrayBuffer，返回 Promise |
| `blob.stream()` | 返回 ReadableStream，适合流式处理大文件 |
| `blob.bytes()` | 读成 Uint8Array，返回 Promise；较新的接口 |
| `blob.slice(start, end)` | 截取一段，返回新 Blob，常用于大文件分片上传 |

````js
const text = await file.text()
const buffer = await file.arrayBuffer()
const partial = file.slice(0, 1024) // 前 1KB
````

---

### File

`File` 继承自 `Blob`，在二进制数据基础上增加了文件名等元信息。

| 属性 | 说明 |
|------|------|
| `name` | 文件名，含扩展名 |
| `lastModified` | 最后修改时间，毫秒时间戳 |
| `webkitRelativePath` | 用 `webkitdirectory` 选目录时的相对路径；其余情况为空字符串 |

`File` 也可以用构造函数主动创建，不需要让用户选择：

````js
const file = new File(['hello'], 'hello.txt', { type: 'text/plain' })
````

第一个参数是内容数组（字符串、Blob、ArrayBuffer 都可以），第二个是文件名，第三个是可选的 `{ type, lastModified }`。

---

### FileReader

`FileReader` 是较早的读取接口，用事件回调的方式把文件读成字符串、ArrayBuffer 或 Data URL。现在多数场景直接用 `await file.text()` 或 `await file.arrayBuffer()` 就够了，不需要 `FileReader`；它主要用在需要兼容旧浏览器的时候。

| 方法 | 读成什么 |
|------|----------|
| `readAsText(file)` | 字符串 |
| `readAsArrayBuffer(file)` | ArrayBuffer |
| `readAsDataURL(file)` | `data:image/png;base64,...` 形式的字符串 |

````js
const reader = new FileReader()
// 用 reader 读取一个 File 对象
reader.readAsText(file)
reader.onload = () => {
    console.log(reader.result)
}
````

事件：`load`（读完）、`progress`（进行中）、`error`（出错）、`abort`（手动中断）。

---

### DataTransfer

`DataTransfer` 是拖拽和剪贴板事件的数据载体。拖文件时从 `event.dataTransfer.files` 拿到 `FileList`；粘贴图片时从 `clipboardData.files` 拿。

| 属性 | 说明 |
|------|------|
| `files` | FileList，本次拖拽或粘贴携带的所有文件 |
| `items` | DataTransferItemList，逐项访问，可以区分文件和文本 |
| `types` | 字符串数组，本次携带的数据类型，如 `['Files']`、`['text/plain']` |

| 属性 | 说明 |
|------|------|
| `effectAllowed` | 源头允许的操作：`none` / `copy` / `move` / `link` / `copyMove` / `linkMove` / `all` |
| `dropEffect` | 放下时实际执行的操作：`none` / `copy` / `move` / `link` |

#### 拖拽取文件

拖拽涉及四个事件：`dragenter`（进入）、`dragover`（悬停，持续触发）、`dragleave`（离开）、`drop`（放下）。

要让浏览器允许放下，必须在 `dragover` 里调用 `e.preventDefault()`，否则浏览器默认行为是打开文件而不是触发 `drop`：

````js
const dropZone = document.querySelector('#drop-zone')

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault() // 不调用这行就无法触发 drop
    e.dataTransfer.dropEffect = 'copy'
})

dropZone.addEventListener('drop', (e) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    console.log(files) // FileList
})
````

只允许拖入图片时，检查是否为 `PNG` 图片

````js
dropZone.addEventListener('drop', (e) => {
    e.preventDefault()

    const file = e.dataTransfer.files[0]
    if (!file) return

    if (file.type === 'image/png') {
      console.log(file) // 拿到 PNG 文件，后续随便用
    } else {
      console.log('文件不是png格式!')
    }
})
````

#### DataTransferItem

`items` 里的每一项是 `DataTransferItem`，比 `files` 多一层信息——它知道这一项是文件还是文本：

| 属性 | 说明 |
|------|------|
| `kind` | `'file'` 或 `'string'` |
| `type` | MIME 类型，如 `'image/png'`、`'text/plain'` |

| 方法 | 说明 |
|------|------|
| `getAsFile()` | 取出文件，返回 `File` |
| `getAsString(callback)` | 读成字符串，异步回调 |

````js
dropZone.addEventListener('drop', (e) => {
    e.preventDefault()
    for (const item of e.dataTransfer.items) {
        if (item.kind === 'file') {
            console.log(item.getAsFile()) // File
        } else if (item.kind === 'string') {
            item.getAsString((text) => console.log(text))
        }
    }
})
````

#### 粘贴取文件

粘贴事件里同样有 `dataTransfer` 属性（`clipboardData` 就是它），从 `clipboardData.files` 拿文件：

````js
document.addEventListener('paste', (e) => {
    const files = e.clipboardData.files
    if (files.length > 0) {
        console.log(files[0]) // 截图粘贴进来时是一个 File
    }
})
````

截图后直接 Ctrl+V，`clipboardData.files` 里会有一个 `image/png` 类型的 `File`，可以用来做截图上传。


## 常见用法

### `<input type="file" />`

#### 基础用法

`change` 事件在选择文件后触发；`input` 事件在部分浏览器里选择过程中也会触发，一般用 `change` 就够：

````html
<input type="file" id="file" />
<script>
    document.querySelector('#file').addEventListener('change', (e) => {
        const file = e.target.files[0]
        if (file) {
            console.log(file.name, file.size, file.type)
        }
    })
</script>
````

选中后 `input.files` 就是 `FileList`；清空时长度为 0，取 `files[0]` 会得到 `undefined`，只能消费一次。

#### accept

`accept` 限制选择器里能看到的文件类型，接受扩展名和 MIME 类型两种写法：

````html
<!-- 只能选图片 -->
<input type="file" accept="image/*" />

<!-- 只能选 .txt 和 .csv -->
<input type="file" accept=".txt,.csv" />

<!-- PNG 和 PDF -->
<input type="file" accept="image/png,.pdf" />
````

`accept` 只是给选择器加了默认过滤，用户切换到"所有文件"仍然能选到别的类型，不能替代后续的校验。

#### multiple

加 `multiple` 可以一次选多个文件；不加则只能选一个，`files.length` 最大是 1：

````html
<input type="file" multiple id="file" />
<script>
    document.querySelector('#file').addEventListener('change', (e) => {
        for (const file of e.target.files) {
            console.log(file.name)
        }
    })
</script>
````

#### webkitdirectory

加 `webkitdirectory` 可以选择整个目录，选完后 `files` 里是该目录下所有文件的 `File` 列表，每个 `File` 的 `webkitRelativePath` 记录了相对路径：

````html
<input type="file" webkitdirectory />
<script>
    document.querySelector('input').addEventListener('change', (e) => {
        for (const file of e.target.files) {
            console.log(file.webkitRelativePath, file.size)
        }
    })
</script>
````

#### capture

移动端加 `capture` 可以直接调起摄像头或麦克风，跳过文件选择界面：

````html
<!-- 前置摄像头 -->
<input type="file" capture="user" accept="image/*" />

<!-- 后置摄像头 -->
<input type="file" capture="environment" accept="image/*" />

<!-- 麦克风 -->
<input type="file" capture="microphone" accept="audio/*" />
````

桌面端通常会忽略 `capture`，仍然显示文件选择器。

#### showPicker()

`input.showPicker()` 可以在不依赖用户点击的情况下打开文件选择器，但必须在用户手势（点击、触摸）里调用：

````js
button.addEventListener('click', () => {
    input.showPicker() // 用户手势内调用才有效
})
````

这个方法用来实现自定义样式的选择按钮——`<input>` 本身用 `display: none` 隐藏，点按钮时调 `showPicker()`：

````html
<button id="pick">选择文件</button>
<input type="file" id="file" style="display:none" />
<script>
    const button = document.querySelector('#pick')
    const input = document.querySelector('#file')
    button.addEventListener('click', () => {
        input.showPicker()
    })
    input.addEventListener('change', () => {
        console.log(input.files[0]?.name)
    })
</script>
````

---

### 读取与预览

拿到 `File` 之后，根据后续用途选合适的读取方式。

#### 读文本

`await file.text()` 一行搞定，适合 `.txt`、`.json`、`.csv` 这类文件：

````js
const text = await file.text()
console.log(text)
````

#### 读二进制

`await file.arrayBuffer()` 把文件读成 ArrayBuffer，适合做数据解析或上传前处理：

````js
const buffer = await file.arrayBuffer()
const view = new Uint8Array(buffer)
console.log(view[0]) // 第一个字节
````

#### 图片预览

`URL.createObjectURL(file)` 把文件变成一个临时链接，直接给 `<img>` 就能显示：

````js
const url = URL.createObjectURL(file)
const img = document.querySelector('#preview')
img.src = url
img.onload = () => URL.revokeObjectURL(url) // 用完释放
````

`revokeObjectURL` 一定要调，否则这条链接会一直占内存直到页面关闭。如果 `img` 的显示时间不确定（比如用户随时可能删掉预览），也可以在替换或删除时统一 `revoke`。

#### Data URL

`FileReader.readAsDataURL()` 把文件读成 `data:image/png;base64,...` 形式的字符串，可以直接塞进 CSS 的 `background-image` 或 `<img src>`，不需要额外管理 `revokeObjectURL`：

````js
const reader = new FileReader()
reader.onload = () => {
    img.src = reader.result // data:image/png;base64,...
}
reader.readAsDataURL(file)
````

代价是字符串比二进制占内存多约 33%，大图不适合。

#### 流式处理

大文件不要一次性读进内存，用 `blob.stream()` 拿到 ReadableStream 逐块处理：

````js
const stream = file.stream()
const reader = stream.getReader()
while (true) {
    const { done, value } = await reader.read()
    if (done) break
    console.log(value) // 每块 Uint8Array
}
````



## File System Access API
Access API 允许 Web 应用在获取用户明确的**授权**后，安全的获取、写入和管理用户本地设备上的文件和目录，补强了传统 Web 文件处理只能依赖用户主动上传获取文件快照的，无法直接修改原始文件的问题。

> 仅在安全上下文中可用，也就是 https 或者 localhost 环境下
> 需要明确获取用户的授权

检测是否支持 `File System Access API`
````js
if ('showOpenFilePicker' in self) {
    // 支持
}
````

## FileSystemFileHandle

`FileSystemFileHandle` 代表一个文件的引用，可以长期保存，下次访问时不需要重新弹选择器。

获取方式有两种：`showOpenFilePicker()` 返回的数组里取第一个，或者从目录句柄调 `getFileHandle()`：

````js
// 方式一：弹选择器选文件
const [handle] = await window.showOpenFilePicker() // showOpenFilePicker 在用户选择后返回是一个数组, 这里解构获取了第一个元素
console.log(handle.kind) // 'file'

// 方式二：从已有的目录句柄里拿
const dirHandle = await window.showDirectoryPicker()
const fileHandle = await dirHandle.getFileHandle('notes.txt')
````

#### 属性

| 属性 | 说明 |
|------|------|
| `kind` | 固定为 `'file'`；目录句柄是 `'directory'` |
| `name` | 文件名 |

#### 读取

`handle.getFile()` 返回 `File` 对象，之后的读取方式和普通 `File` 一样：

````js
const file = await handle.getFile()
const text = await file.text()
````

#### 写入

`handle.createWritable()` 返回一个可写流，调 `write()` 写入、调 `close()` 关闭。不 `close()` 的话写入不会落盘：

````js
const writable = await handle.createWritable()
await writable.write('hello world')
await writable.close()
````

`write()` 接受字符串、Blob、ArrayBuffer，也可以传 `{ type: 'write', position, data }` 指定写入位置实现定点修改。

#### 其他方法

| 方法 | 说明 |
|------|------|
| `remove()` | 删除这个文件；需要目录句柄的写权限 |
| `queryPermission({ mode })` | 查询当前权限状态，返回 `'granted'` / `'denied'` / `'prompt'` |
| `requestPermission({ mode })` | 重新请求权限，需要用户手势，返回 `'granted'` 或 `'denied'` |

`mode` 取 `'read'` 或 `'readwrite'`。第一次通过 `showOpenFilePicker()` 拿到的句柄默认只有 `read` 权限，要写入需要传 `{ mode: 'readwrite' }`：

````js
const [handle] = await window.showOpenFilePicker({ mode: 'readwrite' })
````

#### 打开一个文件

````js
// 1. 选文件，同时要读写权限
const [handle] = await window.showOpenFilePicker({ mode: 'readwrite' })

// 2. 读出内容
const file = await handle.getFile()
const text = await file.text()

// 3. 修改后写回
const writable = await handle.createWritable()
await writable.write(text.replace('hello', 'goodbye'))
await writable.close()

// 4. 再读确认修改生效
console.log(await (await handle.getFile()).text())
````

如果句柄是之前保存的（存到 IndexedDB 之类的），下次打开时权限可能已过期，需要先检查再请求：

````js
const permission = await handle.queryPermission({ mode: 'readwrite' })
if (permission !== 'granted') {
    const result = await handle.requestPermission({ mode: 'readwrite' })
    if (result !== 'granted') {
        console.log('用户拒绝了写入权限')
    }
}
````

保存的操作是将修改完的句柄落盘的原有的文件上, 如果需要**另存为**则需要创建一个新的文件句柄
此时可以用 `window.showSaveFilePicker()`。它弹出"保存文件"对话框，用户选好路径后返回一个 `FileSystemFileHandle`，之后用 `createWritable()` 写入即可：

````js
const handle = await window.showSaveFilePicker()
const writable = await handle.createWritable()
await writable.write('这是新文件的内容')
await writable.close()
````

和 `showOpenFilePicker` 不同，`showSaveFilePicker` 返回的是单个句柄，不是数组，不需要解构。

常用配置项：

| 配置项 | 说明 |
|------|------|
| `suggestedName` | 对话框里的默认文件名，如 `'notes.txt'` |
| `types` | 允许的文件类型，格式和 `accept` 类似但更详细，可以带描述 |
| `excludeAcceptAllOption` | 为 `true` 时去掉选择器里的"所有文件"选项 |

````js
const handle = await window.showSaveFilePicker({
    suggestedName: 'report.txt',
    types: [
        { description: '文本文件', accept: { 'text/plain': ['.txt'] } },
        { description: 'JSON', accept: { 'application/json': ['.json'] } },
    ],
    excludeAcceptAllOption: true, // 不允许"所有文件"
})
````

浏览器不支持时降级用 `<a download>` 触发下载，不需要用户选路径，文件直接进浏览器的下载目录：

````js
function download(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}
download('这是新文件的内容', 'notes.txt')
````

默认的打开目录 `startIn` 配置项
````js
const [handle] = await window.showOpenFilePicker({
    startIn: 'pictures' // 文件选择框默认从用户的图片路径打开
})
````

常见的可选值
| 值 | 对应目录 |
|-|-|
| desktop | 用户的桌面目录（如果存在 |
| documents | 用户创建的文档通常会存储在该目录中 |
| downloads | 通常用于存储下载文件的目录 |
| music | 通常存储音频文件的目录 |
| pictures | 通常用于存储照片和其他静态图片的目录 |
| videos | 通常用于存储视频或电影的目录 |

句柄可持久化到 IndexDB 中, 但由于 IndexDB 保存的是句柄的信息(文件指向, 是文件还是目录等...), 它无法保存权限, 所以从 IndexDB 恢复句柄可能权限已经失效, 需要检测加重新申请
````js
// 检测句柄是否还有读写权限
async function verifyPermission(fileHandle, readWrite) {
  const options = {};
  if (readWrite) {
    options.mode = 'readwrite';
  }
  // Check if permission was already granted. If so, return true.
  if ((await fileHandle.queryPermission(options)) === 'granted') {
    return true;
  }
  // Request permission. If the user grants permission, return true.
  if ((await fileHandle.requestPermission(options)) === 'granted') {
    return true;
  }
  // The user didn't grant permission, so return false.
  return false;
}
````

#### 打开一个目录
使用 `window.showDirectoryPicker` 来让用户选择一个目录并获得操作句柄. 跟 `window.showOpenFilePicker` 不同的是它返回的是一个目录句柄 `FileSystemDirectoryHandle`.
和 `window.showOpenFilePicker` 类似, 默认情况下只有可读权限, 如需读写需要传入 `{ mode: 'readwrite' }`

````js
const dirHandle = await window.showDirectoryPicker({
    mode: 'readwrite'
});
````

#### 属性

| 属性 | 说明 |
|------|------|
| `kind` | 固定为 `'directory'`；文件句柄是 `'file'` |
| `name` | 目录名 |

#### 遍历目录

`dirHandle.entries()` 返回一个异步迭代器，每次产出 `[name, handle]`，`handle` 可能是 `FileSystemFileHandle` 也可能是 `FileSystemDirectoryHandle`：

````js
for await (const [name, handle] of dirHandle.entries()) {
    console.log(handle.kind, name)
}
````

`keys()` 只返回名字，`values()` 只返回句柄：

````js
for await (const name of dirHandle.keys()) {
    console.log(name)
}
````

#### 获取目录中的文件

`dirHandle.getFileHandle(name)` 按文件名取句柄：

````js
const fileHandle = await dirHandle.getFileHandle('notes.txt')
const file = await fileHandle.getFile()
console.log(await file.text())
````

默认只读取已有文件。加 `{ create: true }`，文件不存在时自动创建：

````js
const fileHandle = await dirHandle.getFileHandle('new.txt', { create: true })
const writable = await fileHandle.createWritable()
await writable.write('第一次写入')
await writable.close()
````

#### 创建子目录

`dirHandle.getDirectoryHandle(name)` 取子目录句柄，同样支持 `{ create: true }`：

````js
const subDir = await dirHandle.getDirectoryHandle('docs', { create: true })
const fileHandle = await subDir.getFileHandle('readme.md', { create: true })
const writable = await fileHandle.createWritable()
await writable.write('# README')
await writable.close()
````

#### 删除

`dirHandle.removeEntry(name)` 删除文件或空目录：

````js
await dirHandle.removeEntry('notes.txt') // 删文件
await dirHandle.removeEntry('docs') // 删空目录，非空会抛错
````

#### 路径

`dirHandle.resolve(handle)` 返回某个句柄相对于当前目录的路径，找不到时返回 `null`：

````js
const path = await dirHandle.resolve(fileHandle)
console.log(path) // ['docs', 'readme.md']
````

#### 完整示例：递归列出目录树

````js
async function listDir(dirHandle, path = '') {
    for await (const [name, handle] of dirHandle.entries()) {
        const fullPath = path ? `${path}/${name}` : name
        if (handle.kind === 'file') {
            const file = await handle.getFile()
            console.log(fullPath, file.size)
        } else if (handle.kind === 'directory') {
            await listDir(handle, fullPath)
        }
    }
}

await listDir(dirHandle)
````