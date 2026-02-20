'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { type Recommendation } from '@/data/recommendations';

interface Props {
    recommendation: Recommendation;
}

export default function RecommendationCard({ recommendation: rec }: Props) {
    const { approveRecommendation, rejectRecommendation, modifyRecommendation } = useApp();
    const [modifying, setModifying] = useState(false);
    const [modifiedSpend, setModifiedSpend] = useState(rec.recommendedSpend);

    const isActioned = rec.status !== 'pending';

    const getChannelBadgeClass = (channel: string) => {
        if (channel === 'Google_Search') return 'google';
        if (channel === 'Meta') return 'meta';
        if (channel === 'Google_Programmatic') return 'prog';
        return '';
    };

    const channelLabel = rec.channel === 'Google_Search' ? 'Google Search'
        : rec.channel === 'Meta' ? 'Meta Ads'
            : 'Programmatic';

    const handleModifyConfirm = () => {
        modifyRecommendation(rec.recId, modifiedSpend);
        setModifying(false);
    };

    return (
        <div className={`rec-card ${rec.status}`}>
            {/* Left section: Identity & Channel */}
            <div className="rec-card-hero">
                <div className={`rec-card-channel-badge ${getChannelBadgeClass(rec.channel)}`}>
                    {channelLabel}
                </div>
                <div style={{ marginTop: 12 }}>
                    <div className="rec-card-title">{rec.officeName}</div>
                    <div className="rec-card-subtitle" style={{ margin: 0 }}>ID: {rec.officeId}</div>

                    <div className="rec-card-rationale">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        <span>{rec.rationale}</span>
                    </div>
                </div>
            </div>

            {/* Middle section: Budget Flow & Impacts */}
            <div className="rec-card-flow">
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--medium-gray)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Weekly Spend Optimization
                </div>

                <div className="budget-flow">
                    <span className="budget-amount old">${rec.currentSpend.toLocaleString()}</span>
                    <span className="budget-arrow">→</span>
                    <span className="budget-amount">${rec.recommendedSpend.toLocaleString()}</span>
                    <span className={`budget-delta-badge ${rec.delta > 0 ? 'positive' : 'negative'}`}>
                        {rec.delta > 0 ? '+' : ''}{rec.delta < 0 ? '-' : ''}${Math.abs(rec.delta).toLocaleString()}
                    </span>
                </div>

                <div className="rec-impact-pills" style={{ marginTop: 4 }}>
                    <span className={`impact-pill ${rec.projectedBookingsDelta > 0 ? 'success' : 'danger'}`}>
                        {rec.projectedBookingsDelta > 0 ? '+' : ''}{rec.projectedBookingsDelta} bookings
                    </span>
                    <span className={`impact-pill`} style={{ borderColor: 'var(--border-gray)', background: 'var(--bg-app)', color: 'var(--medium-gray)' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        {rec.confidence} Confidence
                    </span>
                </div>
            </div>

            {/* Right section: Actions */}
            <div className="rec-card-actions-area">
                <div className="rec-card-timestamp">
                    {new Date(rec.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {new Date(rec.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </div>

                {isActioned ? (
                    <div className="rec-card-status">
                        {rec.status === 'approved' && <><span style={{ color: 'var(--success)', marginRight: 6 }}>✓</span> Approved</>}
                        {rec.status === 'rejected' && <><span style={{ color: 'var(--danger)', marginRight: 6 }}>✗</span> Rejected</>}
                        {rec.status === 'modified' && <><span style={{ color: 'var(--heartland-blue)', marginRight: 6 }}>✎</span> Modified to ${rec.recommendedSpend.toLocaleString()}</>}
                    </div>
                ) : modifying ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', background: 'var(--light-gray)', padding: 12, borderRadius: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)' }}>$</span>
                            <input
                                type="number"
                                value={modifiedSpend}
                                onChange={e => setModifiedSpend(Number(e.target.value))}
                                style={{
                                    width: 80,
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: 13,
                                    padding: '4px 8px',
                                    border: '1px solid var(--border-gray)',
                                    borderRadius: 'var(--radius-sm)',
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                            <button className="btn btn-modify btn-xs" onClick={() => setModifying(false)}>Cancel</button>
                            <button className="btn btn-primary btn-xs" onClick={handleModifyConfirm}>Save</button>
                        </div>
                    </div>
                ) : (
                    <div className="rec-card-actions">
                        <button className="btn btn-approve btn-sm" onClick={() => approveRecommendation(rec.recId)}>
                            Approve
                        </button>
                        <button className="btn btn-reject btn-sm" onClick={() => rejectRecommendation(rec.recId)}>
                            Reject
                        </button>
                        <button className="btn btn-modify btn-sm" onClick={() => setModifying(true)}>
                            Modify
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
