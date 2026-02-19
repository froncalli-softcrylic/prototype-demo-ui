export interface ResponseCurveParams {
    officeId: number;
    channel: 'Google_Search' | 'Meta' | 'Google_Programmatic';
    K: number;       // saturation ceiling (max incremental bookings)
    beta: number;    // half-saturation point ($)
    n: number;       // curve steepness
    maxSpend: number; // x-axis max for chart
    currentSpend: number;
    optimalSpend: number;
}

/** Hill function: y = K * (x^n) / (beta^n + x^n) */
export function hillFunction(x: number, K: number, beta: number, n: number): number {
    if (x <= 0) return 0;
    const xn = Math.pow(x, n);
    const bn = Math.pow(beta, n);
    return K * xn / (bn + xn);
}

/** Marginal CPA = 1 / (dy/dx) where dy/dx = K * n * beta^n * x^(n-1) / (beta^n + x^n)^2 */
export function marginalCPA(x: number, K: number, beta: number, n: number): number {
    if (x <= 0) return 0;
    const xn = Math.pow(x, n);
    const bn = Math.pow(beta, n);
    const dydx = (K * n * bn * Math.pow(x, n - 1)) / Math.pow(bn + xn, 2);
    return dydx > 0 ? 1 / dydx : Infinity;
}

export const responseCurveData: ResponseCurveParams[] = [
    // Dental Care at Gateway Commons (1484) — Scale:0.80, Mature, Medium
    { officeId: 1484, channel: 'Google_Search', K: 38, beta: 5800, n: 1.8, maxSpend: 18000, currentSpend: 6805, optimalSpend: 6200 },
    { officeId: 1484, channel: 'Meta', K: 28, beta: 4800, n: 1.6, maxSpend: 14000, currentSpend: 4741, optimalSpend: 4200 },
    { officeId: 1484, channel: 'Google_Programmatic', K: 22, beta: 3500, n: 1.5, maxSpend: 10000, currentSpend: 2726, optimalSpend: 3000 },

    // Main Street Dentistry (1587) — Scale:0.60, Growing, Small
    { officeId: 1587, channel: 'Google_Search', K: 32, beta: 4800, n: 1.9, maxSpend: 15000, currentSpend: 5913, optimalSpend: 6800 },
    { officeId: 1587, channel: 'Meta', K: 24, beta: 4200, n: 1.5, maxSpend: 12000, currentSpend: 3978, optimalSpend: 3500 },
    { officeId: 1587, channel: 'Google_Programmatic', K: 18, beta: 3000, n: 1.6, maxSpend: 9000, currentSpend: 2381, optimalSpend: 2800 },

    // 1st Advantage Dental - Colonie (1603) — Scale:0.85, Mature, Medium
    { officeId: 1603, channel: 'Google_Search', K: 40, beta: 6000, n: 1.7, maxSpend: 20000, currentSpend: 7200, optimalSpend: 6500 },
    { officeId: 1603, channel: 'Meta', K: 30, beta: 5200, n: 1.5, maxSpend: 15000, currentSpend: 4915, optimalSpend: 4300 },
    { officeId: 1603, channel: 'Google_Programmatic', K: 24, beta: 3800, n: 1.6, maxSpend: 12000, currentSpend: 3000, optimalSpend: 2800 },

    // 1st Advantage Dental - Bethlehem (1605) — Scale:0.65, Growing, Small
    { officeId: 1605, channel: 'Google_Search', K: 30, beta: 4600, n: 1.8, maxSpend: 14000, currentSpend: 5800, optimalSpend: 6400 },
    { officeId: 1605, channel: 'Meta', K: 22, beta: 3900, n: 1.5, maxSpend: 11000, currentSpend: 4211, optimalSpend: 3600 },
    { officeId: 1605, channel: 'Google_Programmatic', K: 18, beta: 2900, n: 1.6, maxSpend: 8000, currentSpend: 3200, optimalSpend: 3400 },

    // 1st Advantage Dental - Clifton Park (1606) — Scale:0.72, Growing, Medium
    { officeId: 1606, channel: 'Google_Search', K: 36, beta: 5400, n: 1.8, maxSpend: 17000, currentSpend: 6500, optimalSpend: 7000 },
    { officeId: 1606, channel: 'Meta', K: 26, beta: 4600, n: 1.6, maxSpend: 13000, currentSpend: 4790, optimalSpend: 4200 },
    { officeId: 1606, channel: 'Google_Programmatic', K: 20, beta: 3300, n: 1.5, maxSpend: 10000, currentSpend: 3200, optimalSpend: 3500 },

    // Today's Dentistry of Jacksonville (1902) — Scale:0.75, Growing, Medium
    { officeId: 1902, channel: 'Google_Search', K: 34, beta: 5100, n: 1.7, maxSpend: 16000, currentSpend: 6800, optimalSpend: 6200 },
    { officeId: 1902, channel: 'Meta', K: 30, beta: 5000, n: 1.8, maxSpend: 15000, currentSpend: 5001, optimalSpend: 5200 },
    { officeId: 1902, channel: 'Google_Programmatic', K: 22, beta: 3400, n: 1.5, maxSpend: 10000, currentSpend: 3500, optimalSpend: 3300 },

    // St Cloud Dentistry (2372) — Scale:0.55, New, Small
    { officeId: 2372, channel: 'Google_Search', K: 35, beta: 5200, n: 2.0, maxSpend: 16000, currentSpend: 6064, optimalSpend: 8200 },
    { officeId: 2372, channel: 'Meta', K: 26, beta: 4500, n: 1.7, maxSpend: 13000, currentSpend: 4915, optimalSpend: 3100 },
    { officeId: 2372, channel: 'Google_Programmatic', K: 20, beta: 3200, n: 1.5, maxSpend: 10000, currentSpend: 2521, optimalSpend: 2900 },

    // Woodmont Family Dentistry (8329) — Scale:1.10, Mature, Large
    { officeId: 8329, channel: 'Google_Search', K: 45, beta: 7000, n: 1.6, maxSpend: 25000, currentSpend: 8800, optimalSpend: 7200 },
    { officeId: 8329, channel: 'Meta', K: 34, beta: 6000, n: 1.5, maxSpend: 18000, currentSpend: 6314, optimalSpend: 4800 },
    { officeId: 8329, channel: 'Google_Programmatic', K: 26, beta: 4200, n: 1.4, maxSpend: 14000, currentSpend: 4500, optimalSpend: 3600 },

    // Western New York Dental Group Lancaster (8375) — Scale:0.90, Mature, Medium
    { officeId: 8375, channel: 'Google_Search', K: 42, beta: 6500, n: 1.7, maxSpend: 22000, currentSpend: 7400, optimalSpend: 6800 },
    { officeId: 8375, channel: 'Meta', K: 32, beta: 5500, n: 1.5, maxSpend: 16000, currentSpend: 5279, optimalSpend: 4400 },
    { officeId: 8375, channel: 'Google_Programmatic', K: 24, beta: 3800, n: 1.5, maxSpend: 12000, currentSpend: 3300, optimalSpend: 3000 },
];

export function getResponseCurvesForOffice(officeId: number): ResponseCurveParams[] {
    return responseCurveData.filter(rc => rc.officeId === officeId);
}

export function generateCurvePoints(params: ResponseCurveParams, steps: number = 100): { spend: number; bookings: number }[] {
    const points: { spend: number; bookings: number }[] = [];
    for (let i = 0; i <= steps; i++) {
        const spend = (params.maxSpend / steps) * i;
        const bookings = hillFunction(spend, params.K, params.beta, params.n);
        points.push({ spend, bookings });
    }
    return points;
}
