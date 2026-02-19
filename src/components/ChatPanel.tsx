'use client';

import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { suggestedPrompts } from '@/data/chat-scripts';

export default function ChatPanel() {
    const {
        chatOpen, toggleChat, chatMessages, chatThinking, sendChatMessage,
    } = useApp();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, chatThinking]);

    const handleSend = () => {
        if (!input.trim()) return;
        sendChatMessage(input.trim());
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handlePromptClick = (prompt: string) => {
        sendChatMessage(prompt);
    };

    if (!chatOpen) {
        return (
            <div style={{
                width: 48, minWidth: 48, background: 'var(--light-gray)',
                borderLeft: '1px solid var(--border-gray)', display: 'flex',
                flexDirection: 'column', alignItems: 'center', padding: '12px 0', flexShrink: 0,
            }}>
                <button className="chat-toggle-btn" onClick={toggleChat} title="Open chat">
                    💬
                </button>
                <span style={{
                    writingMode: 'vertical-rl', fontSize: 10, color: 'var(--medium-gray)',
                    marginTop: 12, fontFamily: 'var(--font-mono)', fontWeight: 600,
                    letterSpacing: '0.05em',
                }}>
                    AGENT CHAT
                </span>
            </div>
        );
    }

    return (
        <div className="chat-panel">
            <div className="chat-header">
                <div className="chat-header-title">
                    <span className="agent-status-dot" style={{ width: 6, height: 6 }} />
                    Agent Orchestrator
                    <span style={{ fontSize: 10, color: 'var(--medium-gray)', fontWeight: 400 }}>· Active</span>
                </div>
                <button className="chat-toggle-btn" onClick={toggleChat}>✕</button>
            </div>

            <div className="chat-messages">
                {chatMessages.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--medium-gray)' }}>
                        <div style={{ fontSize: 32, marginBottom: 12 }}>🤖</div>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Paid Media Agent</div>
                        <div style={{ fontSize: 12 }}>
                            Ask me about office performance, spend optimization, or budget reallocation.
                        </div>
                    </div>
                )}

                {chatMessages.map(msg => (
                    <div key={msg.id} className={`chat-bubble ${msg.role}`}>
                        <div style={{ whiteSpace: 'pre-wrap' }}>
                            {msg.content.split(/(\*\*.*?\*\*)/).map((part, i) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                    return <strong key={i}>{part.slice(2, -2)}</strong>;
                                }
                                return part;
                            })}
                        </div>

                        {msg.hasTable && msg.tableData && (
                            <table className="chat-bubble-table">
                                <thead>
                                    <tr>
                                        {msg.tableData.headers.map(h => <th key={h}>{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {msg.tableData.rows.map((row, ri) => (
                                        <tr key={ri}>
                                            {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        <div className="chat-bubble-timestamp">
                            {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </div>
                    </div>
                ))}

                {chatThinking && (
                    <div className="chat-bubble agent" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, color: 'var(--medium-gray)' }}>Analyzing</span>
                        <div className="thinking-dots">
                            <div className="thinking-dot" />
                            <div className="thinking-dot" />
                            <div className="thinking-dot" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="chat-suggested">
                <div className="chat-suggested-label">Suggested:</div>
                <div className="chat-suggested-prompts">
                    {suggestedPrompts.slice(0, 4).map(prompt => (
                        <button
                            key={prompt}
                            className="chat-suggested-chip"
                            onClick={() => handlePromptClick(prompt)}
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            </div>

            <div className="chat-input-area">
                <input
                    className="chat-input"
                    placeholder="Type a message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={chatThinking}
                />
                <button
                    className="chat-send-btn"
                    onClick={handleSend}
                    disabled={!input.trim() || chatThinking}
                >
                    ➤
                </button>
            </div>
        </div>
    );
}
