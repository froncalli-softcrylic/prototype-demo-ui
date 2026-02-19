export interface ScheduleSlot {
    officeId: number;
    date: string;
    totalSlots: number;
    bookedSlots: number;
    openSlots: number;
}

export function generateScheduleData(): ScheduleSlot[] {
    const offices = [
        { id: 1484, capacity: 0.75, dailySlots: 11 },  // Gateway Commons — Scale:0.80
        { id: 1587, capacity: 0.65, dailySlots: 11 },  // Main Street — Scale:0.60
        { id: 1603, capacity: 0.78, dailySlots: 10 },  // Colonie — Scale:0.85
        { id: 1605, capacity: 0.68, dailySlots: 11 },  // Bethlehem — Scale:0.65
        { id: 1606, capacity: 0.72, dailySlots: 11 },  // Clifton Park — Scale:0.72
        { id: 1902, capacity: 0.70, dailySlots: 11 },  // Jacksonville — Scale:0.75
        { id: 2372, capacity: 0.62, dailySlots: 13 },  // St Cloud — Scale:0.55
        { id: 8329, capacity: 0.88, dailySlots: 10 },  // Woodmont — Scale:1.10
        { id: 8375, capacity: 0.82, dailySlots: 10 },  // W NY Lancaster — Scale:0.90
    ];

    const data: ScheduleSlot[] = [];
    const startDate = new Date(2026, 1, 18); // Feb 18, 2026

    let seed = 123;
    function seededRandom() {
        seed = (seed * 16807 + 0) % 2147483647;
        return (seed - 1) / 2147483646;
    }

    for (const office of offices) {
        for (let day = 0; day < 7; day++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + day);
            const dateStr = date.toISOString().split('T')[0];

            const totalSlots = office.dailySlots;
            const variation = office.capacity + (seededRandom() - 0.5) * 0.1;
            const effectiveCap = Math.max(0.4, Math.min(0.95, variation));
            const bookedSlots = Math.round(totalSlots * effectiveCap);
            const openSlots = totalSlots - bookedSlots;

            data.push({
                officeId: office.id,
                date: dateStr,
                totalSlots,
                bookedSlots,
                openSlots: Math.max(0, openSlots),
            });
        }
    }

    return data;
}

export const scheduleData = generateScheduleData();

export function getScheduleForOffice(officeId: number): ScheduleSlot[] {
    return scheduleData.filter(s => s.officeId === officeId);
}

export function getOpenSlots7Day(officeId: number): number {
    return getScheduleForOffice(officeId).reduce((sum, s) => sum + s.openSlots, 0);
}
