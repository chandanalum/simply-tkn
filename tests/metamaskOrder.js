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
        console.log('🚀 Starting website automation with absolute XPath...');
        await page.goto('https://develop.dev6mmrvnzfnk.amplifyapp.com', {
            waitUntil: 'domcontentloaded',
            timeout: 120000
        });

        console.log('⏳ Waiting 2 minutes for the page to fully load before login...');
        await page.waitForTimeout(120000);
        await page.screenshot({ path: 'debug-login-page.png', fullPage: true });

        fs.writeFileSync('page-source.html', await page.content());
        console.log('📄 Saved HTML snapshot as page-source.html');

        const emailInput = await page.$('xpath=//input[contains(@placeholder, "Email") or contains(@name, "email") or @type="email"]');
        const passwordInput = await page.$('xpath=//input[contains(@placeholder, "Password") or contains(@name, "password") or @type="password"]');

        if (emailInput && passwordInput) {
            console.log('✅ Found email & password fields – proceeding...');
            await emailInput.fill('st_gsq008794@yopmail.com');
            await passwordInput.fill('tEST@12345');

            const loginButton = await page.$('button[type="submit"], button:has-text("Login")');
            if (loginButton) {
                await loginButton.click();
                console.log('✅ Clicked login button');
            } else {
                console.warn('⚠️ Login button not found – continuing anyway...');
            }
        } else {
            throw new Error('❌ Email or password input not found – check selector or page content');
        }

        console.log('⏰ Waiting 2 minute for 2FA...');
        await page.waitForTimeout(120000);
        await page.waitForLoadState('networkidle');

        await tryClick(page, 'xpath=//img[@alt="open sidebar"]');

        try {
            await page.getByRole('link', { name: /Administration/i }).click({ timeout: 30000 });
        } catch {
            await tryClick(page, 'text=Administration');
        }

        await tryClick(page, 'xpath=(//img[@alt="Wallets"])[1]');
        await page.waitForLoadState('networkidle');

        const addButtonSelectors = [
            'button:has-text("Add")',
            '[type="button"]:has-text("Add")',
            'button[class*="add"]',
            '[id*="add"]'
        ];
        for (const selector of addButtonSelectors) {
            try {
                await tryClick(page, selector);
                break;
            } catch {}
        }

        const metamaskSelectors = [
            'button:has-text("Add MetaMask")',
            'button:has-text("Add Metamask")',
            'button[class*="metamask"]'
        ];
        for (const selector of metamaskSelectors) {
            try {
                await tryClick(page, selector);
                break;
            } catch {}
        }

        const connectSelectors = [
            'button:has-text("Connect")',
            'button[class*="connect"]'
        ];
        for (const selector of connectSelectors) {
            try {
                await tryClick(page, selector);
                break;
            } catch {}
        }

        console.log('⏰ Waiting 1 minute for MetaMask manual connection...');
        await page.waitForTimeout(60000);

        await tryClick(page, 'xpath=//span[normalize-space()="Tokenstore"]');
        await tryClick(page, 'xpath=//img[@alt="ERC20 Custom"]');

        console.log('👉 Clicking "Order"...');
        await tryClick(page, 'button:has-text("Order")');

        console.log('⏳ Waiting 2 minutes for token setup...');
        await page.waitForTimeout(120000);

        console.log('👉 Clicking "Order" after manual token setup...');
        await tryClick(page, 'button:has-text("Order")');

        console.log('👉 Clicking "Confirm"...');
        await tryClick(page, 'button:has-text("Confirm")');

        console.log('👉 Clicking "To your offering"...');
        await tryClick(page, 'text=To your offering');

        console.log('👉 Clicking "Generate Contract"...');
        await tryClick(page, 'button:has-text("Generate Contract")');

        console.log('⏳ Waiting 1 minute for manual contract generation...');
        await page.waitForTimeout(60000);

        console.log('👉 Clicking "Build Token"...');
        await tryClick(page, 'button:has-text("Build Token")');

        console.log('⏳ Waiting 1 minute for manual token build...');
        await page.waitForTimeout(60000);

        console.log('👉 Clicking "Deploy Contract"...');
        await tryClick(page, 'button:has-text("Deploy Contract")');

        console.log('⏳ Waiting 1 minute before deploying proxy contract...');
        await page.waitForTimeout(60000);

        console.log('👉 Clicking "Deploy Proxy Contract"...');
        await tryClick(page, 'button:has-text("Deploy Proxy Contract")');

        console.log('⏳ Waiting 1 minute after deploying proxy contract...');
        await page.waitForTimeout(60000);

        console.log('👉 Clicking back (chevron icon)...');
        await tryClick(page, 'xpath=//img[@alt="chevron icon"]');

        console.log('👉 Clicking first "Grant Role"...');
        await tryClick(page, 'button:has-text("Grant Role")');

        console.log('⏳ Waiting 1 minute before clicking second "Grant Role"...');
        await page.waitForTimeout(60000);

        console.log('👉 Clicking second "Grant Role"...');
        await tryClick(page, 'button:has-text("Grant Role")');

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

console.log('🎯 Starting automation with full flow...');
console.log('📝 Ensure MetaMask and manual steps are ready.');
automateWithAbsoluteXPath().catch(console.error);
