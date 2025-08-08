const { chromium } = require('playwright');
const readline = require('readline');

async function automateForgotPassword() {
    const browser = await chromium.launch({
        headless: false,
        slowMo: 2000
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('🚀 Starting forgot password automation...');

        // Step 1: Open the site
        console.log('📱 Navigating to website...');
        await page.goto('https://develop.dev6mmrvnzfnk.amplifyapp.com');

        // ✅ Wait for a visible element to confirm the page loaded
        await page.waitForSelector('text="Sign Up"', { timeout: 50000 });

        // 🖼 Take a screenshot of the initial page state
        await page.screenshot({ path: 'loaded_homepage.png' });
        console.log('📸 Screenshot saved as loaded_homepage.png');

        // Step 2: Click "Forgot Password?"
        console.log('🔗 Clicking "Forgot Password?" link...');
        await page.click('text="Forgot Password?"');

        // Wait for Reset Password form to appear
        await page.waitForSelector('text="Reset your password"', { timeout: 50000 });

        // Step 3: Wait for manual email entry
        console.log('📧 Please enter your email manually in the browser.');
        await waitForUserInput('Press Enter when email is entered...');

        // Step 4: Click "Send Verification Code"
        console.log('📨 Clicking "Send Verification Code"...');
        await page.click('button:has-text("Send Verification Code")');

        // Optional: Wait for response
        await page.waitForSelector('text="Verification code sent"', { timeout: 50000 }).catch(() => {
            console.log('⚠️ Skipping confirmation message wait (not found)');
        });

        // Step 5: Wait for manual code/password entry
        console.log('🔐 Enter verification code and new password manually.');
        await waitForUserInput('Press Enter after filling verification form...');

        // Step 6: Click "Change Password"
        console.log('🔘 Clicking "Change Password"...');
        await page.click('button:has-text("Change Password")');

        // Optional success message
        await page.waitForSelector('text="Password changed"', { timeout: 50000 }).catch(() => {
            console.log('✅ Password change might have succeeded (no confirmation found)');
        });

        console.log('✅ Forgot password automation completed successfully!');
        await page.waitForTimeout(50000);

    } catch (error) {
        console.error('❌ Error during automation:', error);

        // Save screenshot if something goes wrong
        try {
            await page.screenshot({ path: 'error_screenshot.png', fullPage: true });
            console.log('📸 Screenshot saved as error_screenshot.png');
        } catch (screenshotError) {
            console.error('Screenshot failed:', screenshotError);
        }
    } finally {
        await browser.close();
    }
}

// 🧾 Helper for terminal input
function waitForUserInput(message = 'Press Enter to continue...') {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(`\n📥 ${message}\n`, () => {
            rl.close();
            resolve();
        });
    });
}

automateForgotPassword();
