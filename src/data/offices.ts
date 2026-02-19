export interface Office {
    officeId: number;
    officeName: string;
    city: string;
    state: string;
    marketSize: 'Small' | 'Medium' | 'Large';
    maturityStage: 'New' | 'Growing' | 'Mature';
    capacityUtilBaseline: number;
    avgWeeklySpendTotal: number;
    dominantChannel: string;
    googleSearchIncr: number;
    metaIncr: number;
    programmaticIncr: number;
    cpaTarget: number;
    openSlots7Day: number;
    totalSlots7Day: number;
}

export type InvestmentStatus = 'over-invested' | 'under-invested' | 'optimal';

export function getInvestmentStatus(office: Office): InvestmentStatus {
    if (office.capacityUtilBaseline >= 0.80) return 'over-invested';
    if (office.capacityUtilBaseline <= 0.66) return 'under-invested';
    return 'optimal';
}

export const offices: Office[] = [
    {
        officeId: 1484,
        officeName: 'Dental Care at Gateway Commons',
        city: 'Palmetto',
        state: 'FL',
        marketSize: 'Medium',
        maturityStage: 'Mature',
        capacityUtilBaseline: 0.75,
        avgWeeklySpendTotal: 14271,
        dominantChannel: 'Google_Search',
        googleSearchIncr: 0.82,
        metaIncr: 0.63,
        programmaticIncr: 0.74,
        cpaTarget: 185,
        openSlots7Day: 19,
        totalSlots7Day: 76,
    },
    {
        officeId: 1587,
        officeName: 'Main Street Dentistry',
        city: 'Fishkill',
        state: 'NY',
        marketSize: 'Small',
        maturityStage: 'Growing',
        capacityUtilBaseline: 0.65,
        avgWeeklySpendTotal: 12272,
        dominantChannel: 'Google_Search',
        googleSearchIncr: 0.82,
        metaIncr: 0.63,
        programmaticIncr: 0.74,
        cpaTarget: 205,
        openSlots7Day: 28,
        totalSlots7Day: 80,
    },
    {
        officeId: 1603,
        officeName: '1st Advantage Dental - Colonie',
        city: 'Albany',
        state: 'NY',
        marketSize: 'Medium',
        maturityStage: 'Mature',
        capacityUtilBaseline: 0.78,
        avgWeeklySpendTotal: 15115,
        dominantChannel: 'Google_Search',
        googleSearchIncr: 0.82,
        metaIncr: 0.63,
        programmaticIncr: 0.74,
        cpaTarget: 188,
        openSlots7Day: 15,
        totalSlots7Day: 68,
    },
    {
        officeId: 1605,
        officeName: '1st Advantage Dental - Bethlehem',
        city: 'Delmar',
        state: 'NY',
        marketSize: 'Small',
        maturityStage: 'Growing',
        capacityUtilBaseline: 0.68,
        avgWeeklySpendTotal: 13211,
        dominantChannel: 'Google_Search',
        googleSearchIncr: 0.82,
        metaIncr: 0.63,
        programmaticIncr: 0.74,
        cpaTarget: 200,
        openSlots7Day: 24,
        totalSlots7Day: 75,
    },
    {
        officeId: 1606,
        officeName: '1st Advantage Dental - Clifton Park',
        city: 'Halfmoon',
        state: 'NY',
        marketSize: 'Medium',
        maturityStage: 'Growing',
        capacityUtilBaseline: 0.72,
        avgWeeklySpendTotal: 14490,
        dominantChannel: 'Google_Search',
        googleSearchIncr: 0.82,
        metaIncr: 0.63,
        programmaticIncr: 0.74,
        cpaTarget: 198,
        openSlots7Day: 21,
        totalSlots7Day: 75,
    },
    {
        officeId: 1902,
        officeName: "Today's Dentistry of Jacksonville",
        city: 'Jacksonville',
        state: 'FL',
        marketSize: 'Medium',
        maturityStage: 'Growing',
        capacityUtilBaseline: 0.70,
        avgWeeklySpendTotal: 15301,
        dominantChannel: 'Google_Search',
        googleSearchIncr: 0.82,
        metaIncr: 0.63,
        programmaticIncr: 0.74,
        cpaTarget: 195,
        openSlots7Day: 23,
        totalSlots7Day: 77,
    },
    {
        officeId: 2372,
        officeName: 'St Cloud Dentistry',
        city: 'Saint Cloud',
        state: 'FL',
        marketSize: 'Small',
        maturityStage: 'New',
        capacityUtilBaseline: 0.62,
        avgWeeklySpendTotal: 14906,
        dominantChannel: 'Google_Search',
        googleSearchIncr: 0.82,
        metaIncr: 0.63,
        programmaticIncr: 0.74,
        cpaTarget: 210,
        openSlots7Day: 34,
        totalSlots7Day: 89,
    },
    {
        officeId: 8329,
        officeName: 'Woodmont Family Dentistry',
        city: 'Tamarac',
        state: 'FL',
        marketSize: 'Large',
        maturityStage: 'Mature',
        capacityUtilBaseline: 0.88,
        avgWeeklySpendTotal: 19614,
        dominantChannel: 'Google_Search',
        googleSearchIncr: 0.82,
        metaIncr: 0.63,
        programmaticIncr: 0.74,
        cpaTarget: 175,
        openSlots7Day: 8,
        totalSlots7Day: 67,
    },
    {
        officeId: 8375,
        officeName: 'Western New York Dental Group Lancaster',
        city: 'Depew',
        state: 'NY',
        marketSize: 'Medium',
        maturityStage: 'Mature',
        capacityUtilBaseline: 0.82,
        avgWeeklySpendTotal: 15979,
        dominantChannel: 'Google_Search',
        googleSearchIncr: 0.82,
        metaIncr: 0.63,
        programmaticIncr: 0.74,
        cpaTarget: 180,
        openSlots7Day: 12,
        totalSlots7Day: 67,
    },
];
