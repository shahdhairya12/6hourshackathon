/**
 * @file FinanceContext.jsx
 * @description Central Single Source of Truth (SSOT) State & Action Controller
 * for the PULSE Gen Z Financial Operating System.
 * Synchronizes deterministic calculations, Web Audio, UPI Soundbox, and LocalStorage.
 * @author PULSE OS Engineering
 * @version 1.1.0
 */

import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { PERSONAS, CURVEBALL_EVENTS } from '../../data/initialData';
import { sound } from '../../services/soundService';
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
  calculateGamification,
  getRiskStatusTier,
  getHealthStatusTier,
  calculateTransactionTotals,
  calculateTotalLockedSavings,
  calculateTotalSavingsTarget
} from '../../utils/financeMath';
import {
  calculateConsequenceMatrix,
  runMonteCarloFanSimulation
} from '../../services/simulationService';
import {
  determineDefconLevel,
  calculateResilienceIndex,
  trackFinancialEvent
} from '../../services/analyticsService';
import { STORAGE_KEYS, MONTE_CARLO_CONFIG } from '../../constants/financeRules';

export function FinanceProvider({ children }) {
  // Current Persona (persisted)
  const [selectedPersonaId, setSelectedPersonaId] = useLocalStorage(STORAGE_KEYS.PERSONA_ID, PERSONAS[0].id);
  const currentPersona = useMemo(
    () => PERSONAS.find(p => p.id === selectedPersonaId) || PERSONAS[0],
    [selectedPersonaId]
  );

  // Simulation day and audio toggles
  const [currentDay, setCurrentDay] = useLocalStorage(STORAGE_KEYS.CURRENT_DAY, 3);
  const [soundEnabled, setSoundEnabled] = useLocalStorage(STORAGE_KEYS.SOUND_ENABLED, true);
  const [upiSoundboxEnabled, setUpiSoundboxEnabled] = useLocalStorage(STORAGE_KEYS.UPI_SOUNDBOX_ENABLED, true);

  // FinPulse AI Archetype ('roast' | 'zen' | 'hustler' | 'quant')
  const [aiArchetype, setAiArchetype] = useLocalStorage(STORAGE_KEYS.AI_ARCHETYPE, 'roast');

  // Emergency Austerity Lockdown toggle
  const [austerityMode, setAusterityMode] = useLocalStorage(STORAGE_KEYS.AUSTERITY_MODE, false);

  // Core financial entities initialized from persona or local storage
  const [commitments, setCommitments] = useLocalStorage(STORAGE_KEYS.COMMITMENTS, currentPersona.commitments);
  const [subscriptions, setSubscriptions] = useLocalStorage(STORAGE_KEYS.SUBSCRIPTIONS, currentPersona.subscriptions);
  const [savingsGoals, setSavingsGoals] = useLocalStorage(STORAGE_KEYS.SAVINGS_GOALS, currentPersona.savingsGoals);
  const [transactions, setTransactions] = useLocalStorage(STORAGE_KEYS.TRANSACTIONS, currentPersona.initialTransactions);
  const [wishlist, setWishlist] = useLocalStorage(STORAGE_KEYS.WISHLIST, []);
  const [curveballHistory, setCurveballHistory] = useLocalStorage(STORAGE_KEYS.CURVEBALL_HISTORY, []);
  
  // UI Tabs & Modals
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isWrapModalOpen, setIsWrapModalOpen] = useState(false);

  // What-If Simulation State & Bill Split Count
  const [splitCount, setSplitCount] = useState(1);
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

  // Switch Persona and re-seed state
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
    setSplitCount(1);
    setSimulation({
      name: 'Midnight Biryani + Swiggy Craving',
      amount: 460,
      category: 'food',
      icon: '🍗',
      frequency: 'one-off',
      active: false,
    });
    sound.playClick();
    trackFinancialEvent('switch_persona', { personaId: target.id });
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
    setAusterityMode(false);
    setSplitCount(1);
    sound.playClick();
    trackFinancialEvent('reset_month');
    showToast('Month reset to Day 1. ₹10,000 ready to deploy!', 'success');
  };

  // Toggle master audio
  const handleToggleSound = () => {
    const state = sound.toggleSound();
    setSoundEnabled(state);
    showToast(state ? 'Sound FX Enabled 🔊' : 'Sound Muted 🔇', 'info');
  };

  // Toggle Indian UPI Soundbox voice announcements
  const handleToggleUpiSoundbox = () => {
    const nextState = !upiSoundboxEnabled;
    sound.soundboxEnabled = nextState;
    setUpiSoundboxEnabled(nextState);
    if (nextState) {
      sound.playUpiSoundbox(500, 'FinPulse');
    }
    showToast(nextState ? 'UPI Soundbox Active 📢' : 'UPI Soundbox Voice Muted 🔕', 'info');
  };

  // Toggle tactical Austerity Lockdown mode
  const toggleAusterityMode = () => {
    const next = !austerityMode;
    setAusterityMode(next);
    if (next) {
      sound.playDefconDrone();
      showToast('⚠️ DEFCON Austerity Lockdown ENGAGED. Discretionary spending frozen!', 'warning');
    } else {
      sound.playSuccess();
      showToast('Austerity Lockdown Lifted. Standard budget resumed.', 'info');
    }
    trackFinancialEvent('toggle_austerity', { active: next });
  };

  // Derived Core Financial Metrics
  const totalLockedInSavings = useMemo(() => calculateTotalLockedSavings(savingsGoals), [savingsGoals]);

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

  const totalSavingsTarget = useMemo(() => calculateTotalSavingsTarget(savingsGoals), [savingsGoals]);

  const financialHealth = useMemo(() => {
    return calculateFinancialHealth({
      financialRisk,
      totalLockedSavings: totalLockedInSavings,
      totalSavingsTarget,
      trueFreeCash,
      safeDailyAllowance
    });
  }, [financialRisk, totalLockedInSavings, totalSavingsTarget, trueFreeCash, safeDailyAllowance]);

  // DEFCON Severity State
  const defconState = useMemo(() => {
    return determineDefconLevel({
      liquidBalance,
      totalLiabilities: totalPendingLiabilities,
      trueFreeCash,
      safeDailyAllowance,
      financialRisk
    });
  }, [liquidBalance, totalPendingLiabilities, trueFreeCash, safeDailyAllowance, financialRisk]);

  // Resilience Index
  const resilienceIndex = useMemo(() => {
    return calculateResilienceIndex({
      liquidBalance,
      totalLiabilities: totalPendingLiabilities,
      emergencySavings: emergencyGoal ? emergencyGoal.current : 0,
      runwayDays,
      daysRemaining
    });
  }, [liquidBalance, totalPendingLiabilities, emergencyGoal, runwayDays, daysRemaining]);

  // Monte Carlo 30-Day Stochastic Fan Projections
  const monteCarloFanResult = useMemo(() => {
    return runMonteCarloFanSimulation(
      liquidBalance,
      totalPendingLiabilities,
      safeDailyAllowance,
      currentDay,
      MONTE_CARLO_CONFIG.DEFAULT_TRIALS
    );
  }, [liquidBalance, totalPendingLiabilities, safeDailyAllowance, currentDay]);

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
  const riskStatus = useMemo(() => getRiskStatusTier(financialRisk), [financialRisk]);
  const healthStatus = useMemo(() => getHealthStatusTier(financialHealth), [financialHealth]);

  // Total debited / credited
  const financialTotals = useMemo(() => calculateTransactionTotals(transactions), [transactions]);


  // SIMULATOR IMPACT ENGINE: Consequence Matrix with Split Calculation
  const simulatedImpact = useMemo(() => {
    return calculateConsequenceMatrix({
      amount: simulation.amount,
      liquidBalance,
      trueFreeCash,
      daysRemaining,
      safeDailyAllowance,
      financialRisk,
      financialHealth,
      averageDailySpend,
      runwayDays,
      totalPendingLiabilities,
      splitCount
    });
  }, [
    simulation.amount,
    liquidBalance,
    trueFreeCash,
    daysRemaining,
    safeDailyAllowance,
    financialRisk,
    financialHealth,
    averageDailySpend,
    runwayDays,
    totalPendingLiabilities,
    splitCount
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
    trackFinancialEvent('advance_day', { from: currentDay, to: nextDay });
  };

  const payCommitment = (commitmentId) => {
    const target = commitments.find(c => c.id === commitmentId);
    if (!target || target.paid) return;

    if (upiSoundboxEnabled) {
      sound.playUpiSoundbox(target.amount, target.name);
    } else {
      sound.playCoin();
    }

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
    trackFinancialEvent('pay_commitment', { id: target.id, amount: target.amount });
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
    trackFinancialEvent('toggle_subscription', { id: target.id, active: nextState });
  };

  const commitSimulation = () => {
    if (austerityMode) {
      sound.playDefconDrone();
      showToast('Spend Blocked! Austerity Lockdown mode is active. Deactivate to spend.', 'warning');
      return;
    }

    if (!simulation.amount || Number(simulation.amount) <= 0) {
      showToast('Please enter a valid purchase amount', 'warning');
      return;
    }

    const effectiveAmt = Math.round(Number(simulation.amount) / Math.max(1, splitCount));

    if (upiSoundboxEnabled) {
      sound.playUpiSoundbox(effectiveAmt, simulation.name);
    } else {
      sound.playCoin();
    }

    const newTx = {
      id: `tx_sim_${Date.now()}`,
      day: currentDay,
      name: splitCount > 1 
        ? `${simulation.name || 'Simulated Spend'} (1/${splitCount} share)` 
        : (simulation.name || 'Simulated Purchase'),
      amount: effectiveAmt,
      type: 'expense',
      category: simulation.category || 'food',
      note: `Executed from What-If Simulator on Day ${currentDay}`
    };

    setTransactions(prev => [newTx, ...prev]);
    showToast(`Purchased "${simulation.name}" for ₹${effectiveAmt}. Live metrics updated!`, 'warning');

    if (simulatedImpact.simFreeCash < 0) {
      sound.playWarning();
    }
    trackFinancialEvent('execute_simulation', { amount: effectiveAmt, split: splitCount });
  };

  const saveToWishlist = () => {
    if (!simulation.amount) return;
    sound.playSuccess();
    confetti({
      particleCount: 60,
      spread: 75,
      origin: { y: 0.7 }
    });

    const effectiveAmt = Math.round(Number(simulation.amount) / Math.max(1, splitCount));

    const wishItem = {
      id: `wish_${Date.now()}`,
      name: simulation.name,
      amount: effectiveAmt,
      category: simulation.category,
      savedOnDay: currentDay,
      dailySavedAmount: Math.round(effectiveAmt / daysRemaining)
    };

    setWishlist(prev => [wishItem, ...prev]);
    showToast(`Masterstroke! Delayed "${simulation.name}" to 48h Wishlist. Saved ₹${effectiveAmt}! 🛡️`, 'success');
    trackFinancialEvent('save_to_wishlist', { amount: effectiveAmt });
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
    trackFinancialEvent('deposit_goal', { id: target.id, amount: addAmt });
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
    trackFinancialEvent('withdraw_goal', { id: target.id, amount: subAmt });
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
      trackFinancialEvent('curveball_spin', { id: picked.id, amount: picked.amount });
    }, 450);
  };

  const addTransaction = (name, amount, type = 'expense', category = 'food', note = '') => {
    const val = Number(amount);
    if (!name || isNaN(val) || val <= 0) {
      showToast('Please enter a valid name and amount', 'warning');
      return;
    }

    if (austerityMode && type === 'expense') {
      sound.playDefconDrone();
      showToast('Expense Blocked! Austerity Lockdown mode is active.', 'warning');
      return;
    }

    if (type === 'income') {
      sound.playSuccess();
    } else {
      if (upiSoundboxEnabled) {
        sound.playUpiSoundbox(val, name);
      } else {
        sound.playCoin();
      }
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
    trackFinancialEvent('add_transaction', { name, amount: val, type });
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
        upiSoundboxEnabled,
        handleToggleUpiSoundbox,

        aiArchetype,
        setAiArchetype,
        austerityMode,
        toggleAusterityMode,
        defconState,
        resilienceIndex,
        monteCarloFanResult,

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
        splitCount,
        setSplitCount,
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
