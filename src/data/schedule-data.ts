export interface ScheduleDayAverage {
    day: string;
    maxSlots: number;
    avgBooked: number;
    avgOpen: number;
}

export interface OfficeScheduleAverage {
    officeId: number;
    averageWeek: ScheduleDayAverage[];
}

export const scheduleAverages: OfficeScheduleAverage[] = [
    {
        "officeId": 1484,
        "averageWeek": [
            {
                "day": "Monday",
                "maxSlots": 27,
                "avgBooked": 8,
                "avgOpen": 19
            },
            {
                "day": "Tuesday",
                "maxSlots": 30,
                "avgBooked": 12,
                "avgOpen": 18
            },
            {
                "day": "Wednesday",
                "maxSlots": 24,
                "avgBooked": 11,
                "avgOpen": 14
            },
            {
                "day": "Thursday",
                "maxSlots": 30,
                "avgBooked": 10,
                "avgOpen": 20
            },
            {
                "day": "Friday",
                "maxSlots": 27,
                "avgBooked": 13,
                "avgOpen": 14
            },
            {
                "day": "Saturday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            },
            {
                "day": "Sunday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            }
        ]
    },
    {
        "officeId": 1587,
        "averageWeek": [
            {
                "day": "Monday",
                "maxSlots": 27,
                "avgBooked": 9,
                "avgOpen": 18
            },
            {
                "day": "Tuesday",
                "maxSlots": 27,
                "avgBooked": 8,
                "avgOpen": 20
            },
            {
                "day": "Wednesday",
                "maxSlots": 27,
                "avgBooked": 10,
                "avgOpen": 17
            },
            {
                "day": "Thursday",
                "maxSlots": 27,
                "avgBooked": 10,
                "avgOpen": 17
            },
            {
                "day": "Friday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            },
            {
                "day": "Saturday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            },
            {
                "day": "Sunday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            }
        ]
    },
    {
        "officeId": 1603,
        "averageWeek": [
            {
                "day": "Monday",
                "maxSlots": 27,
                "avgBooked": 8,
                "avgOpen": 19
            },
            {
                "day": "Tuesday",
                "maxSlots": 27,
                "avgBooked": 10,
                "avgOpen": 17
            },
            {
                "day": "Wednesday",
                "maxSlots": 27,
                "avgBooked": 10,
                "avgOpen": 17
            },
            {
                "day": "Thursday",
                "maxSlots": 27,
                "avgBooked": 9,
                "avgOpen": 18
            },
            {
                "day": "Friday",
                "maxSlots": 24,
                "avgBooked": 8,
                "avgOpen": 17
            },
            {
                "day": "Saturday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            },
            {
                "day": "Sunday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            }
        ]
    },
    {
        "officeId": 1605,
        "averageWeek": [
            {
                "day": "Monday",
                "maxSlots": 24,
                "avgBooked": 7,
                "avgOpen": 18
            },
            {
                "day": "Tuesday",
                "maxSlots": 27,
                "avgBooked": 10,
                "avgOpen": 18
            },
            {
                "day": "Wednesday",
                "maxSlots": 27,
                "avgBooked": 10,
                "avgOpen": 18
            },
            {
                "day": "Thursday",
                "maxSlots": 27,
                "avgBooked": 11,
                "avgOpen": 16
            },
            {
                "day": "Friday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            },
            {
                "day": "Saturday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            },
            {
                "day": "Sunday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            }
        ]
    },
    {
        "officeId": 1606,
        "averageWeek": [
            {
                "day": "Monday",
                "maxSlots": 30,
                "avgBooked": 7,
                "avgOpen": 23
            },
            {
                "day": "Tuesday",
                "maxSlots": 30,
                "avgBooked": 10,
                "avgOpen": 20
            },
            {
                "day": "Wednesday",
                "maxSlots": 30,
                "avgBooked": 8,
                "avgOpen": 22
            },
            {
                "day": "Thursday",
                "maxSlots": 27,
                "avgBooked": 9,
                "avgOpen": 18
            },
            {
                "day": "Friday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            },
            {
                "day": "Saturday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            },
            {
                "day": "Sunday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            }
        ]
    },
    {
        "officeId": 1902,
        "averageWeek": [
            {
                "day": "Monday",
                "maxSlots": 27,
                "avgBooked": 10,
                "avgOpen": 17
            },
            {
                "day": "Tuesday",
                "maxSlots": 28,
                "avgBooked": 8,
                "avgOpen": 20
            },
            {
                "day": "Wednesday",
                "maxSlots": 28,
                "avgBooked": 9,
                "avgOpen": 20
            },
            {
                "day": "Thursday",
                "maxSlots": 28,
                "avgBooked": 11,
                "avgOpen": 18
            },
            {
                "day": "Friday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            },
            {
                "day": "Saturday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            },
            {
                "day": "Sunday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            }
        ]
    },
    {
        "officeId": 2372,
        "averageWeek": [
            {
                "day": "Monday",
                "maxSlots": 27,
                "avgBooked": 8,
                "avgOpen": 19
            },
            {
                "day": "Tuesday",
                "maxSlots": 27,
                "avgBooked": 7,
                "avgOpen": 20
            },
            {
                "day": "Wednesday",
                "maxSlots": 27,
                "avgBooked": 8,
                "avgOpen": 19
            },
            {
                "day": "Thursday",
                "maxSlots": 27,
                "avgBooked": 9,
                "avgOpen": 19
            },
            {
                "day": "Friday",
                "maxSlots": 15,
                "avgBooked": 5,
                "avgOpen": 10
            },
            {
                "day": "Saturday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            },
            {
                "day": "Sunday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            }
        ]
    },
    {
        "officeId": 2445,
        "averageWeek": [
            {
                "day": "Monday",
                "maxSlots": 24,
                "avgBooked": 8,
                "avgOpen": 16
            },
            {
                "day": "Tuesday",
                "maxSlots": 21,
                "avgBooked": 8,
                "avgOpen": 13
            },
            {
                "day": "Wednesday",
                "maxSlots": 27,
                "avgBooked": 10,
                "avgOpen": 17
            },
            {
                "day": "Thursday",
                "maxSlots": 24,
                "avgBooked": 8,
                "avgOpen": 17
            },
            {
                "day": "Friday",
                "maxSlots": 24,
                "avgBooked": 8,
                "avgOpen": 16
            },
            {
                "day": "Saturday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            },
            {
                "day": "Sunday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            }
        ]
    },
    {
        "officeId": 8329,
        "averageWeek": [
            {
                "day": "Monday",
                "maxSlots": 27,
                "avgBooked": 9,
                "avgOpen": 19
            },
            {
                "day": "Tuesday",
                "maxSlots": 24,
                "avgBooked": 9,
                "avgOpen": 15
            },
            {
                "day": "Wednesday",
                "maxSlots": 24,
                "avgBooked": 7,
                "avgOpen": 17
            },
            {
                "day": "Thursday",
                "maxSlots": 24,
                "avgBooked": 9,
                "avgOpen": 15
            },
            {
                "day": "Friday",
                "maxSlots": 12,
                "avgBooked": 5,
                "avgOpen": 7
            },
            {
                "day": "Saturday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            },
            {
                "day": "Sunday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            }
        ]
    },
    {
        "officeId": 8375,
        "averageWeek": [
            {
                "day": "Monday",
                "maxSlots": 21,
                "avgBooked": 8,
                "avgOpen": 13
            },
            {
                "day": "Tuesday",
                "maxSlots": 24,
                "avgBooked": 9,
                "avgOpen": 15
            },
            {
                "day": "Wednesday",
                "maxSlots": 21,
                "avgBooked": 8,
                "avgOpen": 14
            },
            {
                "day": "Thursday",
                "maxSlots": 24,
                "avgBooked": 11,
                "avgOpen": 14
            },
            {
                "day": "Friday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            },
            {
                "day": "Saturday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            },
            {
                "day": "Sunday",
                "maxSlots": 0,
                "avgBooked": 0,
                "avgOpen": 0
            }
        ]
    }
];

export function getWeeklyScheduleAverage(officeId: number): ScheduleDayAverage[] {
    const data = scheduleAverages.find(s => s.officeId === officeId);
    return data ? data.averageWeek : [];
}
