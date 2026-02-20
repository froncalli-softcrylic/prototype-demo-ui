import { Step } from 'react-joyride';

export const tutorialSteps: Step[] = [
    {
        target: 'body',
        placement: 'center',
        title: 'Welcome to Heartland Paid Media Agent',
        content: 'This guided tour will walk you through the core features of the platform, showing you how to monitor performance, review AI recommendations, and optimize your media spend.',
        disableBeacon: true,
    },
    {
        target: '.tour-kpi-strip',
        placement: 'bottom',
        title: 'Global Performance KPIs',
        content: 'At the top, you can monitor your aggregated performance across all connected offices, including Total Spend, Average CPA, and Total Bookings.',
        disableBeacon: true,
    },
    {
        target: '.tour-time-range',
        placement: 'bottom',
        title: 'Time Range Context',
        content: 'Data is currently locked to "This Week" for this demo, focusing on real-time optimization and pacing rather than historical lookbacks.',
        disableBeacon: true,
    },
    {
        target: '.tour-admin-integrations',
        placement: 'bottom',
        title: 'Data Pipelines',
        content: 'The platform aggregates data from Google Ads, Meta, PM Systems like Dentrix, and Call Tracking to feed the AI optimization engine.',
        disableBeacon: true,
    },
    {
        target: '.tour-office-grid',
        placement: 'top',
        title: 'Individual Office Cards',
        content: 'Each card represents a dental office. You can see their current spend allocation, capacity utilization, and a sparkline of their recent trajectory.',
        disableBeacon: true,
    },
    {
        target: '.tour-office-sidebar',
        placement: 'right',
        title: 'Deep Dive Analytics',
        content: 'Clicking any office in the sidebar (or clicking an office card) reveals their specific MMM Response Curve, Schedule Capacity, and tailored AI recommendations.',
        disableBeacon: true,
    },
    {
        target: '.tour-nav-recommendations',
        placement: 'bottom',
        title: 'AI Recommendations Queue',
        content: 'This tab holds actionable, quantifiable reallocation steps to shift budget from underperforming or over-capacity offices to those that need volume.',
        disableBeacon: true,
    },
    {
        target: '.tour-nav-performance',
        placement: 'bottom',
        title: 'Performance Dashboards',
        content: 'Need to drill down? The Performance tab offers beautiful macro-level charts comparing CPA, Spend vs Bookings, and Conversion Incrementality across the entire network.',
        disableBeacon: true,
    },
    {
        target: '.tour-ai-agent',
        placement: 'left',
        title: 'Conversational AI Agent',
        content: 'Have a specific question? Ask the Agent Orchestrator to analyze pacing, draft a report, or execute a complex budget reallocation directly via chat.',
        disableBeacon: true,
    }
];
