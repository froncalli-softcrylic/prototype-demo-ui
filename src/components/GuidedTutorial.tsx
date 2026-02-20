'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useApp } from '@/context/AppContext';
import { tutorialSteps } from '@/data/tutorial-steps';
import { CallBackProps, STATUS, TooltipRenderProps } from 'react-joyride';

// Dynamically import Joyride so it only loads on the client
const Joyride = dynamic(() => import('react-joyride'), { ssr: false });

function CustomTooltip({
    index,
    step,
    skipProps,
    primaryProps,
    backProps,
    tooltipProps,
    isLastStep,
}: TooltipRenderProps) {
    return (
        <div
            {...tooltipProps}
            style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '16px',
                padding: '24px',
                width: '380px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.1)',
                border: '1px solid var(--border-gray)',
                fontFamily: 'var(--font-sans)',
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--heartland-blue)', letterSpacing: '-0.02em', paddingRight: '12px' }}>
                    {step.title}
                </h3>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--medium-gray)', background: 'var(--light-gray)', padding: '4px 8px', borderRadius: '12px', whiteSpace: 'nowrap' }}>
                    {index + 1} / {tutorialSteps.length}
                </span>
            </div>

            {/* Body */}
            <div style={{ fontSize: '14px', color: 'var(--charcoal)', lineHeight: '1.5', marginBottom: '24px', fontWeight: 500 }}>
                {step.content}
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                    {...skipProps}
                    style={{
                        background: 'none', border: 'none', color: 'var(--medium-gray)',
                        fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: '8px 4px',
                        opacity: index === 0 ? 1 : 0, pointerEvents: index === 0 ? 'auto' : 'none'
                    }}
                >
                    Skip Tour
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {index > 0 && (
                        <button
                            {...backProps}
                            style={{
                                background: 'transparent', border: '1px solid var(--border-gray)',
                                color: 'var(--charcoal)', padding: '8px 16px', borderRadius: '8px',
                                fontWeight: 700, fontSize: '13px', cursor: 'pointer'
                            }}
                        >
                            Back
                        </button>
                    )}
                    <button
                        {...primaryProps}
                        style={{
                            background: 'var(--heartland-blue)', border: 'none', color: 'white',
                            padding: '8px 20px', borderRadius: '8px', fontWeight: 700,
                            fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 116, 176, 0.3)'
                        }}
                    >
                        {isLastStep ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function GuidedTutorial() {
    const { isTutorialRunning, startTutorial, stopTutorial, setCenterView, setSidebarOpen } = useApp();
    const [mounted, setMounted] = useState(false);

    // Only run on client mounting
    useEffect(() => {
        setMounted(true);
        const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
        if (!hasSeenTutorial) {
            // Slight delay so the UI fully paints before starting
            setTimeout(() => {
                startTutorial();
            }, 1000);
        }
    }, [startTutorial]);

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status, type, index, action } = data;

        // Auto-navigation for specific steps
        if (type === 'step:before') {
            const currentStepTarget = tutorialSteps[index]?.target;

            // If the next step is the deep-dive recommendations, ensure we navigate there
            if (currentStepTarget === '.tour-nav-recommendations') {
                setCenterView('recommendations');
            }
            // If the next step is performance trends, switch tab
            if (currentStepTarget === '.tour-nav-performance') {
                setCenterView('trends');
            }
            // If step focuses on the sidebar or specific office, ensure sidebar is open
            if (currentStepTarget === '.tour-office-sidebar') {
                setCenterView('dashboard'); // go back from recs/trends
                // Use setTimeout to allow state to settle
                setTimeout(() => {
                    setSidebarOpen && setSidebarOpen(true);
                }, 100);
            }
        }

        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
        if (finishedStatuses.includes(status)) {
            // Tour finished or skipped
            localStorage.setItem('hasSeenTutorial', 'true');
            stopTutorial();

            // Clean up navigation payload
            setCenterView('dashboard');
        }
    };

    if (!mounted) return null;

    return (
        <Joyride
            steps={tutorialSteps}
            run={isTutorialRunning}
            continuous
            scrollToFirstStep
            showProgress
            showSkipButton
            disableOverlayClose
            tooltipComponent={CustomTooltip}
            callback={handleJoyrideCallback}
            styles={{
                options: {
                    zIndex: 10000,
                    overlayColor: 'rgba(0, 0, 0, 0.55)',
                    arrowColor: 'var(--bg-surface)'
                }
            }}
        />
    );
}
