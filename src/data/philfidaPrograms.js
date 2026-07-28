export const PHILFIDA_LOAN_PRESETS = [
  {
    id: 'regular',
    name: 'Regular Loan',
    amount: 50000,
    monthlyRateDecimal: 0.01, // 1%
    months: 12,
    badge: 'Regular 1.0%',
    color: 'primary'
  },
  {
    id: 'emergency',
    name: 'Emergency Loan',
    amount: 60000,
    monthlyRateDecimal: 0.005, // 0.5%
    months: 12,
    badge: 'Emergency 0.5%',
    color: 'success'
  },
  {
    id: 'provident',
    name: 'Provident Loan',
    amount: 80000,
    monthlyRateDecimal: 0.0075, // 0.75%
    months: 15,
    badge: 'Provident 0.75%',
    color: 'warning'
  },
  {
    id: 'special',
    name: 'Special Loan',
    amount: 70000,
    monthlyRateDecimal: 0.01, // 1%
    months: 24,
    badge: 'Special 1.0%',
    color: 'secondary'
  }
];

export const FIBER_CROP_PRESETS = [
  { id: 'abaca', name: 'Abaca (Musa textilis)', yieldPerHaKg: 1200, averagePricePerKg: 110 },
  { id: 'cotton', name: 'Cotton (Gossypium)', yieldPerHaKg: 1800, averagePricePerKg: 85 },
  { id: 'salago', name: 'Salago Fiber', yieldPerHaKg: 800, averagePricePerKg: 140 },
  { id: 'pina', name: 'Piña (Pineapple Fiber)', yieldPerHaKg: 500, averagePricePerKg: 350 }
];
