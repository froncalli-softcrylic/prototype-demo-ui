'use client';

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, ComposedChart, ReferenceLine, Legend,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { getAggregatedWeeklyTrends } from '@/data/weekly-performance';
import PerformanceAnalytics from './PerformanceAnalytics';
import { useMemo } from 'react';

const formatDollar = (val: number) => `$${(val / 1000).toFixed(0)}K`;
const formatNumber = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return val.toString();
};
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
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-gray)',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
        },
        itemStyle: { color: 'var(--charcoal)' },
        labelStyle: { color: 'var(--charcoal)' }
    };

    return (
        <div>
            {/* Cross-Office Top Analytics */}
            {!selectedOfficeId && (
                <PerformanceAnalytics />
            )}

            {/* Spend + Bookings + CPA over time */}
            <div className="chart-section">
                <div className="chart-section-title">Weekly Spend & Bookings</div>
                <ResponsiveContainer width="100%" height={240}>
                    <ComposedChart data={trends} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-gray)" />
                        <XAxis
                            dataKey="weekStart"
                            tickFormatter={formatDate}
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--medium-gray)' }}
                        />
                        <YAxis
                            yAxisId="spend"
                            tickFormatter={formatDollar}
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--medium-gray)' }}
                            orientation="left"
                        />
                        <YAxis
                            yAxisId="bookings"
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--medium-gray)' }}
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
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-gray)" />
                        <XAxis
                            dataKey="weekStart"
                            tickFormatter={formatDate}
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--medium-gray)' }}
                        />
                        <YAxis
                            tickFormatter={formatDollar}
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--medium-gray)' }}
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
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-gray)" />
                        <XAxis
                            dataKey="weekStart"
                            tickFormatter={formatDate}
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--medium-gray)' }}
                        />
                        <YAxis
                            yAxisId="cpa"
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--medium-gray)' }}
                            tickFormatter={(v: number) => `$${v}`}
                            orientation="left"
                        />
                        <YAxis
                            yAxisId="cap"
                            domain={[0, 1]}
                            tickFormatter={(v: number) => `${Math.round(v * 100)}%`}
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--medium-gray)' }}
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
            {/* Conversions: Observed vs Incremental */}
            <div className="chart-section">
                <div className="chart-section-title">Conversion Incrementality</div>
                <ResponsiveContainer width="100%" height={240}>
                    <ComposedChart data={trends} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-gray)" />
                        <XAxis
                            dataKey="weekStart"
                            tickFormatter={formatDate}
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--medium-gray)' }}
                        />
                        <YAxis
                            tickFormatter={formatNumber}
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--medium-gray)' }}
                        />
                        <Tooltip
                            {...tooltipStyle}
                            formatter={(value: any, name: any) => {
                                const v = Number(value);
                                if (name === 'conversionsObserved') return [v, 'Observed Conversions'];
                                if (name === 'conversionsIncremental') return [v, 'Incremental Conversions'];
                                return [v, name];
                            }}
                            labelFormatter={(label) => `Week of ${String(label)}`}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
                            formatter={(value: string) => value === 'conversionsObserved' ? 'Platform Observed' : 'True Incremental'}
                        />
                        <Area
                            type="monotone"
                            dataKey="conversionsObserved"
                            stroke="#D1D5DB"
                            fill="#E5E7EB"
                            fillOpacity={0.5}
                        />
                        <Area
                            type="monotone"
                            dataKey="conversionsIncremental"
                            stroke="#9B51E0"
                            fill="#9B51E0"
                            fillOpacity={0.4}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Revenue vs Spend */}
            <div className="chart-section">
                <div className="chart-section-title">Revenue vs Media Spend</div>
                <ResponsiveContainer width="100%" height={240}>
                    <ComposedChart data={trends} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-gray)" />
                        <XAxis
                            dataKey="weekStart"
                            tickFormatter={formatDate}
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--medium-gray)' }}
                        />
                        <YAxis
                            yAxisId="rev"
                            tickFormatter={formatDollar}
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--medium-gray)' }}
                            orientation="left"
                        />
                        <YAxis
                            yAxisId="spend"
                            tickFormatter={formatDollar}
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--medium-gray)' }}
                            orientation="right"
                        />
                        <Tooltip
                            {...tooltipStyle}
                            formatter={(value: any, name: any) => {
                                const v = Number(value);
                                if (name === 'totalRevenue') return [formatDollar(v), 'Attributed Revenue'];
                                if (name === 'totalSpend') return [formatDollar(v), 'Total Spend'];
                                return [v, name];
                            }}
                            labelFormatter={(label) => `Week of ${String(label)}`}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
                            formatter={(value: string) => value === 'totalRevenue' ? 'Attributed Revenue' : 'Media Spend'}
                        />
                        <Area
                            yAxisId="rev"
                            type="monotone"
                            dataKey="totalRevenue"
                            stroke="#00D084"
                            fill="#00D084"
                            fillOpacity={0.15}
                        />
                        <Line
                            yAxisId="spend"
                            type="monotone"
                            dataKey="totalSpend"
                            stroke="var(--medium-gray)"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            dot={false}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Top of Funnel: Impressions & Clicks */}
            <div className="chart-section">
                <div className="chart-section-title">Top of Funnel (Impressions & Clicks)</div>
                <ResponsiveContainer width="100%" height={240}>
                    <ComposedChart data={trends} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-gray)" />
                        <XAxis
                            dataKey="weekStart"
                            tickFormatter={formatDate}
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--medium-gray)' }}
                        />
                        <YAxis
                            yAxisId="imp"
                            tickFormatter={formatNumber}
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--medium-gray)' }}
                            orientation="left"
                        />
                        <YAxis
                            yAxisId="clicks"
                            tickFormatter={formatNumber}
                            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--medium-gray)' }}
                            orientation="right"
                        />
                        <Tooltip
                            {...tooltipStyle}
                            formatter={(value: any, name: any) => {
                                const v = Number(value);
                                if (name === 'totalImpressions') return [formatNumber(v), 'Impressions'];
                                if (name === 'totalClicks') return [formatNumber(v), 'Clicks'];
                                return [v, name];
                            }}
                            labelFormatter={(label) => `Week of ${String(label)}`}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
                            formatter={(value: string) => value === 'totalImpressions' ? 'Impressions' : 'Clicks'}
                        />
                        <Line
                            yAxisId="imp"
                            type="monotone"
                            dataKey="totalImpressions"
                            stroke="#0074B0"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            yAxisId="clicks"
                            type="monotone"
                            dataKey="totalClicks"
                            stroke="#F59E0B"
                            strokeWidth={2}
                            dot={false}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
}
