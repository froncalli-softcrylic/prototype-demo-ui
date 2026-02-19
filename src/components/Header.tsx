'use client';

import { useApp } from '@/context/AppContext';

export default function Header() {
    const { selectedOffice, selectOffice, timeRange, setTimeRange } = useApp();

    return (
        <header className="header">
            <div className="header-logo">
                <div>
                    <div className="header-logo-text">HEARTLAND</div>
                    <div className="header-logo-subtitle">Paid Media Agent</div>
                </div>
            </div>

            <div className="header-breadcrumb">
                {selectedOffice ? (
                    <>
                        <a onClick={() => selectOffice(null)}>All Offices</a>
                        <span> › </span>
                        <span style={{ color: 'var(--charcoal)', fontWeight: 600 }}>{selectedOffice.officeName}</span>
                    </>
                ) : null}
            </div>

            <div className="header-right">
                <div className="agent-status">
                    <span className="agent-status-dot" />
                    Agent Active
                </div>
                <span style={{ color: 'var(--border-gray)' }}>|</span>
                <span>Last refresh: 2:30 PM</span>
                <select
                    className="time-range-select"
                    value={timeRange}
                    onChange={e => setTimeRange(e.target.value as typeof timeRange)}
                >
                    <option value="this-week">This Week</option>
                    <option value="14-days">Last 14 Days</option>
                    <option value="30-days">Last 30 Days</option>
                    <option value="90-days">Last 90 Days</option>
                </select>
                <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>Field Strategist</span>
            </div>
        </header>
    );
}
