const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function tryClick(page, selector, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const element = page.locator(selector);
            await element.scrollIntoViewIfNeeded();
            await element.waitFor({ timeout: 5000 });
            await element.click();
            return;
        } catch (e) {
            console.log(`⚠️ Retry ${i + 1} failed for selector: ${selector}`);
            await page.waitForTimeout(2000);
        }
    }
    throw new Error(`Failed to click after ${retries} retries: ${selector}`);
}

async function automateWithAbsoluteXPath() {
    const browser = await chromium.launch({
        headless: false,
        slowMo: 300,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--no-sandbox'
        ]
    });

    const context = await browser.newContext({
        permissions: ['notifications']
    });

    const page = await context.newPage();

    try {
        console.log('🚀 Starting website automation...');
        await page.goto('https://stage.assetmanager.simplytokenized.com/#/offerings/RVJDMjAjNzhiOWQwN2UtODU3Ny00NGUxLTgyOTQtMGIxYzVjMjllNjQ5', {
            waitUntil: 'domcontentloaded',
            timeout: 120000
        });

        console.log('⏳ Waiting 2 minutes for the page to load...');
        await page.waitForTimeout(120000);
        await page.screenshot({ path: 'debug-login-page.png', fullPage: true });

        fs.writeFileSync('page-source.html', await page.content());
        console.log('📄 Saved HTML snapshot as page-source.html');

        const emailInput = await page.$('xpath=//input[contains(@placeholder, "Email") or contains(@name, "email") or @type="email"]');
        const passwordInput = await page.$('xpath=//input[contains(@placeholder, "Password") or contains(@name, "password") or @type="password"]');

        if (emailInput && passwordInput) {
            console.log('✅ Found login fields – proceeding...');
            await emailInput.fill('saranya.s@geesesquads.com');
            await passwordInput.fill('Test@12345');

            const loginButton = await page.$('button[type="submit"], button:has-text("Login")');
            if (loginButton) {
                await loginButton.click();
                console.log('✅ Clicked login button');
            } else {
                console.warn('⚠️ Login button not found – continuing anyway...');
            }
        } else {
            throw new Error('❌ Email or password input not found.');
        }

        console.log('⏰ Waiting for 2FA...');
        await page.waitForTimeout(120000);
        await page.waitForLoadState('networkidle');

        // 🔓 After login, go to Add Order flow
        await tryClick(page, 'xpath=//img[@alt="open sidebar"]');

        console.log('👉 Clicking "Add Order"...');
        await tryClick(page, 'button:has-text("Add Order")');

        console.log('⏳ Waiting 2 minutes for manual order setup...');
        await page.waitForTimeout(120000);

        // ✅ Updated locator for the final "Order" button
        console.log('👉 Clicking final "Order"...');
        await tryClick(page, 'xpath=//button[normalize-space()="Order"]');

        console.log('👉 Clicking "Confirm Payment"...');
        await tryClick(page, 'button:has-text("Confirm Payment")');

        console.log('👉 Clicking "Mint"...');
        await tryClick(page, 'button:has-text("Mint")');
         await page.waitForTimeout(120000);

        await page.screenshot({ path: 'final-automation-complete.png', fullPage: true });
        console.log('📸 Screenshot saved: final-automation-complete.png');
        console.log('✅ Automation completed successfully');
    } catch (err) {
        console.error('❌ Automation failed:', err.message);
        await page.screenshot({ path: 'error-debug-full.png', fullPage: true });
        console.log('📸 Screenshot saved: error-debug-full.png');
    } finally {
        await browser.close();
        console.log('🔒 Browser closed');
    }
}

console.log('🎯 Starting automation with final Order flow...');
automateWithAbsoluteXPath().catch(console.error);
