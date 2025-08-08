const { chromium } = require('playwright');
const readline = require('readline');

async function automateSignup() {
    // Launch browser
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        console.log('🚀 Starting signup automation...');

        // Step 1: Navigate to the website
        console.log('📱 Navigating to website...');
        await page.goto('https://develop.dev6mmrvnzfnk.amplifyapp.com');
        await page.waitForLoadState('domcontentloaded'); // safer than 'networkidle' for SPAs

        // Step 2: Click on Sign Up button
        console.log('🔘 Clicking Sign Up button...');
        await page.click('button:has-text("Sign Up")');
        await page.waitForLoadState('domcontentloaded');

        // Step 3: Wait for manual signup details entry
        console.log('⏳ Please enter signup details manually...');
        await waitForUserInput('Press Enter when you’ve filled out the signup form...');

        // Step 4: Click Continue button
        console.log('🔘 Clicking Continue button...');
        await page.click('button:has-text("Continue")');
        await page.waitForLoadState('domcontentloaded');

        // Step 5: Verification Code
        console.log('📧 Waiting on confirmation page...');
        await waitForUserInput('Press Enter when you’ve entered the verification code...');

        // Step 6: Two-Factor Authentication
        console.log('🔐 Waiting for two-factor authentication...');
        await waitForUserInput('Press Enter when 2FA is complete...');

        // Step 7: Tenant Details
        console.log('🏢 Waiting for tenant details entry...');
        await waitForUserInput('Press Enter when tenant details are filled...');

        // Step 8: Click Register
        console.log('🔘 Clicking Register button...');
        await page.click('button:has-text("Register")');
        await page.waitForLoadState('domcontentloaded');

        console.log('✅ Signup automation completed successfully!');
        await page.waitForTimeout(5000);

    } catch (error) {
        console.error('❌ Error during automation:', error);
    } finally {
        await browser.close();
    }
}

// ✅ Cross-platform terminal-friendly user input wait
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

// Run the automation
automateSignup();
