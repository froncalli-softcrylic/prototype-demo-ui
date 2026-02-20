'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import RecommendationCard from './RecommendationCard';

type SortField = 'officeName' | 'channel' | 'action' | 'currentSpend' | 'recommendedSpend' | 'delta' | 'confidence' | 'status';
type QueueFilter = 'all' | 'pending' | 'approved' | 'rejected';

export default function RecommendationsQueue() {
    const { recommendations, bulkApprove, bulkReject } = useApp();
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

    const pendingCount = recommendations.filter(r => r.status === 'pending').length;

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

            <div className="rec-grid">
                {sorted.map(r => (
                    <RecommendationCard key={r.recId} recommendation={r} />
                ))}
            </div>

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
