import { DEFAULT_MULTIPLIER, DEFAULT_REAL_RETURN_ANNUAL } from "@/config/financial";

export interface FreedomMetrics {
    freedomNumber: number;
    percentage: number;
    yearsToFreedom: number;
    monthlyInvestment: number;
}

/**
 * Calculates financial freedom metrics based on user inputs.
 *
 * @param monthlyCost - Monthly lifestyle cost
 * @param currentAssets - Current net worth/invested assets
 * @param monthlyInvestment - Monthly contribution amount
 * @param annualReturnRate - Optional annual return rate (defaults to DEFAULT_REAL_RETURN_ANNUAL)
 * @returns FreedomMetrics object containing target, progress %, estimated years, and the investment used.
 */
export const calculateFreedomMetrics = (
    monthlyCost: number,
    currentAssets: number,
    monthlyInvestment: number,
    annualReturnRate: number = DEFAULT_REAL_RETURN_ANNUAL
): FreedomMetrics => {
    // Ensure non-negative inputs (redundant if Zod is used upstream, but good for pure function safety)
    const safeMonthlyCost = Math.max(0, monthlyCost);
    const safeAssets = Math.max(0, currentAssets);
    const safeInvestment = Math.max(0, monthlyInvestment);

    const freedomNumber = safeMonthlyCost > 0 ? safeMonthlyCost * DEFAULT_MULTIPLIER : 0;
    const percentage = freedomNumber > 0 ? (safeAssets / freedomNumber) * 100 : 0;

    // NPER calculation
    const monthlyRate = annualReturnRate / 12;
    let yearsToFreedom = Infinity;

    if (freedomNumber > 0 && safeInvestment > 0) {
        if (safeAssets >= freedomNumber) {
            yearsToFreedom = 0;
        } else {
            // NPER formula: n = ln((FV*r + PMT) / (PV*r + PMT)) / ln(1 + r)
            const fv = freedomNumber;
            const pv = safeAssets;
            const pmt = safeInvestment;
            const r = monthlyRate;

            const numerator = Math.log((fv * r + pmt) / (pv * r + pmt));
            const denominator = Math.log(1 + r);

            // Prevent log of negative/zero if math breaks (though basic valid inputs shouldn't cause this)
            if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
                yearsToFreedom = Infinity;
            } else {
                const months = numerator / denominator;
                yearsToFreedom = Math.max(0, months / 12);
            }
        }
    } else if (safeAssets >= freedomNumber && freedomNumber > 0) {
        // Case where investment is 0 but we already have the money
        yearsToFreedom = 0;
    }

    return {
        freedomNumber,
        percentage: Math.min(percentage, 100),
        yearsToFreedom,
        monthlyInvestment: safeInvestment,
    };
};
