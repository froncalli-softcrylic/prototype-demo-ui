const fs = require('fs');
const readline = require('readline');

async function processCSV() {
    const fileStream = fs.createReadStream('heartland_synthetic_schedule_data.csv');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let isFirst = true;
    const weeklyData = {};

    for await (const line of rl) {
        if (isFirst) {
            isFirst = false;
            continue;
        }

        const cols = line.split(',');
        if (cols.length < 7) continue;

        const officeId = parseInt(cols[0], 10);
        const dayOfWeek = cols[3];
        const maxSlots = parseInt(cols[5], 10);
        const booked = parseInt(cols[6], 10);
        const open = maxSlots - booked;

        if (!weeklyData[officeId]) {
            weeklyData[officeId] = {
                Monday: { slots: [], booked: [], open: [] },
                Tuesday: { slots: [], booked: [], open: [] },
                Wednesday: { slots: [], booked: [], open: [] },
                Thursday: { slots: [], booked: [], open: [] },
                Friday: { slots: [], booked: [], open: [] },
                Saturday: { slots: [], booked: [], open: [] },
                Sunday: { slots: [], booked: [], open: [] },
            };
        }

        if (weeklyData[officeId][dayOfWeek]) {
            weeklyData[officeId][dayOfWeek].slots.push(maxSlots);
            weeklyData[officeId][dayOfWeek].booked.push(booked);
            weeklyData[officeId][dayOfWeek].open.push(open);
        }
    }

    const output = [];

    for (const [officeId, days] of Object.entries(weeklyData)) {
        const dayAverages = [];
        for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']) {
            const data = days[day];
            if (data.slots.length > 0) {
                const avgMaxSlots = Math.round(data.slots.reduce((a, b) => a + b, 0) / data.slots.length);
                const avgBooked = Math.round(data.booked.reduce((a, b) => a + b, 0) / data.booked.length);
                const avgOpen = Math.round(data.open.reduce((a, b) => a + b, 0) / data.open.length);
                dayAverages.push({ day, maxSlots: avgMaxSlots, avgBooked, avgOpen });
            } else {
                dayAverages.push({ day, maxSlots: 0, avgBooked: 0, avgOpen: 0 });
            }
        }
        output.push({ officeId: parseInt(officeId, 10), averageWeek: dayAverages });
    }

    const tsContent = `export interface ScheduleDayAverage {
    day: string;
    maxSlots: number;
    avgBooked: number;
    avgOpen: number;
}

export interface OfficeScheduleAverage {
    officeId: number;
    averageWeek: ScheduleDayAverage[];
}

export const scheduleAverages: OfficeScheduleAverage[] = ${JSON.stringify(output, null, 4)};

export function getWeeklyScheduleAverage(officeId: number): ScheduleDayAverage[] {
    const data = scheduleAverages.find(s => s.officeId === officeId);
    return data ? data.averageWeek : [];
}
`;

    fs.writeFileSync('src/data/schedule-data.ts', tsContent);
    console.log('Successfully generated src/data/schedule-data.ts');
}

processCSV();
