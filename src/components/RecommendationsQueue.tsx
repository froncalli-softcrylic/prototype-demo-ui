'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';

type SortField = 'officeName' | 'channel' | 'action' | 'currentSpend' | 'recommendedSpend' | 'delta' | 'confidence' | 'status';
type QueueFilter = 'all' | 'pending' | 'approved' | 'rejected';

const channelLabels: Record<string, string> = {
    Google_Search: 'Google Search',
    Meta: 'Meta',
    Google_Programmatic: 'Programmatic',
};

export default function RecommendationsQueue() {
    const { recommendations, approveRecommendation, rejectRecommendation, bulkApprove, bulkReject } = useApp();
    const [sortField, setSortField] = useState<SortField>('officeName');
    const [sortAsc, setSortAsc] = useState(true);
    const [filter, setFilter] = useState<QueueFilter>('all');
    const [showModal, setShowModal] = useState<'approve' | 'reject' | null>(null);

    const filtered = recommendations.filter(r => {
        if (filter === 'all') return true;
        return r.status === filter;
    });

    const sorted = [...filtered].sort((a, b) => {
        let cmp = 0;
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (typeof aVal === 'string' && typeof bVal === 'string') cmp = aVal.localeCompare(bVal);
        else if (typeof aVal === 'number' && typeof bVal === 'number') cmp = aVal - bVal;
        return sortAsc ? cmp : -cmp;
    });

    const handleSort = (field: SortField) => {
        if (sortField === field) setSortAsc(!sortAsc);
        else { setSortField(field); setSortAsc(true); }
    };

    const pendingCount = recommendations.filter(r => r.status === 'pending').length;

    const sortIndicator = (field: SortField) => {
        if (sortField !== field) return '';
        return sortAsc ? ' ↑' : ' ↓';
    };

    return (
        <div>
            <div className="queue-filters">
                {(['all', 'pending', 'approved', 'rejected'] as QueueFilter[]).map(f => (
                    <button
                        key={f}
                        className={`status-filter-chip ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
                <div style={{ flex: 1 }} />
                {pendingCount > 0 && (
                    <>
                        <button className="btn btn-approve btn-xs" onClick={() => setShowModal('approve')}>
                            Approve All Pending ({pendingCount})
                        </button>
                        <button className="btn btn-reject btn-xs" onClick={() => setShowModal('reject')}>
                            Reject All Pending
                        </button>
                    </>
                )}
            </div>

            <table className="queue-table">
                <thead>
                    <tr>
                        <th onClick={() => handleSort('officeName')}>Office{sortIndicator('officeName')}</th>
                        <th onClick={() => handleSort('channel')}>Channel{sortIndicator('channel')}</th>
                        <th onClick={() => handleSort('action')}>Action{sortIndicator('action')}</th>
                        <th onClick={() => handleSort('currentSpend')}>Current{sortIndicator('currentSpend')}</th>
                        <th onClick={() => handleSort('recommendedSpend')}>Recommended{sortIndicator('recommendedSpend')}</th>
                        <th onClick={() => handleSort('delta')}>Delta{sortIndicator('delta')}</th>
                        <th>Impact</th>
                        <th onClick={() => handleSort('confidence')}>Confidence{sortIndicator('confidence')}</th>
                        <th onClick={() => handleSort('status')}>Status{sortIndicator('status')}</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sorted.map(r => (
                        <tr key={r.recId}>
                            <td style={{ fontFamily: 'var(--font-sans)', fontWeight: 600 }}>{r.officeName}</td>
                            <td>{channelLabels[r.channel] || r.channel}</td>
                            <td style={{ textTransform: 'capitalize' }}>{r.action}</td>
                            <td>${r.currentSpend.toLocaleString()}</td>
                            <td>${r.recommendedSpend.toLocaleString()}</td>
                            <td style={{ color: r.delta > 0 ? 'var(--success)' : r.delta < 0 ? 'var(--danger)' : 'var(--medium-gray)' }}>
                                {r.delta > 0 ? '+' : ''}{r.delta < 0 ? '-' : ''}${Math.abs(r.delta).toLocaleString()}
                            </td>
                            <td style={{ color: r.projectedBookingsDelta > 0 ? 'var(--success)' : r.projectedBookingsDelta < 0 ? 'var(--danger)' : 'var(--medium-gray)' }}>
                                {r.projectedBookingsDelta > 0 ? '+' : ''}{r.projectedBookingsDelta} bookings
                            </td>
                            <td>
                                <span className={`incrementality-badge ${r.confidence === 'High' ? 'high' : r.confidence === 'Medium' ? 'mid' : 'low'}`}>
                                    {r.confidence}
                                </span>
                            </td>
                            <td>
                                <span className={`queue-status-pill ${r.status}`}>
                                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                                </span>
                            </td>
                            <td>
                                {r.status === 'pending' ? (
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        <button className="btn btn-approve btn-xs" onClick={() => approveRecommendation(r.recId)}>✓</button>
                                        <button className="btn btn-reject btn-xs" onClick={() => rejectRecommendation(r.recId)}>✗</button>
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray">—</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {sorted.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--medium-gray)' }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>All caught up</div>
                    <div style={{ fontSize: 12 }}>No {filter === 'all' ? '' : filter + ' '}recommendations to display.</div>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-title">
                            {showModal === 'approve' ? 'Approve All Pending?' : 'Reject All Pending?'}
                        </div>
                        <div className="modal-body">
                            {showModal === 'approve'
                                ? `This will approve ${pendingCount} pending recommendation(s). Dashboard will update to reflect new allocations.`
                                : `This will reject ${pendingCount} pending recommendation(s). Current spend allocations will remain unchanged.`
                            }
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-modify btn-sm" onClick={() => setShowModal(null)}>Cancel</button>
                            <button
                                className={`btn ${showModal === 'approve' ? 'btn-approve' : 'btn-reject'} btn-sm`}
                                onClick={() => {
                                    if (showModal === 'approve') bulkApprove();
                                    else bulkReject();
                                    setShowModal(null);
                                }}
                            >
                                {showModal === 'approve' ? 'Approve All' : 'Reject All'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
