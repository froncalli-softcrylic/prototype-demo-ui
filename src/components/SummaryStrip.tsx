'use client';

import { useApp } from '@/context/AppContext';
import { offices } from '@/data/offices';
import { DollarSign, Activity, Target, CalendarDays, Percent, AlignLeft } from 'lucide-react';

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
            <div className="summary-card hover-lift" style={{ display: 'flex', alignItems: 'center', textAlign: 'left', padding: '20px' }}>
                <div className="icon-box red" style={{ width: 48, height: 48, marginRight: 16 }}>
                    <DollarSign size={24} />
                </div>
                <div>
                    <div className="summary-card-label" style={{ marginBottom: 4, letterSpacing: '0.02em' }}>Total Weekly Spend</div>
                    <div className="summary-card-value" style={{ fontSize: 24 }}>${(totalWeeklySpend / 1000).toFixed(1)}K</div>
                </div>
            </div>

            <div className="summary-card hover-lift" style={{ display: 'flex', alignItems: 'center', textAlign: 'left', padding: '20px' }}>
                <div className="icon-box amber" style={{ width: 48, height: 48, marginRight: 16 }}>
                    <Activity size={24} />
                </div>
                <div>
                    <div className="summary-card-label" style={{ marginBottom: 4, letterSpacing: '0.02em' }}>Avg CPA (Observed)</div>
                    <div className="summary-card-value" style={{ fontSize: 24 }}>${avgCPAObserved.toFixed(2)}</div>
                </div>
            </div>

            <div className="summary-card hover-lift" style={{ display: 'flex', alignItems: 'center', textAlign: 'left', padding: '20px' }}>
                <div className="icon-box blue" style={{ width: 48, height: 48, marginRight: 16 }}>
                    <Target size={24} />
                </div>
                <div>
                    <div className="summary-card-label" style={{ marginBottom: 4, letterSpacing: '0.02em' }}>Avg CPA (Incremental)</div>
                    <div className="summary-card-value" style={{ fontSize: 24 }}>${avgCPAIncremental.toFixed(2)}</div>
                </div>
            </div>

            <div className="summary-card hover-lift" style={{ display: 'flex', alignItems: 'center', textAlign: 'left', padding: '20px' }}>
                <div className="icon-box emerald" style={{ width: 48, height: 48, marginRight: 16 }}>
                    <CalendarDays size={24} />
                </div>
                <div>
                    <div className="summary-card-label" style={{ marginBottom: 4, letterSpacing: '0.02em' }}>Total Weekly Bookings</div>
                    <div className="summary-card-value" style={{ fontSize: 24 }}>{totalBookings.toLocaleString()}</div>
                </div>
            </div>

            <div className="summary-card hover-lift" style={{ display: 'flex', alignItems: 'center', textAlign: 'left', padding: '20px' }}>
                <div className="icon-box purple" style={{ width: 48, height: 48, marginRight: 16 }}>
                    <Percent size={24} />
                </div>
                <div style={{ flex: 1 }}>
                    <div className="summary-card-label" style={{ marginBottom: 4, letterSpacing: '0.02em' }}>Avg Capacity Util.</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="summary-card-value" style={{ fontSize: 24, margin: 0 }}>{Math.round(avgCapacity * 100)}%</div>
                        <div className="capacity-bar" style={{ width: '100%', maxWidth: 60, height: 6 }}>
                            <div className="capacity-bar-fill medium" style={{ width: `${Math.round(avgCapacity * 100)}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="summary-card hover-lift" style={{ display: 'flex', alignItems: 'center', textAlign: 'left', padding: '20px' }}>
                <div className="icon-box blue" style={{ width: 48, height: 48, marginRight: 16, backgroundColor: 'var(--heartland-blue)', color: '#fff' }}>
                    <AlignLeft size={24} />
                </div>
                <div>
                    <div className="summary-card-label" style={{ marginBottom: 4, letterSpacing: '0.02em' }}>Recs Pending</div>
                    <div className="summary-card-value" style={{ fontSize: 24 }}>{pendingCount}</div>
                </div>
            </div>
        </div>
    );
}
