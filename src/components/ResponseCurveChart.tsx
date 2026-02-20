'use client';

import { useMemo, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    ReferenceLine, ReferenceDot, Area, Legend, ComposedChart, Label,
} from 'recharts';
import { Info } from 'lucide-react';
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

const CustomDot = (props: any) => {
    const { cx, cy, fill, stroke, strokeWidth, r, desc } = props;
    if (cx == null || cy == null) return null;
    return (
        <g style={{ pointerEvents: 'auto' }}>
            <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={strokeWidth} style={{ outline: 'none', cursor: 'pointer' }} />
            <title>{desc}</title>
        </g>
    );
};

const LegendTooltip = ({ text, dotClass, description }: { text: string; dotClass: string; description: string }) => {
    const [show, setShow] = useState(false);
    return (
        <span
            className="spend-legend-item"
            style={{ cursor: 'help', position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            <span className={`spend-legend-dot ${dotClass}`} />
            {text}
            <Info size={14} style={{ opacity: 0.6, marginLeft: 2 }} />
            {show && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-gray)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    fontSize: 12,
                    lineHeight: 1.5,
                    color: 'var(--charcoal)',
                    width: 280,
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 9999,
                    pointerEvents: 'none',
                    whiteSpace: 'normal',
                    animation: 'fadeIn 0.15s ease-out',
                }}>
                    <div style={{
                        position: 'absolute',
                        top: -6,
                        left: '50%',
                        transform: 'translateX(-50%) rotate(45deg)',
                        width: 10,
                        height: 10,
                        background: 'var(--bg-surface)',
                        borderLeft: '1px solid var(--border-gray)',
                        borderTop: '1px solid var(--border-gray)',
                    }} />
                    {description}
                </div>
            )}
        </span>
    );
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
    const { chartData, spendTicks } = useMemo(() => {
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
        // Generate tick marks at every $1K
        const ticks: number[] = [];
        for (let v = 0; v <= maxSpend; v += 1000) {
            ticks.push(v);
        }
        return { chartData: data, spendTicks: ticks };
    }, [curves]);

    const maxBookings = Math.max(...curves.map(c => c.K)) * 1.05;

    const formatSpend = (val: number) => {
        if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
        return `$${val}`;
    };

    const formatSpendFull = (val: number) => {
        return `$${val.toLocaleString()}`;
    };

    const activeCurves = curves.filter(c => activeChannels.has(c.channel));

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
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-gray)" />
                    <XAxis
                        dataKey="spend"
                        type="number"
                        domain={[0, 'dataMax']}
                        ticks={spendTicks}
                        tickFormatter={formatSpend}
                        tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--medium-gray)' }}
                        axisLine={{ stroke: 'var(--border-gray)' }}
                    />
                    <YAxis
                        domain={[0, maxBookings]}
                        tick={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--medium-gray)' }}
                        axisLine={{ stroke: 'var(--border-gray)' }}
                        label={{ value: 'Incremental Bookings', angle: -90, position: 'insideLeft', style: { fontSize: 9, fill: 'var(--medium-gray)' } }}
                    />

                    <Tooltip
                        contentStyle={{
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-gray)',
                            borderRadius: 8,
                            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 11,
                        }}
                        itemStyle={{ color: 'var(--charcoal)' }}
                        labelStyle={{ color: 'var(--charcoal)' }}
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
                                tooltipType="none"
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

                    {/* Current spend vertical reference lines */}
                    {curves.map(c => {
                        if (!activeChannels.has(c.channel)) return null;
                        const cfg = channelConfig[c.channel];
                        return (
                            <ReferenceLine
                                key={`cur-line-${c.channel}`}
                                x={c.currentSpend}
                                stroke={cfg.color}
                                strokeDasharray="4 4"
                                strokeOpacity={0.5}
                                strokeWidth={1}
                            />
                        );
                    })}

                    {/* Optimal spend vertical reference lines */}
                    {curves.map(c => {
                        if (!activeChannels.has(c.channel)) return null;
                        return (
                            <ReferenceLine
                                key={`opt-line-${c.channel}`}
                                x={c.optimalSpend}
                                stroke="#10B981"
                                strokeDasharray="6 3"
                                strokeOpacity={0.4}
                                strokeWidth={1}
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
                                shape={(props: any) => (
                                    <CustomDot
                                        {...props}
                                        fill={cfg.color}
                                        stroke="var(--bg-surface)"
                                        strokeWidth={2.5}
                                        r={7}
                                        desc={`Current Spend for ${cfg.label}: $${c.currentSpend.toLocaleString()}/wk`}
                                    />
                                )}
                            />
                        );
                    })}

                    {/* Optimal spend markers */}
                    {curves.map(c => {
                        if (!activeChannels.has(c.channel)) return null;
                        const cfg = channelConfig[c.channel];
                        const y = hillFunction(c.optimalSpend, c.K, c.beta, c.n);
                        return (
                            <ReferenceDot
                                key={`opt-${c.channel}`}
                                x={c.optimalSpend}
                                y={Number(y.toFixed(2))}
                                shape={(props: any) => (
                                    <CustomDot
                                        {...props}
                                        fill="#10B981"
                                        stroke="var(--bg-surface)"
                                        strokeWidth={2.5}
                                        r={7}
                                        desc={`Recommended Spend for ${cfg.label}: $${c.optimalSpend.toLocaleString()}/wk`}
                                    />
                                )}
                            />
                        );
                    })}
                </ComposedChart>
            </ResponsiveContainer>

            {/* Spend comparison panel */}
            <div className="spend-comparison-panel">
                <div className="spend-comparison-legend">
                    <LegendTooltip text="Recommended Spend" dotClass="spend-legend-recommended" description="The green dots on the response curve show the AI-recommended optimal weekly spend. Shifting budget to this level is projected to maximize incremental bookings." />
                </div>
                <div className="spend-comparison-cards">
                    {activeCurves.map(c => {
                        const cfg = channelConfig[c.channel];
                        const delta = c.optimalSpend - c.currentSpend;
                        const deltaPct = ((delta / c.currentSpend) * 100).toFixed(0);
                        const currentBookings = hillFunction(c.currentSpend, c.K, c.beta, c.n);
                        const optimalBookings = hillFunction(c.optimalSpend, c.K, c.beta, c.n);
                        const bookingsDelta = optimalBookings - currentBookings;
                        return (
                            <div key={c.channel} className="spend-compare-card" style={{ borderLeftColor: cfg.color }}>
                                <div className="spend-compare-channel">{cfg.label}</div>
                                <div className="spend-compare-row">
                                    <div className="spend-compare-col">
                                        <div className="spend-compare-label">Current</div>
                                        <div className="spend-compare-value" style={{ color: cfg.color }}>
                                            {formatSpendFull(c.currentSpend)}<span className="spend-compare-unit">/wk</span>
                                        </div>
                                        <div className="spend-compare-bookings">{currentBookings.toFixed(1)} bookings</div>
                                    </div>
                                    <div className="spend-compare-arrow">
                                        {delta > 0 ? '→' : delta < 0 ? '→' : '='}
                                    </div>
                                    <div className="spend-compare-col">
                                        <div className="spend-compare-label">Recommended</div>
                                        <div className="spend-compare-value" style={{ color: '#10B981' }}>
                                            {formatSpendFull(c.optimalSpend)}<span className="spend-compare-unit">/wk</span>
                                        </div>
                                        <div className="spend-compare-bookings">{optimalBookings.toFixed(1)} bookings</div>
                                    </div>
                                    <div className={`spend-compare-delta ${delta > 0 ? 'positive' : delta < 0 ? 'negative' : 'neutral'}`}>
                                        <span className="spend-delta-amount">
                                            {delta >= 0 ? '+' : ''}{formatSpendFull(delta)}
                                        </span>
                                        <span className="spend-delta-pct">
                                            ({delta >= 0 ? '+' : ''}{deltaPct}%)
                                        </span>
                                        <span className="spend-delta-bookings">
                                            {bookingsDelta >= 0 ? '+' : ''}{bookingsDelta.toFixed(1)} bookings
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
