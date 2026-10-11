import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PERSONAS, SIMULATION_PRESETS, CURVEBALL_EVENTS } from '../data/initialData';
import { sound } from '../utils/audio';

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  // Current Persona
  const [selectedPersonaId, setSelectedPersonaId] = useState(PERSONAS[0].id);
  const currentPersona = useMemo(
    () => PERSONAS.find(p => p.id === selectedPersonaId) || PERSONAS[0],
    [selectedPersonaId]
  );

  // Month state (Day 1 to 30)
  const [currentDay, setCurrentDay] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Core financial entities initialized from persona
  const [commitments, setCommitments] = useState(currentPersona.commitments);
  const [subscriptions, setSubscriptions] = useState(currentPersona.subscriptions);
  const [savingsGoals, setSavingsGoals] = useState(currentPersona.savingsGoals);
  const [transactions, setTransactions] = useState(currentPersona.initialTransactions);
  const [wishlist, setWishlist] = useState([]);
  const [curveballHistory, setCurveballHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | simulator | commitments | goals | trajectory | curveball

  // What-If Simulation State
  const [simulation, setSimulation] = useState({
    name: 'Midnight Biryani + Swiggy Craving',
    amount: 460,
    category: 'food',
    icon: '🍗',
    frequency: 'one-off',
    active: false,
  });

  // Notifications / Feedback toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Switch Persona and re-seed
  const switchPersona = (personaId) => {
    const target = PERSONAS.find(p => p.id === personaId);
    if (!target) return;
    setSelectedPersonaId(personaId);
    setCurrentDay(3);
    setCommitments(target.commitments);
    setSubscriptions(target.subscriptions);
    setSavingsGoals(target.savingsGoals);
    setTransactions(target.initialTransactions);
    setWishlist([]);
    setCurveballHistory([]);
    setSimulation({
      name: 'Midnight Biryani + Swiggy Craving',
      amount: 460,
      category: 'food',
      icon: '🍗',
      frequency: 'one-off',
      active: false,
    });
    sound.playClick();
    showToast(`Switched profile to ${target.name}`, 'info');
  };

  // Reset current month back to Day 1
  const resetMonth = () => {
    setCurrentDay(1);
    setCommitments(currentPersona.commitments.map(c => ({ ...c, paid: false })));
    setSubscriptions(currentPersona.subscriptions);
    setSavingsGoals(currentPersona.savingsGoals.map(g => ({ ...g, current: Math.round(g.target * 0.2) })));
    setTransactions([
      { id: 't1', day: 1, name: 'Monthly Budget Allocated', amount: 10000, type: 'income', category: 'budget', note: 'Monthly 30-Day Budget' }
    ]);
    setWishlist([]);
    setCurveballHistory([]);
    sound.playClick();
    showToast('Month reset to Day 1. ₹10,000 ready to deploy!', 'success');
  };

  // Toggle audio
  const handleToggleSound = () => {
    const state = sound.toggleSound();
    setSoundEnabled(state);
    showToast(state ? 'Sound Effects Enabled 🔊' : 'Sound Muted 🔇', 'info');
  };

  // Calculations: Liquid Cash, Savings Locked, Liabilities
  const totalLockedInSavings = useMemo(() => {
    return savingsGoals.reduce((sum, g) => sum + (Number(g.current) || 0), 0);
  }, [savingsGoals]);

  // Total credits and debits from transactions
  const financialTotals = useMemo(() => {
    let income = 0;
    let spent = 0;

    transactions.forEach(t => {
      if (t.type === 'income') {
        income += Number(t.amount);
      } else {
        spent += Number(t.amount);
      }
    });

    // Liquid balance = all income received - all transactions spent - funds locked in savings vaults
    // Note: initial budget is an income transaction (t1).
    const liquidBalance = income - spent - totalLockedInSavings;

    return {
      income,
      spent,
      liquidBalance: Math.max(-5000, liquidBalance) // allow showing negative for debt alert
    };
  }, [transactions, totalLockedInSavings]);

  // Days left in 30-day month
  const daysRemaining = useMemo(() => {
    return Math.max(1, 30 - currentDay + 1);
  }, [currentDay]);

  // Pending Commitments (Bills not yet paid and due on or after today, or overdue)
  const pendingCommitmentsList = useMemo(() => {
    return commitments.filter(c => !c.paid);
  }, [commitments]);

  const pendingCommitmentsTotal = useMemo(() => {
    return pendingCommitmentsList.reduce((sum, c) => sum + Number(c.amount), 0);
  }, [pendingCommitmentsList]);

  // Active Subscriptions due for the rest of the month
  const pendingSubscriptionsList = useMemo(() => {
    return subscriptions.filter(s => s.active && s.dueDay >= currentDay);
  }, [subscriptions, currentDay]);

  const pendingSubscriptionsTotal = useMemo(() => {
    return pendingSubscriptionsList.reduce((sum, s) => sum + Number(s.amount), 0);
  }, [pendingSubscriptionsList]);

  const totalPendingLiabilities = pendingCommitmentsTotal + pendingSubscriptionsTotal;

  // True Free Cash Flow
  const trueFreeCash = financialTotals.liquidBalance - totalPendingLiabilities;

  // Safe Daily Allowance
  const safeDailyAllowance = Math.max(0, Math.floor(trueFreeCash / daysRemaining));

  // Burn rate so far
  const averageDailySpend = useMemo(() => {
    const nonBudgetExpenses = transactions
      .filter(t => t.type !== 'income' && t.day <= currentDay)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return currentDay > 1 ? Math.round(nonBudgetExpenses / currentDay) : 300;
  }, [transactions, currentDay]);

  // Runway in Days
  const runwayDays = useMemo(() => {
    if (financialTotals.liquidBalance <= 0) return 0;
    const dailyPace = Math.max(120, averageDailySpend);
    return Math.min(30, Math.floor(financialTotals.liquidBalance / dailyPace));
  }, [financialTotals.liquidBalance, averageDailySpend]);

  // Financial Risk Calculation (0 - 100)
  const financialRisk = useMemo(() => {
    let score = 15; // baseline

    // 1. Liability coverage pressure
    if (financialTotals.liquidBalance <= 0) {
      score += 60;
    } else {
      const liabilityRatio = totalPendingLiabilities / financialTotals.liquidBalance;
      if (liabilityRatio > 0.8) score += 35;
      else if (liabilityRatio > 0.5) score += 22;
      else if (liabilityRatio > 0.3) score += 10;
    }

    // 2. Daily allowance pressure
    if (safeDailyAllowance < 100) score += 30;
    else if (safeDailyAllowance < 180) score += 18;
    else if (safeDailyAllowance > 300) score -= 10;

    // 3. Runway deficit
    if (runwayDays < daysRemaining) {
      score += Math.min(25, (daysRemaining - runwayDays) * 3);
    } else {
      score -= 8;
    }

    // 4. Emergency fund check
    const emergencyPot = savingsGoals.find(g => g.name.toLowerCase().includes('emergency'));
    if (emergencyPot && emergencyPot.current < 500) {
      score += 15;
    } else if (emergencyPot && emergencyPot.current >= 1200) {
      score -= 10;
    }

    return Math.max(5, Math.min(99, Math.round(score)));
  }, [financialTotals.liquidBalance, totalPendingLiabilities, safeDailyAllowance, runwayDays, daysRemaining, savingsGoals]);

  // Financial Health Score (0 - 100)
  const financialHealth = useMemo(() => {
    // 100 - risk adjusted + savings bonus
    const totalSavingsTarget = savingsGoals.reduce((s, g) => sumTarget(s, g), 0);
    const savingsRatio = totalSavingsTarget > 0 ? totalLockedInSavings / totalSavingsTarget : 0.5;

    let health = 100 - (financialRisk * 0.65) + (savingsRatio * 20);
    if (trueFreeCash < 500) health -= 15;
    if (safeDailyAllowance < 150) health -= 10;

    return Math.max(10, Math.min(98, Math.round(health)));
  }, [financialRisk, totalLockedInSavings, savingsGoals, trueFreeCash, safeDailyAllowance]);

  function sumTarget(sum, g) {
    return sum + (Number(g.target) || 0);
  }

  // Risk Rating Category
  const riskStatus = useMemo(() => {
    if (financialRisk < 28) return { label: 'Low Risk', color: '#10B981', vibe: 'Chill & Covered 🛡️', bg: 'rgba(16, 185, 129, 0.15)' };
    if (financialRisk < 52) return { label: 'Moderate', color: '#F59E0B', vibe: 'Balanced Pacing ⚡', bg: 'rgba(245, 158, 11, 0.15)' };
    if (financialRisk < 75) return { label: 'Elevated Risk', color: '#F97316', vibe: 'Tight Leeway ⚠️', bg: 'rgba(249, 115, 22, 0.15)' };
    return { label: 'Critical Risk', color: '#EF4444', vibe: 'Insolvency Alert 🚨', bg: 'rgba(239, 68, 68, 0.15)' };
  }, [financialRisk]);

  // Health Rating Category
  const healthStatus = useMemo(() => {
    if (financialHealth >= 82) return { label: 'Zen Master', desc: 'Flawless pacing & solid cushion', color: '#10B981', emoji: '🧘' };
    if (financialHealth >= 68) return { label: 'Smart Hustler', desc: 'On track with conscious trade-offs', color: '#06B6D4', emoji: '💼' };
    if (financialHealth >= 50) return { label: 'Tightrope Walker', desc: 'Budget vulnerable to surprise shocks', color: '#F59E0B', emoji: '🎪' };
    return { label: 'Code Red Survivor', desc: 'Urgent expense freeze recommended', color: '#EF4444', emoji: '🚨' };
  }, [financialHealth]);

  // SIMULATOR IMPACT ENGINE: What-If Analysis
  const simulatedImpact = useMemo(() => {
    const simAmount = Number(simulation.amount) || 0;
    const simLiquid = financialTotals.liquidBalance - simAmount;
    const simFreeCash = trueFreeCash - simAmount;
    const simSafeDaily = Math.max(0, Math.floor(simFreeCash / daysRemaining));
    const dailyDrop = safeDailyAllowance - simSafeDaily;

    // Simulated risk
    let simRisk = financialRisk;
    if (simAmount > 0) {
      const dropRatio = simAmount / Math.max(1, financialTotals.liquidBalance);
      simRisk += Math.round(dropRatio * 40);
      if (simSafeDaily < 120) simRisk += 15;
    }
    simRisk = Math.max(5, Math.min(99, simRisk));

    // Simulated health
    let simHealth = financialHealth;
    if (simAmount > 0) {
      const penalty = Math.round((simAmount / 250) + (dailyDrop / 15));
      simHealth = Math.max(10, Math.min(98, simHealth - penalty));
    }

    // Runway impact
    const simRunway = averageDailySpend > 0 ? Math.max(0, Math.floor(simLiquid / averageDailySpend)) : runwayDays;

    // AI Verdict Gen Z Persona Roast & Advice
    let verdict = {
      status: 'safe',
      headline: 'Budget Looks Clean 🚀',
      analysis: `This ₹${simAmount} purchase takes ₹${dailyDrop}/day off your daily allowance, leaving you with ₹${simSafeDaily}/day.`,
      action: 'You can absorb this without jeopardizing bills or savings goals.'
    };

    if (simFreeCash < 0) {
      verdict = {
        status: 'danger',
        headline: '🚨 Financial Redline: Default Warning!',
        analysis: `If you spend ₹${simAmount}, you will NOT have enough cash (short by ₹${Math.abs(simFreeCash)}) to clear your upcoming commitments (Rent & Bills: ₹${totalPendingLiabilities})!`,
        action: 'Crucial: Skip this purchase or unfreeze a savings goal before you hit Day 30.'
      };
    } else if (dailyDrop > 50 || simSafeDaily < 120) {
      verdict = {
        status: 'warning',
        headline: '⚠️ Harsh Leeway Squeeze!',
        analysis: `Your daily discretionary spending drops from ₹${safeDailyAllowance}/day down to ₹${simSafeDaily}/day (-₹${dailyDrop}/day). A single auto surge or cafe meet will push you into red.`,
        action: 'Suggestion: Add to Wishlist for 48 hours, or look for a ₹' + Math.round(simAmount * 0.3) + ' alternative.'
      };
    } else if (simAmount > 1500) {
      verdict = {
        status: 'caution',
        headline: '⚡ Big Chunk Warning',
        analysis: `This represents ${Math.round((simAmount / 10000) * 100)}% of your entire monthly ₹10k budget in one single swipe.`,
        action: 'Consider whether this impulse brings 30-day value or temporary dopamine.'
      };
    }

    return {
      simLiquid,
      simFreeCash,
      simSafeDaily,
      dailyDrop,
      simRisk,
      simHealth,
      simRunway,
      verdict
    };
  }, [
    simulation,
    financialTotals.liquidBalance,
    trueFreeCash,
    daysRemaining,
    safeDailyAllowance,
    financialRisk,
    financialHealth,
    averageDailySpend,
    runwayDays,
    totalPendingLiabilities
  ]);

  // ACTION: Advance Day (Time Travel Month Simulation)
  const advanceDay = (steps = 1) => {
    const nextDay = Math.min(30, currentDay + steps);
    if (nextDay === currentDay) {
      showToast('You have reached Day 30 of your monthly simulation!', 'info');
      return;
    }

    sound.playClick();
    setCurrentDay(nextDay);

    // Auto-check bills due between currentDay and nextDay
    let dueCommitments = commitments.filter(c => !c.paid && c.dueDay > currentDay && c.dueDay <= nextDay);
    let dueSubs = subscriptions.filter(s => s.active && s.dueDay > currentDay && s.dueDay <= nextDay);

    if (dueCommitments.length > 0 || dueSubs.length > 0) {
      sound.playWarning();
      const names = [...dueCommitments.map(c => c.name), ...dueSubs.map(s => s.name)].join(', ');
      showToast(`Day ${nextDay} reached! Bills due: ${names}`, 'warning');
    } else {
      showToast(`Advanced to Day ${nextDay} of 30 (+${steps} days)`, 'info');
    }
  };

  // ACTION: Pay Commitment
  const payCommitment = (commitmentId) => {
    const target = commitments.find(c => c.id === commitmentId);
    if (!target || target.paid) return;

    sound.playCoin();
    setCommitments(prev => prev.map(c => c.id === commitmentId ? { ...c, paid: true } : c));
    
    // Log as transaction
    const newTx = {
      id: `tx_${Date.now()}`,
      day: currentDay,
      name: `Paid: ${target.name}`,
      amount: target.amount,
      type: 'commitment',
      category: target.category,
      note: `Fixed commitment cleared on Day ${currentDay}`
    };
    setTransactions(prev => [newTx, ...prev]);
    showToast(`Paid ₹${target.amount} for ${target.name}. Obligation cleared!`, 'success');
  };

  // ACTION: Toggle Subscription
  const toggleSubscription = (subscriptionId) => {
    const target = subscriptions.find(s => s.id === subscriptionId);
    if (!target) return;

    const nextState = !target.active;
    sound.playClick();
    setSubscriptions(prev => prev.map(s => s.id === subscriptionId ? { ...s, active: nextState } : s));

    if (nextState) {
      showToast(`Reactivated ${target.name} (₹${target.amount}/mo).`, 'info');
    } else {
      sound.playSuccess();
      showToast(`Cancelled ${target.name}! Saved ₹${target.amount} & freed +₹${Math.round(target.amount / daysRemaining)}/day!`, 'success');
    }
  };

  // ACTION: Commit Simulated Decision to Real Balance
  const commitSimulation = () => {
    if (!simulation.amount || Number(simulation.amount) <= 0) {
      showToast('Please enter a valid purchase amount', 'warning');
      return;
    }

    sound.playCoin();
    const newTx = {
      id: `tx_sim_${Date.now()}`,
      day: currentDay,
      name: simulation.name || 'Simulated Purchase',
      amount: Number(simulation.amount),
      type: 'expense',
      category: simulation.category || 'food',
      note: `Executed from What-If Simulator on Day ${currentDay}`
    };

    setTransactions(prev => [newTx, ...prev]);
    showToast(`Purchased "${simulation.name}" for ₹${simulation.amount}. Live balance & allowance updated!`, 'warning');

    // Trigger celebratory or warning sound depending on state
    if (simulatedImpact.simFreeCash < 0) {
      sound.playWarning();
    }
  };

  // ACTION: Save Simulated Item to Wishlist (Delayed Gratification)
  const saveToWishlist = () => {
    if (!simulation.amount) return;
    sound.playSuccess();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });

    const wishItem = {
      id: `wish_${Date.now()}`,
      name: simulation.name,
      amount: Number(simulation.amount),
      category: simulation.category,
      savedOnDay: currentDay,
      dailySavedAmount: Math.round(Number(simulation.amount) / daysRemaining)
    };

    setWishlist(prev => [wishItem, ...prev]);
    showToast(`Smart Move! Delayed "${simulation.name}" to Wishlist. Saved ₹${simulation.amount}! 🛡️`, 'success');
  };

  // ACTION: Deposit into Savings Goal
  const depositToGoal = (goalId, amount) => {
    const target = savingsGoals.find(g => g.id === goalId);
    if (!target) return;
    const addAmt = Number(amount);
    if (addAmt <= 0) return;

    if (financialTotals.liquidBalance < addAmt) {
      sound.playWarning();
      showToast(`Cannot lock ₹${addAmt}: Liquid balance is only ₹${financialTotals.liquidBalance}!`, 'warning');
      return;
    }

    sound.playCoin();
    setSavingsGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        const nextVal = Math.min(g.target, g.current + addAmt);
        if (nextVal >= g.target) {
          confetti({ particleCount: 80, spread: 80 });
          sound.playSuccess();
        }
        return { ...g, current: nextVal };
      }
      return g;
    }));

    showToast(`Locked ₹${addAmt} into "${target.name}". Safety buffer strengthened!`, 'success');
  };

  // ACTION: Withdraw from Savings Goal
  const withdrawFromGoal = (goalId, amount) => {
    const target = savingsGoals.find(g => g.id === goalId);
    if (!target) return;
    const subAmt = Number(amount);
    if (subAmt <= 0 || target.current < subAmt) {
      showToast('Insufficient funds in this savings vault', 'warning');
      return;
    }

    sound.playWarning();
    setSavingsGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return { ...g, current: Math.max(0, g.current - subAmt) };
      }
      return g;
    }));

    showToast(`Unlocked ₹${subAmt} from "${target.name}" back into liquid cash.`, 'info');
  };

  // ACTION: Trigger Curveball / Life Event Roulette
  const spinCurveball = () => {
    sound.playRoulette();
    // Pick random curveball not recently drawn
    const available = CURVEBALL_EVENTS.filter(e => !curveballHistory.some(h => h.id === e.id));
    const pool = available.length > 0 ? available : CURVEBALL_EVENTS;
    const picked = pool[Math.floor(Math.random() * pool.length)];

    setTimeout(() => {
      if (picked.type === 'positive') {
        sound.playSuccess();
        confetti({ particleCount: 60, spread: 70 });
      } else {
        sound.playWarning();
      }

      const eventRecord = {
        ...picked,
        occurredDay: currentDay,
        timestamp: Date.now()
      };

      setCurveballHistory(prev => [eventRecord, ...prev]);

      // Apply to transactions
      const newTx = {
        id: `tx_cb_${Date.now()}`,
        day: currentDay,
        name: picked.title,
        amount: Math.abs(picked.amount),
        type: picked.type === 'positive' ? 'income' : 'expense',
        category: picked.category,
        note: `Curveball Event: ${picked.desc}`
      };

      setTransactions(prev => [newTx, ...prev]);
      showToast(`Curveball Hit: ${picked.title} (${picked.amount > 0 ? '+' : ''}₹${picked.amount})`, picked.type === 'positive' ? 'success' : 'warning');
    }, 450);
  };

  // ACTION: Add Manual Expense or Income
  const addTransaction = (name, amount, type = 'expense', category = 'food', note = '') => {
    const val = Number(amount);
    if (!name || isNaN(val) || val <= 0) {
      showToast('Please enter a valid name and amount', 'warning');
      return;
    }

    if (type === 'income') {
      sound.playSuccess();
    } else {
      sound.playCoin();
    }

    const newTx = {
      id: `tx_${Date.now()}`,
      day: currentDay,
      name,
      amount: val,
      type,
      category,
      note: note || `Logged on Day ${currentDay}`
    };

    setTransactions(prev => [newTx, ...prev]);
    showToast(`${type === 'income' ? 'Credited' : 'Logged'} ₹${val} for "${name}".`, type === 'income' ? 'success' : 'info');
  };

  return (
    <FinanceContext.Provider
      value={{
        // Persona
        selectedPersonaId,
        currentPersona,
        switchPersona,
        resetMonth,

        // Day & Sound
        currentDay,
        setCurrentDay,
        daysRemaining,
        advanceDay,
        soundEnabled,
        handleToggleSound,

        // Financial Data
        commitments,
        subscriptions,
        savingsGoals,
        transactions,
        wishlist,
        curveballHistory,
        activeTab,
        setActiveTab,

        // Core Financial Metrics
        liquidBalance: financialTotals.liquidBalance,
        totalLockedInSavings,
        totalSpent: financialTotals.spent,
        totalIncome: financialTotals.income,
        pendingCommitmentsTotal,
        pendingCommitmentsList,
        pendingSubscriptionsTotal,
        pendingSubscriptionsList,
        totalPendingLiabilities,
        trueFreeCash,
        safeDailyAllowance,
        averageDailySpend,
        runwayDays,
        financialRisk,
        riskStatus,
        financialHealth,
        healthStatus,

        // What-If Simulator
        simulation,
        setSimulation,
        simulatedImpact,
        commitSimulation,
        saveToWishlist,

        // Actions
        payCommitment,
        toggleSubscription,
        depositToGoal,
        withdrawFromGoal,
        spinCurveball,
        addTransaction,

        // Toast
        toast,
        showToast
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
