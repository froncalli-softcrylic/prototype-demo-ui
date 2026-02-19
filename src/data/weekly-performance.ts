export interface WeeklyPerformance {
    weekStart: string;
    officeId: number;
    channel: string;
    spend: number;
    impressions: number;
    clicks: number;
    ctr: number;
    cpc: number;
    conversionsObserved: number;
    conversionsIncremental: number;
    incrementalityRate: number;
    cpaObserved: number;
    cpaIncremental: number;
    newPatientBookings: number;
    attributedRevenue: number;
    capacityUtilization: number;
    seasonalityFactor: number;
}

// Generate ~26 weeks of synthetic weekly data for each office × channel
function generateWeeklyData(): WeeklyPerformance[] {
    const data: WeeklyPerformance[] = [];
    const officeConfigs = [
        { id: 2370, name: 'Dental Care at Gateway Commons', baseSpend: { gs: 6200, meta: 4800, prog: 3300 }, baseCap: 0.75, baseBookings: { gs: 18, meta: 12, prog: 8 } },
        { id: 2371, name: 'Main Street Dentistry', baseSpend: { gs: 4900, meta: 3600, prog: 2700 }, baseCap: 0.65, baseBookings: { gs: 15, meta: 10, prog: 7 } },
        { id: 2372, name: 'St Cloud Dentistry', baseSpend: { gs: 6063, meta: 4915, prog: 2521 }, baseCap: 0.62, baseBookings: { gs: 16, meta: 11, prog: 6 } },
        { id: 2373, name: '1st Advantage Dental - Colonie', baseSpend: { gs: 7100, meta: 4800, prog: 3200 }, baseCap: 0.78, baseBookings: { gs: 20, meta: 13, prog: 9 } },
        { id: 2374, name: '1st Advantage Dental - Bethlehem', baseSpend: { gs: 4700, meta: 3400, prog: 2700 }, baseCap: 0.68, baseBookings: { gs: 14, meta: 9, prog: 6 } },
        { id: 2375, name: '1st Advantage Dental - Clifton Park', baseSpend: { gs: 5800, meta: 4200, prog: 3500 }, baseCap: 0.72, baseBookings: { gs: 17, meta: 11, prog: 8 } },
        { id: 2376, name: "Today's Dentistry of Jacksonville", baseSpend: { gs: 5400, meta: 5200, prog: 3600 }, baseCap: 0.70, baseBookings: { gs: 16, meta: 14, prog: 8 } },
        { id: 2377, name: 'Woodmont Family Dentistry', baseSpend: { gs: 8900, meta: 6200, prog: 4500 }, baseCap: 0.88, baseBookings: { gs: 22, meta: 14, prog: 10 } },
        { id: 2378, name: 'Western NY Dental Group Lancaster', baseSpend: { gs: 7800, meta: 5400, prog: 3600 }, baseCap: 0.82, baseBookings: { gs: 21, meta: 13, prog: 9 } },
        { id: 2379, name: 'Smile Design Dentistry', baseSpend: { gs: 6300, meta: 5800, prog: 3700 }, baseCap: 0.73, baseBookings: { gs: 18, meta: 15, prog: 8 } },
    ];

    const channels = [
        { key: 'Google_Search', spendKey: 'gs' as const, bookingsKey: 'gs' as const },
        { key: 'Meta', spendKey: 'meta' as const, bookingsKey: 'meta' as const },
        { key: 'Google_Programmatic', spendKey: 'prog' as const, bookingsKey: 'prog' as const },
    ];

    // Seeded pseudo-random (deterministic)
    let seed = 42;
    function seededRandom() {
        seed = (seed * 16807 + 0) % 2147483647;
        return (seed - 1) / 2147483646;
    }

    for (const office of officeConfigs) {
        for (let week = 0; week < 26; week++) {
            const weekDate = new Date(2025, 7, 18); // Aug 18, 2025
            weekDate.setDate(weekDate.getDate() + week * 7);
            const weekStr = weekDate.toISOString().split('T')[0];

            // Seasonality: slight bump in Oct-Nov, dip in Dec, recovery in Jan-Feb
            const month = weekDate.getMonth();
            const seasonalFactors: Record<number, number> = { 0: 0.95, 1: 0.98, 2: 1.02, 3: 1.05, 4: 1.03, 5: 0.97, 6: 0.93, 7: 0.95, 8: 1.0, 9: 1.08, 10: 1.10, 11: 0.88 };
            const seasonality = seasonalFactors[month] || 1.0;

            const capVariation = office.baseCap + (seededRandom() - 0.5) * 0.08;
            const capacityUtil = Math.max(0.45, Math.min(0.95, capVariation));

            for (const ch of channels) {
                const baseSpend = office.baseSpend[ch.spendKey];
                const baseBookings = office.baseBookings[ch.bookingsKey];
                const variation = 0.85 + seededRandom() * 0.30; // 0.85 to 1.15
                const spend = Math.round(baseSpend * variation * seasonality);
                const impressions = Math.round(spend * (15 + seededRandom() * 10));
                const ctr = 0.02 + seededRandom() * 0.04;
                const clicks = Math.round(impressions * ctr);
                const cpc = clicks > 0 ? spend / clicks : 0;
                const bookings = Math.max(1, Math.round(baseBookings * variation * seasonality));
                const incrementalityRate = 0.5 + seededRandom() * 0.4;
                const incrBookings = Math.max(1, Math.round(bookings * incrementalityRate));
                const cpaObs = bookings > 0 ? spend / bookings : 0;
                const cpaIncr = incrBookings > 0 ? spend / incrBookings : 0;
                const revenue = bookings * (800 + seededRandom() * 400);

                data.push({
                    weekStart: weekStr,
                    officeId: office.id,
                    channel: ch.key,
                    spend: Math.round(spend),
                    impressions,
                    clicks,
                    ctr: Math.round(ctr * 10000) / 10000,
                    cpc: Math.round(cpc * 100) / 100,
                    conversionsObserved: bookings,
                    conversionsIncremental: incrBookings,
                    incrementalityRate: Math.round(incrementalityRate * 100) / 100,
                    cpaObserved: Math.round(cpaObs * 100) / 100,
                    cpaIncremental: Math.round(cpaIncr * 100) / 100,
                    newPatientBookings: bookings,
                    attributedRevenue: Math.round(revenue),
                    capacityUtilization: Math.round(capacityUtil * 100) / 100,
                    seasonalityFactor: seasonality,
                });
            }
        }
    }

    return data;
}

export const weeklyPerformanceData = generateWeeklyData();

export function getWeeklyDataForOffice(officeId: number): WeeklyPerformance[] {
    return weeklyPerformanceData.filter(d => d.officeId === officeId);
}

export function getAggregatedWeeklyTrends(officeId?: number): {
    weekStart: string;
    totalSpend: number;
    totalBookings: number;
    avgCPA: number;
    capacityUtil: number;
    googleSpend: number;
    metaSpend: number;
    progSpend: number;
}[] {
    const filtered = officeId
        ? weeklyPerformanceData.filter(d => d.officeId === officeId)
        : weeklyPerformanceData;

    const weekMap = new Map<string, {
        totalSpend: number;
        totalBookings: number;
        capacitySum: number;
        capacityCount: number;
        googleSpend: number;
        metaSpend: number;
        progSpend: number;
    }>();

    for (const d of filtered) {
        const existing = weekMap.get(d.weekStart) || {
            totalSpend: 0, totalBookings: 0, capacitySum: 0, capacityCount: 0,
            googleSpend: 0, metaSpend: 0, progSpend: 0,
        };
        existing.totalSpend += d.spend;
        existing.totalBookings += d.newPatientBookings;
        existing.capacitySum += d.capacityUtilization;
        existing.capacityCount += 1;
        if (d.channel === 'Google_Search') existing.googleSpend += d.spend;
        else if (d.channel === 'Meta') existing.metaSpend += d.spend;
        else existing.progSpend += d.spend;
        weekMap.set(d.weekStart, existing);
    }

    return Array.from(weekMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([weekStart, v]) => ({
            weekStart,
            totalSpend: v.totalSpend,
            totalBookings: v.totalBookings,
            avgCPA: v.totalBookings > 0 ? Math.round((v.totalSpend / v.totalBookings) * 100) / 100 : 0,
            capacityUtil: v.capacityCount > 0 ? Math.round((v.capacitySum / v.capacityCount) * 100) / 100 : 0,
            googleSpend: v.googleSpend,
            metaSpend: v.metaSpend,
            progSpend: v.progSpend,
        }));
}
