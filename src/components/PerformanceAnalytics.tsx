'use client';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    ComposedChart, Line, Cell, Legend
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { useMemo, useState, useEffect } from 'react';

const COLORS = {
    Google: '#0074B0',
    Meta: '#9B51E0',
    Programmatic: '#00D084',
};

const formatDollar = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
};
const formatDollarCPA = (val: number) => `$${val.toFixed(0)}`;
const formatNumber = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toString();
};

export default function PerformanceAnalytics() {
    const { selectedOfficeId } = useApp();

    const [rawApiData, setRawApiData] = useState<{ channels: { channel: string, spend: number, bookings: number, conversions: number, cpa: number }[], offices: { officeId: number, name: string, spend: number, bookings: number, avgCapacityUtil: number }[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/performance-kpis');
                const data = await res.json();
                setRawApiData(data);
            } catch (e) {
                console.error('Failed to fetch KPI data:', e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const channelData = useMemo(() => {
        if (!rawApiData) return [];
        // The API returns pre-aggregated data for *all* offices.
        // If an office is selected, we ideally want to fetch data just for that office.
        // For now, since the API parses Section 3 which doesn't easily expose channel data PER office across all rows,
        // we'll use the API for all-offices and just mock/rely on the fact that if an office is selected, you don't even show this chart!
        return rawApiData.channels;
    }, [rawApiData]);

    // Only show office data if looking at "All Markets"
    const displayOfficeCharts = !selectedOfficeId;

    const officeData = useMemo(() => {
        if (!rawApiData) return [];
        return rawApiData.offices;
    }, [rawApiData]);

    const tooltipStyle = {
        contentStyle: {
            background: 'var(--bg-surface, #FFFFFF)',
            border: '1px solid var(--border-gray, #D9D9D9)',
            borderRadius: 8,
            boxShadow: 'var(--shadow-sm, 0 4px 16px rgba(0,0,0,0.12))',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            color: 'var(--charcoal, #111827)'
        },
        itemStyle: {
            color: 'var(--charcoal, #111827)'
        }
    };

    const getCapacityColor = (util: number) => {
        if (util >= 0.85) return '#F59E0B'; // Orange/Yellow
        if (util >= 0.70) return '#00D084'; // Green
        return '#0074B0'; // Blue
    };

    return (
        <div className="analytics-dashboard">
            <div className="analytics-header">
                <h2>Performance Analytics</h2>
                <p>Cross-office performance trends and channel efficiency analysis</p>
            </div>

            {isLoading ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--medium-gray)' }}>Loading analytics data...</div>
            ) : (
                <div className="analytics-grid">

                    {/* 1 & 2. Spend & Bookings by Channel (Composed) */}
                    <div className="chart-section grid-item" style={{ gridColumn: 'span 2' }}>
                        <div className="chart-section-title">Spend & Customer Bookings by Channel</div>
                        <ResponsiveContainer width="100%" height={260}>
                            <ComposedChart data={channelData} margin={{ top: 20, right: 20, bottom: 20, left: 10 }} barSize={50}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-gray, #EEEEEE)" />
                                <XAxis
                                    dataKey="channel"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 13, fill: 'var(--charcoal, #6B7280)' }}
                                />
                                <YAxis
                                    yAxisId="left"
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={formatDollar}
                                    tick={{ fontSize: 11, fill: 'var(--charcoal, #6B7280)' }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={formatNumber}
                                    tick={{ fontSize: 11, fill: 'var(--charcoal, #6B7280)' }}
                                />
                                <Tooltip
                                    {...tooltipStyle}
                                    cursor={{ fill: 'transparent' }}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    formatter={(value: any, name: string | undefined) => {
                                        if (name === "Spend") return [formatDollar(Number(value)), name];
                                        return [formatNumber(Number(value)), name || ''];
                                    }}
                                />
                                <Legend />
                                <Bar yAxisId="left" dataKey="spend" name="Spend" radius={[4, 4, 0, 0]}>
                                    {channelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.channel as keyof typeof COLORS] || '#8884d8'} />
                                    ))}
                                </Bar>
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="bookings"
                                    name="Bookings"
                                    stroke="#F59E0B"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    {/* 3. CPA by Channel (Bar) */}
                    <div className="chart-section grid-item">
                        <div className="chart-section-title">CPA by Channel</div>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={channelData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }} barSize={50}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-gray, #EEEEEE)" />
                                <XAxis
                                    dataKey="channel"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 13, fill: 'var(--charcoal, #6B7280)' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={formatDollarCPA}
                                    tick={{ fontSize: 11, fill: 'var(--charcoal, #6B7280)' }}
                                />
                                <Tooltip
                                    {...tooltipStyle}
                                    cursor={{ fill: 'transparent' }}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    formatter={(value: any) => [formatDollarCPA(Number(value)), 'Avg CPA']}
                                />
                                <Bar dataKey="cpa" radius={[4, 4, 0, 0]}>
                                    {channelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.channel as keyof typeof COLORS] || '#8884d8'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Office Charts - Only show on 'All Markets' */}
                    {displayOfficeCharts && (
                        <>
                            {/* 3. Spend by Office (Horizontal Bar) */}
                            <div className="chart-section grid-item">
                                <div className="chart-section-title">Spend vs. Bookings by Office</div>
                                <ResponsiveContainer width="100%" height={260}>
                                    <ComposedChart data={officeData} margin={{ top: 20, right: 20, bottom: 50, left: 10 }} barSize={30}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-gray, #EEEEEE)" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fill: 'var(--charcoal, #6B7280)' }}
                                            angle={-45}
                                            textAnchor="end"
                                        />
                                        <YAxis
                                            yAxisId="left"
                                            axisLine={false}
                                            tickLine={false}
                                            tickFormatter={formatDollar}
                                            tick={{ fontSize: 10, fill: 'var(--charcoal, #6B7280)' }}
                                        />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                            axisLine={false}
                                            tickLine={false}
                                            tickFormatter={formatNumber}
                                            tick={{ fontSize: 10, fill: 'var(--charcoal, #6B7280)' }}
                                        />
                                        <Tooltip
                                            {...tooltipStyle}
                                            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            formatter={(value: any, name: string | undefined) => {
                                                if (name === "Spend") return [formatDollar(Number(value)), name];
                                                return [formatNumber(Number(value)), name || ''];
                                            }}
                                        />
                                        <Legend verticalAlign="top" height={36} />
                                        <Bar yAxisId="left" dataKey="spend" name="Spend" fill="#0074B0" radius={[4, 4, 0, 0]} />
                                        <Line yAxisId="right" dataKey="bookings" name="Bookings" type="monotone" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>

                            {/* 4. Capacity Utilization by Office */}
                            <div className="chart-section grid-item">
                                <div className="chart-section-title">Capacity Utilization by Office</div>
                                <ResponsiveContainer width="100%" height={260}>
                                    <BarChart data={officeData.map(d => ({ ...d, utilPercent: d.avgCapacityUtil * 100 })).sort((a, b) => b.utilPercent - a.utilPercent)} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 60 }} barSize={12}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-gray, #EEEEEE)" />
                                        <XAxis
                                            type="number"
                                            domain={[0, 100]}
                                            axisLine={false}
                                            tickLine={false}
                                            tickFormatter={(v) => `${v}%`}
                                            tick={{ fontSize: 10, fill: 'var(--charcoal, #6B7280)' }}
                                        />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fill: 'var(--charcoal, #6B7280)' }}
                                            width={110}
                                        />
                                        <Tooltip
                                            {...tooltipStyle}
                                            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'Capacity Utilization']}
                                        />
                                        <Bar dataKey="utilPercent" radius={[0, 4, 4, 0]}>
                                            {officeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={getCapacityColor(entry.avgCapacityUtil)} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    )}

                </div>
            )}
        </div>
    );
}
