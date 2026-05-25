/**
 * Gojica 应用测试用例
 */

const { test, expect } = require('@playwright/test');

test.describe('Gojica 应用测试', () => {

  test('首页加载成功', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 检查页面标题
    const title = await page.title();
    console.log('页面标题:', title);

    // 截图
    await page.screenshot({ path: 'test-results/homepage.png', fullPage: true });

    // 验证页面加载完成
    await expect(page).toHaveTitle(/Gojica|登录|首页/);
  });

  test('登录页面加载', async ({ page }) => {
    await page.goto('/pages/login/index');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 检查页面包含登录相关文本
    const pageContent = await page.content();
    console.log('登录页面包含 GOJICA:', pageContent.includes('GOJICA'));

    // 截图
    await page.screenshot({ path: 'test-results/login-page.png', fullPage: true });

    // 验证登录页面元素
    await expect(page.locator('text=GOJICA')).toBeVisible({ timeout: 5000 });
  });

  test('乐队页面加载', async ({ page }) => {
    await page.goto('/pages/band/list');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 截图
    await page.screenshot({ path: 'test-results/band-list.png', fullPage: true });
  });

  test('API 端点可用性', async ({ page }) => {
    // 测试首页 API
    const response = await page.request.get('http://localhost:3000/api/v1/home');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.code).toBe(1000);
    expect(data.data).toHaveProperty('banners');
    expect(data.data).toHaveProperty('stats');
    expect(data.data).toHaveProperty('hotBands');
    expect(data.data).toHaveProperty('activities');
  });
});
