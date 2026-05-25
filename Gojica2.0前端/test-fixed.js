/**
 * 修复后的发布动态测试
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const testResultsDir = './test-results/fixed-tests';
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true });
}

async function takeScreenshot(page, name) {
  const timestamp = Date.now();
  const filename = `${timestamp}-${name}.png`;
  const filepath = path.join(testResultsDir, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  console.log(`📸 截图: ${name}`);
  return filepath;
}

async function testPostPage() {
  console.log('🚀 开始测试发布动态页面');
  
  const browser = await chromium.launch({
    channel: "chrome",
    headless: false,
    slowMo: 100
  });
  
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('1️⃣ 加载发布页面...');
    await page.goto('http://localhost:5173/#/pages/square/post', {
      waitUntil: 'networkidle',
      timeout: 15000
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '01-post-page-loaded');
    
    console.log('2️⃣ 查找 textarea 元素...');
    
    // 方法1：直接查找 textarea 标签
    let textarea = await page.$('textarea.content-input');
    console.log(`   方法1 (textarea.content-input): ${textarea ? '找到' : '未找到'}`);
    
    if (!textarea) {
      // 方法2：查找所有 textarea
      const allTextareas = await page.$$('textarea');
      console.log(`   方法2 (所有textarea): 找到 ${allTextareas.length} 个`);
      if (allTextareas.length > 0) {
        textarea = allTextareas[0];
      }
    }
    
    if (!textarea) {
      // 方法3：使用 XPath
      textarea = await page.$('xpath=//textarea');
      console.log(`   方法3 (xpath): ${textarea ? '找到' : '未找到'}`);
    }
    
    if (textarea) {
      console.log('3️⃣ 尝试不同的输入方法...');
      
      // 方法1：使用 fill
      try {
        await textarea.click();
        await page.waitForTimeout(500);
        await page.keyboard.type('这是一条测试动态！🎵 #音乐 #乐队');
        await page.waitForTimeout(500);
        await takeScreenshot(page, '02-post-filled-keyboard');
        console.log('   ✅ 方法1成功：使用 keyboard.type()');
      } catch (e) {
        console.log(`   ❌ 方法1失败: ${e.message.substring(0, 50)}`);
      }
      
      // 清空并尝试方法2
      await textarea.click();
      await page.keyboard.down('Control');
      await page.keyboard.press('a');
      await page.keyboard.up('Control');
      await page.keyboard.press('Backspace');
      await page.waitForTimeout(300);
      
      // 方法2：直接使用 page.fill
      try {
        await page.fill('textarea.content-input', '测试内容2');
        await page.waitForTimeout(500);
        await takeScreenshot(page, '03-post-filled-fill');
        console.log('   ✅ 方法2成功：使用 page.fill()');
      } catch (e) {
        console.log(`   ❌ 方法2失败: ${e.message.substring(0, 50)}`);
      }
      
      // 清空并尝试方法3
      await textarea.click();
      await page.keyboard.down('Control');
      await page.keyboard.press('a');
      await page.keyboard.up('Control');
      await page.keyboard.press('Backspace');
      await page.waitForTimeout(300);
      
      // 方法3：使用 evaluate 直接设置值
      try {
        await page.evaluate(() => {
          const textarea = document.querySelector('textarea.content-input');
          if (textarea) {
            textarea.value = '测试内容3';
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
        await page.waitForTimeout(500);
        await takeScreenshot(page, '04-post-filled-evaluate');
        console.log('   ✅ 方法3成功：使用 page.evaluate()');
      } catch (e) {
        console.log(`   ❌ 方法3失败: ${e.message.substring(0, 50)}`);
      }
      
    } else {
      console.log('❌ 无法找到 textarea 元素');
      await takeScreenshot(page, '00-no-textarea');
    }
    
    console.log('4️⃣ 检查页面结构...');
    const html = await page.content();
    
    // 检查是否包含 textarea
    if (html.includes('<textarea')) {
      console.log('   ✅ HTML 中包含 textarea 标签');
    }
    
    // 检查类名
    if (html.includes('content-input')) {
      console.log('   ✅ HTML 中包含 content-input 类');
    }
    
    console.log('\n✅ 测试完成！');
    console.log(`📸 截图保存在: ${path.resolve(testResultsDir)}`);
    
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    await takeScreenshot(page, 'error');
  } finally {
    console.log('\n👋 按 Ctrl+C 结束...');
    await new Promise(() => {});
  }
}

testPostPage();
