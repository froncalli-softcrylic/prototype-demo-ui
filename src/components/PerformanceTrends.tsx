'use client';

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, ComposedChart, ReferenceLine, Legend,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { getAggregatedWeeklyTrends } from '@/data/weekly-performance';
import { useMemo } from 'react';

const formatDollar = (val: number) => `$${(val / 1000).toFixed(0)}K`;
const formatDate = (val: string) => {
    const d = new Date(val);
    return `${d.getMonth() + 1}/${d.getDate()}`;
};

export default function PerformanceTrends() {
    const { selectedOfficeId } = useApp();

    const trends = useMemo(
        () => getAggregatedWeeklyTrends(selectedOfficeId ?? undefined),
        [selectedOfficeId]
    );

    const tooltipStyle = {
        contentStyle: {
            background: '#FFFFFF',
            border: '1px solid #D9D9D9',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
        },
    };

    return (
        <div>
            {/* Spend + Bookings + CPA over time */}
            <div className="chart-section">
                <div className="chart-section-title">Weekly Spend & Bookings</div>
                <ResponsiveContainer width="100%" height={240}>
                    <ComposedChart data={trends} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" />
                        <XAxis
                            dataKey="weekStart"
                            tickFormatter={formatDate}
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: '#6B7280' }}
                        />
                        <YAxis
                            yAxisId="spend"
                            tickFormatter={formatDollar}
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: '#6B7280' }}
                            orientation="left"
                        />
                        <YAxis
                            yAxisId="bookings"
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: '#6B7280' }}
                            orientation="right"
                        />
                        <Tooltip
                            {...tooltipStyle}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            formatter={(value: any, name: any) => {
                                const v = Number(value);
                                if (name === 'totalSpend') return [formatDollar(v), 'Total Spend'];
                                if (name === 'totalBookings') return [v, 'Bookings'];
                                return [v, name];
                            }}
                            labelFormatter={(label) => `Week of ${String(label)}`}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
                            formatter={(value: string) => value === 'totalSpend' ? 'Total Spend' : 'Bookings'}
                        />
                        <Area
                            yAxisId="spend"
                            type="monotone"
                            dataKey="totalSpend"
                            stroke="#0074B0"
                            fill="#0074B0"
                            fillOpacity={0.08}
                            strokeWidth={2}
                        />
                        <Line
                            yAxisId="bookings"
                            type="monotone"
                            dataKey="totalBookings"
                            stroke="#00D084"
                            strokeWidth={2.5}
                            dot={false}
                        />
                        {/* Agent recommendation applied marker */}
                        <ReferenceLine
                            x={trends.length > 18 ? trends[18].weekStart : undefined}
                            yAxisId="spend"
                            stroke="#0074B0"
                            strokeDasharray="5 5"
                            strokeWidth={1.5}
                            label={{ value: 'Agent Applied', position: 'top', style: { fontSize: 9, fill: '#0074B0', fontFamily: 'JetBrains Mono' } }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Channel Mix Area Chart */}
            <div className="chart-section">
                <div className="chart-section-title">Channel Mix Over Time</div>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={trends} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" />
                        <XAxis
                            dataKey="weekStart"
                            tickFormatter={formatDate}
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: '#6B7280' }}
                        />
                        <YAxis
                            tickFormatter={formatDollar}
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: '#6B7280' }}
                        />
                        <Tooltip
                            {...tooltipStyle}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            formatter={(value: any, name: any) => {
                                const labels: Record<string, string> = {
                                    googleSpend: 'Google Search', metaSpend: 'Meta', progSpend: 'Programmatic',
                                };
                                return [formatDollar(Number(value)), labels[String(name)] || String(name)];
                            }}
                            labelFormatter={(label) => `Week of ${String(label)}`}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
                            formatter={(value: string) => {
                                const labels: Record<string, string> = {
                                    googleSpend: 'Google Search', metaSpend: 'Meta', progSpend: 'Programmatic',
                                };
                                return labels[value] || value;
                            }}
                        />
                        <Area type="monotone" dataKey="googleSpend" stackId="1" stroke="#0074B0" fill="#0074B0" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="metaSpend" stackId="1" stroke="#9B51E0" fill="#9B51E0" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="progSpend" stackId="1" stroke="#00D084" fill="#00D084" fillOpacity={0.6} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* CPA + Capacity Overlay */}
            <div className="chart-section">
                <div className="chart-section-title">Avg CPA & Capacity Utilization</div>
                <ResponsiveContainer width="100%" height={200}>
                    <ComposedChart data={trends} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" />
                        <XAxis
                            dataKey="weekStart"
                            tickFormatter={formatDate}
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: '#6B7280' }}
                        />
                        <YAxis
                            yAxisId="cpa"
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: '#6B7280' }}
                            tickFormatter={(v: number) => `$${v}`}
                            orientation="left"
                        />
                        <YAxis
                            yAxisId="cap"
                            domain={[0, 1]}
                            tickFormatter={(v: number) => `${Math.round(v * 100)}%`}
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: '#6B7280' }}
                            orientation="right"
                        />
                        <Tooltip
                            {...tooltipStyle}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            formatter={(value: any, name: any) => {
                                const v = Number(value);
                                if (name === 'avgCPA') return [`$${v.toFixed(2)}`, 'Avg CPA'];
                                if (name === 'capacityUtil') return [`${Math.round(v * 100)}%`, 'Capacity'];
                                return [v, name];
                            }}
                            labelFormatter={(label) => `Week of ${String(label)}`}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
                            formatter={(value: string) => value === 'avgCPA' ? 'Avg CPA' : 'Capacity Utilization'}
                        />
                        <Line
                            yAxisId="cpa"
                            type="monotone"
                            dataKey="avgCPA"
                            stroke="#CF2E2E"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            yAxisId="cap"
                            type="monotone"
                            dataKey="capacityUtil"
                            stroke="#0074B0"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
