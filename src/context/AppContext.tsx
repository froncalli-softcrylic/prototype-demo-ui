'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type Office, offices, getInvestmentStatus, type InvestmentStatus } from '@/data/offices';
import { initialRecommendations, type Recommendation } from '@/data/recommendations';
import { type ChatMessage, suggestedPrompts } from '@/data/chat-scripts';
import { getResponseCurvesForOffice } from '@/data/response-curves';

export type CenterView = 'dashboard' | 'detail' | 'recommendations' | 'trends';
export type TimeRange = 'this-week' | '14-days' | '30-days' | '90-days';
export type MarketFilter = 'all' | 'Florida' | 'New York';
export type StatusFilter = 'all' | 'over-invested' | 'under-invested' | 'optimal';
export type Theme = 'light' | 'dark';

interface AppState {
    // Navigation
    selectedOfficeId: number | null;
    centerView: CenterView;
    chatOpen: boolean;
    timeRange: TimeRange;
    archExpanded: boolean;
    isSidebarOpen: boolean;

    // Filters
    marketFilter: MarketFilter;
    statusFilter: StatusFilter;

    // Theme
    theme: Theme;

    // Tutorial
    isTutorialRunning: boolean;

    // Data
    recommendations: Recommendation[];
    chatMessages: ChatMessage[];
    chatThinking: boolean;

    // Actions
    selectOffice: (id: number | null) => void;
    setCenterView: (view: CenterView) => void;
    toggleChat: () => void;
    setTimeRange: (range: TimeRange) => void;
    setMarketFilter: (filter: MarketFilter) => void;
    setStatusFilter: (filter: StatusFilter) => void;
    toggleArchExpanded: () => void;
    toggleTheme: () => void;
    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;
    startTutorial: () => void;
    stopTutorial: () => void;

    approveRecommendation: (recId: string) => void;
    rejectRecommendation: (recId: string) => void;
    modifyRecommendation: (recId: string, newSpend: number) => void;
    bulkApprove: () => void;
    bulkReject: () => void;

    sendChatMessage: (text: string) => void;

    // Computed
    filteredOffices: Office[];
    selectedOffice: Office | null;
    pendingRecommendationsCount: number;
    getOfficeRecommendations: (officeId: number) => Recommendation[];
}

const AppContext = createContext<AppState | null>(null);

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be inside AppProvider');
    return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
    const [selectedOfficeId, setSelectedOfficeId] = useState<number | null>(null);
    const [centerView, setCenterView] = useState<CenterView>('dashboard');
    const [chatOpen, setChatOpen] = useState(true);
    const [timeRange, setTimeRange] = useState<TimeRange>('this-week');
    const [marketFilter, setMarketFilter] = useState<MarketFilter>('all');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [archExpanded, setArchExpanded] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [recommendations, setRecommendations] = useState<Recommendation[]>(initialRecommendations);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatThinking, setChatThinking] = useState(false);
    const [theme, setTheme] = useState<Theme>('light');
    const [isTutorialRunning, setIsTutorialRunning] = useState(false);

    // Apply theme to document element
    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const selectOffice = useCallback((id: number | null) => {
        setSelectedOfficeId(id);
        setCenterView(id !== null ? 'detail' : 'dashboard');
        setIsSidebarOpen(false);
    }, []);

    const toggleChat = useCallback(() => setChatOpen(prev => !prev), []);
    const toggleArchExpanded = useCallback(() => setArchExpanded(prev => !prev), []);
    const toggleTheme = useCallback(() => setTheme(prev => prev === 'light' ? 'dark' : 'light'), []);
    const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
    const setSidebarOpen = useCallback((isOpen: boolean) => setIsSidebarOpen(isOpen), []);

    const startTutorial = useCallback(() => {
        setIsTutorialRunning(true);
        setCenterView('dashboard');
        setIsSidebarOpen(false); // Make sure sidebar isn't obscuring the dashboard on mobile
    }, []);

    const stopTutorial = useCallback(() => {
        setIsTutorialRunning(false);
    }, []);

    const approveRecommendation = useCallback((recId: string) => {
        setRecommendations(prev => prev.map(r => r.recId === recId ? { ...r, status: 'approved' as const } : r));
    }, []);

    const rejectRecommendation = useCallback((recId: string) => {
        setRecommendations(prev => prev.map(r => r.recId === recId ? { ...r, status: 'rejected' as const } : r));
    }, []);

    const modifyRecommendation = useCallback((recId: string, newSpend: number) => {
        setRecommendations(prev => prev.map(r => r.recId === recId ? { ...r, recommendedSpend: newSpend, delta: newSpend - r.currentSpend, status: 'modified' as const } : r));
    }, []);

    const bulkApprove = useCallback(() => {
        setRecommendations(prev => prev.map(r => r.status === 'pending' ? { ...r, status: 'approved' as const } : r));
    }, []);

    const bulkReject = useCallback(() => {
        setRecommendations(prev => prev.map(r => r.status === 'pending' ? { ...r, status: 'rejected' as const } : r));
    }, []);

    const sendChatMessage = useCallback((text: string) => {
        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: text,
            timestamp: new Date().toISOString(),
        };
        const agentMsgId = `agent-${Date.now()}`;
        const agentMsg: ChatMessage = {
            id: agentMsgId,
            role: 'agent',
            content: '',
            timestamp: new Date().toISOString(),
        };

        setChatMessages(prev => [...prev, userMsg, agentMsg]);
        setChatThinking(true);

        // Build message history for API
        const allMessages = [...chatMessages, userMsg].map(m => ({
            role: m.role,
            content: m.content,
        }));

        (async () => {
            try {
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: allMessages }),
                });

                if (!res.ok) {
                    const errText = await res.text();
                    setChatMessages(prev =>
                        prev.map(m => m.id === agentMsgId ? { ...m, content: `Error: ${errText}` } : m)
                    );
                    setChatThinking(false);
                    return;
                }

                const reader = res.body?.getReader();
                const decoder = new TextDecoder();
                let accumulated = '';

                if (reader) {
                    setChatThinking(false); // Hide thinking dots once streaming starts
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        accumulated += decoder.decode(value, { stream: true });
                        const current = accumulated;
                        setChatMessages(prev =>
                            prev.map(m => m.id === agentMsgId ? { ...m, content: current } : m)
                        );
                    }
                }
            } catch (err) {
                setChatMessages(prev =>
                    prev.map(m => m.id === agentMsgId ? { ...m, content: 'Sorry, I encountered a connection error. Please try again.' } : m)
                );
                setChatThinking(false);
            }
        })();
    }, [chatMessages]);

    // Computed
    const filteredOffices = offices.filter(o => {
        if (marketFilter === 'Florida' && o.state !== 'FL') return false;
        if (marketFilter === 'New York' && o.state !== 'NY') return false;
        if (statusFilter !== 'all' && getInvestmentStatus(o) !== statusFilter) return false;
        return true;
    });

    const selectedOffice = selectedOfficeId !== null
        ? offices.find(o => o.officeId === selectedOfficeId) || null
        : null;

    const pendingRecommendationsCount = recommendations.filter(r => r.status === 'pending').length;

    const getOfficeRecommendations = useCallback((officeId: number) => {
        return recommendations.filter(r => r.officeId === officeId);
    }, [recommendations]);

    return (
        <AppContext.Provider value={{
            selectedOfficeId, centerView, chatOpen, timeRange, archExpanded, isSidebarOpen,
            marketFilter, statusFilter, theme, isTutorialRunning,
            recommendations, chatMessages, chatThinking,
            selectOffice, setCenterView, toggleChat, setTimeRange,
            setMarketFilter, setStatusFilter, toggleArchExpanded, toggleTheme, toggleSidebar, setSidebarOpen,
            startTutorial, stopTutorial,
            approveRecommendation, rejectRecommendation, modifyRecommendation,
            bulkApprove, bulkReject,
            sendChatMessage,
            filteredOffices, selectedOffice, pendingRecommendationsCount,
            getOfficeRecommendations,
        }}>
            {children}
        </AppContext.Provider>
    );
}
