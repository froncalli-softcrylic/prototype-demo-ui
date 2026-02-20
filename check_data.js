const fs = require('fs');

const md = fs.readFileSync('Heartland_Synthetic_Media_Data_ALL.md', 'utf8');
const sectionMatch = md.match(/## 3\. Office-Level Summary \(Aggregated\)([\s\S]*?)(?=\n## 4\.|\Z)/);
const sectionLines = sectionMatch[1].trim().split('\n');
const tableLines = sectionLines.filter(line => line.trim().startsWith('|'));
const rows = tableLines.slice(2);

const channels = {};
const offices = {};

const parseDollar = (s) => parseFloat(s.replace(/\$|,/g, '').trim()) || 0;
const parseNum = (s) => parseFloat(s.replace(/,/g, '').trim()) || 0;
const parsePct = (s) => (parseFloat(s.replace(/%/g, '').trim()) || 0) / 100.0;

for (const row of rows) {
    const cols = row.split('|').map(c => c.trim());
    if (cols.length < 18) continue;
    
    const officeId = parseInt(cols[1], 10);
    const officeName = cols[2];
    const channel = cols[5];
    const spend = parseDollar(cols[6]);
    const bookings = parseNum(cols[11]);
    const capacityUtil = parsePct(cols[17]);

    if (!channels[channel]) channels[channel] = { spend: 0, bookings: 0 };
    channels[channel].spend += spend;
    channels[channel].bookings += bookings;

    if (!offices[officeId]) {
        offices[officeId] = { name: officeName, spend: 0, bookings: 0, capSum: 0, count: 0 };
    }
    offices[officeId].spend += spend;
    offices[officeId].bookings += bookings;
    offices[officeId].capSum += capacityUtil;
    offices[officeId].count += 1;
}

console.log("Channels:");
for (const ch in channels) {
    const data = channels[ch];
    console.log(`  ${ch}: Spend=${data.spend}, Bookings=${data.bookings}, CPA=${data.spend/data.bookings}`);
}

console.log("\nOffices:");
for (const id in offices) {
    const data = offices[id];
    console.log(`  ${data.name}: Spend=${data.spend}, Bookings=${data.bookings}, AvgCap=${data.capSum/data.count}`);
}
