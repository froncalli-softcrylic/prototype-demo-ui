'use client';

import { useApp, type MarketFilter, type StatusFilter } from '@/context/AppContext';
import { getInvestmentStatus, type Office } from '@/data/offices';

function formatSpend(val: number): string {
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val}`;
}

function CapacityBarSmall({ value }: { value: number }) {
    const pct = Math.round(value * 100);
    const cls = pct >= 80 ? 'high' : pct >= 67 ? 'medium' : 'low';
    return (
        <div className="capacity-bar-container">
            <div className="capacity-bar">
                <div className={`capacity-bar-fill ${cls}`} style={{ width: `${pct}%` }} />
            </div>
            <span>{pct}%</span>
        </div>
    );
}

export default function Sidebar() {
    const {
        filteredOffices, selectedOfficeId, selectOffice,
        marketFilter, setMarketFilter,
        statusFilter, setStatusFilter,
        archExpanded, toggleArchExpanded,
        isSidebarOpen, toggleSidebar,
    } = useApp();

    const statusFilters: { label: string; value: StatusFilter }[] = [
        { label: 'All', value: 'all' },
        { label: 'Over-Inv.', value: 'over-invested' },
        { label: 'Under-Inv.', value: 'under-invested' },
        { label: 'Optimal', value: 'optimal' },
    ];

    return (
        <aside className={`sidebar tour-office-sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Offices
                    {isSidebarOpen && (
                        <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--charcoal)' }}>✕</button>
                    )}
                </div>
            </div>

            <div className="sidebar-filters">
                <select
                    className="sidebar-select"
                    value={marketFilter}
                    onChange={e => setMarketFilter(e.target.value as MarketFilter)}
                >
                    <option value="all">All Markets</option>
                    <option value="Florida">Florida</option>
                    <option value="New York">New York</option>
                </select>

                <div className="status-filters">
                    {statusFilters.map(f => (
                        <button
                            key={f.value}
                            className={`status-filter-chip ${statusFilter === f.value ? 'active' : ''}`}
                            onClick={() => setStatusFilter(f.value)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="sidebar-office-list">
                <div
                    className={`sidebar-office-item all-offices ${selectedOfficeId === null ? 'active' : ''}`}
                    onClick={() => selectOffice(null)}
                >
                    <span className="sidebar-office-name">📊 All Offices</span>
                </div>

                {filteredOffices.map(office => {
                    const status = getInvestmentStatus(office);
                    const active = selectedOfficeId === office.officeId;
                    return (
                        <div
                            key={office.officeId}
                            className={`sidebar-office-item ${active ? 'active' : ''}`}
                            onClick={() => selectOffice(office.officeId)}
                        >
                            <div className="sidebar-office-name">
                                <span className={`status-dot ${status}`} />
                                {office.officeName}
                            </div>
                            <div className="sidebar-office-location">
                                {office.city}, {office.state}
                            </div>
                            <div className="sidebar-office-metrics">
                                <CapacityBarSmall value={office.capacityUtilBaseline} />
                                <span>{formatSpend(office.avgWeeklySpendTotal)}/wk</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Architecture panel */}
            <div className="architecture-panel">
                <button
                    className="rec-card-expand"
                    onClick={toggleArchExpanded}
                    style={{ marginBottom: 8 }}
                >
                    {archExpanded ? '▼' : '▶'} Agent Network
                </button>

                {archExpanded && (
                    <>
                        <div className="arch-section">
                            <div className="arch-section-label">Agent Network</div>
                            <div className="arch-item">
                                <span className="arch-item-dot connected" />
                                <span className="arch-item-name" style={{ fontWeight: 700 }}>Agent Orchestrator</span>
                                <span className="arch-item-status">Active</span>
                            </div>
                            <div className="arch-tree-connector">
                                <div className="arch-item">
                                    <span className="arch-item-dot connected" />
                                    <span className="arch-item-name">Data Collection</span>
                                    <span className="arch-item-status">Last: 2m</span>
                                </div>
                                <div className="arch-item">
                                    <span className="arch-item-dot connected" />
                                    <span className="arch-item-name">Optimizer Agent</span>
                                    <span className="arch-item-status">Last: 5m</span>
                                </div>
                            </div>
                        </div>

                        <div className="arch-section">
                            <div className="arch-section-label">Data Connections</div>
                            <div className="arch-item">
                                <span className="arch-item-dot connected" />
                                <span className="arch-item-name">Office Data</span>
                                <span className="arch-item-status">Connected</span>
                            </div>
                            <div className="arch-item">
                                <span className="arch-item-dot connected" />
                                <span className="arch-item-name">Campaign Perf.</span>
                                <span className="arch-item-status">Connected</span>
                            </div>
                            <div className="arch-item">
                                <span className="arch-item-dot connected" />
                                <span className="arch-item-name">Scheduling</span>
                                <span className="arch-item-status">Connected</span>
                            </div>
                            <div className="arch-item">
                                <span className="arch-item-dot inactive" />
                                <span className="arch-item-name">Events / Weather</span>
                                <span className="arch-item-status" style={{ color: 'var(--border-gray)' }}>Not Active</span>
                            </div>
                        </div>

                        <div style={{ fontSize: 10, color: 'var(--medium-gray)', fontFamily: 'var(--font-mono)' }}>
                            Last full optimization: 2:30 PM<br />
                            Next scheduled run: 3:30 PM
                        </div>
                    </>
                )}
            </div>
        </aside>
    );
}
