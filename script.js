// ROI Calculator JavaScript
class ROICalculator {
    constructor() {
        this.chart = null;
        this.initializeElements();
        this.bindEvents();
        this.initializeChart();
    }

    initializeElements() {
        this.elements = {
            initialInvestment: document.getElementById('initialInvestment'),
            finalValue: document.getElementById('finalValue'),
            timePeriod: document.getElementById('timePeriod'),
            timeUnit: document.getElementById('timeUnit'),
            additionalCosts: document.getElementById('additionalCosts'),
            calculateBtn: document.getElementById('calculateBtn'),
            roiPercentage: document.getElementById('roiPercentage'),
            netProfit: document.getElementById('netProfit'),
            annualizedRoi: document.getElementById('annualizedRoi'),
            totalInvestment: document.getElementById('totalInvestment'),
            chartCanvas: document.getElementById('roiChart')
        };
    }

    bindEvents() {
        this.elements.calculateBtn.addEventListener('click', () => this.calculateROI());
        
        // Add input validation and real-time updates
        Object.values(this.elements).forEach(element => {
            if (element && element.tagName === 'INPUT') {
                element.addEventListener('input', () => this.validateInputs());
                element.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.calculateROI();
                    }
                });
            }
        });
    }

    validateInputs() {
        const inputs = [
            this.elements.initialInvestment,
            this.elements.finalValue,
            this.elements.timePeriod
        ];

        let isValid = true;
        inputs.forEach(input => {
            if (input && input.value && parseFloat(input.value) < 0) {
                input.style.borderColor = '#dc3545';
                isValid = false;
            } else if (input) {
                input.style.borderColor = '#e1e5e9';
            }
        });

        this.elements.calculateBtn.disabled = !isValid;
        return isValid;
    }

    calculateROI() {
        if (!this.validateInputs()) {
            this.showError('Please enter valid positive numbers.');
            return;
        }

        const initialInvestment = parseFloat(this.elements.initialInvestment.value) || 0;
        const finalValue = parseFloat(this.elements.finalValue.value) || 0;
        const timePeriod = parseFloat(this.elements.timePeriod.value) || 0;
        const timeUnit = this.elements.timeUnit.value;
        const additionalCosts = parseFloat(this.elements.additionalCosts.value) || 0;

        if (initialInvestment === 0 || finalValue === 0 || timePeriod === 0) {
            this.showError('Please fill in all required fields.');
            return;
        }

        this.showLoading();

        // Simulate calculation delay for better UX
        setTimeout(() => {
            const results = this.performCalculations(initialInvestment, finalValue, timePeriod, timeUnit, additionalCosts);
            this.displayResults(results);
            this.updateChart(results);
            this.hideLoading();
        }, 500);
    }

    performCalculations(initialInvestment, finalValue, timePeriod, timeUnit, additionalCosts) {
        const totalInvestment = initialInvestment + additionalCosts;
        const netProfit = finalValue - totalInvestment;
        const roiPercentage = ((netProfit / totalInvestment) * 100);
        
        // Convert time period to years for annualized calculation
        let timeInYears = timePeriod;
        switch (timeUnit) {
            case 'months':
                timeInYears = timePeriod / 12;
                break;
            case 'days':
                timeInYears = timePeriod / 365;
                break;
        }

        const annualizedRoi = timeInYears > 0 ? ((Math.pow((finalValue / totalInvestment), (1 / timeInYears)) - 1) * 100) : 0;

        return {
            roiPercentage: roiPercentage,
            netProfit: netProfit,
            annualizedRoi: annualizedRoi,
            totalInvestment: totalInvestment,
            initialInvestment: initialInvestment,
            finalValue: finalValue,
            timeInYears: timeInYears
        };
    }

    displayResults(results) {
        // Format and display results
        this.elements.roiPercentage.textContent = `${results.roiPercentage.toFixed(2)}%`;
        this.elements.netProfit.textContent = this.formatCurrency(results.netProfit);
        this.elements.annualizedRoi.textContent = `${results.annualizedRoi.toFixed(2)}%`;
        this.elements.totalInvestment.textContent = this.formatCurrency(results.totalInvestment);

        // Add visual feedback
        this.addResultAnimation();
        
        // Color code the ROI percentage
        this.colorCodeROI(results.roiPercentage);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    colorCodeROI(roiPercentage) {
        const roiElement = this.elements.roiPercentage;
        roiElement.style.color = roiPercentage >= 0 ? '#28a745' : '#dc3545';
    }

    addResultAnimation() {
        const resultCards = document.querySelectorAll('.result-card');
        resultCards.forEach(card => {
            card.classList.add('updated');
            setTimeout(() => card.classList.remove('updated'), 500);
        });
    }

    initializeChart() {
        const ctx = this.elements.chartCanvas.getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Initial Investment', 'Net Profit/Loss'],
                datasets: [{
                    data: [100, 0],
                    backgroundColor: [
                        '#667eea',
                        '#28a745'
                    ],
                    borderWidth: 0,
                    hoverBackgroundColor: [
                        '#5a6fd8',
                        '#218838'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                return `${label}: ${value.toFixed(2)}%`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true
                }
            }
        });
    }

    updateChart(results) {
        const initialPercentage = (results.initialInvestment / results.totalInvestment) * 100;
        const profitPercentage = results.netProfit >= 0 ? 
            (results.netProfit / results.totalInvestment) * 100 : 0;
        const lossPercentage = results.netProfit < 0 ? 
            Math.abs(results.netProfit / results.totalInvestment) * 100 : 0;

        this.chart.data.datasets[0].data = [initialPercentage, profitPercentage];
        this.chart.data.datasets[0].backgroundColor = [
            '#667eea',
            results.netProfit >= 0 ? '#28a745' : '#dc3545'
        ];
        this.chart.data.datasets[0].hoverBackgroundColor = [
            '#5a6fd8',
            results.netProfit >= 0 ? '#218838' : '#c82333'
        ];

        this.chart.update();
    }

    showLoading() {
        document.body.classList.add('calculating');
        this.elements.calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';
    }

    hideLoading() {
        document.body.classList.remove('calculating');
        this.elements.calculateBtn.innerHTML = '<i class="fas fa-calculator"></i> Calculate ROI';
    }

    showError(message) {
        // Create a temporary error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        // Remove error message after 3 seconds
        setTimeout(() => {
            errorDiv.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => document.body.removeChild(errorDiv), 300);
        }, 3000);
    }
}

// Add CSS animations for error messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ROICalculator();
    
    // Add some sample data for demonstration
    const sampleData = {
        initialInvestment: 10000,
        finalValue: 12500,
        timePeriod: 2,
        timeUnit: 'years',
        additionalCosts: 500
    };

    // Auto-fill sample data after a short delay
    setTimeout(() => {
        document.getElementById('initialInvestment').value = sampleData.initialInvestment;
        document.getElementById('finalValue').value = sampleData.finalValue;
        document.getElementById('timePeriod').value = sampleData.timePeriod;
        document.getElementById('timeUnit').value = sampleData.timeUnit;
        document.getElementById('additionalCosts').value = sampleData.additionalCosts;
    }, 1000);
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        document.getElementById('calculateBtn').click();
    }
});

// Add tooltips for better UX
document.addEventListener('DOMContentLoaded', () => {
    const tooltips = {
        'initialInvestment': 'Enter the amount you initially invested',
        'finalValue': 'Enter the current or final value of your investment',
        'timePeriod': 'How long you held the investment',
        'additionalCosts': 'Any additional costs like fees, taxes, or expenses'
    };

    Object.entries(tooltips).forEach(([id, text]) => {
        const element = document.getElementById(id);
        if (element) {
            element.title = text;
        }
    });
});