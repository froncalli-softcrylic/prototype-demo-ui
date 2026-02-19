'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { type Recommendation } from '@/data/recommendations';

interface Props {
    recommendation: Recommendation;
}

export default function RecommendationCard({ recommendation: rec }: Props) {
    const { approveRecommendation, rejectRecommendation, modifyRecommendation } = useApp();
    const [expanded, setExpanded] = useState(false);
    const [modifying, setModifying] = useState(false);
    const [modifiedSpend, setModifiedSpend] = useState(rec.recommendedSpend);

    const confidencePct = rec.confidence === 'High' ? 85 : rec.confidence === 'Medium' ? 60 : 35;
    const isActioned = rec.status !== 'pending';

    const handleModifyConfirm = () => {
        modifyRecommendation(rec.recId, modifiedSpend);
        setModifying(false);
    };

    return (
        <div className={`rec-card ${rec.status}`}>
            <div className="rec-card-header">
                <div className="rec-card-title">
                    <span>🤖</span>
                    <span>AGENT RECOMMENDATION</span>
                </div>
                <div className="rec-card-timestamp">
                    {new Date(rec.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' · '}
                    {new Date(rec.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </div>
            </div>

            <div className="rec-card-body">
                {rec.rationale}
                {rec.projectedBookingsDelta !== 0 && (
                    <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                        <strong>Projected impact:</strong>{' '}
                        <span className={rec.projectedBookingsDelta > 0 ? 'text-success' : 'text-danger'}>
                            {rec.projectedBookingsDelta > 0 ? '+' : ''}{rec.projectedBookingsDelta} bookings/week
                        </span>
                    </div>
                )}
            </div>

            <div className="rec-card-confidence">
                <span>Confidence:</span>
                <div className="confidence-bar">
                    <div className="confidence-bar-fill" style={{ width: `${confidencePct}%` }} />
                </div>
                <span style={{ fontWeight: 700 }}>{rec.confidence}</span>
            </div>

            <button className="rec-card-expand" onClick={() => setExpanded(!expanded)}>
                {expanded ? '▼' : '▶'} Why this recommendation?
            </button>

            {expanded && (
                <div className="rec-card-reasoning">
                    <strong>Data inputs:</strong> Office capacity ({rec.officeName}), response curve position ({rec.channel}), scheduling data (7-day open slots), incrementality rate.<br /><br />
                    <strong>Rule triggered:</strong> {rec.action === 'increase' ? 'Capacity + Schedule — under-utilized office with open slots' : 'CPA Optimization — past diminishing returns threshold on response curve'}<br /><br />
                    <strong>Current spend position:</strong> {rec.action === 'increase' ? 'Below optimal on response curve — efficient marginal CPA' : 'Past half-saturation point — diminishing returns detected'}
                </div>
            )}

            {modifying && (
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                    <span>Modified spend:</span>
                    <span>$</span>
                    <input
                        type="number"
                        value={modifiedSpend}
                        onChange={e => setModifiedSpend(Number(e.target.value))}
                        style={{
                            width: 100,
                            fontFamily: 'var(--font-mono)',
                            fontSize: 13,
                            padding: '4px 8px',
                            border: '1px solid var(--border-gray)',
                            borderRadius: 'var(--radius-sm)',
                        }}
                    />
                    <span>/wk</span>
                    <button className="btn btn-primary btn-sm" onClick={handleModifyConfirm}>Confirm</button>
                    <button className="btn btn-modify btn-sm" onClick={() => setModifying(false)}>Cancel</button>
                </div>
            )}

            <div className="rec-card-actions">
                {isActioned ? (
                    <div className="rec-card-status">
                        {rec.status === 'approved' && <><span style={{ color: 'var(--success)' }}>✓</span> Approved</>}
                        {rec.status === 'rejected' && <><span style={{ color: 'var(--danger)' }}>✗</span> Rejected</>}
                        {rec.status === 'modified' && <><span style={{ color: 'var(--heartland-blue)' }}>✎</span> Modified to ${rec.recommendedSpend.toLocaleString()}/wk</>}
                    </div>
                ) : (
                    <>
                        <button className="btn btn-approve btn-sm" onClick={() => approveRecommendation(rec.recId)}>
                            Approve
                        </button>
                        <button className="btn btn-reject btn-sm" onClick={() => rejectRecommendation(rec.recId)}>
                            Reject
                        </button>
                        <button className="btn btn-modify btn-sm" onClick={() => setModifying(true)}>
                            Modify
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
