import React from 'react';
import {
  Box, Typography, Chip,
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TableViewIcon from '@mui/icons-material/TableView';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatCurrency } from '../utils/loanCalculations';

const COLUMNS = [
  { label: '#',           align: 'left',  width: '40px' },
  { label: 'Balance',     align: 'right', width: '110px' },
  { label: 'Principal',   align: 'right', width: '100px' },
  { label: 'Interest',    align: 'right', width: '95px' },
  { label: 'Payment',     align: 'right', width: '105px' },
  { label: 'New Balance', align: 'right', width: '110px' },
];

export default function MuiAmortizationTable({ schedule, loanType, borrowerName = '' }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const totalPayment   = schedule.reduce((s, r) => s + r.payment,   0);
  const totalPrincipal = schedule.reduce((s, r) => s + r.principal, 0);
  const totalInterest  = schedule.reduce((s, r) => s + r.interest,  0);

  // Calculate dynamic row padding so rows expand smoothly to fill container height with zero empty whitespace
  const rowPaddingY = schedule.length <= 12
    ? 1.6
    : schedule.length <= 24
    ? 1.15
    : schedule.length <= 36
    ? 0.9
    : 0.75;

  return (
    <Box sx={{
      bgcolor: 'background.paper',
      borderRadius: 2.5,
      border: '1px solid',
      borderColor: isDark ? '#334155' : '#E5E7EB',
      boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.04)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%', // Matches exact height of Loan Parameters sidebar card
      transition: 'background-color 0.25s ease, border-color 0.25s ease',
    }}>
      {/* Header */}
      <Box sx={{
        px: 2.5, py: 1.75,
        borderBottom: '1px solid',
        borderColor: isDark ? '#334155' : '#F3F4F6',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Box display="flex" alignItems="center" gap={1.25}>
          <Box sx={{
            width: 28, height: 28, borderRadius: 1.25,
            bgcolor: isDark ? 'rgba(34,197,94,0.15)' : '#F0FDF4',
            border: '1px solid',
            borderColor: isDark ? 'rgba(34,197,94,0.3)' : '#BBF7D0',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <TableViewIcon sx={{ color: isDark ? '#4ADE80' : '#16A34A', fontSize: 15 }} />
          </Box>
          <Box>
            <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.85rem' }}>
              {borrowerName ? `Amortization Schedule — ${borrowerName.toUpperCase()}` : 'Amortization Schedule'}
            </Typography>
            {schedule.length > 0 && (
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem' }}>
                {schedule.length} periods · Total {formatCurrency(totalPayment)}
              </Typography>
            )}
          </Box>
        </Box>
        {loanType && (
          <Chip label={loanType} size="small" sx={{
            bgcolor: isDark ? 'rgba(34,197,94,0.15)' : '#F0FDF4',
            color: isDark ? '#4ADE80' : '#15803D',
            border: '1px solid',
            borderColor: isDark ? 'rgba(34,197,94,0.3)' : '#BBF7D0',
            fontWeight: 700, fontSize: '0.65rem', height: 20,
          }} />
        )}
      </Box>

      {/* Table Container - Fills available vertical space down to the footer */}
      <TableContainer sx={{
        flex: 1,
        minHeight: 0,
        overflowX: 'auto',
        overflowY: 'auto',
        bgcolor: isDark ? '#1E293B' : '#FFFFFF',
        '&::-webkit-scrollbar': { width: 6, height: 6 },
        '&::-webkit-scrollbar-thumb': { bgcolor: isDark ? '#475569' : '#CBD5E1', borderRadius: 8 },
      }}>
        <Table
          stickyHeader
          size="small"
          sx={{
            width: '100%',
            minWidth: 540,
            tableLayout: 'fixed',
          }}
        >
          <TableHead>
            <TableRow>
              {COLUMNS.map((col, i) => (
                <TableCell
                  key={col.label}
                  align={col.align}
                  sx={{
                    width: col.width,
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: i === 2
                      ? (isDark ? '#60A5FA' : '#2563EB')
                      : i === 3
                      ? (isDark ? '#F59E0B' : '#D97706')
                      : i === 4
                      ? (isDark ? '#4ADE80' : '#16A34A')
                      : (isDark ? '#94A3B8' : '#9CA3AF'),
                    bgcolor: isDark ? '#0F172A' : '#F9FAFB',
                    borderBottom: '1px solid',
                    borderColor: isDark ? '#334155' : '#E5E7EB',
                    py: 1,
                    px: i === 0 ? 1.5 : 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {schedule.length > 0 ? (
              schedule.map((row, idx) => {
                const isLast = idx === schedule.length - 1;
                return (
                  <TableRow
                    key={row.month}
                    sx={{
                      bgcolor: isDark ? '#1E293B' : '#FFFFFF',
                      '&:hover': { bgcolor: isDark ? '#334155' : '#F9FAFB' },
                      '& td': { borderBottom: `1px solid ${isDark ? '#334155' : '#F3F4F6'}` },
                      '&:last-child td': { borderBottom: 'none' },
                      transition: 'background-color 0.06s',
                    }}
                  >
                    {/* Month */}
                    <TableCell sx={{ px: 1.5, py: rowPaddingY }}>
                      <Box sx={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 24, height: 24, borderRadius: 1,
                        bgcolor: isLast ? (isDark ? 'rgba(34,197,94,0.2)' : '#F0FDF4') : (isDark ? '#0F172A' : '#F3F4F6'),
                        fontSize: '0.72rem', fontWeight: 700,
                        color: isLast ? (isDark ? '#4ADE80' : '#15803D') : (isDark ? '#94A3B8' : '#6B7280'),
                      }}>
                        {row.month}
                      </Box>
                    </TableCell>

                    {/* Beginning Balance */}
                    <TableCell align="right" sx={{
                      fontFamily: '"Inter", monospace', color: isDark ? '#CBD5E1' : '#374151',
                      fontSize: '0.78rem', letterSpacing: '-0.01em', py: rowPaddingY, px: 1,
                    }}>
                      {formatCurrency(row.balance)}
                    </TableCell>

                    {/* Principal */}
                    <TableCell align="right" sx={{
                      fontFamily: '"Inter", monospace', color: isDark ? '#60A5FA' : '#2563EB',
                      fontWeight: 600, fontSize: '0.78rem', letterSpacing: '-0.01em', py: rowPaddingY, px: 1,
                    }}>
                      {formatCurrency(row.principal)}
                    </TableCell>

                    {/* Interest */}
                    <TableCell align="right" sx={{
                      fontFamily: '"Inter", monospace', color: isDark ? '#F59E0B' : '#D97706',
                      fontWeight: 600, fontSize: '0.78rem', letterSpacing: '-0.01em', py: rowPaddingY, px: 1,
                    }}>
                      {formatCurrency(row.interest)}
                    </TableCell>

                    {/* Payment */}
                    <TableCell align="right" sx={{ px: 1, py: rowPaddingY }}>
                      <Box sx={{
                        display: 'inline-block',
                        fontFamily: '"Inter", monospace', fontWeight: 700,
                        fontSize: '0.75rem',
                        color: isDark ? '#4ADE80' : '#15803D',
                        bgcolor: isDark ? 'rgba(34,197,94,0.15)' : '#F0FDF4',
                        border: '1px solid',
                        borderColor: isDark ? 'rgba(34,197,94,0.3)' : '#BBF7D0',
                        px: 0.6, py: 0.1, borderRadius: 1,
                        letterSpacing: '-0.01em',
                      }}>
                        {formatCurrency(row.payment)}
                      </Box>
                    </TableCell>

                    {/* New Balance */}
                    <TableCell align="right" sx={{
                      fontFamily: '"Inter", monospace', fontWeight: 700,
                      fontSize: '0.78rem',
                      color: row.newBalance === 0 ? (isDark ? '#4ADE80' : '#15803D') : (isDark ? '#F8FAFC' : '#111827'),
                      letterSpacing: '-0.01em', py: rowPaddingY, px: 1,
                    }}>
                      {row.newBalance === 0 ? (
                        <Box sx={{
                          display: 'inline-flex', alignItems: 'center', gap: 0.3,
                          bgcolor: isDark ? 'rgba(34,197,94,0.2)' : '#DCFCE7',
                          color: isDark ? '#4ADE80' : '#15803D',
                          border: '1px solid', borderColor: isDark ? 'rgba(34,197,94,0.4)' : '#86EFAC',
                          px: 0.75, py: 0.15, borderRadius: 1, fontSize: '0.68rem', fontWeight: 800,
                        }}>
                          <span>₱0.00</span>
                          <CheckCircleIcon sx={{ fontSize: 12 }} />
                        </Box>
                      ) : (
                        formatCurrency(row.newBalance)
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, border: 'none' }}>
                  <Stack alignItems="center" spacing={1}>
                    <Box sx={{
                      width: 40, height: 40, borderRadius: 2,
                      bgcolor: isDark ? '#0F172A' : '#F3F4F6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <InfoOutlinedIcon sx={{ color: isDark ? '#64748B' : '#D1D5DB', fontSize: 20 }} />
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.825rem' }}>
                        No schedule generated
                      </Typography>
                      <Typography variant="caption" sx={{ color: isDark ? '#64748B' : '#9CA3AF' }}>
                        Enter valid loan parameters to calculate
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer Pinned At Exact Bottom Edge */}
      {schedule.length > 0 && (
        <Box sx={{
          borderTop: '1px solid',
          borderColor: isDark ? '#334155' : '#F3F4F6',
          bgcolor: isDark ? '#0F172A' : '#F9FAFB',
          px: 2.5, py: 1.5,
          display: 'flex', justifyContent: 'flex-end', gap: 2.5,
          mt: 'auto',
        }}>
          <Box textAlign="right">
            <Typography sx={{ color: 'text.secondary', display: 'block', mb: 0.1, fontWeight: 500, fontSize: '0.65rem' }}>
              Total Principal
            </Typography>
            <Typography sx={{
              color: isDark ? '#60A5FA' : '#2563EB', fontFamily: '"Inter", monospace',
              fontWeight: 800, fontSize: '0.875rem', letterSpacing: '-0.02em',
            }}>
              {formatCurrency(totalPrincipal)}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography sx={{ color: 'text.secondary', display: 'block', mb: 0.1, fontWeight: 500, fontSize: '0.65rem' }}>
              Total Interest
            </Typography>
            <Typography sx={{
              color: isDark ? '#F59E0B' : '#D97706', fontFamily: '"Inter", monospace',
              fontWeight: 800, fontSize: '0.875rem', letterSpacing: '-0.02em',
            }}>
              {formatCurrency(totalInterest)}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography sx={{ color: 'text.secondary', display: 'block', mb: 0.1, fontWeight: 500, fontSize: '0.65rem' }}>
              Total Repaid
            </Typography>
            <Typography sx={{
              color: 'text.primary', fontFamily: '"Inter", monospace',
              fontWeight: 800, fontSize: '0.875rem', letterSpacing: '-0.02em',
            }}>
              {formatCurrency(totalPayment)}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
