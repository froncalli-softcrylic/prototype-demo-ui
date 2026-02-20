'use client';

import { useApp } from '@/context/AppContext';
import { getWeeklyScheduleAverage, ScheduleDayAverage } from '@/data/schedule-data';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { CalendarClock } from 'lucide-react';

// Custom Tooltip for Stacked Bar Chart
const CustomScheduleTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const booked = payload.find((p: any) => p.dataKey === 'avgBooked')?.value || 0;
        const open = payload.find((p: any) => p.dataKey === 'avgOpen')?.value || 0;
        const total = booked + open;
        const utilPct = total > 0 ? Math.round((booked / total) * 100) : 0;

        return (
            <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-gray)',
                padding: '12px 16px',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-sm)',
                minWidth: '200px'
            }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: 'var(--charcoal)' }}>{label}</div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '2px', background: 'var(--heartland-blue)' }} />
                        Booked Slots:
                    </span>
                    <strong style={{ alignSelf: 'center', margin: 0 }}>{booked}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '2px', background: 'var(--chart-open-fill)' }} />
                        Open Slots:
                    </span>
                    <strong style={{ alignSelf: 'center', margin: 0 }}>{open}</strong>
                </div>

                <div style={{ borderTop: '1px solid var(--border-gray)', paddingTop: 8, marginTop: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: 'var(--medium-gray)' }}>Slot Utilization</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: utilPct >= 80 ? 'var(--success)' : utilPct >= 65 ? 'var(--warning)' : 'var(--heartland-blue)' }}>
                            {utilPct}%
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export default function OfficeSchedule() {
    const { selectedOfficeId } = useApp();

    if (!selectedOfficeId) return null;

    const data = getWeeklyScheduleAverage(selectedOfficeId);

    // Filter out weekend days if they consistently have 0 max slots
    // Some offices might be open on weekends, so only filter if completely null
    const hasWeekendHours = data.some(d => (d.day === 'Saturday' || d.day === 'Sunday') && d.maxSlots > 0);
    const chartData = hasWeekendHours ? data : data.filter(d => d.day !== 'Saturday' && d.day !== 'Sunday');

    // Calculate Weekly Summary Meta
    const totalWeeklySlots = chartData.reduce((s, d) => s + d.maxSlots, 0);
    const totalWeeklyBooked = chartData.reduce((s, d) => s + d.avgBooked, 0);
    const overallUtil = totalWeeklySlots > 0 ? Math.round((totalWeeklyBooked / totalWeeklySlots) * 100) : 0;

    return (
        <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-gray)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--charcoal)', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CalendarClock size={20} color="var(--heartland-blue)" />
                        Schedule & Capacity
                    </h3>
                    <p style={{ color: 'var(--medium-gray)', fontSize: 13, margin: 0, letterSpacing: '0.02em' }}>
                        Typical weekly appointment availability based on 4-week moving average
                    </p>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', gap: 24 }}>
                    <div>
                        <div className="sidebar-section-label" style={{ fontSize: 10, marginBottom: 4, letterSpacing: '0.04em' }}>TOTAL CAP.</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--charcoal)' }}>{totalWeeklySlots} <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--medium-gray)' }}>slots/wk</span></div>
                    </div>
                    <div>
                        <div className="sidebar-section-label" style={{ fontSize: 10, marginBottom: 4, letterSpacing: '0.04em' }}>WEEKLY UTIL.</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: overallUtil >= 80 ? 'var(--success)' : overallUtil >= 65 ? 'var(--warning)' : 'var(--heartland-blue)' }}>{overallUtil}%</div>
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div style={{ height: 320, marginLeft: -20, position: 'relative', marginTop: 16 }}>
                {totalWeeklySlots === 0 ? (
                    <div style={{ position: 'absolute', top: 0, left: 20, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--medium-gray)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                        No schedule data available for this timeline.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 0, left: 10, bottom: 10 }}
                            barSize={32}
                        >
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(val) => val.substring(0, 3)}
                                tick={{ fontSize: 12, fill: 'var(--medium-gray)', fontWeight: 500 }}
                                dy={10}
                                height={50}
                                label={{ value: 'Day of Week', position: 'insideBottom', style: { fontSize: 12, fill: 'var(--medium-gray)', fontWeight: 500 }, offset: -5 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: 'var(--medium-gray)' }}
                                dx={-10}
                                width={60}
                                label={{ value: 'Total Slots', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: 'var(--medium-gray)', fontWeight: 500 }, dx: 15 }}
                            />
                            <Tooltip content={<CustomScheduleTooltip />} cursor={{ fill: 'var(--light-gray)' }} />
                            <Legend
                                verticalAlign="top"
                                align="right"
                                iconType="circle"
                                wrapperStyle={{ fontSize: 12, top: -10 }}
                            />

                            <Bar
                                dataKey="avgBooked"
                                name="Booked Appointments"
                                stackId="a"
                                fill="var(--heartland-blue)"
                                radius={[0, 0, 4, 4]}
                            >
                                <LabelList dataKey="avgBooked" position="center" fill="#FFFFFF" fontSize={11} fontWeight={600} formatter={(val: any) => val > 0 ? val : ''} />
                            </Bar>
                            <Bar
                                dataKey="avgOpen"
                                name="Available Slots"
                                stackId="a"
                                fill="var(--chart-open-fill)"
                                radius={[4, 4, 0, 0]}
                            >
                                <LabelList dataKey="avgOpen" position="top" fill="var(--charcoal)" fontSize={11} fontWeight={600} formatter={(val: any) => val > 0 ? val : ''} offset={5} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
