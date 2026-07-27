/**
 * Format currency with ₱ prefix and 2 decimal places
 */
export function formatCurrency(amount) {
  return '₱' + Number(amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Calculates loan amortization matching exact Excel/PhilFIDA formula
 * Monthly Payment = P * [ r * (1 + r)^n ] / [ (1 + r)^n - 1 ]
 */
export function calculateLoanAmortization({
  loanAmount,
  monthlyInterestRateDecimal,
  numMonths,
}) {
  const P = parseFloat(loanAmount) || 0;
  const r = parseFloat(monthlyInterestRateDecimal) || 0;
  const n = parseInt(numMonths) || 0;

  if (P <= 0 || r <= 0 || n <= 0) {
    return {
      monthlyPayment: 0,
      totalInterestPaid: 0,
      totalRepayment: 0,
      schedule: [],
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
      newBalance: Math.max(0, newBalance),
    });

    currentBalance = newBalance;
  }

  return {
    monthlyPayment,
    totalInterestPaid,
    totalRepayment: P + totalInterestPaid,
    schedule,
  };
}

// Color Theme mapping per loan program
const PROGRAM_THEMES = {
  'Regular Loan':   { primary: '16A34A', lightFill: 'F0FDF4', border: 'BBF7D0', fontColor: '15803D' },
  'Emergency Loan': { primary: '2563EB', lightFill: 'EFF6FF', border: 'BFDBFE', fontColor: '1D4ED8' },
  'Provident Loan': { primary: 'D97706', lightFill: 'FFFBEB', border: 'FDE68A', fontColor: 'B45309' },
  'Special Loan':   { primary: '7C3AED', lightFill: 'FAF5FF', border: 'DDD6FE', fontColor: '6D28D9' },
};

/**
 * Export Color-Coded Executive Amortization Schedule to Native .xlsx Excel File using ExcelJS
 * Uses Dynamic Code-Splitting (import('exceljs')) for Ultra-Fast Web App Load Speeds!
 */
export async function downloadAmortizationCSV({
  schedule,
  borrowerName = '',
  borrowerPosition = '',
  borrowerOffice = '',
  loanType,
  loanAmount,
  monthlyRateDecimal,
  numMonths,
  calcResult,
  preparedByName = '',
  preparedByTitle = 'PhilFIDA Account Officer',
  approvedByName = '',
  approvedByTitle = 'Regional Director / OIC',
}) {
  // Dynamically import ExcelJS on-demand when Export button is clicked
  const ExcelJS = (await import('exceljs')).default;

  const currentDate = new Date().toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeStamp = new Date().toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const P = parseFloat(loanAmount) || 0;
  const r = parseFloat(monthlyRateDecimal) || 0;
  const n = parseInt(numMonths) || 0;
  const monthlyPMT = calcResult?.monthlyPayment || 0;
  const totalInterest = calcResult?.totalInterestPaid || 0;
  const totalRepayment = calcResult?.totalRepayment || (P + totalInterest);

  const themeConfig = PROGRAM_THEMES[loanType] || PROGRAM_THEMES['Regular Loan'];

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'PhilFIDA Regional Office V';
  workbook.created = new Date();

  const ws = workbook.addWorksheet('Amortization Schedule', {
    pageSetup: { paperSize: 9, orientation: 'portrait', fitToPage: true },
  });

  // Set Column Widths
  ws.columns = [
    { key: 'col1', width: 12 }, // Period (#)
    { key: 'col2', width: 24 }, // Beginning Balance
    { key: 'col3', width: 22 }, // Interest Paid
    { key: 'col4', width: 22 }, // Monthly Total
    { key: 'col5', width: 24 }, // Monthly Payment
    { key: 'col6', width: 25 }, // Ending Balance
  ];

  // Helper for applying background fill
  const applyFill = (cell, argbHex) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF' + argbHex },
    };
  };

  // Helper for setting cell borders
  const applyBorders = (cell, colorHex = 'D1D5DB') => {
    cell.border = {
      top:    { style: 'thin', color: { argb: 'FF' + colorHex } },
      left:   { style: 'thin', color: { argb: 'FF' + colorHex } },
      bottom: { style: 'thin', color: { argb: 'FF' + colorHex } },
      right:  { style: 'thin', color: { argb: 'FF' + colorHex } },
    };
  };

  // 1. Executive Agency Header Block (Rows 1 - 5)
  ws.mergeCells('A1:F1');
  const r1 = ws.getCell('A1');
  r1.value = 'REPUBLIC OF THE PHILIPPINES';
  r1.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FF6B7280' } };
  r1.alignment = { horizontal: 'center', vertical: 'middle' };

  ws.mergeCells('A2:F2');
  const r2 = ws.getCell('A2');
  r2.value = 'DEPARTMENT OF AGRICULTURE';
  r2.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF111827' } };
  r2.alignment = { horizontal: 'center', vertical: 'middle' };

  ws.mergeCells('A3:F3');
  const r3 = ws.getCell('A3');
  r3.value = 'PHILIPPINE FIBER INDUSTRY DEVELOPMENT AUTHORITY';
  r3.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FF' + themeConfig.primary } };
  r3.alignment = { horizontal: 'center', vertical: 'middle' };

  ws.mergeCells('A4:F4');
  const r4 = ws.getCell('A4');
  r4.value = 'REGIONAL OFFICE V (BICOL REGION)';
  r4.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF374151' } };
  r4.alignment = { horizontal: 'center', vertical: 'middle' };

  ws.mergeCells('A5:F5');
  const r5 = ws.getCell('A5');
  r5.value = 'Bicol University Compound, Legazpi City, Albay 4500, Philippines';
  r5.font = { name: 'Segoe UI', size: 8.5, italic: true, color: { argb: 'FF6B7280' } };
  r5.alignment = { horizontal: 'center', vertical: 'middle' };

  ws.addRow([]); // Row 6 blank

  // 2. Document Title Banner (Row 7)
  ws.mergeCells('A7:F7');
  const r7 = ws.getCell('A7');
  r7.value = 'OFFICIAL LOAN AMORTIZATION SCHEDULE & COMPUTATION';
  r7.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FF' + themeConfig.fontColor } };
  r7.alignment = { horizontal: 'center', vertical: 'middle' };
  applyFill(r7, themeConfig.lightFill);
  applyBorders(r7, themeConfig.border);
  ws.getRow(7).height = 28;

  ws.mergeCells('A8:F8');
  const r8 = ws.getCell('A8');
  r8.value = `Issued on ${currentDate} at ${timeStamp} | PhilFIDA Credit & Financial Operations`;
  r8.font = { name: 'Segoe UI', size: 8.5, bold: true, color: { argb: 'FF6B7280' } };
  r8.alignment = { horizontal: 'center', vertical: 'middle' };

  ws.addRow([]); // Row 9 blank

  // 3. Loan Parameters & Borrower Profile Section (Row 10 - 20)
  ws.mergeCells('A10:F10');
  const r10 = ws.getCell('A10');
  r10.value = '  LOAN SUMMARY & BORROWER PROFILE';
  r10.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF111827' } };
  r10.alignment = { horizontal: 'left', vertical: 'middle' };
  applyFill(r10, 'F3F4F6');
  ws.getRow(10).height = 22;

  const paramsData = [
    ['  Borrower Name:', borrowerName ? borrowerName.toUpperCase() : 'N/A (GENERAL ESTIMATE)', false, true],
    ['  Position / Designation:', borrowerPosition || 'N/A', false],
    ['  Designated Office / Station:', borrowerOffice || 'N/A', false],
    ['  Loan Program / Type:', loanType || 'Regular Loan', false],
    ['  Principal Amount (PHP):', P, true],
    ['  Monthly Interest Rate:', `${(r * 100).toFixed(2)}% per month`, false],
    ['  Loan Tenure / Term:', `${n} Months (${(n / 12).toFixed(1)} Years)`, false],
    ['  Calculated Monthly Payment (PHP):', monthlyPMT, true, true],
    ['  Total Interest Payable (PHP):', totalInterest, true],
    ['  Total Repayment Amount (PHP):', totalRepayment, true, true],
  ];

  paramsData.forEach(([label, val, isCurr, isHighlight], idx) => {
    const rowIdx = 11 + idx;
    ws.mergeCells(`A${rowIdx}:B${rowIdx}`);
    ws.mergeCells(`C${rowIdx}:F${rowIdx}`);

    const labelCell = ws.getCell(`A${rowIdx}`);
    labelCell.value = label;
    labelCell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF374151' } };

    const valCell = ws.getCell(`C${rowIdx}`);
    valCell.value = val;
    valCell.font = {
      name: 'Segoe UI',
      size: 9.5,
      bold: isHighlight || isCurr,
      color: { argb: isHighlight ? ('FF' + themeConfig.primary) : 'FF111827' },
    };
    if (isCurr) {
      valCell.numFmt = '"₱"#,##0.00';
      valCell.alignment = { horizontal: 'left' };
    }
    ws.getRow(rowIdx).height = 20;
  });

  ws.addRow([]); // Blank row before table

  // 4. Color-Coded Table Header (Row 22)
  const headers = ['#', 'Beginning Balance (PHP)', 'Interest Paid (PHP)', 'Monthly Total (PHP)', 'Monthly Payment (PHP)', 'Ending Balance (PHP)'];
  const headerRowIdx = 22;
  const headerRow = ws.getRow(headerRowIdx);
  headerRow.height = 26;

  headers.forEach((h, colIdx) => {
    const cell = headerRow.getCell(colIdx + 1);
    cell.value = h;
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FFFFFFFF' } };

    // Distinct Column Color Coding Fills
    if (colIdx === 2) {
      applyFill(cell, 'D97706'); // Warm Amber for Interest Paid
    } else if (colIdx === 4) {
      applyFill(cell, '16A34A'); // Emerald Green for Monthly Payment
    } else {
      applyFill(cell, '1E293B'); // Dark Slate for main columns
    }
  });

  // 5. Data Rows (Rows 23+)
  let startRowIdx = 23;
  schedule.forEach((row, idx) => {
    const currentR = startRowIdx + idx;
    const rObj = ws.getRow(currentR);
    rObj.height = 20;

    const isEven = idx % 2 === 0;
    const bgHex = isEven ? 'FFFFFF' : 'F8FAFC';

    // Col 1: Month #
    const c1 = rObj.getCell(1);
    c1.value = row.month;
    c1.alignment = { horizontal: 'center', vertical: 'middle' };
    c1.font = { name: 'Segoe UI', size: 9.5, bold: true };
    applyFill(c1, bgHex);
    applyBorders(c1);

    // Col 2: Beginning Balance
    const c2 = rObj.getCell(2);
    c2.value = row.balance;
    c2.numFmt = '"₱"#,##0.00';
    c2.alignment = { horizontal: 'right', vertical: 'middle' };
    applyFill(c2, bgHex);
    applyBorders(c2);

    // Col 3: Interest Paid — Soft Amber Tint
    const c3 = rObj.getCell(3);
    c3.value = row.interest;
    c3.numFmt = '"₱"#,##0.00';
    c3.alignment = { horizontal: 'right', vertical: 'middle' };
    c3.font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FFB45309' } };
    applyFill(c3, 'FFFBEB'); // Warm Amber Soft Fill
    applyBorders(c3, 'FDE68A');

    // Col 4: Monthly Total
    const c4 = rObj.getCell(4);
    c4.value = row.monthlyTotal;
    c4.numFmt = '"₱"#,##0.00';
    c4.alignment = { horizontal: 'right', vertical: 'middle' };
    applyFill(c4, bgHex);
    applyBorders(c4);

    // Col 5: Monthly Payment — Soft Emerald Tint
    const c5 = rObj.getCell(5);
    c5.value = row.payment;
    c5.numFmt = '"₱"#,##0.00';
    c5.alignment = { horizontal: 'right', vertical: 'middle' };
    c5.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF15803D' } };
    applyFill(c5, 'F0FDF4'); // Emerald Soft Fill
    applyBorders(c5, 'BBF7D0');

    // Col 6: Ending Balance — Highlight Final Zero Period
    const c6 = rObj.getCell(6);
    c6.value = row.newBalance;
    c6.numFmt = '"₱"#,##0.00';
    c6.alignment = { horizontal: 'right', vertical: 'middle' };
    if (row.newBalance === 0) {
      c6.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF15803D' } };
      applyFill(c6, 'DCFCE7'); // Bright Payoff Mint
      applyBorders(c6, '86EFAC');
    } else {
      c6.font = { name: 'Segoe UI', size: 9.5, bold: true };
      applyFill(c6, bgHex);
      applyBorders(c6);
    }
  });

  // 6. Totals Summary Row
  const totalsRowIdx = startRowIdx + schedule.length;
  const tRow = ws.getRow(totalsRowIdx);
  tRow.height = 24;

  ws.mergeCells(`A${totalsRowIdx}:B${totalsRowIdx}`);
  const tLabel = ws.getCell(`A${totalsRowIdx}`);
  tLabel.value = 'TOTALS:';
  tLabel.alignment = { horizontal: 'right', vertical: 'middle' };
  tLabel.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF111827' } };

  // Total Interest
  const tInt = tRow.getCell(3);
  tInt.value = totalInterest;
  tInt.numFmt = '"₱"#,##0.00';
  tInt.alignment = { horizontal: 'right', vertical: 'middle' };
  tInt.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFB45309' } };
  applyFill(tInt, 'FEF3C7');

  // Col 4 Blank Total
  const t4 = tRow.getCell(4);
  t4.value = '-';
  t4.alignment = { horizontal: 'center', vertical: 'middle' };

  // Total Repayment
  const tRep = tRow.getCell(5);
  tRep.value = totalRepayment;
  tRep.numFmt = '"₱"#,##0.00';
  tRep.alignment = { horizontal: 'right', vertical: 'middle' };
  tRep.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF15803D' } };
  applyFill(tRep, 'DCFCE7');

  // Col 6 Blank Total
  const t6 = tRow.getCell(6);
  t6.value = '-';
  t6.alignment = { horizontal: 'center', vertical: 'middle' };

  for (let c = 1; c <= 6; c++) {
    const cell = tRow.getCell(c);
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF111827' } },
      bottom: { style: 'double', color: { argb: 'FF111827' } },
    };
  }

  // 7. Signatory Certification Block (with generous physical signature space!)
  const sigStartIdx = totalsRowIdx + 3;
  ws.mergeCells(`A${sigStartIdx}:F${sigStartIdx}`);
  const sigBanner = ws.getCell(`A${sigStartIdx}`);
  sigBanner.value = '  OFFICIAL SIGNATORIES & CERTIFICATION';
  sigBanner.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF111827' } };
  sigBanner.alignment = { horizontal: 'left', vertical: 'middle' };
  applyFill(sigBanner, 'F3F4F6');
  ws.getRow(sigStartIdx).height = 22;

  // Row 1: Labels
  ws.mergeCells(`A${sigStartIdx + 1}:C${sigStartIdx + 1}`);
  ws.mergeCells(`D${sigStartIdx + 1}:F${sigStartIdx + 1}`);
  ws.getCell(`A${sigStartIdx + 1}`).value = '  Prepared & Certified By:';
  ws.getCell(`D${sigStartIdx + 1}`).value = '  Approved & Verified By:';

  // Row 2: Blank Signature Space (42px height for physical wet signature / stamp!)
  const sigSpaceRowIdx = sigStartIdx + 2;
  ws.mergeCells(`A${sigSpaceRowIdx}:C${sigSpaceRowIdx}`);
  ws.mergeCells(`D${sigSpaceRowIdx}:F${sigSpaceRowIdx}`);
  ws.getRow(sigSpaceRowIdx).height = 42;

  // Row 3: Names (Bold, UpperCase)
  const nameRowIdx = sigStartIdx + 3;
  ws.mergeCells(`A${nameRowIdx}:C${nameRowIdx}`);
  ws.mergeCells(`D${nameRowIdx}:F${nameRowIdx}`);
  const prepNameCell = ws.getCell(`A${nameRowIdx}`);
  prepNameCell.value = '  ' + (preparedByName ? preparedByName.toUpperCase() : '[ ___________________________ ]');
  prepNameCell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF111827' } };

  const appNameCell = ws.getCell(`D${nameRowIdx}`);
  appNameCell.value = '  ' + (approvedByName ? approvedByName.toUpperCase() : '[ ___________________________ ]');
  appNameCell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF111827' } };

  // Row 4: Titles
  const titleRowIdx = sigStartIdx + 4;
  ws.mergeCells(`A${titleRowIdx}:C${titleRowIdx}`);
  ws.mergeCells(`D${titleRowIdx}:F${titleRowIdx}`);
  ws.getCell(`A${titleRowIdx}`).value = '  ' + (preparedByTitle || 'PhilFIDA Account Officer');
  ws.getCell(`D${titleRowIdx}`).value = '  ' + (approvedByTitle || 'Regional Director / OIC');

  // Generate Buffer & Trigger Browser Download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);

  const cleanLoanName = (loanType || 'Regular_Loan').replace(/\s+/g, '_');
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `PhilFIDA_Amortization_Schedule_${cleanLoanName}_${dateStr}.xlsx`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
