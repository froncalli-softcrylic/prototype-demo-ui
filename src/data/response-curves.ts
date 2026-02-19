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
    // Dental Care at Gateway Commons (2370)
    { officeId: 2370, channel: 'Google_Search', K: 38, beta: 5500, n: 1.8, maxSpend: 18000, currentSpend: 6200, optimalSpend: 5800 },
    { officeId: 2370, channel: 'Meta', K: 28, beta: 4800, n: 1.6, maxSpend: 14000, currentSpend: 4800, optimalSpend: 4200 },
    { officeId: 2370, channel: 'Google_Programmatic', K: 22, beta: 3500, n: 1.5, maxSpend: 10000, currentSpend: 3300, optimalSpend: 3500 },

    // Main Street Dentistry (2371)
    { officeId: 2371, channel: 'Google_Search', K: 32, beta: 4800, n: 1.9, maxSpend: 15000, currentSpend: 4900, optimalSpend: 5800 },
    { officeId: 2371, channel: 'Meta', K: 24, beta: 4200, n: 1.5, maxSpend: 12000, currentSpend: 3600, optimalSpend: 3200 },
    { officeId: 2371, channel: 'Google_Programmatic', K: 18, beta: 3000, n: 1.6, maxSpend: 9000, currentSpend: 2700, optimalSpend: 3100 },

    // St Cloud Dentistry (2372)
    { officeId: 2372, channel: 'Google_Search', K: 35, beta: 5200, n: 2.0, maxSpend: 16000, currentSpend: 6063, optimalSpend: 8200 },
    { officeId: 2372, channel: 'Meta', K: 26, beta: 4500, n: 1.7, maxSpend: 13000, currentSpend: 4915, optimalSpend: 3100 },
    { officeId: 2372, channel: 'Google_Programmatic', K: 20, beta: 3200, n: 1.5, maxSpend: 10000, currentSpend: 2521, optimalSpend: 2900 },

    // 1st Advantage Dental - Colonie (2373)
    { officeId: 2373, channel: 'Google_Search', K: 40, beta: 6000, n: 1.7, maxSpend: 20000, currentSpend: 7100, optimalSpend: 6200 },
    { officeId: 2373, channel: 'Meta', K: 30, beta: 5200, n: 1.5, maxSpend: 15000, currentSpend: 4800, optimalSpend: 4100 },
    { officeId: 2373, channel: 'Google_Programmatic', K: 24, beta: 3800, n: 1.6, maxSpend: 12000, currentSpend: 3200, optimalSpend: 2800 },

    // 1st Advantage Dental - Bethlehem (2374)
    { officeId: 2374, channel: 'Google_Search', K: 30, beta: 4600, n: 1.8, maxSpend: 14000, currentSpend: 4700, optimalSpend: 5400 },
    { officeId: 2374, channel: 'Meta', K: 22, beta: 3900, n: 1.5, maxSpend: 11000, currentSpend: 3400, optimalSpend: 3000 },
    { officeId: 2374, channel: 'Google_Programmatic', K: 18, beta: 2900, n: 1.6, maxSpend: 8000, currentSpend: 2700, optimalSpend: 3100 },

    // 1st Advantage Dental - Clifton Park (2375)
    { officeId: 2375, channel: 'Google_Search', K: 36, beta: 5400, n: 1.8, maxSpend: 17000, currentSpend: 5800, optimalSpend: 6500 },
    { officeId: 2375, channel: 'Meta', K: 26, beta: 4600, n: 1.6, maxSpend: 13000, currentSpend: 4200, optimalSpend: 3800 },
    { officeId: 2375, channel: 'Google_Programmatic', K: 20, beta: 3300, n: 1.5, maxSpend: 10000, currentSpend: 3500, optimalSpend: 3700 },

    // Today's Dentistry of Jacksonville (2376)
    { officeId: 2376, channel: 'Google_Search', K: 34, beta: 5100, n: 1.7, maxSpend: 16000, currentSpend: 5400, optimalSpend: 6000 },
    { officeId: 2376, channel: 'Meta', K: 30, beta: 5000, n: 1.8, maxSpend: 15000, currentSpend: 5200, optimalSpend: 5500 },
    { officeId: 2376, channel: 'Google_Programmatic', K: 22, beta: 3400, n: 1.5, maxSpend: 10000, currentSpend: 3600, optimalSpend: 3400 },

    // Woodmont Family Dentistry (2377)
    { officeId: 2377, channel: 'Google_Search', K: 45, beta: 7000, n: 1.6, maxSpend: 25000, currentSpend: 8900, optimalSpend: 7200 },
    { officeId: 2377, channel: 'Meta', K: 34, beta: 6000, n: 1.5, maxSpend: 18000, currentSpend: 6200, optimalSpend: 4500 },
    { officeId: 2377, channel: 'Google_Programmatic', K: 26, beta: 4200, n: 1.4, maxSpend: 14000, currentSpend: 4500, optimalSpend: 3600 },

    // Western NY Dental Group Lancaster (2378)
    { officeId: 2378, channel: 'Google_Search', K: 42, beta: 6500, n: 1.7, maxSpend: 22000, currentSpend: 7800, optimalSpend: 6800 },
    { officeId: 2378, channel: 'Meta', K: 32, beta: 5500, n: 1.5, maxSpend: 16000, currentSpend: 5400, optimalSpend: 4200 },
    { officeId: 2378, channel: 'Google_Programmatic', K: 24, beta: 3800, n: 1.5, maxSpend: 12000, currentSpend: 3600, optimalSpend: 3200 },

    // Smile Design Dentistry (2379)
    { officeId: 2379, channel: 'Google_Search', K: 38, beta: 5800, n: 1.8, maxSpend: 19000, currentSpend: 6300, optimalSpend: 6800 },
    { officeId: 2379, channel: 'Meta', K: 32, beta: 5400, n: 1.7, maxSpend: 16000, currentSpend: 5800, optimalSpend: 5400 },
    { officeId: 2379, channel: 'Google_Programmatic', K: 22, beta: 3600, n: 1.5, maxSpend: 11000, currentSpend: 3700, optimalSpend: 3600 },
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
