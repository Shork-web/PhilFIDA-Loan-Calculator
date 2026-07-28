import React from 'react';
import { Box, Typography, Chip, Stack, IconButton, Tooltip } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function MuiHeader({ darkMode, onToggleDarkMode }) {
  return (
    <Box
      sx={{
        mb: 2,
        borderRadius: 2.5,
        bgcolor: darkMode ? '#1E293B' : '#FFFFFF',
        border: '1px solid',
        borderColor: darkMode ? '#334155' : '#E5E7EB',
        boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'background-color 0.25s ease, border-color 0.25s ease',
      }}
    >
      {/* Top Emerald Accent Bar */}
      <Box
        sx={{
          height: 3.5,
          background: 'linear-gradient(90deg, #16A34A 0%, #22C55E 60%, #3B82F6 100%)',
        }}
      />

      <Box
        sx={{
          px: { xs: 2.5, sm: 3.5 },
          py: { xs: 2, sm: 2.25 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2.5,
        }}
      >
        {/* Left Side: Logo + Title (Strictly side-by-side) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2.5,
            flexWrap: 'nowrap',
            minWidth: 0,
          }}
        >
          {/* Official DA-PhilFIDA Logo Seal */}
          <Box
            component="img"
            src="/philfida-logo.png"
            alt="Department of Agriculture - PhilFIDA Official Seal"
            sx={{
              width: { xs: 70, sm: 90, md: 105 },
              height: { xs: 70, sm: 90, md: 105 },
              objectFit: 'contain',
              flexShrink: 0,
              display: 'block',
              filter: darkMode ? 'drop-shadow(0 3px 10px rgba(0,0,0,0.5))' : 'drop-shadow(0 3px 8px rgba(0,0,0,0.08))',
            }}
          />

          {/* Title Text Block */}
          <Box sx={{ minWidth: 0 }}>
            {/* Republic Eyebrow */}
            <Typography
              sx={{
                color: darkMode ? '#94A3B8' : '#6B7280',
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                lineHeight: 1.2,
                mb: 0.25,
              }}
            >
              Republic of the Philippines &bull; Department of Agriculture
            </Typography>

            {/* Main Title */}
            <Typography
              sx={{
                color: darkMode ? '#F8FAFC' : '#111827',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                fontSize: { xs: '1.15rem', sm: '1.35rem', md: '1.5rem' },
                lineHeight: 1.15,
              }}
            >
              FIDA-V Employees Credit Cooperative (FECCO)
            </Typography>

            {/* Subtitle Line */}
            <Typography
              sx={{
                color: '#22C55E',
                fontWeight: 700,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                mt: 0.25,
                display: 'block',
              }}
            >
              Regional Office V (Bicol Region)
            </Typography>

            {/* Title Details & Badges */}
            <Stack direction="row" spacing={1} alignItems="center" mt={0.5} flexWrap="wrap">
              <Typography sx={{ color: darkMode ? '#CBD5E1' : '#4B5563', fontWeight: 600, fontSize: '0.8rem' }}>
                Interactive Loan Calculator
              </Typography>

              <Chip
                icon={<VerifiedIcon sx={{ fontSize: '11px !important', color: darkMode ? '#4ADE80 !important' : '#15803D !important' }} />}
                label="Official Utility"
                size="small"
                sx={{
                  bgcolor: darkMode ? 'rgba(34,197,94,0.15)' : '#F0FDF4',
                  color: darkMode ? '#4ADE80' : '#15803D',
                  border: '1px solid',
                  borderColor: darkMode ? 'rgba(34,197,94,0.3)' : '#BBF7D0',
                  fontWeight: 700,
                  fontSize: '0.62rem',
                  height: 20,
                }}
              />
            </Stack>
          </Box>
        </Box>

        {/* Right Side: Address, Live Status & Dark Mode Toggle */}
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
          {/* Location Box */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.75,
              py: 0.85,
              borderRadius: 2,
              bgcolor: darkMode ? '#0F172A' : '#F9FAFB',
              border: '1px solid',
              borderColor: darkMode ? '#334155' : '#E5E7EB',
            }}
          >
            <LocationOnIcon sx={{ fontSize: 16, color: '#22C55E', flexShrink: 0 }} />
            <Box>
              <Typography sx={{ color: darkMode ? '#F8FAFC' : '#111827', fontWeight: 700, fontSize: '0.72rem', lineHeight: 1.25 }}>
                PhilFIDA Region V Headquarters
              </Typography>
              <Typography sx={{ color: darkMode ? '#94A3B8' : '#6B7280', fontSize: '0.65rem', fontWeight: 500, lineHeight: 1.25 }}>
                Bicol University Compound, Legazpi City, Albay 4500, Philippines
              </Typography>
            </Box>
          </Box>

          {/* Live Status Indicator */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.6,
              px: 1.25,
              py: 0.6,
              borderRadius: 99,
              bgcolor: darkMode ? 'rgba(34,197,94,0.15)' : '#F0FDF4',
              border: '1px solid',
              borderColor: darkMode ? 'rgba(34,197,94,0.3)' : '#BBF7D0',
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: '#22C55E',
                boxShadow: '0 0 0 2px rgba(34,197,94,0.2)',
                animation: 'hdrPulse 2.5s ease-in-out infinite',
                '@keyframes hdrPulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
              }}
            />
            <Typography sx={{ color: darkMode ? '#4ADE80' : '#15803D', fontSize: '0.65rem', fontWeight: 700 }}>
              Live System
            </Typography>
          </Box>

          {/* Dark Mode Toggle Button */}
          <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton
              onClick={onToggleDarkMode}
              sx={{
                bgcolor: darkMode ? '#334155' : '#F3F4F6',
                color: darkMode ? '#FDE047' : '#4B5563',
                border: '1px solid',
                borderColor: darkMode ? '#475569' : '#E5E7EB',
                width: 36,
                height: 36,
                '&:hover': {
                  bgcolor: darkMode ? '#475569' : '#E5E7EB',
                  transform: 'rotate(15deg)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {darkMode ? <LightModeIcon sx={{ fontSize: 18 }} /> : <DarkModeIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );
}
