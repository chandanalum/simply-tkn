const { chromium } = require('playwright');

async function automateWithAbsoluteXPath() {
    const browser = await chromium.launch({
        headless: false,
        slowMo: 300,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // ✅ Chrome path
        args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--no-sandbox'
        ]
    });

    const context = await browser.newContext({
        permissions: ['notifications']
        // No viewport override = no maximize
    });

    const page = await context.newPage();

    try {
        console.log('🚀 Starting website automation with absolute XPath...');
        console.log('📍 Navigating to login page...');
        await page.goto('https://develop.dev6mmrvnzfnk.amplifyapp.com');
        await page.waitForSelector('input[name="email"]');

        console.log('🔐 Filling login credentials...');
        await page.fill('input[name="email"]', 'buproufeiffoipro-3686@yopmail.com');
        await page.fill('input[name="password"]', 'Test@12345');
        console.log('Clicking login button...');
        await page.click('button[type="submit"]');

        console.log('🔒 Waiting for 2FA confirmation code...');
        console.log('⏰ Please enter your confirmation code manually - waiting 1 minute...');
        let countdown = 60;
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown % 10 === 0) console.log(`⏰ ${countdown} seconds remaining for 2FA...`);
        }, 1000);
        await page.waitForTimeout(60000);
        clearInterval(countdownInterval);

        console.log('⏳ Waiting for page to load after 2FA...');
        await page.waitForLoadState('networkidle');
        console.log('⏰ Additional 1 minute wait for page loading...');
        countdown = 60;
        const loadingInterval = setInterval(() => {
            countdown--;
            if (countdown % 15 === 0) console.log(`⏳ ${countdown} seconds remaining for loading...`);
        }, 1000);
        await page.waitForTimeout(60000);
        clearInterval(loadingInterval);

        // Step 6: Hamburger Menu
        console.log('🍔 Clicking on Hamburger Menu using absolute XPath...');
        const hamburgerAbsoluteXPath = '/html[1]/body[1]/div[2]/div[1]/main[1]/div[1]/div[1]/div[1]/div[1]/button[1]/img[1]';
        try {
            await page.waitForSelector(`xpath=${hamburgerAbsoluteXPath}`, { timeout: 30000 });
            await page.click(`xpath=${hamburgerAbsoluteXPath}`);
            console.log('✅ Hamburger menu clicked successfully with absolute XPath');
        } catch {
            console.log('❌ Absolute XPath failed, trying fallback hamburger menu strategies...');
        }

        await page.waitForLoadState('networkidle');

        // Step 7: Administration
        console.log('🏛️ Clicking on Administration...');
        try {
            const adminRole = page.getByRole('link', { name: /Administration/i });
            await adminRole.waitFor({ timeout: 30000 });
            await adminRole.click();
            console.log('✅ Clicked Administration using role-based selector');
        } catch (err1) {
            try {
                const adminText = page.locator('text=Administration');
                await adminText.waitFor({ timeout: 30000 });
                await adminText.click();
                console.log('✅ Clicked Administration using text locator');
            } catch {
                const allLinks = await page.locator('a').allTextContents();
                console.log('🔍 Available links:', allLinks);
                throw new Error('❌ Could not find "Administration" link using any strategy.');
            }
        }

        await page.waitForLoadState('networkidle');

        // Step 8: Wallet (updated XPath)
        console.log('💼 Selecting Wallet option...');
        await page.waitForSelector(`xpath=(//img[@alt='Wallets'])[1]`, { timeout: 60000 });
        await page.click(`xpath=(//img[@alt='Wallets'])[1]`);
        await page.waitForLoadState('networkidle');

        // Step 9: Add
        console.log('➕ Clicking Add button...');
        const addButtonSelectors = [
            'button:has-text("Add")',
            'button:text-matches("Add", "i")',
            '[type="button"]:has-text("Add")',
            'button[class*="add"]',
            '[id*="add"]',
            '.add-btn',
            '[data-testid*="add"]',
            'button:text("Add")'
        ];
        let addClicked = false;
        for (const selector of addButtonSelectors) {
            try {
                await page.waitForSelector(selector, { timeout: 5000 });
                await page.click(selector);
                console.log(`✅ Add button clicked with: ${selector}`);
                addClicked = true;
                break;
            } catch {}
        }
        if (!addClicked) throw new Error('Could not find Add button');
        await page.waitForLoadState('networkidle');

        // Step 10: Add MetaMask
        console.log('🦊 Clicking Add MetaMask...');
        const metamaskSelectors = [
            'button:has-text("Add Metamask")',
            '[name="Add Metamask"]',
            'button:has-text("Add MetaMask")',
            'button:text-matches("Add.*MetaMask", "i")',
            '[data-testid*="metamask"]',
            'button[class*="metamask"]',
            '*:has-text("Add Metamask")',
            'button:text("Add Metamask")'
        ];
        let metamaskClicked = false;
        for (const selector of metamaskSelectors) {
            try {
                await page.waitForSelector(selector, { timeout: 5000 });
                await page.click(selector);
                console.log(`✅ MetaMask button clicked with: ${selector}`);
                metamaskClicked = true;
                break;
            } catch {}
        }
        if (!metamaskClicked) throw new Error('Could not find Add MetaMask button');
        await page.waitForLoadState('networkidle');

        // Step 11: Connect
        console.log('🔗 Clicking Connect button...');
        const connectSelectors = [
            'button:has-text("Connect")',
            '[name="Connect"]',
            'button:text-matches("Connect", "i")',
            'button[class*="connect"]',
            '[data-testid*="connect"]',
            'button:text("Connect")',
            '*:has-text("Connect")'
        ];
        let connectClicked = false;
        for (const selector of connectSelectors) {
            try {
                await page.waitForSelector(selector, { timeout: 5000 });
                await page.click(selector);
                console.log(`✅ Connect button clicked with: ${selector}`);
                connectClicked = true;
                break;
            } catch {}
        }
        if (!connectClicked) throw new Error('Could not find Connect button');

        // Step 12: MetaMask Wait
        console.log('🦊 MetaMask connection initiated...');
        console.log('⏰ Waiting 1 minute for MetaMask manual setup...');
        countdown = 60;
        const metamaskInterval = setInterval(() => {
            countdown--;
            if (countdown % 15 === 0) console.log(`🦊 ${countdown} seconds remaining for MetaMask setup...`);
        }, 50000);
        await page.waitForTimeout(60000);
        clearInterval(metamaskInterval);

        // Step 13: Final Screenshot
        await page.screenshot({ path: 'final-automation-complete.png', fullPage: true });
        console.log('📸 Final screenshot saved as final-automation-complete.png');
        console.log('✅ Complete automation finished successfully!');
        console.log('🌐 Final URL:', page.url());
        await page.waitForTimeout(10000);
    } catch (error) {
        console.error('❌ Automation failed:', error.message);
        console.error('📍 Error details:', error.stack);
        await page.screenshot({ path: 'error-debug-full.png', fullPage: true });
        console.log('📸 Error screenshot saved as error-debug-full.png');
        try {
            const title = await page.title();
            console.log('📄 Page title:', title);
        } catch {}
        try {
            const structure = await page.evaluate(() => {
                const main = document.querySelector('main');
                return main ? main.outerHTML.substring(0, 500) : 'Main element not found';
            });
            console.log('🔍 DOM structure preview:', structure);
        } catch {}
    } finally {
        console.log('🔒 Closing browser...');
        await browser.close();
        console.log('✅ Browser closed successfully');
    }
}

console.log('🎯 Starting automation with absolute XPath hamburger menu...');
console.log('📝 Remember to update your email and password in the script!');
console.log('🦊 Make sure MetaMask extension is installed and ready');
console.log('🍔 Using absolute XPath: /html[1]/body[1]/div[2]/div[1]/main[1]/div[1]/div[1]/div[1]/div[1]/button[1]/img[1]\n');

automateWithAbsoluteXPath().catch(console.error);
