import React from 'react';
import {
  Box, Button, TextField, Divider,
  InputAdornment, Typography, Stack,
  Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PercentIcon from '@mui/icons-material/Percent';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DrawIcon from '@mui/icons-material/Draw';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import BusinessIcon from '@mui/icons-material/Business';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PHILFIDA_LOAN_PRESETS } from '../data/philfidaPrograms';
import { formatCurrency } from '../utils/loanCalculations';

const PRESET_CONFIG = {
  regular:   { color: '#16A34A', light: '#F0FDF4', label: 'Regular',   rate: '1.0%' },
  emergency: { color: '#2563EB', light: '#EFF6FF', label: 'Emergency', rate: '0.5%' },
  provident: { color: '#D97706', light: '#FFFBEB', label: 'Provident', rate: '1.0%' },
  special:   { color: '#7C3AED', light: '#FAF5FF', label: 'Special',   rate: '1.0%' },
};

export default function MuiLoanForm({
  borrowerName, setBorrowerName,
  borrowerPosition, setBorrowerPosition,
  borrowerOffice, setBorrowerOffice,
  loanType, setLoanType,
  loanAmount, setLoanAmount,
  interestRateDecimal, setInterestRateDecimal,
  numMonths, setNumMonths,
  preparedByName, setPreparedByName,
  preparedByTitle, setPreparedByTitle,
  approvedByName, setApprovedByName,
  approvedByTitle, setApprovedByTitle,
  calcResult, onPrint, onExportCSV,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handlePresetSelect = (preset) => {
    setLoanType(preset.name);
    setLoanAmount(preset.amount);
    setInterestRateDecimal(preset.monthlyRateDecimal);
    setNumMonths(preset.months);
  };

  const activePresetId = PHILFIDA_LOAN_PRESETS.find(p => p.name === loanType)?.id;

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
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Box>
          <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.875rem' }}>
            Loan Parameters
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
            Recalculates instantly
          </Typography>
        </Box>
        <Box sx={{
          width: 7, height: 7, borderRadius: '50%',
          bgcolor: '#22C55E', boxShadow: '0 0 0 2px rgba(34,197,94,0.2)',
        }} />
      </Box>

      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* Loan Program Segmented Control Switch — 100% Uniform & Rectangular */}
        <Box>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', mb: 1 }}>
            Loan Program
          </Typography>

          <Box
            sx={{
              display: 'flex',
              bgcolor: isDark ? '#0F172A' : '#F3F4F6',
              borderRadius: 2,
              p: 0.5,
              border: '1px solid',
              borderColor: isDark ? '#334155' : '#E5E7EB',
              gap: 0.5,
            }}
          >
            {PHILFIDA_LOAN_PRESETS.map((preset) => {
              const cfg = PRESET_CONFIG[preset.id] || PRESET_CONFIG.regular;
              const isActive = activePresetId === preset.id;
              return (
                <Box
                  key={preset.id}
                  component="button"
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    py: 0.85,
                    px: 0.25,
                    borderRadius: 1.5,
                    border: 'none',
                    bgcolor: isActive ? cfg.color : 'transparent',
                    color: isActive ? '#FFFFFF' : (isDark ? '#94A3B8' : '#4B5563'),
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease-in-out',
                    outline: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isActive ? `0 2px 6px ${cfg.color}40` : 'none',
                    '&:hover': {
                      color: isActive ? '#FFFFFF' : (isDark ? '#F8FAFC' : '#111827'),
                      bgcolor: isActive ? cfg.color : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      lineHeight: 1.15,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '100%',
                      textAlign: 'center',
                    }}
                  >
                    {cfg.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.6rem',
                      fontWeight: 600,
                      opacity: isActive ? 0.9 : 0.75,
                      lineHeight: 1.1,
                      mt: 0.2,
                    }}
                  >
                    {cfg.rate}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Divider sx={{ borderColor: isDark ? '#334155' : '#F3F4F6' }} />

        {/* Borrower Details Section */}
        <Stack spacing={1.25}>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Borrower Profile
          </Typography>

          <TextField
            label="Borrower / Account Name"
            placeholder="e.g. Juan De La Cruz"
            value={borrowerName}
            onChange={(e) => setBorrowerName(e.target.value)}
            fullWidth size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ fontSize: 15, color: isDark ? '#64748B' : '#9CA3AF' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Position / Designation"
            placeholder="e.g. Fiber Development Officer II"
            value={borrowerPosition}
            onChange={(e) => setBorrowerPosition(e.target.value)}
            fullWidth size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon sx={{ fontSize: 15, color: isDark ? '#64748B' : '#9CA3AF' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Designated Office / Station"
            placeholder="e.g. PhilFIDA Region V - Legazpi Station"
            value={borrowerOffice}
            onChange={(e) => setBorrowerOffice(e.target.value)}
            fullWidth size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessIcon sx={{ fontSize: 15, color: isDark ? '#64748B' : '#9CA3AF' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Divider sx={{ borderColor: isDark ? '#334155' : '#F3F4F6' }} />

        {/* Inputs — compact size="small" */}
        <Stack spacing={1.5}>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Loan Financial Terms
          </Typography>

          <TextField
            label="Loan Amount (₱)" type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            fullWidth size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography sx={{ color: '#22C55E', fontWeight: 700, fontSize: '0.875rem' }}>₱</Typography>
                </InputAdornment>
              ),
            }}
            inputProps={{ min: 1000, step: 1000 }}
          />

          <TextField
            label="Monthly Interest Rate" type="number"
            value={interestRateDecimal}
            onChange={(e) => setInterestRateDecimal(Math.max(0, parseFloat(e.target.value) || 0))}
            fullWidth size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PercentIcon sx={{ fontSize: 13, color: isDark ? '#64748B' : '#9CA3AF' }} />
                </InputAdornment>
              ),
            }}
            inputProps={{ min: 0, step: 0.001 }}
            helperText={`${(interestRateDecimal * 100).toFixed(2)}% per month`}
          />

          <TextField
            label="Term (Months)" type="number"
            value={numMonths}
            onChange={(e) => setNumMonths(Math.max(1, parseInt(e.target.value) || 1))}
            fullWidth size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonthIcon sx={{ fontSize: 13, color: isDark ? '#64748B' : '#9CA3AF' }} />
                </InputAdornment>
              ),
            }}
            inputProps={{ min: 1, max: 120 }}
            helperText={`${(numMonths / 12).toFixed(1)} yr maturity`}
          />
        </Stack>

        <Divider sx={{ borderColor: isDark ? '#334155' : '#F3F4F6' }} />

        {/* Summary — 3 stat rows */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', mb: 1.25 }}>
            Calculated Summary
          </Typography>

          {/* Monthly Payment — highlighted */}
          <Box sx={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            px: 1.5, py: 1.25, mx: -1.5,
            borderRadius: 2,
            bgcolor: isDark ? 'rgba(34,197,94,0.12)' : 'rgba(22,163,74,0.06)',
            border: '1px solid',
            borderColor: isDark ? 'rgba(34,197,94,0.25)' : 'transparent',
            mb: 0.5,
          }}>
            <Typography sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.8rem' }}>Monthly Payment</Typography>
            <Typography sx={{ fontWeight: 800, color: isDark ? '#4ADE80' : '#16A34A', fontFamily: '"Inter", monospace', fontSize: '1rem', letterSpacing: '-0.02em' }}>
              {formatCurrency(calcResult.monthlyPayment)}
            </Typography>
          </Box>

          {[
            { label: 'Total Interest', value: formatCurrency(calcResult.totalInterestPaid), color: isDark ? '#F59E0B' : '#D97706' },
            { label: 'Total Repayment', value: formatCurrency(calcResult.totalRepayment), color: isDark ? '#F8FAFC' : '#111827' },
          ].map(({ label, value, color }) => (
            <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.75 }}>
              <Typography sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.8rem' }}>{label}</Typography>
              <Typography sx={{ fontWeight: 700, color, fontFamily: '"Inter", monospace', fontSize: '0.875rem', letterSpacing: '-0.01em' }}>
                {value}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ borderColor: isDark ? '#334155' : '#F3F4F6' }} />

        {/* Customizable Print Signatories Accordion */}
        <Accordion
          disableGutters
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: isDark ? '#334155' : '#E5E7EB',
            borderRadius: '8px !important',
            '&:before': { display: 'none' },
            bgcolor: isDark ? '#0F172A' : '#FAFAFA',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ fontSize: 16, color: 'text.secondary' }} />}
            sx={{ px: 1.5, py: 0.5, minHeight: 36, '& .MuiAccordionSummary-content': { my: 0.5, gap: 1, alignItems: 'center' } }}
          >
            <DrawIcon sx={{ fontSize: 14, color: isDark ? '#4ADE80' : '#16A34A' }} />
            <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.78rem' }}>
              Customize Print Signatories
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 1.5, pb: 1.5, pt: 0 }}>
            <Stack spacing={1.25}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Prepared & Certified By
              </Typography>
              <TextField
                label="Officer Name"
                placeholder="e.g. Juan De La Cruz"
                value={preparedByName}
                onChange={(e) => setPreparedByName(e.target.value)}
                fullWidth size="small"
                inputProps={{ style: { fontSize: '0.78rem' } }}
              />
              <TextField
                label="Officer Title"
                placeholder="PhilFIDA Account Officer"
                value={preparedByTitle}
                onChange={(e) => setPreparedByTitle(e.target.value)}
                fullWidth size="small"
                inputProps={{ style: { fontSize: '0.78rem' } }}
              />

              <Divider sx={{ my: 0.5, borderColor: isDark ? '#334155' : '#F3F4F6' }} />

              <Typography sx={{ color: 'text.secondary', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Approved & Verified By
              </Typography>
              <TextField
                label="Director Name"
                placeholder="e.g. Engr. Roberto M. Reyes"
                value={approvedByName}
                onChange={(e) => setApprovedByName(e.target.value)}
                fullWidth size="small"
                inputProps={{ style: { fontSize: '0.78rem' } }}
              />
              <TextField
                label="Director Title"
                placeholder="Regional Director / OIC"
                value={approvedByTitle}
                onChange={(e) => setApprovedByTitle(e.target.value)}
                fullWidth size="small"
                inputProps={{ style: { fontSize: '0.78rem' } }}
              />
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Actions */}
        <Stack spacing={1} className="no-print">
          <Button
            variant="contained" startIcon={<PrintIcon sx={{ fontSize: 15 }} />}
            onClick={onPrint} fullWidth
            sx={{
              py: 1, fontSize: '0.8125rem',
              bgcolor: isDark ? '#22C55E' : '#111827',
              color: '#FFFFFF',
              '&:hover': {
                bgcolor: isDark ? '#16A34A' : '#1F2937',
                boxShadow: isDark ? '0 4px 14px rgba(34,197,94,0.4)' : '0 4px 12px rgba(0,0,0,0.25)',
              },
            }}
          >
            Print Schedule
          </Button>
          <Button
            variant="outlined" color="primary"
            startIcon={<FileDownloadIcon sx={{ fontSize: 15 }} />}
            onClick={onExportCSV} fullWidth
            sx={{ py: 0.9, fontSize: '0.8125rem' }}
          >
            Export Excel (.xlsx)
          </Button>
        </Stack>

      </Box>
    </Box>
  );
}
