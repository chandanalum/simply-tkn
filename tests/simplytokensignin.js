const { chromium } = require('playwright');

async function automateLogin() {
    // Launch browser
    const browser = await chromium.launch({ 
        headless: false,  // Set to true to run without opening browser window
        slowMo: 200       // Add delay between actions for better visibility
    });
    
    // Create a new browser context
    const context = await browser.newContext();
    
    // Create a new page
    const page = await context.newPage();
    
    try {
        console.log('Navigating to login page...');
        
        // Navigate to the login page
       // await page.goto('https://develop.dev6mmrvnzfnk.amplifyapp.com');
        
        // Wait for the page to load
        //await page.waitForLoadState('networkidle');
        await page.goto('https://develop.dev6mmrvnzfnk.amplifyapp.com');
        await page.waitForSelector('input[name="email"]'); 
        
        console.log('Filling login credentials...');
        
        // Fill in the email field
       // await page.fill('#email', 'buproufeiffoipro-3686@yopmail.com'); // Replace with your email
        
        // Fill in the password field
        //await page.fill('#password', 'Test@12345'); // Replace with your password

        await page.waitForSelector('input[name="email"]');
        await page.fill('input[name="email"]', 'buproufeiffoipro-3686@yopmail.com');

        await page.fill('input[name="password"]', 'Test@12345');

        
        console.log('Clicking login button...');
        await page.click('button[type="submit"]');

        // Click the login button
       // await page.click('#Login');
        
        // Wait for navigation after login
        await page.waitForLoadState('networkidle');
        
        // Optional: Wait for a specific element that appears after successful login
        // await page.waitForSelector('#dashboard', { timeout: 10000 });
        
        // Optional: Wait for URL to change (adjust based on your redirect)
        // await page.waitForURL('**/dashboard**', { timeout: 10000 });
        
        console.log('Login successful!');
        console.log('Current URL:', page.url());
        
        // Add any additional actions you want to perform after login here
        // For example:
        // await page.click('#some-button');
        // await page.fill('#search-input', 'search term');
        
        // Take a screenshot (optional)
        await page.screenshot({ path: 'after-login.png', fullPage: true });
        console.log('Screenshot saved as after-login.png');
        
        // Wait a bit to see the result
        await page.waitForTimeout(50000);
        
    } catch (error) {
        console.error('Error during automation:', error);
        
        // Take screenshot on error for debugging
        await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
        console.log('Error screenshot saved as error-screenshot.png');
    } finally {
        // Close the browser
        await browser.close();
        console.log('Browser closed');
    }
}

// Run the automation
automateLogin().catch(console.error);