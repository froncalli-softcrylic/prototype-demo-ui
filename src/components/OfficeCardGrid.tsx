'use client';

import { useApp } from '@/context/AppContext';
import { type Office, getInvestmentStatus } from '@/data/offices';
import { getResponseCurvesForOffice } from '@/data/response-curves';

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
            <div className="office-card-header">
                <div className="office-card-name">{office.officeName}</div>
                <span className={`status-pill ${status}`}>
                    {status === 'over-invested' ? 'Over-Invested' : status === 'under-invested' ? 'Under-Invested' : 'Optimal'}
                </span>
            </div>
            <div className="office-card-meta">
                {office.city}, {office.state} · {office.marketSize} · {office.maturityStage}
            </div>

            <div className="capacity-bar-container" style={{ marginBottom: 12 }}>
                <span className="sidebar-section-label" style={{ fontSize: 9, marginBottom: 0 }}>CAPACITY</span>
                <div className="capacity-bar" style={{ width: 100 }}>
                    <div
                        className={`capacity-bar-fill ${office.capacityUtilBaseline >= 0.80 ? 'high' : office.capacityUtilBaseline >= 0.67 ? 'medium' : 'low'}`}
                        style={{ width: `${Math.round(office.capacityUtilBaseline * 100)}%` }}
                    />
                </div>
                <span className="font-mono text-xs">{Math.round(office.capacityUtilBaseline * 100)}%</span>
            </div>

            <div className="office-card-channels">
                {curves.map(c => {
                    const delta = c.optimalSpend - c.currentSpend;
                    return (
                        <div key={c.channel} className="channel-row">
                            <span className="channel-dot" style={{ background: channelColors[c.channel] }} />
                            <span className="channel-label">{channelLabels[c.channel]}</span>
                            <span className="font-mono">{formatDollar(c.currentSpend)}/wk</span>
                            <span style={{ color: 'var(--medium-gray)' }}>→</span>
                            <span className="font-mono">{formatDollar(c.optimalSpend)}</span>
                            <span className={`channel-arrow ${delta > 0 ? 'up' : delta < 0 ? 'down' : 'hold'}`}>
                                {delta > 0 ? '↑' : delta < 0 ? '↓' : '–'}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="office-card-total">
                <span>Total: {formatDollar(totalCurrent)} → {formatDollar(totalRecommended)}</span>
                <span className={`delta-badge ${totalDelta > 0 ? 'positive' : totalDelta < 0 ? 'negative' : 'neutral'}`}>
                    {totalDelta >= 0 ? '+' : ''}{formatDollar(totalDelta)}
                </span>
            </div>

            <div style={{ textAlign: 'center', marginTop: 8 }}>
                <button className="btn btn-secondary btn-sm">View Details</button>
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
