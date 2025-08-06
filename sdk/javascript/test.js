const { InvestWiseCalculator } = require('./dist/index.js');

// Test the SDK
async function testSDK() {
    console.log('🧪 Testing InvestWise Calculator SDK...\n');
    
    // Initialize the calculator
    const calculator = new InvestWiseCalculator('test-api-key');
    
    // Test case 1: US investment
    console.log('Test 1 - US Investment:');
    const result1 = await calculator.calculateROI({
        initialInvestment: 10000,
        additionalCosts: 500,
        countryCode: 'US'
    });
    console.log('Request:', { initialInvestment: 10000, additionalCosts: 500, countryCode: 'US' });
    console.log('Response:', JSON.stringify(result1, null, 2));
    console.log();
    
    // Test case 2: UK investment
    console.log('Test 2 - UK Investment:');
    const result2 = await calculator.calculateROI({
        initialInvestment: 10000,
        additionalCosts: 500,
        countryCode: 'GB'
    });
    console.log('Request:', { initialInvestment: 10000, additionalCosts: 500, countryCode: 'GB' });
    console.log('Response:', JSON.stringify(result2, null, 2));
    console.log();
    
    // Test case 3: German investment
    console.log('Test 3 - German Investment:');
    const result3 = await calculator.calculateROI({
        initialInvestment: 10000,
        additionalCosts: 500,
        countryCode: 'DE'
    });
    console.log('Request:', { initialInvestment: 10000, additionalCosts: 500, countryCode: 'DE' });
    console.log('Response:', JSON.stringify(result3, null, 2));
    console.log();
    
    // Test health check
    console.log('Test 4 - Health Check:');
    const health = await calculator.healthCheck();
    console.log('Health Response:', JSON.stringify(health, null, 2));
}

// Run the test
testSDK().catch(console.error);