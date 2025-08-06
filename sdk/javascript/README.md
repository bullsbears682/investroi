# InvestWise Calculator SDK - JavaScript/TypeScript

Official JavaScript/TypeScript SDK for InvestWise Pro ROI Calculator API

## Installation

```bash
npm install investwise-calculator-sdk
# or
yarn add investwise-calculator-sdk
```

## Quick Start

```javascript
import { InvestWiseCalculator } from 'investwise-calculator-sdk';

const calculator = new InvestWiseCalculator('your-api-key');

const result = await calculator.calculateROI({
  initialInvestment: 10000,
  additionalCosts: 500,
  countryCode: 'US'
});

console.log(result.data.totalValue); // $12,500
console.log(result.data.roi); // 25.0
```

## React Hook

```jsx
import { useInvestWiseCalculator } from 'investwise-calculator-sdk/react';

function MyComponent() {
  const { calculate } = useInvestWiseCalculator('your-api-key');

  const handleCalculate = async () => {
    const result = await calculate({
      initialInvestment: 10000,
      additionalCosts: 500,
      countryCode: 'US'
    });
    
    if (result.success) {
      console.log('Total Value:', result.data.totalValue);
      console.log('ROI:', result.data.roi);
    }
  };

  return (
    <button onClick={handleCalculate}>
      Calculate ROI
    </button>
  );
}
```

## API Reference

### InvestWiseCalculator

#### Constructor

```javascript
new InvestWiseCalculator(apiKey, baseURL?)
```

- `apiKey` (string): Your API key for authentication
- `baseURL` (string, optional): Base URL for the API (default: https://api.investwisepro.com)

#### Methods

##### calculateROI(request)

Calculate ROI for an investment.

```javascript
const result = await calculator.calculateROI({
  initialInvestment: 10000,
  additionalCosts: 500,
  countryCode: 'US'
});
```

**Parameters:**
- `initialInvestment` (number): Initial investment amount
- `additionalCosts` (number): Additional costs
- `countryCode` (string): Country code (e.g., "US", "GB", "DE")

**Returns:**
```javascript
{
  success: boolean,
  data: {
    totalValue: number,
    roi: number,
    breakdown: {
      initialInvestment: number,
      additionalCosts: number,
      returns: number
    }
  },
  error?: string
}
```

##### healthCheck()

Check API health status.

```javascript
const health = await calculator.healthCheck();
```

**Returns:**
```javascript
{
  success: boolean,
  data: {
    status: string,
    version: string,
    service: string
  }
}
```

## Error Handling

The SDK handles errors gracefully and returns structured error responses:

```javascript
const result = await calculator.calculateROI({
  initialInvestment: 10000,
  additionalCosts: 500,
  countryCode: 'US'
});

if (!result.success) {
  console.error('Error:', result.error);
} else {
  console.log('Success:', result.data);
}
```

## Types

```typescript
interface ROIRequest {
  initialInvestment: number;
  additionalCosts: number;
  countryCode: string;
}

interface ROIResponse {
  success: boolean;
  data: {
    totalValue: number;
    roi: number;
    breakdown: {
      initialInvestment: number;
      additionalCosts: number;
      returns: number;
    };
  };
  error?: string;
}
```

## License

MIT License - see LICENSE file for details.