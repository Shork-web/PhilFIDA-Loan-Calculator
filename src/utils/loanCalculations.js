/**
 * Format currency with ₱ prefix and 2 decimal places
 */
export function formatCurrency(amount) {
  return '₱' + Number(amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Calculates loan amortization matching exact Excel/PhilFIDA formula in HTML draft
 * Monthly Payment = P * [ r * (1 + r)^n ] / [ (1 + r)^n - 1 ]
 */
export function calculateLoanAmortization({
  loanAmount,
  monthlyInterestRateDecimal,
  numMonths
}) {
  const P = parseFloat(loanAmount) || 0;
  const r = parseFloat(monthlyInterestRateDecimal) || 0;
  const n = parseInt(numMonths) || 0;

  if (P <= 0 || r <= 0 || n <= 0) {
    return {
      monthlyPayment: 0,
      totalInterestPaid: 0,
      totalRepayment: 0,
      schedule: []
    };
  }

  // Monthly Amortization PMT Formula
  const monthlyPayment = (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);

  let currentBalance = P;
  let totalInterestPaid = 0;
  const schedule = [];

  for (let i = 1; i <= n; i++) {
    const interest = currentBalance * r;
    const monthlyTotal = currentBalance + interest;
    let newBalance = monthlyTotal - monthlyPayment;

    // Handle final period rounding adjustments
    if (i === n && Math.abs(newBalance) < 1) {
      newBalance = 0;
    }

    totalInterestPaid += interest;

    schedule.push({
      month: i,
      balance: currentBalance,
      interest: interest,
      monthlyTotal: monthlyTotal,
      payment: monthlyPayment,
      newBalance: Math.max(0, newBalance)
    });

    currentBalance = newBalance;
  }

  return {
    monthlyPayment,
    totalInterestPaid,
    totalRepayment: P + totalInterestPaid,
    schedule
  };
}

/**
 * Export Amortization Schedule to CSV
 */
export function downloadAmortizationCSV(schedule, loanType, loanAmount, monthlyRateDecimal, numMonths) {
  const headers = ['Month', 'Beginning Balance', 'Interest', 'Monthly Total', 'Payment', 'New Balance'];
  const rows = schedule.map(row => [
    row.month,
    row.balance.toFixed(2),
    row.interest.toFixed(2),
    row.monthlyTotal.toFixed(2),
    row.payment.toFixed(2),
    row.newBalance.toFixed(2)
  ]);

  const metaHeader = [
    [`PhilFIDA Loan Amortization Schedule`],
    [`Loan Type: ${loanType}`],
    [`Loan Amount: PHP ${Number(loanAmount).toLocaleString()}`],
    [`Monthly Interest Rate: ${(parseFloat(monthlyRateDecimal) * 100).toFixed(2)}% (${monthlyRateDecimal})`],
    [`Term: ${numMonths} Months`],
    []
  ];

  const csvContent = 'data:text/csv;charset=utf-8,' 
    + metaHeader.map(e => e.join(',')).join('\n')
    + headers.join(',') + '\n'
    + rows.map(e => e.join(',')).join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `PhilFIDA_${loanType.replace(/\s+/g, '_')}_Schedule.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
