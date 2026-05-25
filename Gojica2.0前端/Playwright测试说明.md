# 🎯 Playwright 浏览器自动化测试

## ✅ 已创建的文件

### 1. baidu-test.js
最简单的测试脚本，测试浏览器连接
```bash
node baidu-test.js
```

### 2. minimal-test.js  
带日志的测试脚本
```bash
node minimal-test.js
```

### 3. simple-test.js
用户提供的原始脚本
```bash
node simple-test.js
```

### 4. gojica-test.js
完整的 Gojica 应用测试脚本
```bash
node gojica-test.js
```

## 🚀 如何使用

### 方法 1：在终端直接运行
打开终端，进入项目目录：
```bash
cd "c:\Users\Administrator\Desktop\千早爱音给我助教\Gojica2.0\Gojica2.0前端"
node baidu-test.js
```

### 方法 2：使用 HBuilderX 终端
在 HBuilderX 中：
1. 视图 → 终端
2. 输入命令：
```bash
node baidu-test.js
```

### 方法 3：在浏览器开发者工具中直接粘贴代码
打开 Chrome DevTools → Console，粘贴：
```javascript
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({
    channel: "chrome",
    headless: false
  });
  const page = await browser.newPage();
  await page.goto("http://localhost:5173");
})();
```

## 📝 注意事项

1. **确保 HBuilderX 中的项目正在运行**
   - 应该在 `http://localhost:5173` 运行

2. **Playwright 需要正确安装**
   - 如果报错，需要运行：`npx playwright install chromium`

3. **浏览器会显示出来**
   - `headless: false` 表示可见浏览器窗口

4. **截图保存在**
   - `test-results/` 目录

## 🔧 常见问题

**Q: 报错 "Cannot find module 'playwright'"**
A: 运行 `npm install playwright`

**Q: 报错 "Executable doesn't exist"**
A: 运行 `npx playwright install chromium`

**Q: 浏览器没有打开**
A: 检查 Playwright 是否正确安装
