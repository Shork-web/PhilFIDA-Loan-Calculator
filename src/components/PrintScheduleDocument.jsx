import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { formatCurrency } from '../utils/loanCalculations';

export default function PrintScheduleDocument({
  loanType,
  loanAmount,
  interestRateDecimal,
  numMonths,
  calcResult,
  preparedByName = '',
  preparedByTitle = 'PhilFIDA Account Officer',
  approvedByName = '',
  approvedByTitle = 'Regional Director / OIC',
}) {
  const currentDate = new Date().toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box className="print-only" sx={{ p: 0, color: '#000000', bgcolor: '#ffffff' }}>
      {/* Official Government Header */}
      <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" mb={1.5}>
        <img
          src="/philfida-logo.png"
          alt="Department of Agriculture - PhilFIDA Official Seal"
          style={{ height: 52, width: 'auto', marginBottom: 6, objectFit: 'contain' }}
        />
        <Typography variant="overline" sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', color: '#444', display: 'block', lineHeight: 1.1 }}>
          Republic of the Philippines
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', color: '#000', lineHeight: 1.1 }}>
          DEPARTMENT OF AGRICULTURE
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase', color: '#059669', fontSize: '1.1rem', letterSpacing: '-0.02em', my: 0.2 }}>
          PHILIPPINE FIBER INDUSTRY DEVELOPMENT AUTHORITY
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#333' }}>
          REGIONAL OFFICE V (BICOL REGION)
        </Typography>
        <Typography variant="caption" sx={{ fontSize: '0.68rem', color: '#555', display: 'block', mt: 0.2 }}>
          Bicol University Compound, Legazpi City, Albay 4500, Philippines
        </Typography>
      </Box>

      <Divider sx={{ borderColor: '#000', borderBottomWidth: 1.5, mb: 1.5 }} />

      {/* Document Title */}
      <Box textAlign="center" mb={1.75}>
        <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#000', fontSize: '0.95rem' }}>
          OFFICIAL LOAN AMORTIZATION SCHEDULE
        </Typography>
        <Typography variant="caption" sx={{ color: '#555', fontSize: '0.68rem' }}>
          Issued on {currentDate} &bull; PhilFIDA Region V Credit & Financial Operations
        </Typography>
      </Box>

      {/* Loan Metadata Summary */}
      <Box sx={{ border: '1px solid #333', borderRadius: 1, p: 1.5, mb: 1.75, bgcolor: '#fafafa' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.75, textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid #ccc', pb: 0.25 }}>
          Loan Summary & Key Details
        </Typography>

        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={0.75} sx={{ fontSize: '0.78rem' }}>
          <Box><strong>Loan Program / Type:</strong> {loanType || 'Regular Loan'}</Box>
          <Box><strong>Principal Amount:</strong> {formatCurrency(loanAmount)}</Box>
          <Box><strong>Monthly Interest Rate:</strong> {(interestRateDecimal * 100).toFixed(2)}% per month</Box>
          <Box><strong>Loan Term:</strong> {numMonths} Months ({(numMonths / 12).toFixed(1)} yr maturity)</Box>
          <Box><strong>Monthly Payment:</strong> <span style={{ fontWeight: 'bold', color: '#047857' }}>{formatCurrency(calcResult.monthlyPayment)}</span></Box>
          <Box><strong>Total Interest Payable:</strong> {formatCurrency(calcResult.totalInterestPaid)}</Box>
          <Box gridColumn="span 2" sx={{ pt: 0.5, borderTop: '1px dashed #bbb', mt: 0.25 }}>
            <strong>Total Repayment Amount:</strong> <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{formatCurrency(calcResult.totalRepayment)}</span>
          </Box>
        </Box>
      </Box>

      {/* Schedule Table */}
      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.75, textTransform: 'uppercase', fontSize: '0.7rem' }}>
        Amortization Schedule Breakdown ({calcResult.schedule.length} Periods)
      </Typography>

      <table className="print-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #333', padding: '5px 6px', textAlign: 'center', width: '36px' }}>#</th>
            <th style={{ border: '1px solid #333', padding: '5px 6px', textAlign: 'right' }}>Beginning Balance</th>
            <th style={{ border: '1px solid #333', padding: '5px 6px', textAlign: 'right' }}>Interest Paid</th>
            <th style={{ border: '1px solid #333', padding: '5px 6px', textAlign: 'right' }}>Monthly Total</th>
            <th style={{ border: '1px solid #333', padding: '5px 6px', textAlign: 'right' }}>Monthly Payment</th>
            <th style={{ border: '1px solid #333', padding: '5px 6px', textAlign: 'right' }}>Ending Balance</th>
          </tr>
        </thead>
        <tbody>
          {calcResult.schedule.map((row) => (
            <tr key={row.month} style={{ pageBreakInside: 'avoid' }}>
              <td style={{ border: '1px solid #333', padding: '3.5px 6px', textAlign: 'center', fontWeight: 'bold' }}>{row.month}</td>
              <td style={{ border: '1px solid #333', padding: '3.5px 6px', textAlign: 'right', fontFamily: 'monospace' }}>{formatCurrency(row.balance)}</td>
              <td style={{ border: '1px solid #333', padding: '3.5px 6px', textAlign: 'right', fontFamily: 'monospace' }}>{formatCurrency(row.interest)}</td>
              <td style={{ border: '1px solid #333', padding: '3.5px 6px', textAlign: 'right', fontFamily: 'monospace' }}>{formatCurrency(row.monthlyTotal)}</td>
              <td style={{ border: '1px solid #333', padding: '3.5px 6px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 'bold' }}>{formatCurrency(row.payment)}</td>
              <td style={{ border: '1px solid #333', padding: '3.5px 6px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 'bold' }}>{row.newBalance === 0 ? '₱0.00' : formatCurrency(row.newBalance)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ backgroundColor: '#f9f9f9', fontWeight: 'bold' }}>
            <td colSpan={2} style={{ border: '1px solid #333', padding: '5px 6px', textAlign: 'right' }}>TOTALS:</td>
            <td style={{ border: '1px solid #333', padding: '5px 6px', textAlign: 'right', fontFamily: 'monospace' }}>{formatCurrency(calcResult.totalInterestPaid)}</td>
            <td style={{ border: '1px solid #333', padding: '5px 6px' }}></td>
            <td style={{ border: '1px solid #333', padding: '5px 6px', textAlign: 'right', fontFamily: 'monospace' }}>{formatCurrency(calcResult.totalRepayment)}</td>
            <td style={{ border: '1px solid #333', padding: '5px 6px' }}></td>
          </tr>
        </tfoot>
      </table>

      {/* Customizable Signatures Block */}
      <Box className="print-avoid-break" mt={2.5} pt={1} display="grid" gridTemplateColumns="1fr 1fr" gap={4}>
        <Box>
          <Typography variant="caption" sx={{ display: 'block', color: '#555', mb: 2.5 }}>
            Prepared & Certified By:
          </Typography>
          {preparedByName && (
            <Typography variant="body1" sx={{ fontWeight: 800, fontSize: '0.825rem', mb: 0.2, textTransform: 'uppercase' }}>
              {preparedByName}
            </Typography>
          )}
          <Box sx={{ borderBottom: '1px solid #000', width: '210px', mb: 0.4 }} />
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.78rem' }}>
            {preparedByTitle || 'PhilFIDA Account Officer'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#555', display: 'block', fontSize: '0.68rem' }}>
            Credit & Financial Operations — Region V
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ display: 'block', color: '#555', mb: 2.5 }}>
            Approved & Verified By:
          </Typography>
          {approvedByName && (
            <Typography variant="body1" sx={{ fontWeight: 800, fontSize: '0.825rem', mb: 0.2, textTransform: 'uppercase' }}>
              {approvedByName}
            </Typography>
          )}
          <Box sx={{ borderBottom: '1px solid #000', width: '210px', mb: 0.4 }} />
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.78rem' }}>
            {approvedByTitle || 'Regional Director / OIC'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#555', display: 'block', fontSize: '0.7rem' }}>
            PhilFIDA Regional Office V
          </Typography>
        </Box>
      </Box>

      {/* Disclaimer */}
      <Box className="print-avoid-break" mt={2} pt={1} sx={{ borderTop: '1px solid #ddd', textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: '#777', fontSize: '0.6rem' }}>
          Notice: This official computer-generated loan amortization schedule is issued by the Philippine Fiber Industry Development Authority (PhilFIDA) Regional Office V for official calculation, verification, and record-keeping purposes.
        </Typography>
      </Box>
    </Box>
  );
}
