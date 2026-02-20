'use client';

import { useApp } from '@/context/AppContext';
import { getInvestmentStatus } from '@/data/offices';
import { getResponseCurvesForOffice } from '@/data/response-curves';
import ResponseCurveChart from './ResponseCurveChart';
import RecommendationCard from './RecommendationCard';
import OfficeSchedule from './OfficeSchedule'; // Added import for OfficeSchedule

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

            {/* Agent Recommendations */}
            {recs.length > 0 && (
                <div style={{ marginTop: 24, marginBottom: 24 }}>
                    <div className="chart-section-title" style={{ marginBottom: 12 }}>Agent Recommendations</div>
                    {recs.map(r => (
                        <RecommendationCard key={r.recId} recommendation={r} />
                    ))}
                </div>
            )}

            {/* Office Schedule */}
            <div style={{ marginTop: 24 }}>
                <div className="chart-section-title" style={{ marginBottom: 12 }}>Schedule & Capacity</div>
                <OfficeSchedule />
            </div>
        </div>
    );
}
