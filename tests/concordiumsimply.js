const { chromium } = require('playwright');
const path = require('path');

async function automateWithAbsoluteXPath() {
    const extensionPath = path.join(__dirname, 'concordium-wallet-extension');

    // 🚀 Launch persistent context with extension
    const context = await chromium.launchPersistentContext('./user-data-dir', {
        headless: false,
        slowMo: 300,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: [
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`,
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--no-sandbox'
        ],
        permissions: ['notifications']
    });

    const pages = context.pages();
    const page = pages.length ? pages[0] : await context.newPage();

    try {
        console.log('🚀 Starting website automation with absolute XPath...');
        console.log('📍 Navigating to login page...');
        await page.goto('https://develop.dev6mmrvnzfnk.amplifyapp.com', {
            timeout: 120000,
            waitUntil: 'domcontentloaded'
        });

        console.log('⌛ Waiting for email input to appear...');
        await page.waitForSelector('input[name="email"]', { timeout: 60000, state: 'visible' });

        console.log('🔐 Filling login credentials...');
        await page.fill('input[name="email"]', 'st_gsq008794@yopmail.com');
        await page.fill('input[name="password"]', 'tEST@12345');
        console.log('🔘 Clicking login button...');
        await page.click('button[type="submit"]');

        console.log('🔒 Waiting for 2FA confirmation code (60s)...');
        await page.waitForTimeout(60000);

        console.log('⏳ Waiting for page to load after 2FA...');
        await page.waitForLoadState('networkidle');
        console.log('🕒 Additional wait for full content load (60s)...');
        await page.waitForTimeout(60000);

        console.log('🍔 Clicking on Hamburger Menu...');
        const hamburgerXPath = '/html[1]/body[1]/div[2]/div[1]/main[1]/div[1]/div[1]/div[1]/div[1]/button[1]/img[1]';
        await page.waitForSelector(`xpath=${hamburgerXPath}`, { timeout: 30000 });
        await page.click(`xpath=${hamburgerXPath}`);

        await page.waitForLoadState('networkidle');

        console.log('🏛️ Navigating to Administration...');
        try {
            const adminRole = page.getByRole('link', { name: /Administration/i });
            await adminRole.waitFor({ timeout: 30000 });
            await adminRole.click();
        } catch {
            const adminText = page.locator('text=Administration');
            await adminText.waitFor({ timeout: 30000 });
            await adminText.click();
        }

        await page.waitForLoadState('networkidle');

        console.log('💼 Navigating to Connect Concordium section...');
        await page.waitForSelector(`xpath=(//img[@alt='Wallets'])[1]`, { timeout: 60000 });
        await page.click(`xpath=(//img[@alt='Wallets'])[1]`);
        await page.waitForLoadState('networkidle');

        console.log('🔗 Clicking Connect Concordium...');
        const connectConcordiumSelectors = [
            'button:has-text("Connect Concordium")',
            'button:text("Connect Concordium")',
            '*:has-text("Connect Concordium")'
        ];
        let connectConcordiumClicked = false;
        for (const selector of connectConcordiumSelectors) {
            try {
                await page.waitForSelector(selector, { timeout: 5000 });
                await page.click(selector);
                console.log(`✅ Clicked Connect Concordium with: ${selector}`);
                connectConcordiumClicked = true;
                break;
            } catch {}
        }
        if (!connectConcordiumClicked) throw new Error('❌ Could not find Connect Concordium button');

        // 🕔 Wait 5 minutes to install/configure Concordium Wallet manually
        console.log('⏳ Waiting 5 minutes for manual Concordium Wallet setup...');
        await page.waitForTimeout(300000); // 300000 ms = 5 minutes

        console.log('➕ Clicking Add button...');
        const addButtonSelectors = [
            'button:has-text("Add")',
            'button:text("Add")'
        ];
        let addClicked = false;
        for (const selector of addButtonSelectors) {
            try {
                await page.waitForSelector(selector, { timeout: 5000 });
                await page.click(selector);
                console.log(`✅ Clicked Add button with: ${selector}`);
                addClicked = true;
                break;
            } catch {}
        }
        if (!addClicked) throw new Error('❌ Could not find Add button');

        await page.waitForLoadState('networkidle');

        console.log('⏳ Waiting 1 minute for manual Concordium wallet setup...');
        await page.waitForTimeout(60000);

        await page.screenshot({ path: 'final-automation-complete.png', fullPage: true });
        console.log('📸 Screenshot saved: final-automation-complete.png');
        console.log('✅ Automation completed! 🌐 Final URL:', page.url());

        await page.waitForTimeout(10000);

    } catch (error) {
        console.error('❌ Automation failed:', error.message);
        console.error('📍 Error details:', error.stack);
        await page.screenshot({ path: 'error-debug-full.png', fullPage: true });
        console.log('📸 Error screenshot saved as error-debug-full.png');
    } finally {
        console.log('🔒 Closing browser...');
        await context.close();
        console.log('✅ Browser closed.');
    }
}

console.log('🎯 Starting automation with absolute XPath hamburger menu...');
console.log('📝 Update credentials if needed.');
console.log('🦊 Ensure Concordium Wallet is ready and extracted in "concordium-wallet-extension" folder.');
console.log('🍔 Using absolute XPath: /html[1]/body[1]/div[2]/div[1]/main[1]/div[1]/div[1]/div[1]/div[1]/button[1]/img[1]\n');

automateWithAbsoluteXPath().catch(console.error);
