'use client';

import { useState } from 'react';
import { CheckCircle, AlertCircle, Settings, ExternalLink, ChevronRight } from 'lucide-react';

type IntegrationStatus = 'connected' | 'available' | 'error';

interface Integration {
    id: string;
    name: string;
    description: string;
    logoUrl: string;
    status: IntegrationStatus;
    tags: string[];
    lastSync?: string;
}

const integrations: Integration[] = [
    {
        id: 'google-ads',
        name: 'Google Ads',
        description: 'Import campaign performance, spend data, and conversion metrics directly from Google Ads Manager.',
        logoUrl: 'https://cdn.worldvectorlogo.com/logos/google-ads-2.svg',
        status: 'connected',
        tags: ['MEDIA', 'SPEND'],
        lastSync: '2 min ago',
    },
    {
        id: 'meta-ads',
        name: 'Meta Business Suite',
        description: 'Sync Facebook and Instagram ad performance, audience insights, and lead generation data.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/600px-Facebook_Logo_%282019%29.png',
        status: 'connected',
        tags: ['MEDIA', 'SOCIAL'],
        lastSync: '5 min ago',
    },
    {
        id: 'google-analytics',
        name: 'Google Analytics 4',
        description: 'Track website traffic attribution, user behavior, and conversion funnels for each office landing page.',
        logoUrl: 'https://cdn.worldvectorlogo.com/logos/google-analytics-4.svg',
        status: 'connected',
        tags: ['ANALYTICS'],
        lastSync: '10 min ago',
    },
    {
        id: 'dentrix',
        name: 'Dentrix Enterprise',
        description: 'Pull real-time appointment scheduling, patient records, and capacity utilization from Dentrix PMS.',
        logoUrl: 'https://www.dentrix.com/favicon.ico',
        status: 'connected',
        tags: ['PMS', 'SCHEDULING'],
        lastSync: '15 min ago',
    },
    {
        id: 'callrail',
        name: 'CallRail',
        description: 'Track inbound call volume, call attribution by channel, and new patient phone conversions.',
        logoUrl: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="%2304BE5B"/><path d="M20 16a4 4 0 0 1 4-4h2.34a4 4 0 0 1 3.9 3.12l1.66 7.46a4 4 0 0 1-1.62 4.18l-2.44 1.74a24.07 24.07 0 0 0 9.66 9.66l1.74-2.44a4 4 0 0 1 4.18-1.62l7.46 1.66A4 4 0 0 1 52 39.66V42a4 4 0 0 1-4 4H44A24 24 0 0 1 20 22V16z" fill="white"/></svg>')}`,
        status: 'connected',
        tags: ['TRACKING', 'CALLS'],
        lastSync: '8 min ago',
    },
    {
        id: 'programmatic',
        name: 'DV360 / Programmatic',
        description: 'Manage display and video programmatic campaigns with real-time bidding and audience targeting.',
        logoUrl: 'https://cdn.worldvectorlogo.com/logos/google-marketing-platform.svg',
        status: 'connected',
        tags: ['MEDIA', 'DISPLAY'],
        lastSync: '3 min ago',
    },
    {
        id: 'hubspot',
        name: 'HubSpot CRM',
        description: 'Unify patient lead lifecycle, automate follow-up workflows, and measure marketing ROI end-to-end.',
        logoUrl: 'https://cdn.worldvectorlogo.com/logos/hubspot.svg',
        status: 'available',
        tags: ['CRM', 'LEADS'],
    },
    {
        id: 'snowflake',
        name: 'Snowflake Data Cloud',
        description: 'Centralize all marketing and operational data in a unified cloud warehouse for advanced analytics.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Snowflake_Logo.svg/2560px-Snowflake_Logo.svg.png',
        status: 'available',
        tags: ['DATA', 'WAREHOUSE'],
    },
];

function StatusBadge({ status }: { status: IntegrationStatus }) {
    if (status === 'connected') {
        return (
            <span className="integration-status connected">
                <CheckCircle size={12} />
                Connected
            </span>
        );
    }
    if (status === 'error') {
        return (
            <span className="integration-status error">
                <AlertCircle size={12} />
                Error
            </span>
        );
    }
    return (
        <span className="integration-status available">
            Connect
            <ChevronRight size={12} />
        </span>
    );
}

export default function AdminIntegrations() {
    const [expanded, setExpanded] = useState(false);

    const visibleIntegrations = expanded ? integrations : integrations.slice(0, 4);
    const connectedCount = integrations.filter(i => i.status === 'connected').length;

    return (
        <div className="integrations-section tour-admin-integrations">
            <div className="integrations-header">
                <div>
                    <div className="integrations-title">
                        <Settings size={18} color="var(--heartland-blue)" />
                        Admin Integrations
                        <span className="integrations-count">{connectedCount}/{integrations.length} Active</span>
                    </div>
                    <p className="integrations-subtitle">Connected data sources powering the optimization engine</p>
                </div>
                <button
                    className="integrations-toggle"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? 'Show Less' : 'View All'}
                    <ExternalLink size={13} />
                </button>
            </div>

            <div className="integrations-grid">
                {visibleIntegrations.map(integration => (
                    <div key={integration.id} className={`integration-card ${integration.status}`}>
                        <div className="integration-card-top">
                            <div className="integration-icon-wrap">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={integration.logoUrl}
                                    alt={`${integration.name} logo`}
                                    className="integration-logo"
                                    onError={(e) => {
                                        const target = e.currentTarget;
                                        target.style.display = 'none';
                                        const fallback = target.nextElementSibling as HTMLElement;
                                        if (fallback) fallback.style.display = 'flex';
                                    }}
                                />
                                <span className="integration-logo-fallback" style={{ display: 'none' }}>
                                    {integration.name.charAt(0)}
                                </span>
                            </div>
                            <StatusBadge status={integration.status} />
                        </div>

                        <div className="integration-card-body">
                            <div className="integration-name">{integration.name}</div>
                            <p className="integration-desc">{integration.description}</p>
                        </div>

                        <div className="integration-card-footer">
                            <div className="integration-tags">
                                {integration.tags.map(tag => (
                                    <span key={tag} className="integration-tag">{tag}</span>
                                ))}
                            </div>
                            {integration.lastSync && (
                                <span className="integration-sync">Synced {integration.lastSync}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
