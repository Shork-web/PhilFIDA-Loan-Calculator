import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Container, Box, Tabs, Tab, Typography } from '@mui/material';
import TableViewIcon from '@mui/icons-material/TableView';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { getTheme } from './theme';

import MuiHeader from './components/MuiHeader';
import MuiLoanForm from './components/MuiLoanForm';
import MuiAmortizationTable from './components/MuiAmortizationTable';
import MuiExtraPaymentSimulator from './components/MuiExtraPaymentSimulator';
import PrintScheduleDocument from './components/PrintScheduleDocument';

import { PHILFIDA_LOAN_PRESETS } from './data/philfidaPrograms';
import { calculateLoanAmortization, downloadAmortizationCSV } from './utils/loanCalculations';

export default function App() {
  const defaultPreset = PHILFIDA_LOAN_PRESETS[0];

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('philfida_dark_mode') === 'true';
  });

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('philfida_dark_mode', String(next));
      return next;
    });
  };

  const activeTheme = getTheme(darkMode ? 'dark' : 'light');

  // Borrower State
  const [borrowerName, setBorrowerName]               = useState('');
  const [borrowerPosition, setBorrowerPosition]       = useState('');
  const [borrowerOffice, setBorrowerOffice]           = useState('');

  // Loan State
  const [loanType, setLoanType]                       = useState(defaultPreset.name);
  const [loanAmount, setLoanAmount]                   = useState(defaultPreset.amount);
  const [interestRateDecimal, setInterestRateDecimal] = useState(defaultPreset.monthlyRateDecimal);
  const [numMonths, setNumMonths]                     = useState(defaultPreset.months);
  const [activeTab, setActiveTab]                     = useState(0);

  // Custom Signatories State
  const [preparedByName, setPreparedByName]   = useState('');
  const [preparedByTitle, setPreparedByTitle] = useState('PhilFIDA Account Officer');
  const [approvedByName, setApprovedByName]   = useState('');
  const [approvedByTitle, setApprovedByTitle] = useState('Regional Director / OIC');

  const calcResult = calculateLoanAmortization({
    loanAmount,
    monthlyInterestRateDecimal: interestRateDecimal,
    numMonths,
  });

  const handlePrint     = () => window.print();
  const handleExportCSV = () =>
    downloadAmortizationCSV({
      schedule: calcResult.schedule,
      borrowerName,
      borrowerPosition,
      borrowerOffice,
      loanType,
      loanAmount,
      monthlyRateDecimal: interestRateDecimal,
      numMonths,
      calcResult,
      preparedByName,
      preparedByTitle,
      approvedByName,
      approvedByTitle,
    });

  const tabs = [
    { label: 'Amortization Schedule', icon: <TableViewIcon sx={{ fontSize: 15 }} /> },
    { label: 'Payoff Simulator',       icon: <AutoAwesomeIcon sx={{ fontSize: 15 }} /> },
  ];

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />

      {/* Official Print Schedule Document (Only visible when printing via @media print) */}
      <PrintScheduleDocument
        borrowerName={borrowerName}
        borrowerPosition={borrowerPosition}
        borrowerOffice={borrowerOffice}
        loanType={loanType}
        loanAmount={loanAmount}
        interestRateDecimal={interestRateDecimal}
        numMonths={numMonths}
        calcResult={calcResult}
        preparedByName={preparedByName}
        preparedByTitle={preparedByTitle}
        approvedByName={approvedByName}
        approvedByTitle={approvedByTitle}
      />

      {/* Screen Web UI (Hidden completely during print via no-print class) */}
      <Box
        className="no-print"
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          backgroundImage: darkMode
            ? [
                'radial-gradient(ellipse at 0% 0%, rgba(34,197,94,0.08) 0%, transparent 45%)',
                'radial-gradient(ellipse at 100% 100%, rgba(59,130,246,0.06) 0%, transparent 45%)',
              ].join(', ')
            : [
                'radial-gradient(ellipse at 0% 0%, rgba(22,163,74,0.05) 0%, transparent 45%)',
                'radial-gradient(ellipse at 100% 100%, rgba(59,130,246,0.04) 0%, transparent 45%)',
              ].join(', '),
          transition: 'background-color 0.25s ease',
        }}
      >
        {/* Page Container */}
        <Container maxWidth="xl" sx={{ py: { xs: 1.5, md: 2 }, px: { xs: 1.5, sm: 2 } }}>

          {/* Header with Dark Mode Toggle */}
          <MuiHeader darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />

          {/* Side-by-side Flex Layout */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            alignItems: 'flex-start',
          }}>

            {/* Left Sidebar — Loan Parameter Form */}
            <Box
              sx={{
                width: { xs: '300px', sm: '320px', md: '340px' },
                flexShrink: 0,
                position: 'sticky',
                top: 16,
              }}
            >
              <MuiLoanForm
                borrowerName={borrowerName}             setBorrowerName={setBorrowerName}
                borrowerPosition={borrowerPosition}     setBorrowerPosition={setBorrowerPosition}
                borrowerOffice={borrowerOffice}         setBorrowerOffice={setBorrowerOffice}
                loanType={loanType}                     setLoanType={setLoanType}
                loanAmount={loanAmount}                 setLoanAmount={setLoanAmount}
                interestRateDecimal={interestRateDecimal}
                setInterestRateDecimal={setInterestRateDecimal}
                numMonths={numMonths}                   setNumMonths={setNumMonths}
                preparedByName={preparedByName}         setPreparedByName={setPreparedByName}
                preparedByTitle={preparedByTitle}       setPreparedByTitle={setPreparedByTitle}
                approvedByName={approvedByName}         setApprovedByName={setApprovedByName}
                approvedByTitle={approvedByTitle}       setApprovedByTitle={setApprovedByTitle}
                calcResult={calcResult}
                onPrint={handlePrint}
                onExportCSV={handleExportCSV}
              />
            </Box>

            {/* Right Side — Amortization Schedule & Simulator */}
            <Box sx={{ flex: 1, minWidth: 0 }}>

              {/* Tab Bar */}
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: darkMode ? '#334155' : '#E5E7EB',
                  mb: 1.5,
                  px: 1,
                  boxShadow: darkMode ? '0 2px 6px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <Tabs
                  value={activeTab}
                  onChange={(_, v) => setActiveTab(v)}
                  textColor="inherit"
                  sx={{ minHeight: 38 }}
                >
                  {tabs.map((tab, idx) => (
                    <Tab
                      key={tab.label}
                      icon={tab.icon}
                      iconPosition="start"
                      label={tab.label}
                      sx={{
                        minHeight: 38,
                        py: 0,
                        px: 1.5,
                        gap: 0.5,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: activeTab === idx ? (darkMode ? '#F8FAFC' : '#111827') : (darkMode ? '#94A3B8' : '#9CA3AF'),
                        letterSpacing: '-0.01em',
                        '&.Mui-selected': { color: darkMode ? '#F8FAFC' : '#111827' },
                      }}
                    />
                  ))}
                </Tabs>
              </Box>

              {/* Panels */}
              <Box>
                {activeTab === 0 && (
                  <MuiAmortizationTable schedule={calcResult.schedule} loanType={loanType} borrowerName={borrowerName} />
                )}
                {activeTab === 1 && (
                  <MuiExtraPaymentSimulator
                    loanAmount={loanAmount}
                    monthlyInterestRateDecimal={interestRateDecimal}
                    numMonths={numMonths}
                  />
                )}
              </Box>
            </Box>

          </Box>

          {/* Footer */}
          <Box
            sx={{
              mt: 3,
              pt: 2,
              borderTop: '1px solid',
              borderColor: darkMode ? '#334155' : '#F3F4F6',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            {['PhilFIDA Interactive Loan Calculator', 'Philippine Fiber Industry Development Authority', 'Department of Agriculture'].map((text, i) => (
              <React.Fragment key={text}>
                {i > 0 && <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: darkMode ? '#475569' : '#E5E7EB' }} />}
                <Typography variant="caption" sx={{ color: darkMode ? '#64748B' : '#D1D5DB', fontWeight: 500, fontSize: '0.68rem' }}>
                  {text}
                </Typography>
              </React.Fragment>
            ))}
          </Box>

        </Container>
      </Box>
    </ThemeProvider>
  );
}
