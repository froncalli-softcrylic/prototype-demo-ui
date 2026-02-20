'use client';

import { useApp } from '@/context/AppContext';
import PerformanceAnalytics from './PerformanceAnalytics';

export default function PerformanceTrends() {
    const { selectedOfficeId } = useApp();

    return (
        <div>
            {/* Cross-Office Top Analytics */}
            {!selectedOfficeId && (
                <PerformanceAnalytics />
            )}
        </div>
    );
}
