import React, { useState } from 'react';
import {
  Box, Typography, TextField, Slider, Grid, Divider, Stack, InputAdornment,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SavingsIcon from '@mui/icons-material/Savings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { calculateLoanAmortization, formatCurrency } from '../utils/loanCalculations';

function MetricCard({ icon: Icon, iconBg, iconColor, label, value, valueColor, sub, highlight, isDark }) {
  return (
    <Box sx={{
      p: 2.5,
      borderRadius: 2,
      border: '1px solid',
      borderColor: highlight
        ? (isDark ? 'rgba(34,197,94,0.3)' : '#BBF7D0')
        : (isDark ? '#334155' : '#E5E7EB'),
      bgcolor: highlight
        ? (isDark ? 'rgba(34,197,94,0.15)' : '#F0FDF4')
        : (isDark ? '#0F172A' : '#FFFFFF'),
      display: 'flex', flexDirection: 'column',
      transition: 'all 0.15s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: isDark ? '0 6px 20px rgba(0,0,0,0.4)' : '0 6px 20px rgba(0,0,0,0.07)',
        borderColor: highlight ? '#86EFAC' : (isDark ? '#475569' : '#D1D5DB'),
      },
    }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
        <Box sx={{
          width: 32, height: 32, borderRadius: 1.75,
          bgcolor: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon sx={{ fontSize: 16, color: iconColor }} />
        </Box>
        <Typography sx={{
          fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.07em', color: isDark ? '#94A3B8' : '#9CA3AF', fontSize: '0.62rem',
        }}>
          {label}
        </Typography>
      </Box>
      <Typography sx={{
        fontWeight: 800, color: valueColor,
        fontFamily: '"Inter", monospace',
        letterSpacing: '-0.03em',
        fontSize: { xs: '1.375rem', md: '1.5rem' },
        lineHeight: 1.1, mb: sub ? 0.6 : 0,
      }}>
        {value}
      </Typography>
      {sub && (
        <Typography variant="caption" sx={{ color: isDark ? '#94A3B8' : '#9CA3AF', lineHeight: 1.45, fontSize: '0.7rem' }}>
          {sub}
        </Typography>
      )}
    </Box>
  );
}

export default function MuiExtraPaymentSimulator({ loanAmount, monthlyInterestRateDecimal, numMonths }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState(1000);

  const baseResult = calculateLoanAmortization({ loanAmount, monthlyInterestRateDecimal, numMonths });

  const P     = parseFloat(loanAmount)                 || 0;
  const r     = parseFloat(monthlyInterestRateDecimal) || 0;
  const n     = parseInt(numMonths)                    || 0;
  const extra = parseFloat(extraMonthlyPayment)        || 0;

  let acceleratedMonths = 0, totalInterestAcc = 0, currentBalance = P;
  const baseMonthlyPMT  = baseResult.monthlyPayment;
  const totalMonthlyPMT = baseMonthlyPMT + extra;

  if (P > 0 && r > 0 && n > 0) {
    let month = 0;
    while (currentBalance > 0.01 && month < n * 2) {
      const interest  = currentBalance * r;
      let   payment   = totalMonthlyPMT;
      let   principal = payment - interest;
      if (principal > currentBalance) { principal = currentBalance; payment = principal + interest; }
      currentBalance   = Math.max(0, currentBalance - principal);
      totalInterestAcc += interest;
      month++;
    }
    acceleratedMonths = month;
  }

  const interestSaved = Math.max(0, baseResult.totalInterestPaid - totalInterestAcc);
  const monthsSaved   = Math.max(0, baseResult.schedule.length   - acceleratedMonths);
  const maxSlider     = Math.max(10000, Math.round(baseMonthlyPMT * 2 / 500) * 500);
  const pctReduction  = baseResult.schedule.length > 0 ? (monthsSaved / baseResult.schedule.length) * 100 : 0;

  return (
    <Box sx={{
      bgcolor: 'background.paper',
      borderRadius: 2.5,
      border: '1px solid',
      borderColor: isDark ? '#334155' : '#E5E7EB',
      boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.04)',
      overflow: 'hidden',
      transition: 'background-color 0.25s ease, border-color 0.25s ease',
    }}>
      {/* Header */}
      <Box sx={{
        px: 2.5, py: 1.75,
        borderBottom: '1px solid',
        borderColor: isDark ? '#334155' : '#F3F4F6',
        display: 'flex', alignItems: 'center', gap: 1.5,
      }}>
        <Box sx={{
          width: 30, height: 30, borderRadius: 1.5,
          bgcolor: isDark ? 'rgba(245,158,11,0.15)' : '#FFFBEB',
          border: '1px solid',
          borderColor: isDark ? 'rgba(245,158,11,0.3)' : '#FDE68A',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <AutoAwesomeIcon sx={{ color: isDark ? '#F59E0B' : '#D97706', fontSize: 15 }} />
        </Box>
        <Box>
          <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.875rem' }}>
            Payoff Simulator
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
            See how extra payments accelerate your payoff
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: 2.5 }}>
        <Grid container spacing={2.5}>

          {/* Controls */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              {/* Extra Payment */}
              <Box>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', mb: 1 }}>
                  Extra Monthly Payment
                </Typography>
                <TextField
                  type="number"
                  value={extraMonthlyPayment}
                  onChange={(e) => setExtraMonthlyPayment(Math.max(0, parseFloat(e.target.value) || 0))}
                  fullWidth size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography sx={{ color: isDark ? '#F59E0B' : '#D97706', fontWeight: 700, fontSize: '0.875rem' }}>₱</Typography>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ min: 0, step: 500 }}
                />
              </Box>

              {/* Slider */}
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.72rem' }}>Quick adjust</Typography>
                  <Box sx={{
                    px: 1, py: 0.25, borderRadius: 99,
                    bgcolor: isDark ? 'rgba(245,158,11,0.15)' : '#FFFBEB',
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(245,158,11,0.3)' : '#FDE68A',
                  }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: isDark ? '#F59E0B' : '#D97706', fontSize: '0.72rem' }}>
                      ₱{Number(extraMonthlyPayment).toLocaleString('en-US')}
                    </Typography>
                  </Box>
                </Box>
                <Slider
                  value={extraMonthlyPayment}
                  onChange={(_, val) => setExtraMonthlyPayment(val)}
                  min={0} max={maxSlider} step={500}
                  sx={{
                    color: isDark ? '#F59E0B' : '#D97706', height: 4,
                    '& .MuiSlider-thumb': {
                      width: 16, height: 16,
                      boxShadow: isDark ? '0 0 0 3px rgba(245,158,11,0.25)' : '0 0 0 3px rgba(217,119,6,0.15)',
                      '&:hover': { boxShadow: isDark ? '0 0 0 5px rgba(245,158,11,0.35)' : '0 0 0 5px rgba(217,119,6,0.2)' },
                    },
                    '& .MuiSlider-rail': { backgroundColor: isDark ? '#475569' : '#FDE68A' },
                    '& .MuiSlider-track': { height: 4 },
                  }}
                />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>₱0</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>₱{maxSlider.toLocaleString()}</Typography>
                </Box>
              </Box>

              <Divider sx={{ borderColor: isDark ? '#334155' : '#F3F4F6' }} />

              {/* Breakdown */}
              <Box sx={{
                p: 2, borderRadius: 2,
                bgcolor: isDark ? '#0F172A' : '#F9FAFB',
                border: '1px solid',
                borderColor: isDark ? '#334155' : '#E5E7EB',
              }}>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', mb: 1.25 }}>
                  Monthly Breakdown
                </Typography>
                <Stack spacing={0.75}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.78rem' }}>Base amortization</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, fontFamily: '"Inter", monospace', color: 'text.primary', fontSize: '0.78rem' }}>
                      {formatCurrency(baseMonthlyPMT)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.78rem' }}>Extra payment</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, fontFamily: '"Inter", monospace', color: isDark ? '#F59E0B' : '#D97706', fontSize: '0.78rem' }}>
                      +{formatCurrency(extra)}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderStyle: 'dashed', borderColor: isDark ? '#334155' : '#E5E7EB' }} />
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.8rem' }}>New total</Typography>
                    <Typography sx={{ fontWeight: 800, fontFamily: '"Inter", monospace', color: isDark ? '#4ADE80' : '#16A34A', fontSize: '0.9375rem', letterSpacing: '-0.02em' }}>
                      {formatCurrency(totalMonthlyPMT)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Grid>

          {/* Results */}
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              <Grid container spacing={1.75}>
                <Grid item xs={12} sm={6}>
                  <MetricCard
                    icon={SavingsIcon}
                    iconBg={isDark ? 'rgba(34,197,94,0.15)' : '#F0FDF4'}
                    iconColor={isDark ? '#4ADE80' : '#16A34A'}
                    label="Interest Saved"
                    value={formatCurrency(interestSaved)}
                    valueColor={isDark ? '#4ADE80' : '#15803D'}
                    sub={`↓ from ${formatCurrency(baseResult.totalInterestPaid)} → ${formatCurrency(totalInterestAcc)}`}
                    highlight
                    isDark={isDark}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MetricCard
                    icon={AccessTimeIcon}
                    iconBg={isDark ? 'rgba(245,158,11,0.15)' : '#FFFBEB'}
                    iconColor={isDark ? '#F59E0B' : '#D97706'}
                    label="Months Saved"
                    value={`${monthsSaved} mo`}
                    valueColor={isDark ? '#F59E0B' : '#B45309'}
                    sub={`Pay off in ${acceleratedMonths} instead of ${baseResult.schedule.length} months`}
                    isDark={isDark}
                  />
                </Grid>
              </Grid>

              {/* Timeline Visual */}
              {baseResult.schedule.length > 0 && (
                <Box sx={{
                  p: 2.5, borderRadius: 2,
                  bgcolor: isDark ? '#0F172A' : '#F9FAFB',
                  border: '1px solid',
                  borderColor: isDark ? '#334155' : '#E5E7EB',
                }}>
                  <Box display="flex" alignItems="center" gap={0.75} mb={2}>
                    <TrendingUpIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                      Payoff Timeline
                    </Typography>
                  </Box>

                  <Stack spacing={1.75}>
                    {/* Original */}
                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={0.6}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.78rem' }}>Original</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.78rem' }}>
                          {baseResult.schedule.length} months
                        </Typography>
                      </Box>
                      <Box sx={{ height: 7, borderRadius: 99, bgcolor: isDark ? '#334155' : '#E5E7EB', overflow: 'hidden' }}>
                        <Box sx={{ height: '100%', width: '100%', borderRadius: 99, bgcolor: isDark ? '#475569' : '#D1D5DB' }} />
                      </Box>
                    </Box>

                    {/* Accelerated */}
                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={0.6}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.78rem' }}>With Extra Payment</Typography>
                        <Box display="flex" alignItems="center" gap={0.75}>
                          <Box sx={{
                            px: 0.75, py: 0.1, borderRadius: 99,
                            bgcolor: isDark ? 'rgba(34,197,94,0.15)' : '#F0FDF4',
                            border: '1px solid',
                            borderColor: isDark ? 'rgba(34,197,94,0.3)' : '#BBF7D0',
                          }}>
                            <Typography sx={{ fontWeight: 700, color: isDark ? '#4ADE80' : '#15803D', fontSize: '0.62rem' }}>-{monthsSaved} mo</Typography>
                          </Box>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: isDark ? '#4ADE80' : '#15803D', fontSize: '0.78rem' }}>
                            {acceleratedMonths} months
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ height: 7, borderRadius: 99, bgcolor: isDark ? '#334155' : '#E5E7EB', overflow: 'hidden' }}>
                        <Box sx={{
                          height: '100%',
                          width: `${Math.max(2, 100 - pctReduction)}%`,
                          borderRadius: 99,
                          background: isDark
                            ? 'linear-gradient(90deg, #22C55E, #4ADE80)'
                            : 'linear-gradient(90deg, #16A34A, #22C55E)',
                          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        }} />
                      </Box>
                    </Box>

                    {/* Savings callout */}
                    {monthsSaved > 0 && (
                      <Box sx={{
                        p: 1.75, borderRadius: 1.75,
                        bgcolor: isDark ? 'rgba(34,197,94,0.15)' : '#F0FDF4',
                        border: '1px solid',
                        borderColor: isDark ? 'rgba(34,197,94,0.3)' : '#BBF7D0',
                        display: 'flex', alignItems: 'flex-start', gap: 1.25,
                      }}>
                        <Box sx={{
                          width: 26, height: 26, borderRadius: 1.25,
                          bgcolor: isDark ? 'rgba(34,197,94,0.25)' : '#DCFCE7',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.1,
                        }}>
                          <SavingsIcon sx={{ fontSize: 14, color: isDark ? '#4ADE80' : '#16A34A' }} />
                        </Box>
                        <Typography sx={{ color: isDark ? '#4ADE80' : '#15803D', fontWeight: 600, lineHeight: 1.45, fontSize: '0.8rem' }}>
                          You save{' '}
                          <Box component="span" sx={{ fontFamily: '"Inter", monospace', fontWeight: 800 }}>
                            {formatCurrency(interestSaved)}
                          </Box>{' '}
                          in interest by paying{' '}
                          <Box component="span" sx={{ fontWeight: 800 }}>{formatCurrency(extra)}</Box>{' '}
                          extra each month.
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
