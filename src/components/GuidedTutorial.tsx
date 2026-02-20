'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useApp } from '@/context/AppContext';
import { tutorialSteps } from '@/data/tutorial-steps';
import { CallBackProps, ACTIONS, EVENTS, STATUS, TooltipRenderProps } from 'react-joyride';

// Dynamically import Joyride so it only loads on the client
const Joyride = dynamic(() => import('react-joyride'), { ssr: false });

/* ─────────────────────────────────────────────
   Custom Tooltip with smooth fade-in animation
   ───────────────────────────────────────────── */
function CustomTooltip({
    index,
    step,
    skipProps,
    primaryProps,
    backProps,
    tooltipProps,
    isLastStep,
}: TooltipRenderProps) {
    const [visible, setVisible] = useState(false);

    // Fade-in on mount
    useEffect(() => {
        const raf = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <div
            {...tooltipProps}
            style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '16px',
                padding: '24px',
                width: '380px',
                maxWidth: 'calc(100vw - 40px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.1)',
                border: '1px solid var(--border-gray)',
                fontFamily: 'var(--font-sans)',
                // Smooth fade-in
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.25s ease, transform 0.25s ease',
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
                        transition: 'color 0.15s ease',
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
                                fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                                transition: 'all 0.15s ease',
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
                            fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 116, 176, 0.3)',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        {isLastStep ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────
   Force-clear Joyride scroll locks
   ───────────────────────────────── */
function restoreScrollability() {
    // Joyride sets overflow: hidden on both <html> and <body> — forcibly clear it
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.documentElement.style.removeProperty('overflow');
    document.body.style.removeProperty('overflow');

    // Joyride also sets overflow: hidden on the nearest scroll parent, which is .center-panel in our layout
    const scrollParents = document.querySelectorAll('.center-panel, .app-layout, .sidebar');
    scrollParents.forEach(el => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.overflow = '';
        htmlEl.style.removeProperty('overflow');
    });
}

export default function GuidedTutorial() {
    const { isTutorialRunning, startTutorial, stopTutorial, setCenterView, setSidebarOpen } = useApp();
    const [mounted, setMounted] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);

    // Only run on client mounting
    useEffect(() => {
        requestAnimationFrame(() => setMounted(true));
        const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
        if (!hasSeenTutorial) {
            setTimeout(() => {
                startTutorial();
            }, 1200);
        }
    }, [startTutorial]);

    // Safety net: whenever the tour stops running, ensure scroll is restored
    useEffect(() => {
        if (!isTutorialRunning) {
            // Small delay to let Joyride unmount its overlay first
            const timer = setTimeout(restoreScrollability, 100);
            return () => clearTimeout(timer);
        }
    }, [isTutorialRunning]);

    // Reset step index whenever tour starts
    useEffect(() => {
        if (isTutorialRunning) {
            requestAnimationFrame(() => setStepIndex(0));
        }
    }, [isTutorialRunning]);

    const handleJoyrideCallback = useCallback((data: CallBackProps) => {
        const { status, type, index, action } = data;

        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        // Tour ended — clean up
        if (finishedStatuses.includes(status)) {
            localStorage.setItem('hasSeenTutorial', 'true');
            stopTutorial();
            setCenterView('dashboard');
            // Force restore scroll
            restoreScrollability();
            return;
        }

        // Handle close button
        if (action === ACTIONS.CLOSE) {
            localStorage.setItem('hasSeenTutorial', 'true');
            stopTutorial();
            setCenterView('dashboard');
            restoreScrollability();
            return;
        }

        // Step navigation
        if (type === EVENTS.STEP_AFTER) {
            const nextIndex = index + (action === ACTIONS.PREV ? -1 : 1);

            // Pre-navigate before moving to the target step
            const nextTarget = tutorialSteps[nextIndex]?.target;

            if (nextTarget === '.tour-nav-recommendations') {
                setCenterView('recommendations');
            } else if (nextTarget === '.tour-nav-performance') {
                setCenterView('trends');
            } else if (nextTarget === '.tour-admin-integrations') {
                setCenterView('admin');
            } else if (nextTarget === '.tour-office-sidebar') {
                setCenterView('dashboard');
                setSidebarOpen?.(true);
            } else if (
                nextTarget === '.tour-kpi-strip' ||
                nextTarget === '.tour-office-grid > div:first-child'
            ) {
                setCenterView('dashboard');
            }

            // Navigation is instant so Joyride can find the element smoothly
            setStepIndex(nextIndex);
        }
    }, [stopTutorial, setCenterView, setSidebarOpen]);

    if (!mounted) return null;

    return (
        <Joyride
            steps={tutorialSteps}
            run={isTutorialRunning}
            stepIndex={stepIndex}
            continuous
            scrollToFirstStep
            showProgress
            showSkipButton
            disableOverlayClose
            disableScrollParentFix={false}
            tooltipComponent={CustomTooltip}
            callback={handleJoyrideCallback}
            scrollOffset={120}
            spotlightPadding={8}
            floaterProps={{
                disableAnimation: false,
                styles: {
                    floater: {
                        transition: 'opacity 0.3s ease, transform 0.3s ease',
                    }
                }
            }}
            styles={{
                options: {
                    zIndex: 10000,
                    overlayColor: 'rgba(0, 0, 0, 0.5)',
                    arrowColor: 'var(--bg-surface)',
                },
                spotlight: {
                    borderRadius: 12,
                },
                overlay: {
                    transition: 'background-color 0.3s ease',
                    backdropFilter: 'none',
                    WebkitBackdropFilter: 'none',
                },
            }}
        />
    );
}
