export interface ChatMessage {
    id: string;
    role: 'user' | 'agent';
    content: string;
    timestamp: string;
    hasTable?: boolean;
    tableData?: { headers: string[]; rows: string[][] };
}

export const suggestedPrompts: string[] = [
    'Which offices need budget reallocation?',
    'Show me underperforming channels',
    'Optimize spend for offices with open capacity',
    "What's the projected impact of shifting $5K from Woodmont to St Cloud?",
    'Refresh data and re-run analysis',
    "Summarize this week's recommendations",
];

export interface ScriptedExchange {
    trigger: string[];
    userMessage: string;
    agentResponse: ChatMessage;
}

export const scriptedExchanges: ScriptedExchange[] = [
    {
        trigger: ['over-invested', 'over invested', 'overinvested'],
        userMessage: 'Which offices are over-invested right now?',
        agentResponse: {
            id: 'agent-1',
            role: 'agent',
            content: 'Based on current data, 2 offices are flagged as over-invested:\n\n• **Woodmont Family Dentistry** (Tamarac, FL) — 88% capacity, spending $19.6K/wk with only 8 open slots. At the portfolio-wide 82% Google Search incrementality, additional spend has diminishing marginal returns given capacity constraints.\n\n• **Western New York Dental Group Lancaster** (Depew, NY) — 82% capacity, spending $16.0K/wk. High capacity utilization limits the incremental value of new patient bookings.\n\nWoodmont is closest to capacity saturation — additional spend there yields diminishing returns on incremental bookings. I recommend reallocating $3.1K/wk from Woodmont to under-invested offices like St Cloud and Main Street where marginal CPA is significantly more efficient.',
            timestamp: new Date().toISOString(),
        },
    },
    {
        trigger: ['reallocate', 'st cloud', 'open capacity', 'optimize spend'],
        userMessage: 'Reallocate budget for St Cloud — they have a lot of open capacity',
        agentResponse: {
            id: 'agent-2',
            role: 'agent',
            content: "St Cloud Dentistry is at 62% capacity with 34 open appointment slots this week. Here's my recommended reallocation:",
            timestamp: new Date().toISOString(),
            hasTable: true,
            tableData: {
                headers: ['Channel', 'Current', 'Recommended', 'Change'],
                rows: [
                    ['Google Search', '$6,064', '$8,200', '+$2,136'],
                    ['Meta', '$4,915', '$3,100', '-$1,815'],
                    ['Programmatic', '$2,521', '$2,900', '+$379'],
                ],
            },
        },
    },
    {
        trigger: ['approve', 'google', 'programmatic', 'reject', 'meta'],
        userMessage: 'Yes, approve the Google and Programmatic changes but reject the Meta decrease',
        agentResponse: {
            id: 'agent-3',
            role: 'agent',
            content: "Done. ✅ **Approved:** Google Search increase to $8,200/wk and Programmatic increase to $2,900/wk.\n\n❌ **Rejected:** Meta remains at $4,915/wk.\n\nDashboard has been updated. I'll monitor performance over the next 7 days and flag if CPA exceeds the $210 target for St Cloud.",
            timestamp: new Date().toISOString(),
        },
    },
    {
        trigger: ['underperforming', 'under performing', 'underperform'],
        userMessage: 'Show me underperforming channels',
        agentResponse: {
            id: 'agent-4',
            role: 'agent',
            content: "Here are the channels where capacity constraints make additional spend least efficient:\n\n• **Meta at Woodmont** (Tamarac, FL) — 88% capacity, spending $6.3K/wk. High capacity utilization means limited room for incremental bookings regardless of channel performance.\n\n• **Meta at Western NY Lancaster** (Depew, NY) — 82% capacity, spending $5.3K/wk. Similar capacity constraint limits marginal value.\n\n• **Google Programmatic at Woodmont** — Capacity-constrained office. Lower priority for incremental spend.\n\n• **Meta at 1st Advantage Colonie** (Albany, NY) — 78% capacity, approaching the over-invested threshold.\n\nIn contrast, **Google Search at St Cloud (62% capacity)** and **Google Search at Main Street (65% capacity)** have the most open slots and the strongest incremental potential.",
            timestamp: new Date().toISOString(),
        },
    },
    {
        trigger: ['summarize', 'summary', 'this week', 'recommendations'],
        userMessage: "Summarize this week's recommendations",
        agentResponse: {
            id: 'agent-5',
            role: 'agent',
            content: "**This Week's Optimization Summary:**\n\n📊 **8 recommendations pending** across 5 offices.\n\n**Key themes:**\n1. **Throttle spend at capacity-constrained offices** — Woodmont (88%) and Western NY Lancaster (82%) are over-invested. Recommend reducing combined spend by $3.7K/wk.\n\n2. **Increase spend at under-utilized offices** — St Cloud (62%), Main Street (65%), and Bethlehem (68%) all have significant open capacity and strong incrementality on Google Search.\n\n3. **Channel rebalancing** — Meta performance at capacity-constrained offices shows diminishing marginal returns. Shift toward Google Search and Programmatic at offices with open slots.\n\n**Net projected impact:** +10 incremental bookings/week portfolio-wide at 6% lower blended CPA.\n\nWould you like me to walk through any specific office in detail?",
            timestamp: new Date().toISOString(),
        },
    },
    {
        trigger: ['shift', '$5k', '5k', 'woodmont', 'impact'],
        userMessage: "What's the projected impact of shifting $5K from Woodmont to St Cloud?",
        agentResponse: {
            id: 'agent-6',
            role: 'agent',
            content: "Great question. Here's the projected impact of a $5K/wk reallocation from Woodmont → St Cloud:\n\n**Woodmont (reducing $5K):**\n• Lose ~4 incremental bookings/week\n• CPA savings of ~$3.20/booking\n• Moves from over-invested → optimal on the efficiency curve\n\n**St Cloud (adding $5K):**\n• Gain ~9 incremental bookings/week\n• Marginal CPA of $8.50/booking (well below $210 target)\n• Google Search and Programmatic both have room on the response curve\n\n**Net portfolio impact:**\n• **+5 incremental bookings/week**\n• **$2.10 lower blended CPA**\n• **Better capacity utilization** — St Cloud moves from 62% → projected 71%\n\nThis is highly efficient given Woodmont's capacity constraints (88%). Shall I generate specific channel-level recommendations for this shift?",
            timestamp: new Date().toISOString(),
        },
    },
];

export function findScriptedResponse(input: string): ScriptedExchange | null {
    const lower = input.toLowerCase();
    for (const exchange of scriptedExchanges) {
        const matchCount = exchange.trigger.filter(t => lower.includes(t)).length;
        if (matchCount > 0) return exchange;
    }
    return null;
}

export const defaultAgentResponse: ChatMessage = {
    id: 'agent-default',
    role: 'agent',
    content: "I've analyzed the request. Based on current portfolio data across 9 offices, I can provide insights on spend optimization, capacity utilization, and channel performance. Could you be more specific about which offices or metrics you'd like me to focus on?\n\nYou can ask me things like:\n• Which offices need budget reallocation?\n• Show me underperforming channels\n• Optimize spend for a specific office",
    timestamp: new Date().toISOString(),
};
