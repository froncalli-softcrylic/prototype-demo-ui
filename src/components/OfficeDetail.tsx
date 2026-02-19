'use client';

import { useApp } from '@/context/AppContext';
import { getInvestmentStatus } from '@/data/offices';
import { getResponseCurvesForOffice } from '@/data/response-curves';
import ResponseCurveChart from './ResponseCurveChart';
import RecommendationCard from './RecommendationCard';

const channelConfig: Record<string, { color: string; label: string }> = {
    Google_Search: { color: '#0074B0', label: 'GOOGLE SEARCH' },
    Meta: { color: '#9B51E0', label: 'META' },
    Google_Programmatic: { color: '#00D084', label: 'PROGRAMMATIC' },
};

function formatDollar(val: number): string {
    return `$${val.toLocaleString()}`;
}

export default function OfficeDetail() {
    const { selectedOffice, selectOffice, getOfficeRecommendations } = useApp();

    if (!selectedOffice) return null;

    const status = getInvestmentStatus(selectedOffice);
    const curves = getResponseCurvesForOffice(selectedOffice.officeId);
    const recs = getOfficeRecommendations(selectedOffice.officeId);
    const capPct = Math.round(selectedOffice.capacityUtilBaseline * 100);
    const capClass = capPct >= 80 ? 'high' : capPct >= 67 ? 'medium' : 'low';

    return (
        <div>
            {/* Header */}
            <div className="detail-header">
                <button className="detail-back" onClick={() => selectOffice(null)}>
                    ← Back to All Offices
                </button>
                <div className="detail-title-row">
                    <div className="detail-title">{selectedOffice.officeName}</div>
                    <span className={`status-pill ${status}`} style={{ fontSize: 12 }}>
                        {status === 'over-invested' ? 'Over-Invested' : status === 'under-invested' ? 'Under-Invested' : 'Optimal'}
                    </span>
                </div>
                <div className="detail-meta">
                    {selectedOffice.city}, {selectedOffice.state} · {selectedOffice.marketSize} Market · {selectedOffice.maturityStage} Maturity
                </div>
                <div className="detail-stats">
                    <div>
                        <div className="detail-stat-label">Capacity</div>
                        <div className="detail-stat-value" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="detail-capacity-bar">
                                <div className={`detail-capacity-fill capacity-bar-fill ${capClass}`} style={{ width: `${capPct}%` }} />
                            </div>
                            {capPct}%
                        </div>
                    </div>
                    <div>
                        <div className="detail-stat-label">Open Slots (7-Day)</div>
                        <div className="detail-stat-value">{selectedOffice.openSlots7Day}</div>
                    </div>
                    <div>
                        <div className="detail-stat-label">CPA Target</div>
                        <div className="detail-stat-value">${selectedOffice.cpaTarget}</div>
                    </div>
                </div>
            </div>

            {/* Response Curves */}
            <ResponseCurveChart officeId={selectedOffice.officeId} cpaTarget={selectedOffice.cpaTarget} />

            {/* Channel Breakdown */}
            <div className="channel-breakdown">
                {curves.map(c => {
                    const cfg = channelConfig[c.channel];
                    const delta = c.optimalSpend - c.currentSpend;
                    const incrKey = c.channel === 'Google_Search' ? 'googleSearchIncr'
                        : c.channel === 'Meta' ? 'metaIncr' : 'programmaticIncr';
                    const incrRate = selectedOffice[incrKey as keyof typeof selectedOffice] as number;
                    const incrPct = Math.round(incrRate * 100);
                    const incrLabel = incrPct >= 75 ? 'High' : incrPct >= 60 ? 'Mid' : 'Low';
                    const incrClass = incrPct >= 75 ? 'high' : incrPct >= 60 ? 'mid' : 'low';

                    return (
                        <div key={c.channel} className="channel-breakdown-row">
                            <div className="channel-breakdown-header">
                                <span className="channel-dot" style={{ background: cfg.color, width: 8, height: 8 }} />
                                <span className="channel-breakdown-name" style={{ color: cfg.color }}>{cfg.label}</span>
                            </div>
                            <div className="channel-breakdown-values">
                                <div className="channel-breakdown-item">
                                    <div className="channel-breakdown-item-label">Current</div>
                                    <div className="channel-breakdown-item-value">{formatDollar(c.currentSpend)}/wk</div>
                                </div>
                                <span style={{ color: 'var(--medium-gray)', fontSize: 16 }}>→</span>
                                <div className="channel-breakdown-item">
                                    <div className="channel-breakdown-item-label">Recommended</div>
                                    <div className="channel-breakdown-item-value" style={{ color: 'var(--success)' }}>
                                        {formatDollar(c.optimalSpend)}/wk
                                    </div>
                                </div>
                                <div className="channel-breakdown-item">
                                    <div className="channel-breakdown-item-label">Delta</div>
                                    <div className="channel-breakdown-item-value" style={{
                                        color: delta > 0 ? 'var(--success)' : delta < 0 ? 'var(--danger)' : 'var(--medium-gray)'
                                    }}>
                                        {delta > 0 ? '↑' : delta < 0 ? '↓' : '–'} {formatDollar(Math.abs(delta))}
                                    </div>
                                </div>
                                <div className="channel-breakdown-item">
                                    <div className="channel-breakdown-item-label">Incrementality</div>
                                    <div className="channel-breakdown-item-value">{incrPct}%</div>
                                </div>
                                <div className="channel-breakdown-item">
                                    <span className={`incrementality-badge ${incrClass}`}>{incrLabel}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Agent Recommendations */}
            {recs.length > 0 && (
                <div>
                    <div className="chart-section-title" style={{ marginBottom: 12 }}>Agent Recommendations</div>
                    {recs.map(r => (
                        <RecommendationCard key={r.recId} recommendation={r} />
                    ))}
                </div>
            )}
        </div>
    );
}
