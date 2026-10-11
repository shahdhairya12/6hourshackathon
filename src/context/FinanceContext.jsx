import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { PERSONAS, CURVEBALL_EVENTS } from '../data/initialData';
import { sound } from '../utils/audio';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { FinanceContext } from './financeContextInstance';
import {
  calculateLiquidBalance,
  calculatePendingCommitments,
  calculatePendingSubscriptions,
  calculateTrueFreeCash,
  calculateSafeDailyAllowance,
  calculateAverageDailySpend,
  calculateRunwayDays,
  calculateFinancialRisk,
  calculateFinancialHealth,
  calculateGamification
} from '../utils/financeMath';

export function FinanceProvider({ children }) {
  // Current Persona (persisted)
  const [selectedPersonaId, setSelectedPersonaId] = useLocalStorage('pulse_persona_id', PERSONAS[0].id);
  const currentPersona = useMemo(
    () => PERSONAS.find(p => p.id === selectedPersonaId) || PERSONAS[0],
    [selectedPersonaId]
  );

  // Month state (Day 1 to 30)
  const [currentDay, setCurrentDay] = useLocalStorage('pulse_current_day', 3);
  const [soundEnabled, setSoundEnabled] = useLocalStorage('pulse_sound_enabled', true);

  // Core financial entities initialized from persona or local storage
  const [commitments, setCommitments] = useLocalStorage('pulse_commitments', currentPersona.commitments);
  const [subscriptions, setSubscriptions] = useLocalStorage('pulse_subscriptions', currentPersona.subscriptions);
  const [savingsGoals, setSavingsGoals] = useLocalStorage('pulse_savings_goals', currentPersona.savingsGoals);
  const [transactions, setTransactions] = useLocalStorage('pulse_transactions', currentPersona.initialTransactions);
  const [wishlist, setWishlist] = useLocalStorage('pulse_wishlist', []);
  const [curveballHistory, setCurveballHistory] = useLocalStorage('pulse_curveball_history', []);
  
  // UI Tabs & Modals
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isWrapModalOpen, setIsWrapModalOpen] = useState(false);

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

  // Derived Core Financial Metrics
  const totalLockedInSavings = useMemo(() => {
    return savingsGoals.reduce((sum, g) => sum + (Number(g.current) || 0), 0);
  }, [savingsGoals]);

  const liquidBalance = useMemo(() => {
    return calculateLiquidBalance(transactions, savingsGoals);
  }, [transactions, savingsGoals]);

  const daysRemaining = useMemo(() => {
    return Math.max(1, 30 - currentDay + 1);
  }, [currentDay]);

  const pendingCommitmentsList = useMemo(() => {
    return commitments.filter(c => !c.paid);
  }, [commitments]);

  const pendingCommitmentsTotal = useMemo(() => {
    return calculatePendingCommitments(commitments, currentDay);
  }, [commitments, currentDay]);

  const pendingSubscriptionsList = useMemo(() => {
    return subscriptions.filter(s => s.active && s.dueDay >= currentDay);
  }, [subscriptions, currentDay]);

  const pendingSubscriptionsTotal = useMemo(() => {
    return calculatePendingSubscriptions(subscriptions, currentDay);
  }, [subscriptions, currentDay]);

  const totalPendingLiabilities = pendingCommitmentsTotal + pendingSubscriptionsTotal;

  const trueFreeCash = useMemo(() => {
    return calculateTrueFreeCash(liquidBalance, totalPendingLiabilities);
  }, [liquidBalance, totalPendingLiabilities]);

  const safeDailyAllowance = useMemo(() => {
    return calculateSafeDailyAllowance(trueFreeCash, daysRemaining);
  }, [trueFreeCash, daysRemaining]);

  const averageDailySpend = useMemo(() => {
    return calculateAverageDailySpend(transactions, currentDay);
  }, [transactions, currentDay]);

  const runwayDays = useMemo(() => {
    return calculateRunwayDays(liquidBalance, averageDailySpend, 30);
  }, [liquidBalance, averageDailySpend]);

  const emergencyGoal = useMemo(() => {
    return savingsGoals.find(g => g.name.toLowerCase().includes('emergency'));
  }, [savingsGoals]);

  const financialRisk = useMemo(() => {
    return calculateFinancialRisk({
      liquidBalance,
      totalLiabilities: totalPendingLiabilities,
      safeDailyAllowance,
      runwayDays,
      daysRemaining,
      emergencySavings: emergencyGoal ? emergencyGoal.current : 0
    });
  }, [liquidBalance, totalPendingLiabilities, safeDailyAllowance, runwayDays, daysRemaining, emergencyGoal]);

  const totalSavingsTarget = useMemo(() => {
    return savingsGoals.reduce((s, g) => s + (Number(g.target) || 0), 0);
  }, [savingsGoals]);

  const financialHealth = useMemo(() => {
    return calculateFinancialHealth({
      financialRisk,
      totalLockedSavings: totalLockedInSavings,
      totalSavingsTarget,
      trueFreeCash,
      safeDailyAllowance
    });
  }, [financialRisk, totalLockedInSavings, totalSavingsTarget, trueFreeCash, safeDailyAllowance]);

  // Gamification Level and Badges
  const gamification = useMemo(() => {
    const pausedSubs = subscriptions.filter(s => !s.active).length;
    return calculateGamification({
      wishlistCount: wishlist.length,
      emergencySavings: emergencyGoal ? emergencyGoal.current : 0,
      pausedSubscriptionsCount: pausedSubs,
      healthScore: financialHealth,
      currentDay,
      liquidBalance
    });
  }, [wishlist, emergencyGoal, subscriptions, financialHealth, currentDay, liquidBalance]);

  // Status Tiers
  const riskStatus = useMemo(() => {
    if (financialRisk < 28) return { label: 'Low Risk', color: '#10B981', vibe: 'Chill & Covered 🛡️', bg: 'rgba(16, 185, 129, 0.15)' };
    if (financialRisk < 52) return { label: 'Moderate', color: '#F59E0B', vibe: 'Balanced Pacing ⚡', bg: 'rgba(245, 158, 11, 0.15)' };
    if (financialRisk < 75) return { label: 'Elevated Risk', color: '#F97316', vibe: 'Tight Leeway ⚠️', bg: 'rgba(249, 115, 22, 0.15)' };
    return { label: 'Critical Risk', color: '#EF4444', vibe: 'Insolvency Alert 🚨', bg: 'rgba(239, 68, 68, 0.15)' };
  }, [financialRisk]);

  const healthStatus = useMemo(() => {
    if (financialHealth >= 82) return { label: 'Zen Master', desc: 'Flawless pacing & solid cushion', color: '#10B981', emoji: '🧘' };
    if (financialHealth >= 68) return { label: 'Smart Hustler', desc: 'On track with conscious trade-offs', color: '#06B6D4', emoji: '💼' };
    if (financialHealth >= 50) return { label: 'Tightrope Walker', desc: 'Budget vulnerable to surprise shocks', color: '#F59E0B', emoji: '🎪' };
    return { label: 'Code Red Survivor', desc: 'Urgent expense freeze recommended', color: '#EF4444', emoji: '🚨' };
  }, [financialHealth]);

  // Total debited / credited
  const financialTotals = useMemo(() => {
    let income = 0;
    let spent = 0;
    transactions.forEach(t => {
      if (t.type === 'income') income += Number(t.amount);
      else spent += Number(t.amount);
    });
    return { income, spent };
  }, [transactions]);

  // SIMULATOR IMPACT ENGINE: What-If Analysis
  const simulatedImpact = useMemo(() => {
    const simAmount = Number(simulation.amount) || 0;
    const simLiquid = liquidBalance - simAmount;
    const simFreeCash = trueFreeCash - simAmount;
    const simSafeDaily = calculateSafeDailyAllowance(simFreeCash, daysRemaining);
    const dailyDrop = safeDailyAllowance - simSafeDaily;

    // Simulated risk
    let simRisk = financialRisk;
    if (simAmount > 0) {
      const dropRatio = simAmount / Math.max(1, liquidBalance);
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

    const simRunway = averageDailySpend > 0 ? calculateRunwayDays(simLiquid, averageDailySpend, 30) : runwayDays;

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
        analysis: `If you spend ₹${simAmount}, you will NOT have enough cash (short by ₹${Math.abs(simFreeCash)}) to clear your upcoming commitments (Bills: ₹${totalPendingLiabilities})!`,
        action: 'Crucial: Skip this purchase or unfreeze a savings goal before you hit Day 30.'
      };
    } else if (dailyDrop > 50 || simSafeDaily < 120) {
      verdict = {
        status: 'warning',
        headline: '⚠️ Harsh Leeway Squeeze!',
        analysis: `Your daily discretionary spend drops from ₹${safeDailyAllowance}/day down to ₹${simSafeDaily}/day (-₹${dailyDrop}/day penalty). A single auto surge or cafe meet will trigger debt.`,
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
    liquidBalance,
    trueFreeCash,
    daysRemaining,
    safeDailyAllowance,
    financialRisk,
    financialHealth,
    averageDailySpend,
    runwayDays,
    totalPendingLiabilities
  ]);

  // ACTIONS
  const advanceDay = (steps = 1) => {
    const nextDay = Math.min(30, currentDay + steps);
    if (nextDay === currentDay) {
      showToast('You have reached Day 30 of your monthly simulation!', 'info');
      return;
    }

    sound.playClick();
    setCurrentDay(nextDay);

    const dueCommitments = commitments.filter(c => !c.paid && c.dueDay > currentDay && c.dueDay <= nextDay);
    const dueSubs = subscriptions.filter(s => s.active && s.dueDay > currentDay && s.dueDay <= nextDay);

    if (dueCommitments.length > 0 || dueSubs.length > 0) {
      sound.playWarning();
      const names = [...dueCommitments.map(c => c.name), ...dueSubs.map(s => s.name)].join(', ');
      showToast(`Day ${nextDay} reached! Bills due: ${names}`, 'warning');
    } else {
      showToast(`Advanced to Day ${nextDay} of 30 (+${steps} days)`, 'info');
    }
  };

  const payCommitment = (commitmentId) => {
    const target = commitments.find(c => c.id === commitmentId);
    if (!target || target.paid) return;

    sound.playCoin();
    setCommitments(prev => prev.map(c => c.id === commitmentId ? { ...c, paid: true } : c));
    
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

    if (simulatedImpact.simFreeCash < 0) {
      sound.playWarning();
    }
  };

  const saveToWishlist = () => {
    if (!simulation.amount) return;
    sound.playSuccess();
    confetti({
      particleCount: 50,
      spread: 70,
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

  const depositToGoal = (goalId, amount) => {
    const target = savingsGoals.find(g => g.id === goalId);
    if (!target) return;
    const addAmt = Number(amount);
    if (addAmt <= 0) return;

    if (liquidBalance < addAmt) {
      sound.playWarning();
      showToast(`Cannot lock ₹${addAmt}: Liquid balance is only ₹${liquidBalance}!`, 'warning');
      return;
    }

    sound.playCoin();
    setSavingsGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        const nextVal = Math.min(g.target, g.current + addAmt);
        if (nextVal >= g.target) {
          confetti({ particleCount: 90, spread: 90 });
          sound.playSuccess();
        }
        return { ...g, current: nextVal };
      }
      return g;
    }));

    showToast(`Locked ₹${addAmt} into "${target.name}". Safety buffer strengthened!`, 'success');
  };

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

  const spinCurveball = () => {
    sound.playRoulette();
    const available = CURVEBALL_EVENTS.filter(e => !curveballHistory.some(h => h.id === e.id));
    const pool = available.length > 0 ? available : CURVEBALL_EVENTS;
    const picked = pool[Math.floor(Math.random() * pool.length)];

    setTimeout(() => {
      if (picked.type === 'positive') {
        sound.playSuccess();
        confetti({ particleCount: 65, spread: 75 });
      } else {
        sound.playWarning();
      }

      const eventRecord = {
        ...picked,
        occurredDay: currentDay,
        timestamp: Date.now()
      };

      setCurveballHistory(prev => [eventRecord, ...prev]);

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
        selectedPersonaId,
        currentPersona,
        switchPersona,
        resetMonth,

        currentDay,
        setCurrentDay,
        daysRemaining,
        advanceDay,
        soundEnabled,
        handleToggleSound,

        commitments,
        subscriptions,
        savingsGoals,
        transactions,
        wishlist,
        curveballHistory,
        activeTab,
        setActiveTab,
        isWrapModalOpen,
        setIsWrapModalOpen,

        liquidBalance,
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
        gamification,

        simulation,
        setSimulation,
        simulatedImpact,
        commitSimulation,
        saveToWishlist,

        payCommitment,
        toggleSubscription,
        depositToGoal,
        withdrawFromGoal,
        spinCurveball,
        addTransaction,

        toast,
        showToast
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

