# InvestWise Calculator SDK - Python

Official Python SDK for InvestWise Pro ROI Calculator API

## Installation

```bash
pip install investwise-calculator
```

## Quick Start

```python
from investwise_calculator import InvestWiseCalculator

calculator = InvestWiseCalculator('your-api-key')

result = calculator.calculate_roi(
    initial_investment=10000,
    additional_costs=500,
    country_code='US'
)

print(result.data.total_value)  # $12,500
print(result.data.roi)  # 25.0
```

## API Reference

### InvestWiseCalculator

#### Constructor

```python
InvestWiseCalculator(api_key, base_url="https://api.investwisepro.com")
```

- `api_key` (str): Your API key for authentication
- `base_url` (str, optional): Base URL for the API (default: https://api.investwisepro.com)

#### Methods

##### calculate_roi(initial_investment, additional_costs, country_code="US")

Calculate ROI for an investment.

```python
result = calculator.calculate_roi(
    initial_investment=10000,
    additional_costs=500,
    country_code='US'
)
```

**Parameters:**
- `initial_investment` (float): Initial investment amount
- `additional_costs` (float): Additional costs
- `country_code` (str): Country code (e.g., "US", "GB", "DE")

**Returns:**
```python
{
    "success": bool,
    "data": {
        "total_value": float,
        "roi": float,
        "breakdown": {
            "initial_investment": float,
            "additional_costs": float,
            "returns": float
        }
    },
    "error": str  # optional
}
```

##### health_check()

Check API health status.

```python
health = calculator.health_check()
```

**Returns:**
```python
{
    "success": bool,
    "data": {
        "status": str,
        "version": str,
        "service": str
    }
}
```

## Error Handling

The SDK handles errors gracefully and returns structured error responses:

```python
result = calculator.calculate_roi(
    initial_investment=10000,
    additional_costs=500,
    country_code='US'
)

if not result.success:
    print(f"Error: {result.error}")
else:
    print(f"Success: {result.data}")
```

## Examples

### Basic Usage

```python
from investwise_calculator import InvestWiseCalculator

# Initialize the calculator
calculator = InvestWiseCalculator('your-api-key')

# Calculate ROI
result = calculator.calculate_roi(
    initial_investment=10000,
    additional_costs=500,
    country_code='US'
)

if result.success:
    print(f"Total Value: ${result.data.total_value:,.2f}")
    print(f"ROI: {result.data.roi:.1f}%")
    print(f"Returns: ${result.data.breakdown.returns:,.2f}")
else:
    print(f"Error: {result.error}")
```

### Health Check

```python
# Check API health
health = calculator.health_check()

if health.success:
    print(f"API Status: {health.data.status}")
    print(f"Version: {health.data.version}")
else:
    print(f"Health Check Failed: {health.data.error}")
```

### Different Countries

```python
# Calculate ROI for different countries
countries = ['US', 'GB', 'DE', 'CA', 'AU']

for country in countries:
    result = calculator.calculate_roi(
        initial_investment=10000,
        additional_costs=500,
        country_code=country
    )
    
    if result.success:
        print(f"{country}: ROI {result.data.roi:.1f}%")
    else:
        print(f"{country}: Error - {result.error}")
```

## Requirements

- Python 3.7+
- requests>=2.25.0
- typing-extensions>=3.7.4

## License

MIT License - see LICENSE file for details.