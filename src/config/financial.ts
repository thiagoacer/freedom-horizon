/**
 * Global financial constants used for calculations.
 *
 * MULTIPLIER: The "Rule of 25" multiplier.
 * Derived from the inverse of the Safe Withdrawal Rate (SWR).
 * 1 / 0.0333... ≈ 30 (conservative) or 1 / 0.04 = 25 (standard).
 * This codebase uses 300 which implies a monthly calculation context or a specific variation.
 * Wait, in Index.tsx it said "Rule of 25", but current value is 300.
 * Let's respect the existing value: 300.
 * (300 * monthly_cost = 25 * annual_cost).
 */
export const DEFAULT_MULTIPLIER = 300;

/**
 * Real annual return rate scenarios (inflation adjusted).
 */
export const SCENARIO_RATES = {
  pessimista: 0.03,  // 3% - Conservador (Renda Fixa Premium)
  realista: 0.05,    // 5% - Realista (Carteira Balanceada)
  otimista: 0.08,    // 8% - Otimista (Foco em Ações/FIIs)
} as const;

/**
 * Default scenario for calculations
 */
export const DEFAULT_REAL_RETURN_ANNUAL = SCENARIO_RATES.realista;

/**
 * Optimized return rate for acceleration calculations
 */
export const OPTIMIZED_RETURN_ANNUAL = 0.065; // 6.5% - Com estratégia otimizada
