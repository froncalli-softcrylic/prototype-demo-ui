export interface ChatMessage {
    id: string;
    role: 'user' | 'agent';
    content: string;
    timestamp: string;
}

export const suggestedPrompts: string[] = [
    'Which offices need budget reallocation?',
    'Show me underperforming channels',
    'Optimize spend for offices with open capacity',
    'Refresh data and re-run analysis',
    "Summarize this week's recommendations",
];
