'use client';

import { useApp } from '@/context/AppContext';
import { type Office, getInvestmentStatus } from '@/data/offices';
import { getResponseCurvesForOffice } from '@/data/response-curves';
import { getAggregatedWeeklyTrends } from '@/data/weekly-performance';
import { MapPin, Activity, ArrowRight, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

function formatDollar(val: number): string {
    if (Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val.toLocaleString()}`;
}

const channelColors: Record<string, string> = {
    Google_Search: 'var(--channel-google)',
    Meta: 'var(--channel-meta)',
    Google_Programmatic: 'var(--channel-programmatic)',
};

const channelLabels: Record<string, string> = {
    Google_Search: 'Google',
    Meta: 'Meta',
    Google_Programmatic: 'Prog.',
};

function OfficeCard({ office }: { office: Office }) {
    const { selectOffice } = useApp();
    const status = getInvestmentStatus(office);
    const curves = getResponseCurvesForOffice(office.officeId);

    const totalCurrent = curves.reduce((s, c) => s + c.currentSpend, 0);
    const totalRecommended = curves.reduce((s, c) => s + c.optimalSpend, 0);
    const totalDelta = totalRecommended - totalCurrent;

    return (
        <div className={`office-card ${status}`} onClick={() => selectOffice(office.officeId)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                    <div className="office-card-name" style={{ fontSize: 20, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <ShieldCheck size={20} color={status === 'optimal' ? 'var(--success)' : status === 'under-invested' ? 'var(--heartland-blue)' : 'var(--warning)'} />
                        {office.officeName}
                    </div>
                    <div className="office-card-meta" style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 0, fontSize: 13, color: 'var(--medium-gray)' }}>
                        <MapPin size={14} />
                        {office.city}, {office.state} · {office.marketSize}
                    </div>
                </div>
            </div>

            {/* Core Metrics: large text to fill space */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                    <div className="sidebar-section-label" style={{ fontSize: 11, marginBottom: 4, color: 'var(--medium-gray)' }}>TOTAL CURRENT</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--charcoal)', letterSpacing: '-0.03em' }}>
                        {formatDollar(totalCurrent)}
                        <span style={{ fontSize: 14, color: 'var(--medium-gray)', fontWeight: 500, marginLeft: 4 }}>/wk</span>
                    </div>
                </div>

                <div>
                    <div className="sidebar-section-label" style={{ fontSize: 11, marginBottom: 4, color: 'var(--medium-gray)' }}>CAPACITY UTIL.</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--charcoal)', letterSpacing: '-0.03em' }}>{Math.round(office.capacityUtilBaseline * 100)}%</div>
                        <div className="capacity-bar" style={{ width: '100%', maxWidth: 70, height: 6 }}>
                            <div
                                className={`capacity-bar-fill ${office.capacityUtilBaseline >= 0.80 ? 'high' : office.capacityUtilBaseline >= 0.67 ? 'medium' : 'low'}`}
                                style={{ width: `${Math.round(office.capacityUtilBaseline * 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Channels */}
            <div style={{ background: 'var(--bg-surface)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--medium-gray)', marginBottom: 8, letterSpacing: '0.04em' }}>SPEND ALLOCATION</div>
                {curves.map(c => {
                    const delta = c.optimalSpend - c.currentSpend;
                    return (
                        <div key={c.channel} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span className="channel-dot" style={{ background: channelColors[c.channel], width: 8, height: 8 }} />
                                <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{channelLabels[c.channel]}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-mono)' }}>
                                <span>{formatDollar(c.currentSpend)}</span>
                                <ArrowRight size={14} color="var(--medium-gray)" />
                                <span style={{ color: delta > 0 ? 'var(--success)' : delta < 0 ? '#b8860b' : 'var(--medium-gray)' }}>
                                    {formatDollar(c.optimalSpend)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Sparkline Chart to fill space and add visual interest */}
            <div style={{ height: 60, width: '100%', marginTop: 'auto', margin: '0 -24px -24px -24px', padding: '0 12px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getAggregatedWeeklyTrends(office.officeId).slice(-12)}>
                        <defs>
                            <linearGradient id={`gradient-${office.officeId}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--heartland-blue)" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="var(--heartland-blue)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="totalSpend"
                            stroke="var(--heartland-blue)"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill={`url(#gradient-${office.officeId})`}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default function OfficeCardGrid() {
    const { filteredOffices } = useApp();

    return (
        <div className="office-grid">
            {filteredOffices.map(office => (
                <OfficeCard key={office.officeId} office={office} />
            ))}
        </div>
    );
}
