/**
 * 示例测试用例
 * 放在 tests/ 目录下，配合 playwright.config.js 使用
 */

const { test, expect } = require('@playwright/test');

test.describe('Gojica 应用测试', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('首页加载成功', async ({ page }) => {
    // 等待页面加载
    await page.waitForLoadState('networkidle');
    
    // 检查页面标题或主要元素
    const title = await page.title();
    console.log('页面标题:', title);
    
    // 截图
    await page.screenshot({ path: 'test-results/homepage.png' });
  });

  test('登录页面功能', async ({ page }) => {
    // 导航到登录页面
    await page.goto('/pages/login/index');
    await page.waitForLoadState('networkidle');
    
    // 填写手机号
    await page.fill('input[placeholder*="手机号"]', '13800138000');
    
    // 截图
    await page.screenshot({ path: 'test-results/login-filled.png' });
    
    // 点击获取验证码
    await page.click('text=获取验证码');
    
    // 验证 toast 提示出现
    await expect(page.locator('text=验证码已发送')).toBeVisible({ timeout: 5000 });
  });

  test('TabBar 导航', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // 点击各个 Tab
    const tabs = ['首页', '乐队', '广场', '市场', '我的'];
    
    for (const tab of tabs) {
      await page.click(`text=${tab}`);
      await page.waitForTimeout(500);
      await page.screenshot({ 
        path: `test-results/tab-${tab}.png`,
        fullPage: true 
      });
    }
  });
});
