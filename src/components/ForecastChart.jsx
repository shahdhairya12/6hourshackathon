import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Activity 
} from 'lucide-react';
import { useFinance } from '../hooks/useFinance';

export default function ForecastChart() {
  const {
    currentDay,
    liquidBalance,
    commitments,
    subscriptions,
    averageDailySpend,
    safeDailyAllowance,
    simulatedImpact
  } = useFinance();

  const [hoveredDay, setHoveredDay] = useState(null);

  // Calculate 30-day balance trajectory series
  const trajectoryData = useMemo(() => {
    const points = [];
    
    // Upcoming commitments by day
    const upcomingBillsByDay = {};
    commitments.forEach(c => {
      if (!c.paid && c.dueDay > currentDay) {
        upcomingBillsByDay[c.dueDay] = (upcomingBillsByDay[c.dueDay] || 0) + Number(c.amount);
      }
    });
    subscriptions.forEach(s => {
      if (s.active && s.dueDay > currentDay) {
        upcomingBillsByDay[s.dueDay] = (upcomingBillsByDay[s.dueDay] || 0) + Number(s.amount);
      }
    });

    let currentProjectedBalance = liquidBalance;
    let simProjectedBalance = simulatedImpact.simLiquid;
    const dailyPace = Math.max(120, safeDailyAllowance);

    for (let d = 1; d <= 30; d++) {
      let baseline = Math.round(10000 - (d * (10000 / 30) * 0.85)); // leaves ₹1,500 buffer at end
      let actualOrProjected = 0;
      let simulatedVal = 0;

      if (d <= currentDay) {
        // Past / actual
        actualOrProjected = Math.round(10000 - (d * averageDailySpend));
        if (d === currentDay) actualOrProjected = liquidBalance;
        simulatedVal = actualOrProjected;
      } else {
        // Future projection
        const billToday = upcomingBillsByDay[d] || 0;
        currentProjectedBalance = currentProjectedBalance - dailyPace - billToday;
        actualOrProjected = Math.round(currentProjectedBalance);

        const simBillToday = upcomingBillsByDay[d] || 0;
        simProjectedBalance = simProjectedBalance - Math.max(80, simulatedImpact.simSafeDaily) - simBillToday;
        simulatedVal = Math.round(simProjectedBalance);
      }

      // Find any bills on this day
      const billsOnDay = [
        ...commitments.filter(c => c.dueDay === d),
        ...subscriptions.filter(s => s.dueDay === d && s.active)
      ];

      points.push({
        day: d,
        baseline,
        actualOrProjected,
        simulatedVal,
        isPast: d <= currentDay,
        isCurrent: d === currentDay,
        bills: billsOnDay,
        hasBill: billsOnDay.length > 0
      });
    }

    return points;
  }, [
    currentDay,
    liquidBalance,
    commitments,
    subscriptions,
    averageDailySpend,
    safeDailyAllowance,
    simulatedImpact
  ]);

  // SVG Chart Dimensions
  const width = 850;
  const height = 340;
  const padding = { top: 35, right: 35, bottom: 45, left: 60 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const minVal = -2000;
  const maxVal = 10500;

  const getX = (day) => padding.left + ((day - 1) / 29) * graphWidth;
  const getY = (val) => {
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    return padding.top + (1 - (clamped - minVal) / (maxVal - minVal)) * graphHeight;
  };

  const zeroY = getY(0);

  // Baseline Path
  const baselinePath = trajectoryData.reduce((acc, pt, idx) => {
    const cmd = idx === 0 ? 'M' : 'L';
    return `${acc} ${cmd} ${getX(pt.day)} ${getY(pt.baseline)}`;
  }, '');

  // Actual & Projected Path
  const projectedPath = trajectoryData.reduce((acc, pt, idx) => {
    const cmd = idx === 0 ? 'M' : 'L';
    return `${acc} ${cmd} ${getX(pt.day)} ${getY(pt.actualOrProjected)}`;
  }, '');

  // Area under projected path
  const projectedArea = `${projectedPath} L ${getX(30)} ${zeroY} L ${getX(1)} ${zeroY} Z`;

  // Simulated Path
  const simulatedPath = trajectoryData.reduce((acc, pt, idx) => {
    const cmd = idx === 0 ? 'M' : 'L';
    return `${acc} ${cmd} ${getX(pt.day)} ${getY(pt.simulatedVal)}`;
  }, '');

  // Find Insolvency Day
  const simInsolvencyDay = trajectoryData.find(pt => pt.simulatedVal <= 0 && pt.day >= currentDay);

  const activeHoverData = hoveredDay !== null ? trajectoryData[hoveredDay - 1] : trajectoryData[currentDay - 1];

  return (
    <div className="glass-panel p-6 sm:p-7 space-y-6 shadow-2xl">
      
      {/* Header & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5" />
            30-Day Trajectory Forecast Engine
          </div>
          <h3 className="text-xl sm:text-2xl font-heading font-black text-white">
            Where Will Your ₹10,000 Land by Day 30?
          </h3>
          <p className="text-xs text-slate-400">
            High-precision SVG curve tracking burn rate, bill milestones, and simulation impacts.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium bg-[#0b1022] px-3.5 py-2 rounded-xl border border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 bg-emerald-400 rounded-full" />
            <span className="text-slate-300">Baseline Target</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 bg-violet-400 rounded-full" />
            <span className="text-slate-300">Current Pacing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 bg-cyan-400 border-t-2 border-dashed border-cyan-400" />
            <span className="text-cyan-300 font-bold">Simulated Choice</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-rose-400">Insolvency Line (₹0)</span>
          </div>
        </div>
      </div>

      {/* Trajectory Alert Banner */}
      {simInsolvencyDay ? (
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 flex items-center justify-between text-xs text-rose-300 shadow-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 animate-bounce" />
            <span>
              <strong>CRITICAL SIMULATION WARNING:</strong> Executing this purchase causes your balance to crash to ₹0 on{' '}
              <strong className="underline text-white font-mono text-sm">Day {simInsolvencyDay.day}</strong>, leaving {30 - simInsolvencyDay.day} days in insolvency!
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold text-[10px] uppercase border border-rose-500/30">
            Deficit Alert
          </span>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-emerald-950/25 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300 shadow">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            Current pacing safely clears all commitments and concludes Month 1 with an estimated reserve of{' '}
            <strong className="font-mono text-white text-sm">₹{Math.max(0, trajectoryData[29].actualOrProjected).toLocaleString('en-IN')}</strong>.
          </span>
        </div>
      )}

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-x-auto select-none pt-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[420px] overflow-visible"
        >
          <defs>
            {/* Violet Area Gradient */}
            <linearGradient id="violetGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
            </linearGradient>
            {/* Danger Red Gradient below 0 */}
            <linearGradient id="dangerGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.25" />
            </linearGradient>
            {/* Filter for glowing line */}
            <filter id="glowViolet" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#8B5CF6" floodOpacity="0.6" />
            </filter>
            <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#06B6D4" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Grid lines (horizontal) */}
          {[10000, 7500, 5000, 2500, 0].map((val) => (
            <g key={val}>
              <line
                x1={padding.left}
                y1={getY(val)}
                x2={width - padding.right}
                y2={getY(val)}
                stroke={val === 0 ? '#EF4444' : 'rgba(255,255,255,0.07)'}
                strokeWidth={val === 0 ? 1.5 : 1}
                strokeDasharray={val === 0 ? '4 4' : 'none'}
              />
              <text
                x={padding.left - 10}
                y={getY(val) + 4}
                textAnchor="end"
                className="text-[10px] font-mono fill-slate-500 font-semibold"
              >
                ₹{val >= 1000 ? `${val / 1000}k` : val}
              </text>
            </g>
          ))}

          {/* Day Markers (vertical ticks) */}
          {[1, 5, 10, 15, 20, 25, 30].map((d) => (
            <g key={d}>
              <line
                x1={getX(d)}
                y1={padding.top}
                x2={getX(d)}
                y2={height - padding.bottom}
                stroke="rgba(255,255,255,0.05)"
              />
              <text
                x={getX(d)}
                y={height - padding.bottom + 18}
                textAnchor="middle"
                className="text-[10px] font-mono fill-slate-400 font-bold"
              >
                Day {d}
              </text>
            </g>
          ))}

          {/* Insolvency red shaded danger zone */}
          <rect
            x={padding.left}
            y={zeroY}
            width={graphWidth}
            height={height - padding.bottom - zeroY}
            fill="url(#dangerGradient)"
          />

          {/* Area under projected curve */}
          <path
            d={projectedArea}
            fill="url(#violetGradient)"
          />

          {/* Baseline Curve */}
          <path
            d={baselinePath}
            fill="none"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeOpacity="0.45"
            strokeDasharray="4 4"
          />

          {/* Current Trajectory Curve */}
          <path
            d={projectedPath}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glowViolet)"
          />

          {/* Simulated Trajectory Curve */}
          <path
            d={simulatedPath}
            fill="none"
            stroke="#06B6D4"
            strokeWidth="2.5"
            strokeDasharray="6 3"
            filter="url(#glowCyan)"
          />

          {/* Bill Milestones On Chart */}
          {trajectoryData.filter(pt => pt.hasBill).map(pt => (
            <g key={`bill-${pt.day}`} className="cursor-pointer group">
              <circle
                cx={getX(pt.day)}
                cy={getY(pt.actualOrProjected)}
                r="6"
                fill="#F59E0B"
                stroke="#070913"
                strokeWidth="2.5"
                className="transition-all hover:scale-150"
              />
              <text
                x={getX(pt.day)}
                y={getY(pt.actualOrProjected) - 12}
                textAnchor="middle"
                className="text-[10px] font-mono fill-amber-300 font-bold group-hover:fill-white"
              >
                {pt.bills[0].icon} ₹{pt.bills.reduce((s, b) => s + b.amount, 0)}
              </text>
            </g>
          ))}

          {/* Current Day Glowing Vertical Laser */}
          <g>
            <line
              x1={getX(currentDay)}
              y1={padding.top}
              x2={getX(currentDay)}
              y2={height - padding.bottom}
              stroke="#06B6D4"
              strokeWidth="2.5"
              strokeDasharray="2 2"
              className="animate-pulse"
            />
            <circle
              cx={getX(currentDay)}
              cy={getY(liquidBalance)}
              r="8"
              fill="#06B6D4"
              stroke="#FFFFFF"
              strokeWidth="3"
            />
            <text
              x={getX(currentDay)}
              y={padding.top - 12}
              textAnchor="middle"
              className="text-[11px] font-mono font-bold fill-cyan-400 uppercase tracking-wider"
            >
              Today (D{currentDay})
            </text>
          </g>

          {/* Interactive Hover Point Overlay Areas */}
          {trajectoryData.map((pt) => (
            <rect
              key={`hover-rect-${pt.day}`}
              x={getX(pt.day) - (graphWidth / 58)}
              y={padding.top}
              width={graphWidth / 29}
              height={graphHeight}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredDay(pt.day)}
            />
          ))}

          {/* Hover Indicator Crosshair */}
          {hoveredDay && (
            <g pointerEvents="none">
              <line
                x1={getX(hoveredDay)}
                y1={padding.top}
                x2={getX(hoveredDay)}
                y2={height - padding.bottom}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.5"
              />
              <circle
                cx={getX(hoveredDay)}
                cy={getY(activeHoverData.actualOrProjected)}
                r="6"
                fill="#8B5CF6"
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Interactive Day Scrubber Slider & Inspector */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 bg-[#0a0e20] p-3 rounded-2xl border border-white/10">
          <span className="text-xs font-mono text-slate-400 whitespace-nowrap">Scrub Month:</span>
          <input
            type="range"
            min="1"
            max="30"
            value={hoveredDay || currentDay}
            onChange={(e) => setHoveredDay(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs font-mono font-bold text-cyan-300 w-16 text-right">
            Day {hoveredDay || currentDay}
          </span>
        </div>

        {/* Scrubber Inspector Card */}
        {activeHoverData && (
          <div className="p-4 rounded-2xl bg-[#0c1124] border border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-600/20 text-violet-300 border border-violet-500/40 flex items-center justify-center font-heading font-black font-mono text-lg shadow">
                D{activeHoverData.day}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Day {activeHoverData.day} Status Inspector</span>
                  {activeHoverData.day === currentDay && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                      Current Day
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400">
                  {activeHoverData.day <= currentDay ? 'Actual Past Balance' : 'Simulated Future Runway'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div>
                <div className="text-[11px] text-slate-400 font-mono">Projected Balance</div>
                <div className={`text-lg font-bold font-mono ${
                  activeHoverData.actualOrProjected < 0 ? 'text-rose-400' : 'text-white'
                }`}>
                  ₹{activeHoverData.actualOrProjected.toLocaleString('en-IN')}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-cyan-400 font-mono">With Simulation</div>
                <div className="text-lg font-bold font-mono text-cyan-300">
                  ₹{activeHoverData.simulatedVal.toLocaleString('en-IN')}
                </div>
              </div>

              {activeHoverData.hasBill && (
                <div className="bg-amber-500/15 border border-amber-500/40 px-3.5 py-1.5 rounded-xl">
                  <div className="text-[10px] text-amber-400 font-bold uppercase font-mono">Bills Scheduled</div>
                  <div className="text-xs text-amber-200 font-semibold">
                    {activeHoverData.bills.map(b => `${b.name} (₹${b.amount})`).join(', ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
