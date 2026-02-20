import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-static';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'Heartland_Synthetic_Media_Data_ALL.md');
        const fileContent = await fs.readFile(filePath, 'utf-8');

        // Extract Section 3: Office-Level Summary (Aggregated)
        // Look for the header, then capture lines until the next section (## 4) or End of File
        const sectionMatch = fileContent.match(/## 3\. Office-Level Summary \(Aggregated\)([\s\S]*?)(?=\n## 4\.|[ \t]*$)/);

        if (!sectionMatch) {
            return NextResponse.json({ error: 'Data section not found in file' }, { status: 500 });
        }

        const sectionLines = sectionMatch[1].trim().split('\n');

        // Filter lines that start with the table marker |
        const tableLines = sectionLines.filter(line => line.trim().startsWith('|'));

        if (tableLines.length < 3) {
            return NextResponse.json({ error: 'Data table not found in section' }, { status: 500 });
        }

        // The first two lines are header and separator, so we skip them
        const rows = tableLines.slice(2);

        const channels: Record<string, { spend: number, bookings: number, conversions: number, conversionsIncremental: number }> = {};
        const offices: Record<number, { officeId: number, name: string, spend: number, bookings: number, capacityUtilSum: number, count: number }> = {};

        const summary = {
            totalWeeklySpend: 0,
            totalSpendOutright: 0,
            totalObservedConversions: 0,
            totalIncrementalConversions: 0,
            totalBookings: 0,
            officeCapacitySum: 0,
            officeCount: 0
        };

        // Helper functions
        const parseDollar = (s: string) => parseFloat(s.replace(/\$|,/g, '').trim()) || 0;
        const parseNum = (s: string) => parseFloat(s.replace(/,/g, '').trim()) || 0;
        const parsePct = (s: string) => (parseFloat(s.replace(/%/g, '').trim()) || 0) / 100.0;

        for (const row of rows) {
            // Split by | and filter out the empty first and last strings from the borders
            const cols = row.split('|').map(c => c.trim());
            // Need at least 18 columns conceptually, based on standard full markdown line
            // cols[0] is empty, cols[1] should be OfficeID
            if (cols.length < 18) continue;

            const officeId = parseInt(cols[1], 10);
            if (isNaN(officeId)) continue;

            const officeName = cols[2];
            const channel = cols[5];
            const spend = parseDollar(cols[6]);
            const conversions = parseNum(cols[9]); // Conversions Observed
            const conversionsIncremental = parseNum(cols[10]); // Conversions Incremental
            const bookings = parseNum(cols[11]); // Total Bookings
            const avgWkSpend = parseDollar(cols[13]);
            const capacityUtil = parsePct(cols[17]); // Avg Capacity Utilization

            // Global Summary calculations
            summary.totalSpendOutright += spend;
            summary.totalObservedConversions += conversions;
            summary.totalIncrementalConversions += conversionsIncremental;
            summary.totalBookings += bookings;
            summary.totalWeeklySpend += avgWkSpend;

            // Channel aggregation
            if (!channels[channel]) {
                channels[channel] = { spend: 0, bookings: 0, conversions: 0, conversionsIncremental: 0 };
            }
            channels[channel].spend += spend;
            channels[channel].bookings += bookings;
            channels[channel].conversions += conversions;
            channels[channel].conversionsIncremental += conversionsIncremental;

            // Office aggregation
            if (!offices[officeId]) {
                // Shorten name if possible for better chart fitting, consistent with what's done in UI
                const shortName = officeName.split(' - ')[0].replace('Dental Care at ', '').replace(' Dentistry', '');
                const displayName = shortName.length > 20 ? shortName.substring(0, 18) + '...' : shortName;

                offices[officeId] = {
                    officeId,
                    name: displayName,
                    spend: 0,
                    bookings: 0,
                    capacityUtilSum: 0,
                    count: 0
                };

                // Track unique office capacity sums for accurate global averaging
                summary.officeCapacitySum += capacityUtil;
                summary.officeCount += 1;
            }
            offices[officeId].spend += spend;
            offices[officeId].bookings += bookings;
            // The capacity util might be recorded 3 times per office (for each channel), 
            // but representing the identical total avg util, so we average it appropriately:
            offices[officeId].capacityUtilSum += capacityUtil;
            offices[officeId].count += 1;
        }

        const channelData = Object.entries(channels).map(([ch, data]) => {
            // Clean up channel name for the chart consistency
            const displayName = ch === 'Google_Search' ? 'Google' : ch === 'Google_Programmatic' ? 'Programmatic' : ch;
            return {
                channel: displayName,
                spend: data.spend,
                bookings: data.bookings,
                conversions: data.conversions,
                conversionsIncremental: data.conversionsIncremental,
                cpa: data.conversionsIncremental > 0 ? data.spend / data.conversionsIncremental : 0
            };
        });

        const officeData = Object.values(offices).map(data => ({
            officeId: data.officeId,
            name: data.name,
            spend: data.spend,
            bookings: data.bookings,
            avgCapacityUtil: data.count > 0 ? (data.capacityUtilSum / data.count) : 0
        })).sort((a, b) => b.spend - a.spend);

        const finalSummary = {
            totalWeeklySpend: summary.totalWeeklySpend,
            // 2 years assumed calculation (104 weeks) explicitly derived from the total bookings 
            totalWeeklyBookings: summary.totalBookings > 0 ? Math.round(summary.totalBookings / 104) : 0,
            avgCPAObserved: summary.totalObservedConversions > 0 ? (summary.totalSpendOutright / summary.totalObservedConversions) : 0,
            avgCPAIncremental: summary.totalIncrementalConversions > 0 ? (summary.totalSpendOutright / summary.totalIncrementalConversions) : 0,
            avgCapacityUtil: summary.officeCount > 0 ? (summary.officeCapacitySum / summary.officeCount) : 0
        };

        return NextResponse.json({
            summary: finalSummary,
            channels: channelData,
            offices: officeData
        });

    } catch (error) {
        console.error("Error reading or parsing markdown data:", error);
        return NextResponse.json({ error: 'Failed to process data file' }, { status: 500 });
    }
}
