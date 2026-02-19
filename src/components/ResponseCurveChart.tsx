'use client';

import { useMemo, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    ReferenceLine, ReferenceDot, Area, Legend, ComposedChart,
} from 'recharts';
import { getResponseCurvesForOffice, generateCurvePoints, hillFunction, type ResponseCurveParams } from '@/data/response-curves';

interface Props {
    officeId: number;
    cpaTarget?: number;
}

const channelConfig: Record<string, { color: string; label: string }> = {
    Google_Search: { color: '#0074B0', label: 'Google Search' },
    Meta: { color: '#9B51E0', label: 'Meta' },
    Google_Programmatic: { color: '#00D084', label: 'Programmatic' },
};

export default function ResponseCurveChart({ officeId, cpaTarget }: Props) {
    const curves = getResponseCurvesForOffice(officeId);
    const [activeChannels, setActiveChannels] = useState<Set<string>>(
        new Set(curves.map(c => c.channel))
    );

    const toggleChannel = (ch: string) => {
        setActiveChannels(prev => {
            const next = new Set(prev);
            if (next.has(ch)) {
                if (next.size > 1) next.delete(ch); // keep at least one
            } else {
                next.add(ch);
            }
            return next;
        });
    };

    // Generate merged data points for all channels
    const chartData = useMemo(() => {
        const maxSpend = Math.max(...curves.map(c => c.maxSpend));
        const steps = 150;
        const data: Record<string, number | string>[] = [];
        for (let i = 0; i <= steps; i++) {
            const spend = Math.round((maxSpend / steps) * i);
            const point: Record<string, number | string> = { spend };
            for (const c of curves) {
                point[c.channel] = Number(hillFunction(spend, c.K, c.beta, c.n).toFixed(2));
            }
            data.push(point);
        }
        return data;
    }, [curves]);

    const maxBookings = Math.max(...curves.map(c => c.K)) * 1.05;

    const formatSpend = (val: number) => {
        if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
        return `$${val}`;
    };

    return (
        <div className="chart-section">
            <div className="chart-section-title">MMM Response Curves — Incremental Bookings vs. Weekly Spend</div>

            <div className="channel-toggles">
                {curves.map(c => {
                    const cfg = channelConfig[c.channel];
                    const active = activeChannels.has(c.channel);
                    return (
                        <button
                            key={c.channel}
                            className={`channel-toggle ${active ? 'active' : ''}`}
                            style={{ color: cfg.color, borderColor: active ? cfg.color : undefined }}
                            onClick={() => toggleChannel(c.channel)}
                        >
                            <span className="channel-dot" style={{ background: cfg.color }} />
                            {cfg.label}
                        </button>
                    );
                })}
            </div>

            <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" />
                    <XAxis
                        dataKey="spend"
                        tickFormatter={formatSpend}
                        tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: '#6B7280' }}
                        axisLine={{ stroke: '#D9D9D9' }}
                    />
                    <YAxis
                        domain={[0, maxBookings]}
                        tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: '#6B7280' }}
                        axisLine={{ stroke: '#D9D9D9' }}
                        label={{ value: 'Incremental Bookings', angle: -90, position: 'insideLeft', style: { fontSize: 9, fill: '#6B7280' } }}
                    />

                    <Tooltip
                        contentStyle={{
                            background: '#FFFFFF',
                            border: '1px solid #D9D9D9',
                            borderRadius: 8,
                            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 11,
                        }}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter={(value: any, name: any) => {
                            const cfg = channelConfig[String(name)];
                            return [Number(value).toFixed(1) + ' bookings', cfg?.label || String(name)];
                        }}
                        labelFormatter={(label) => `Spend: ${formatSpend(Number(label))}`}
                    />

                    {curves.map(c => {
                        const cfg = channelConfig[c.channel];
                        if (!activeChannels.has(c.channel)) return null;
                        return (
                            <Area
                                key={`area-${c.channel}`}
                                type="monotone"
                                dataKey={c.channel}
                                stroke="none"
                                fill={cfg.color}
                                fillOpacity={0.06}
                            />
                        );
                    })}

                    {curves.map(c => {
                        const cfg = channelConfig[c.channel];
                        if (!activeChannels.has(c.channel)) return null;
                        return (
                            <Line
                                key={c.channel}
                                type="monotone"
                                dataKey={c.channel}
                                stroke={cfg.color}
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                        );
                    })}

                    {/* Current spend markers */}
                    {curves.map(c => {
                        if (!activeChannels.has(c.channel)) return null;
                        const cfg = channelConfig[c.channel];
                        const y = hillFunction(c.currentSpend, c.K, c.beta, c.n);
                        return (
                            <ReferenceDot
                                key={`cur-${c.channel}`}
                                x={c.currentSpend}
                                y={Number(y.toFixed(2))}
                                r={6}
                                fill={cfg.color}
                                stroke="#FFFFFF"
                                strokeWidth={2}
                            />
                        );
                    })}

                    {/* Optimal spend markers */}
                    {curves.map(c => {
                        if (!activeChannels.has(c.channel)) return null;
                        const y = hillFunction(c.optimalSpend, c.K, c.beta, c.n);
                        return (
                            <ReferenceDot
                                key={`opt-${c.channel}`}
                                x={c.optimalSpend}
                                y={Number(y.toFixed(2))}
                                r={6}
                                fill="#00D084"
                                stroke="#FFFFFF"
                                strokeWidth={2}
                            />
                        );
                    })}
                </ComposedChart>
            </ResponsiveContainer>

            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', fontSize: 10, color: 'var(--medium-gray)', fontFamily: 'var(--font-mono)', marginTop: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--channel-google)', display: 'inline-block', border: '2px solid white', boxShadow: '0 0 0 1px var(--border-gray)' }} />
                    Current Spend
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--success)', display: 'inline-block', border: '2px solid white', boxShadow: '0 0 0 1px var(--border-gray)' }} />
                    Recommended Spend
                </span>
            </div>
        </div>
    );
}
