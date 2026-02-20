import { Step } from 'react-joyride';

const defaultStepConfig: Partial<Step> = {
    disableBeacon: true,
    // Smooth scroll into view instead of instant jump
    disableScrolling: false,
};

export const tutorialSteps: Step[] = [
    {
        ...defaultStepConfig,
        target: 'body',
        placement: 'center',
        title: 'Welcome to Heartland Paid Media Agent',
        content: 'This guided tour will walk you through the core features of the platform, showing you how to monitor performance, review AI recommendations, and optimize your media spend.',
        disableScrolling: true, // Center modal doesn't need scroll
    },
    {
        ...defaultStepConfig,
        target: '.tour-kpi-strip',
        placement: 'bottom',
        title: 'Global Performance KPIs',
        content: 'At the top, you can monitor your aggregated performance across all connected offices, including Total Spend, Average CPA, and Total Bookings.',
    },
    {
        ...defaultStepConfig,
        target: '.tour-time-range',
        placement: 'bottom',
        title: 'Time Range Context',
        content: 'Data is currently locked to "This Week" for this demo, focusing on real-time optimization and pacing rather than historical lookbacks.',
    },
    {
        ...defaultStepConfig,
        target: '.tour-admin-integrations',
        placement: 'bottom',
        title: 'Data Pipelines',
        content: 'The platform aggregates data from Google Ads, Meta, PM Systems like Dentrix, and Call Tracking to feed the AI optimization engine.',
    },
    {
        ...defaultStepConfig,
        target: '.tour-office-grid > div:first-child',
        placement: 'bottom',
        title: 'Individual Office Cards',
        content: 'Each card represents a dental office. You can see their current spend allocation, capacity utilization, and a sparkline of their recent trajectory.',
    },
    {
        ...defaultStepConfig,
        target: '.tour-office-sidebar',
        placement: 'right',
        title: 'Office Sidebar Navigation',
        content: 'Clicking any office in the sidebar (or clicking an office card) reveals their specific MMM Response Curves, Schedule & Capacity, and tailored AI recommendations.',
    },
    {
        ...defaultStepConfig,
        target: '.tour-nav-recommendations',
        placement: 'bottom',
        title: 'AI Recommendations Queue',
        content: 'This tab holds actionable, quantifiable reallocation steps to shift budget from underperforming or over-capacity offices to those that need volume.',
    },
    {
        ...defaultStepConfig,
        target: '.tour-nav-performance',
        placement: 'bottom',
        title: 'Performance Dashboards',
        content: 'Need to drill down? The Performance tab offers beautiful macro-level charts comparing CPA, Spend vs Bookings, and Conversion Incrementality across the entire network.',
    },
    {
        ...defaultStepConfig,
        target: '.tour-ai-agent',
        placement: 'left',
        title: 'Conversational AI Agent',
        content: 'Have a specific question? Ask the Agent Orchestrator to analyze pacing, draft a strategy, or execute a complex budget reallocation directly via natural language chat.',
    },
];
