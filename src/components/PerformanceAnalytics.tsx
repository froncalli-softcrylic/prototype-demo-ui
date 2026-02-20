'use client';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { getAggregateChannelAnalytics, getAggregateOfficeAnalytics } from '@/data/weekly-performance';
import { offices } from '@/data/offices';
import { useMemo } from 'react';

const COLORS = {
    Google: '#0074B0',
    Meta: '#9B51E0',
    Programmatic: '#00D084',
};

const formatDollar = (val: number) => `$${(val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val)}`;
const formatDollarCPA = (val: number) => `$${val.toFixed(0)}`;
const formatNumber = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toString();
};

export default function PerformanceAnalytics() {
    const { selectedOfficeId } = useApp();

    const channelData = useMemo(() => getAggregateChannelAnalytics(selectedOfficeId ?? undefined), [selectedOfficeId]);

    // Only show office data if looking at "All Markets"
    const displayOfficeCharts = !selectedOfficeId;

    const officeDataRaw = useMemo(() => getAggregateOfficeAnalytics(), []);
    const officeData = useMemo(() => {
        return officeDataRaw.map(d => {
            const office = offices.find(o => o.officeId === d.officeId);
            const shortName = office ? office.officeName.split(' - ')[0].replace('Dental Care at ', '').replace(' Dentistry', '') : `Office ${d.officeId}`;
            return {
                ...d,
                name: shortName.length > 20 ? shortName.substring(0, 18) + '...' : shortName
            };
        });
    }, [officeDataRaw]);

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

            <div className="analytics-grid">

                {/* 1. Spend by Channel (Donut) */}
                <div className="chart-section grid-item">
                    <div className="chart-section-title">Spend by Channel</div>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={channelData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="spend"
                                nameKey="channel"
                                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                labelLine={true}
                            >
                                {channelData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.channel as keyof typeof COLORS] || '#8884d8'} />
                                ))}
                            </Pie>
                            <Tooltip
                                {...tooltipStyle}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                formatter={(value: any) => [formatDollar(Number(value)), 'Spend']}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* 2. Customer Acquisitions by Channel (Donut) */}
                <div className="chart-section grid-item">
                    <div className="chart-section-title">Customer Acquisitions by Channel</div>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={channelData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="bookings"
                                nameKey="channel"
                                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                labelLine={true}
                            >
                                {channelData.map((entry, index) => (
                                    <Cell key={`cell-acq-${index}`} fill={COLORS[entry.channel as keyof typeof COLORS] || '#8884d8'} />
                                ))}
                            </Pie>
                            <Tooltip
                                {...tooltipStyle}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                formatter={(value: any) => [formatNumber(Number(value)), 'Acquisitions']}
                            />
                        </PieChart>
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
                                <BarChart data={officeData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 60 }} barSize={12}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-gray, #EEEEEE)" />
                                    <XAxis
                                        type="number"
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={formatDollar}
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
                                        formatter={(value: any) => [formatDollar(Number(value)), 'Spend']}
                                    />
                                    <Bar dataKey="spend" fill="#0074B0" radius={[0, 4, 4, 0]} />
                                </BarChart>
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
        </div>
    );
}
