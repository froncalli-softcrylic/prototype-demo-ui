'use client';

import { useApp } from '@/context/AppContext';
import { offices } from '@/data/offices';

export default function SummaryStrip() {
    const { recommendations } = useApp();

    const totalWeeklySpend = offices.reduce((s, o) => s + o.avgWeeklySpendTotal, 0);
    const totalBookings = Math.round(totalWeeklySpend / 115);
    const avgCPAObserved = totalBookings > 0 ? totalWeeklySpend / totalBookings : 0;
    const avgCPAIncremental = avgCPAObserved * 1.44;
    const avgCapacity = offices.reduce((s, o) => s + o.capacityUtilBaseline, 0) / offices.length;
    const pendingCount = recommendations.filter(r => r.status === 'pending').length;

    return (
        <div className="summary-strip">
            <div className="summary-card">
                <div className="summary-card-value">${(totalWeeklySpend / 1000).toFixed(1)}K</div>
                <div className="summary-card-label">Total Weekly Spend</div>
            </div>
            <div className="summary-card">
                <div className="summary-card-value">${avgCPAObserved.toFixed(2)}</div>
                <div className="summary-card-label">Avg CPA (Observed)</div>
            </div>
            <div className="summary-card">
                <div className="summary-card-value">${avgCPAIncremental.toFixed(2)}</div>
                <div className="summary-card-label">Avg CPA (Incremental)</div>
            </div>
            <div className="summary-card">
                <div className="summary-card-value">{totalBookings.toLocaleString()}</div>
                <div className="summary-card-label">Total Weekly Bookings</div>
            </div>
            <div className="summary-card">
                <div className="summary-card-value">
                    {Math.round(avgCapacity * 100)}%
                </div>
                <div className="summary-card-label">Avg Capacity Util.</div>
                <div className="summary-card-bar">
                    <div className="capacity-bar" style={{ width: 80, margin: '0 auto' }}>
                        <div
                            className="capacity-bar-fill medium"
                            style={{ width: `${Math.round(avgCapacity * 100)}%` }}
                        />
                    </div>
                </div>
            </div>
            <div className="summary-card">
                <div className="summary-card-badge">{pendingCount}</div>
                <div className="summary-card-label" style={{ marginTop: 6 }}>Recs Pending</div>
            </div>
        </div>
    );
}
