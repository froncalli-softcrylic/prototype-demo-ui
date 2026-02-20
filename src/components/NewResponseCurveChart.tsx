'use client';

import { useMemo, useState } from 'react';
import {
    ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Area, Legend,
} from 'recharts';
import { getWeeklyMMMPerformance } from '@/data/weekly-performance-new';

interface Props {
    officeId: number;
    cpaTarget?: number;
}

const channelConfig = {
    googleSearch: { color: '#0074B0', label: 'Google Search' },
    meta: { color: '#9B51E0', label: 'Meta' },
    programmatic: { color: '#00D084', label: 'Programmatic' },
} as const;

type ChannelKey = keyof typeof channelConfig;

// Custom dot renderer for actuals
const ActualDot = ({ cx, cy, fill }: { cx?: number; cy?: number; fill: string }) => {
    if (cx == null || cy == null) return null;
    return <circle cx={cx} cy={cy} r={4} fill={fill} stroke="#fff" strokeWidth={1.5} />;
};

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    // Find the first payload item to extract spendLabel or totalSpend if needed
    const dataRow = payload[0].payload;
    const [dateTxt] = dataRow.tickLabel.split('|');

    return (
        <div style={{
            background: 'var(--bg-surface, #fff)',
            border: '1px solid var(--border-gray, #e5e7eb)',
            borderRadius: 10,
            padding: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 12,
            minWidth: 200,
        }}>
            <div style={{ fontWeight: 600, marginBottom: 16, color: 'var(--charcoal, #111)' }}>
                Week of {dateTxt}
            </div>

            {(Object.keys(channelConfig) as ChannelKey[]).map(chKey => {
                const conf = channelConfig[chKey];
                const predKey = `${chKey}Predicted`;
                const actKey = `${chKey}Actual`;
                const spendKey = `${chKey}Spend`;

                // See if this channel is in payload (i.e. active)
                const hasData = payload.some((p: any) => p.dataKey === predKey || p.dataKey === actKey);
                if (!hasData) return null;

                return (
                    <div key={chKey} style={{ marginBottom: 16 }}>
                        <div style={{ fontWeight: 600, color: conf.color, marginBottom: 4 }}>
                            {conf.label}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '4px 12px', color: '#6b7280' }}>
                            <span>Spend:</span>
                            <span style={{ fontWeight: 600, color: '#111', fontFamily: 'JetBrains Mono, monospace' }}>
                                ${(dataRow[spendKey] || 0).toLocaleString()}
                            </span>

                            <span>Predicted:</span>
                            <span style={{ fontWeight: 600, color: '#111', fontFamily: 'JetBrains Mono, monospace' }}>
                                {(dataRow[predKey] || 0).toLocaleString()}
                            </span>

                            <span>Actual:</span>
                            <span style={{ fontWeight: 600, color: '#111', fontFamily: 'JetBrains Mono, monospace' }}>
                                {(dataRow[actKey] || 0).toLocaleString()}
                            </span>
                        </div>
                    </div>
                );
            })}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--charcoal, #111)', marginTop: 8 }}>
                <span>Total spend:</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>${(dataRow.totalSpend || 0).toLocaleString()}</span>
            </div>
        </div>
    );
};

// Custom multi-line X-Axis tick
const CustomizedAxisTick = (props: any) => {
    const { x, y, payload } = props;
    // We expect payload.value to match the dateLabel
    // Recharts passes the single tick string. If we format it with a newline or just lookup the data array
    // Here we assume getWeeklyMMMPerformance returns `dateLabel` for XAxis, so value == dateLabel.
    // However, if we pass `data` down, we can lookup `spendLabel`.
    // Recharts `XAxis` allows `tickFormatter` or custom components. We passed `tick={...}`
    // But payload is just the string value. We can't access `spendLabel` easily without the full data array.
    // Instead of complex lookups, we will join them with a delimiter in XAxis dataKey, then split here.
    const [dateTxt, spendTxt] = payload.value.split('|');

    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={10} dy={4} textAnchor="middle" fill="#6b7280" fontSize={10} fontFamily="Inter, system-ui, sans-serif">
                {dateTxt}
            </text>
            <text x={0} y={24} dy={4} textAnchor="middle" fill="#9ca3af" fontSize={9} fontFamily="JetBrains Mono, monospace">
                {spendTxt}
            </text>
        </g>
    );
};

// Custom legend
const CustomLegend = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
        marginTop: 16,
        fontSize: 11,
        color: '#6b7280',
        fontFamily: 'Inter, system-ui, sans-serif',
    }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 24, height: 2, background: '#3B82F6', display: 'inline-block', borderRadius: 1 }} />
            Predicted (MMM)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 24, height: 0, borderTop: '2px dashed #9CA3AF', display: 'inline-block' }} />
            Actual Bookings
        </span>
        {Object.entries(channelConfig).map(([key, cfg]) => (
            <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                    width: 8, height: 8, borderRadius: '50%', background: cfg.color,
                    display: 'inline-block'
                }} />
                {cfg.label}
            </span>
        ))}
    </div>
);

export default function ResponseCurveChart({ officeId }: Props) {
    const rawData = useMemo(() => getWeeklyMMMPerformance(officeId), [officeId]);

    // Enhance data with a combined key for the XAxis tick
    const data = useMemo(() => rawData.map(d => ({
        ...d,
        tickLabel: `${d.dateLabel}|${d.spendLabel}`
    })), [rawData]);

    const [activeChannels, setActiveChannels] = useState<Set<ChannelKey>>(
        new Set(['googleSearch', 'meta', 'programmatic'] as ChannelKey[])
    );

    const toggleChannel = (ch: ChannelKey) => {
        setActiveChannels(prev => {
            const next = new Set(prev);
            if (next.has(ch)) {
                if (next.size > 1) next.delete(ch);
            } else {
                next.add(ch);
            }
            return next;
        });
    };

    // Compute max Y for axis domain
    const maxY = useMemo(() => {
        if (!data.length) return 100;
        const allVals = data.flatMap(d => [
            d.googleSearchPredicted, d.googleSearchActual,
            d.metaPredicted, d.metaActual,
            d.programmaticPredicted, d.programmaticActual
        ]);
        return Math.ceil(Math.max(...allVals) * 1.15 / 50) * 50;
    }, [data]);

    if (!data.length) return null;

    return (
        <div className="chart-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                    <div className="chart-section-title" style={{
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontSize: 11,
                        fontWeight: 700,
                    }}>
                        Weekly MMM Performance — Last 8 Weeks
                    </div>
                    <div style={{
                        fontSize: 11,
                        color: '#9ca3af',
                        marginTop: 2,
                        fontStyle: 'italic',
                    }}>
                        Predicted vs actual incremental bookings per channel
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 16 }}>
                    {(Object.entries(channelConfig) as [ChannelKey, typeof channelConfig[ChannelKey]][]).map(([key, cfg]) => {
                        const active = activeChannels.has(key);
                        return (
                            <button
                                key={key}
                                onClick={() => toggleChannel(key)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 5,
                                    padding: '4px 12px',
                                    borderRadius: 16,
                                    border: `1.5px solid ${active ? cfg.color : '#d1d5db'}`,
                                    background: active ? cfg.color : 'transparent',
                                    color: active ? '#fff' : cfg.color,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                    opacity: active ? 1 : 0.5,
                                }}
                            >
                                {cfg.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                    <defs>
                        {(Object.entries(channelConfig) as [ChannelKey, typeof channelConfig[ChannelKey]][]).map(([key, cfg]) => (
                            <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={cfg.color} stopOpacity={0.15} />
                                <stop offset="100%" stopColor={cfg.color} stopOpacity={0.02} />
                            </linearGradient>
                        ))}
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border-gray, #e5e7eb)"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="tickLabel"
                        tick={<CustomizedAxisTick />}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={false}
                        interval={0}
                    />

                    <YAxis
                        domain={[0, maxY]}
                        tick={{ fontSize: 9, fill: '#9ca3af', fontFamily: 'JetBrains Mono, monospace' }}
                        axisLine={false}
                        tickLine={false}
                        label={{
                            value: 'Incremental Bookings',
                            angle: -90,
                            position: 'insideLeft',
                            style: { fontSize: 9, fill: '#9ca3af', fontFamily: 'Inter, system-ui, sans-serif' },
                            offset: 0,
                        }}
                    />

                    <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 1000 }} />

                    {/* Channel Lines */}
                    {(Object.entries(channelConfig) as [ChannelKey, typeof channelConfig[ChannelKey]][]).map(([key, cfg]) => {
                        if (!activeChannels.has(key)) return null;
                        const predKey = `${key}Predicted`;
                        const actKey = `${key}Actual`;

                        return (
                            <g key={key}>
                                {/* Area fill under predicted line */}
                                <Area
                                    type="monotone"
                                    dataKey={predKey}
                                    stroke="none"
                                    fill={`url(#gradient-${key})`}
                                    name={`${cfg.label} Predicted`}
                                />

                                {/* Predicted (MMM) line - solid */}
                                <Line
                                    type="monotone"
                                    dataKey={predKey}
                                    stroke={cfg.color}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 5, fill: cfg.color, stroke: '#fff', strokeWidth: 2 }}
                                    name={`${cfg.label} Predicted`}
                                />

                                {/* Actual Bookings - dashed with dots */}
                                <Line
                                    type="monotone"
                                    dataKey={actKey}
                                    stroke={cfg.color}
                                    strokeWidth={1.5}
                                    strokeDasharray="6 4"
                                    dot={(props: any) => <ActualDot {...props} fill={cfg.color} />}
                                    activeDot={{ r: 6, fill: cfg.color, stroke: '#fff', strokeWidth: 2 }}
                                    name={`${cfg.label} Actual`}
                                />
                            </g>
                        );
                    })}

                    <Legend content={<CustomLegend />} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}

