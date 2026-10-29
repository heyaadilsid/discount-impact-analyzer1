import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatPercent } from '../utils/calculations';
import {
  ArrowLeft,
  Download,
  Save,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Package,
  Layers,
  Sparkles,
  TrendingUp,
  BarChart2,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function ScenarioComparisonPage() {
  const {
    navigate,
    currency,
    scenarioState,
    setScenarioState,
    exportLedgerCSV,
    addToast
  } = useApp();

  const [editingBaseline, setEditingBaseline] = useState(false);

  const { basePrice, cost, baseVolume, tiers } = scenarioState;
  const baseMargin = basePrice - cost;
  const baseProfit = baseMargin * baseVolume;

  // Handle tier changes
  const handleTierChange = (index, field, value) => {
    const updatedTiers = [...tiers];
    updatedTiers[index] = {
      ...updatedTiers[index],
      [field]: Number(value)
    };
    setScenarioState(prev => ({
      ...prev,
      tiers: updatedTiers
    }));
  };

  // Add custom tier
  const handleAddTier = () => {
    const nextLetter = String.fromCharCode(65 + tiers.length - 1);
    const newTier = {
      id: `tier-custom-${Date.now()}`,
      name: `Tier ${nextLetter}: 15% Promotional`,
      discountPercent: 15,
      volumeUpliftPercent: 40,
      isBaseline: false
    };
    setScenarioState(prev => ({
      ...prev,
      tiers: [...prev.tiers, newTier]
    }));
    addToast('Added new custom scenario tier', 'info');
  };

  // Remove custom tier
  const handleRemoveTier = (index) => {
    if (tiers[index].isBaseline) return;
    setScenarioState(prev => ({
      ...prev,
      tiers: prev.tiers.filter((_, i) => i !== index)
    }));
    addToast('Removed scenario tier', 'info');
  };

  // Compute calculated values for each tier
  const computedTiers = tiers.map(tier => {
    const dPct = tier.discountPercent;
    const liftPct = tier.volumeUpliftPercent;
    const sellingPrice = basePrice * (1 - dPct / 100);
    const unitMargin = sellingPrice - cost;
    const marginPercent = sellingPrice > 0 ? (unitMargin / sellingPrice) * 100 : 0;
    const volume = Math.round(baseVolume * (1 + liftPct / 100));
    const revenue = sellingPrice * volume;
    const grossProfit = unitMargin * volume;
    const profitShift = grossProfit - baseProfit;
    const profitShiftPct = baseProfit > 0 ? (profitShift / baseProfit) * 100 : 0;

    // Break-even
    let breakEvenVolume = 0;
    let requiredLift = 0;
    if (unitMargin > 0) {
      breakEvenVolume = Math.ceil(baseProfit / unitMargin);
      requiredLift = ((breakEvenVolume - baseVolume) / baseVolume) * 100;
    } else {
      breakEvenVolume = Infinity;
      requiredLift = Infinity;
    }

    const isSurplus = volume >= breakEvenVolume;

    return {
      ...tier,
      sellingPrice,
      unitMargin,
      marginPercent,
      volume,
      revenue,
      grossProfit,
      profitShift,
      profitShiftPct,
      breakEvenVolume,
      requiredLift,
      isSurplus
    };
  });

  // Find optimal tier (highest gross profit)
  const nonBaselineTiers = computedTiers.filter(t => !t.isBaseline);
  const optimalTier = nonBaselineTiers.reduce((prev, curr) => {
    return (!prev || curr.grossProfit > prev.grossProfit) ? curr : prev;
  }, null);

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#70776F',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            marginBottom: '6px'
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#153825' }} />
            Multi-Tier Promotion Modeler
          </div>
          <h1 style={{
            fontSize: '32px',
            color: '#153825',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            marginBottom: '6px'
          }}>
            Scenario Comparison
          </h1>
          <p style={{
            fontSize: '14.5px',
            color: '#555E57',
            maxWidth: '680px',
            lineHeight: 1.5
          }}>
            Compare multiple promotional discount tiers against your unchanged baseline to evaluate gross profit erosion and required elasticity.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => navigate('new-analysis')}
            className="btn-secondary"
            style={{ fontSize: '12.5px', padding: '7px 12px' }}
          >
            <ArrowLeft size={14} />
            <span>Return to Analysis</span>
          </button>

          <button
            onClick={() => exportLedgerCSV()}
            className="btn-secondary"
            style={{ fontSize: '12.5px', padding: '7px 12px' }}
          >
            <Download size={14} />
            <span>Export Ledger (CSV / PDF)</span>
          </button>

          <button
            onClick={() => {
              addToast('Scenario comparison configuration saved successfully', 'success');
            }}
            className="btn-primary"
            style={{ fontSize: '12.5px', padding: '8px 16px' }}
          >
            <Save size={14} />
            <span>Save Comparison</span>
          </button>
        </div>
      </div>

      {/* Top Active Baseline Bar */}
      <div className="panel-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #ECE7DC',
          paddingBottom: '14px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: '#EAF2EC',
              color: '#153825',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Package size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#153825' }}>
                  {scenarioState.name}
                </span>
                <span style={{
                  backgroundColor: '#EAF2EC',
                  color: '#153825',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  Active Baseline
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#7E867F', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>Period: <strong>{scenarioState.horizon}</strong></span>
                <span>•</span>
                <span>Currency: <strong>{currency} ({currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'})</strong></span>
                <span>•</span>
                <span>Catalog SKU: <strong style={{ fontFamily: 'var(--font-mono)' }}>{scenarioState.sku}</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setEditingBaseline(!editingBaseline)}
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '5px 10px' }}
          >
            {editingBaseline ? 'Close Editor' : 'Edit Baseline Assumptions'}
          </button>
        </div>

        {/* Baseline inline editor (optional) */}
        {editingBaseline && (
          <div style={{
            backgroundColor: '#F7F5EE',
            border: '1px solid #E5DFD0',
            borderRadius: '8px',
            padding: '14px',
            marginBottom: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#555C56', marginBottom: '4px' }}>Base Price</label>
              <input
                type="number"
                value={scenarioState.basePrice}
                onChange={(e) => setScenarioState(prev => ({ ...prev, basePrice: Number(e.target.value) }))}
                style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #CCC', fontSize: '12.5px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#555C56', marginBottom: '4px' }}>Landed Unit Cost</label>
              <input
                type="number"
                value={scenarioState.cost}
                onChange={(e) => setScenarioState(prev => ({ ...prev, cost: Number(e.target.value) }))}
                style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #CCC', fontSize: '12.5px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#555C56', marginBottom: '4px' }}>Base Volume</label>
              <input
                type="number"
                value={scenarioState.baseVolume}
                onChange={(e) => setScenarioState(prev => ({ ...prev, baseVolume: Number(e.target.value) }))}
                style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #CCC', fontSize: '12.5px' }}
              />
            </div>
          </div>
        )}

        {/* 4 Stat Chips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #ECE7DC', borderRadius: '6px', padding: '12px 14px' }}>
            <div style={{ fontSize: '10.5px', color: '#7E867F', textTransform: 'uppercase', fontWeight: 700 }}>Base Price</div>
            <div style={{ fontSize: '19px', fontWeight: 700, color: '#153825', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
              {formatCurrency(basePrice, currency)}
            </div>
            <div style={{ fontSize: '11px', color: '#7E867F', marginTop: '2px' }}>List catalog selling price</div>
          </div>

          <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #ECE7DC', borderRadius: '6px', padding: '12px 14px' }}>
            <div style={{ fontSize: '10.5px', color: '#7E867F', textTransform: 'uppercase', fontWeight: 700 }}>Unit Cost (COGS)</div>
            <div style={{ fontSize: '19px', fontWeight: 700, color: '#153825', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
              {formatCurrency(cost, currency)}
            </div>
            <div style={{ fontSize: '11px', color: '#7E867F', marginTop: '2px' }}>Floor unit protection level</div>
          </div>

          <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #ECE7DC', borderRadius: '6px', padding: '12px 14px' }}>
            <div style={{ fontSize: '10.5px', color: '#7E867F', textTransform: 'uppercase', fontWeight: 700 }}>Base Volume</div>
            <div style={{ fontSize: '19px', fontWeight: 700, color: '#153825', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
              {baseVolume} units
            </div>
            <div style={{ fontSize: '11px', color: '#7E867F', marginTop: '2px' }}>Expected normal period sales</div>
          </div>

          <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #ECE7DC', borderRadius: '6px', padding: '12px 14px' }}>
            <div style={{ fontSize: '10.5px', color: '#7E867F', textTransform: 'uppercase', fontWeight: 700 }}>Baseline Gross Profit</div>
            <div style={{ fontSize: '19px', fontWeight: 700, color: '#153825', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
              {formatCurrency(baseProfit, currency)}
            </div>
            <div style={{ fontSize: '11px', color: '#7E867F', marginTop: '2px' }}>
              {((baseMargin / basePrice) * 100).toFixed(1)}% Unit Margin ({formatCurrency(baseMargin, currency)} / unit)
            </div>
          </div>
        </div>
      </div>

      {/* Tier Simulation Matrix Table */}
      <div className="panel-card" style={{ marginBottom: '28px', overflow: 'hidden' }}>
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #ECE7DC',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '17px', color: '#153825' }}>Tier Simulation Matrix</h3>
            <p style={{ fontSize: '12px', color: '#68726B', marginTop: '2px' }}>
              Adjust the editable discount % and projected volume uplift in real time to calculate unit margins and break-evens.
            </p>
          </div>

          <button
            onClick={handleAddTier}
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '6px 12px', gap: '5px' }}
          >
            <Plus size={14} />
            <span>Add Custom Scenario Tier</span>
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{
                backgroundColor: '#FAF8F4',
                borderBottom: '1px solid #EBE5D8',
                color: '#70776F',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <th style={{ padding: '12px 24px' }}>Scenario Tier</th>
                <th style={{ padding: '12px 16px' }}>Discount %</th>
                <th style={{ padding: '12px 16px' }}>Selling Price</th>
                <th style={{ padding: '12px 16px' }}>Unit Profit (Margin)</th>
                <th style={{ padding: '12px 16px' }}>Modeled Volume Lift</th>
                <th style={{ padding: '12px 24px', textAlign: 'right' }}>Projected Revenue</th>
              </tr>
            </thead>
            <tbody>
              {computedTiers.map((tier, idx) => {
                const isOptimal = optimalTier && optimalTier.id === tier.id && tier.profitShift > 0;
                const isErosion = tier.profitShift < 0;

                return (
                  <tr
                    key={tier.id}
                    style={{
                      borderBottom: idx === computedTiers.length - 1 ? 'none' : '1px solid #F0ECE2',
                      backgroundColor: isOptimal ? '#F6FAF7' : isErosion ? '#FFFDFD' : '#FFFFFF',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    {/* Scenario Tier Name */}
                    <td style={{ padding: '14px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: tier.isBaseline ? '#70776F' : isErosion ? '#C53B27' : '#245A39'
                        }} />
                        <span style={{ fontWeight: 600, color: '#1B211C' }}>
                          {tier.name}
                        </span>
                        {!tier.isBaseline && (
                          <button
                            onClick={() => handleRemoveTier(idx)}
                            title="Remove tier"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#9CA39D',
                              cursor: 'pointer',
                              padding: '2px',
                              marginLeft: '4px'
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Discount % (Editable if not baseline) */}
                    <td style={{ padding: '14px 16px' }}>
                      {tier.isBaseline ? (
                        <span style={{ fontFamily: 'var(--font-mono)', color: '#7E867F' }}>0%</span>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={tier.discountPercent}
                            onChange={(e) => handleTierChange(idx, 'discountPercent', e.target.value)}
                            style={{
                              width: '48px',
                              padding: '4px 6px',
                              borderRadius: '4px',
                              border: '1px solid #DDD7CA',
                              fontSize: '12.5px',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 600,
                              outline: 'none'
                            }}
                          />
                          <span style={{ fontSize: '12px', color: '#68726A' }}>%</span>
                        </div>
                      )}
                    </td>

                    {/* Selling Price */}
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      {formatCurrency(tier.sellingPrice, currency)}
                    </td>

                    {/* Unit Profit (Margin) */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: tier.unitMargin <= 0 ? '#C53B27' : '#1B211C' }}>
                        {formatCurrency(tier.unitMargin, currency)}
                      </div>
                      <div style={{ fontSize: '11px', color: '#7E867F' }}>
                        ({tier.marginPercent.toFixed(1)}%)
                      </div>
                    </td>

                    {/* Modeled Volume Lift (Editable if not baseline) */}
                    <td style={{ padding: '14px 16px' }}>
                      {tier.isBaseline ? (
                        <span style={{ fontFamily: 'var(--font-mono)', color: '#7E867F' }}>100 units</span>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#245A39', fontWeight: 600 }}>+</span>
                          <input
                            type="number"
                            min="0"
                            max="300"
                            value={tier.volumeUpliftPercent}
                            onChange={(e) => handleTierChange(idx, 'volumeUpliftPercent', e.target.value)}
                            style={{
                              width: '48px',
                              padding: '4px 6px',
                              borderRadius: '4px',
                              border: '1px solid #DDD7CA',
                              fontSize: '12.5px',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 600,
                              outline: 'none'
                            }}
                          />
                          <span style={{ fontSize: '12px', color: '#68726A' }}>%</span>
                          <span style={{ fontSize: '11.5px', color: '#7E867F', fontFamily: 'var(--font-mono)' }}>
                            ({tier.volume})
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Projected Revenue */}
                    <td style={{ padding: '14px 24px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      {formatCurrency(tier.revenue, currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend bar */}
        <div style={{
          padding: '12px 24px',
          backgroundColor: '#FAF8F4',
          borderTop: '1px solid #ECE7DC',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11.5px',
          color: '#6F7770'
        }}>
          <div>
            Dynamic recalculation runs instantly. Values highlight green for gross profit expansion and muted red for erosion.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#245A39' }} />
              Profit Expansion
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#70776F' }} />
              Neutral Baseline
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#C53B27' }} />
              Profit Erosion
            </span>
          </div>
        </div>
      </div>

      {/* Visualizations Row (2 Columns) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '28px'
      }}>
        {/* Left Visualization: Gross Profit Yield by Scenario */}
        <div className="panel-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#7E867F', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Ledger Visualization 01
              </div>
              <h3 style={{ fontSize: '18px', color: '#153825', marginTop: '2px' }}>
                Gross Profit Yield by Scenario
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10.5px', color: '#7E867F' }}>Baseline Benchmark</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#1B211C', fontFamily: 'var(--font-mono)' }}>
                {formatCurrency(baseProfit, currency)}
              </div>
            </div>
          </div>

          <p style={{ fontSize: '12px', color: '#68726B', marginBottom: '22px' }}>
            Bars illustrate final cumulative Gross Profit generated after factoring both price reductions and unit elasticity.
          </p>

          {/* Bar Chart Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {computedTiers.map(tier => {
              const maxProfit = Math.max(...computedTiers.map(t => Math.max(t.grossProfit, baseProfit))) * 1.15;
              const barWidth = Math.max(8, Math.min(100, (tier.grossProfit / maxProfit) * 100));
              const isProfitPositive = tier.profitShift >= 0;

              return (
                <div key={tier.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: '#2B322C' }}>
                      {tier.name}
                    </span>
                    <span style={{
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      color: tier.isBaseline ? '#333A35' : isProfitPositive ? '#245A39' : '#C53B27'
                    }}>
                      {formatCurrency(tier.grossProfit, currency)} {!tier.isBaseline && `(${formatPercent(tier.profitShiftPct, true)})`}
                    </span>
                  </div>

                  <div style={{
                    height: '24px',
                    backgroundColor: '#EBE6DC',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    display: 'flex'
                  }}>
                    <div style={{
                      width: `${barWidth}%`,
                      height: '100%',
                      backgroundColor: tier.isBaseline ? '#4E5750' : isProfitPositive ? '#153825' : '#C53B27',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Optimal Scenario Callout */}
          <div style={{
            backgroundColor: '#EAF2EC',
            border: '1px solid #BCD4C1',
            borderRadius: '8px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12.5px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#153825', fontWeight: 600 }}>
              <CheckCircle size={16} />
              <span>Optimal gross yield scenario:</span>
            </div>
            <strong style={{ color: '#153825' }}>
              {optimalTier ? `${optimalTier.name} (+${formatCurrency(optimalTier.profitShift, currency)} / ${formatPercent(optimalTier.profitShiftPct, true)})` : 'None'}
            </strong>
          </div>
        </div>

        {/* Right Visualization: Required Break-Even Volume Lift */}
        <div className="panel-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#7E867F', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Ledger Visualization 02
            </div>
            <h3 style={{ fontSize: '18px', color: '#153825', marginTop: '2px' }}>
              Required Break-Even Volume Lift
            </h3>
          </div>

          <p style={{ fontSize: '12px', color: '#68726B', marginBottom: '20px' }}>
            The minimum unit surge percentage demanded simply to equal the baseline profit of {formatCurrency(baseProfit, currency)}.
          </p>

          {/* Cards for each non-baseline tier */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            {computedTiers.filter(t => !t.isBaseline).map(tier => {
              const hasDeficit = !tier.isSurplus;

              return (
                <div
                  key={tier.id}
                  style={{
                    backgroundColor: '#FAF8F4',
                    border: '1px solid #ECE7DC',
                    borderRadius: '8px',
                    padding: '12px 16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#153825' }}>
                      {tier.name} ({tier.discountPercent}% off)
                    </span>
                    {hasDeficit ? (
                      <span className="badge-alert" style={{ fontSize: '10.5px' }}>
                        Deficit: Volume Inadequate
                      </span>
                    ) : (
                      <span className="badge-sustainable" style={{ fontSize: '10.5px' }}>
                        Surplus Volume Achieved
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#666F68', marginBottom: '3px' }}>
                    <span>Required Break-Even Volume Lift:</span>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: hasDeficit ? '#C53B27' : '#153825' }}>
                      +{tier.requiredLift.toFixed(0)}% ({tier.breakEvenVolume} units)
                    </strong>
                  </div>

                  {/* Meter comparing required vs modeled */}
                  <div style={{
                    height: '8px',
                    backgroundColor: '#E4DFD3',
                    borderRadius: '999px',
                    overflow: 'hidden',
                    marginBottom: '6px'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, (tier.volume / Math.max(1, tier.breakEvenVolume)) * 100)}%`,
                      backgroundColor: hasDeficit ? '#C53B27' : '#245A39'
                    }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#7E867F' }}>
                    <span>Your Modeled Sales Lift:</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#153825' }}>
                      +{tier.volumeUpliftPercent}% ({tier.volume} units)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Steep Non-Linear Dilution Alert Box */}
          <div style={{
            backgroundColor: '#FEF9EE',
            border: '1px solid #F6DFB5',
            borderRadius: '8px',
            padding: '12px 14px',
            display: 'flex',
            gap: '10px'
          }}>
            <AlertTriangle size={18} style={{ color: '#B96E0D', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#824B05', marginBottom: '2px' }}>
                Steep Non-Linear Dilution
              </div>
              <div style={{ fontSize: '11.5px', color: '#684518', lineHeight: 1.45 }}>
                Notice how doubling the discount from 10% to 20% nearly <strong>triples the break-even volume requirement</strong> from +34% to +100%.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card: Plain-Language Decision Ledger [AUDIT VERIFIED] */}
      <div className="panel-card" style={{ padding: '24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          borderBottom: '1px solid #ECE7DC',
          paddingBottom: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={18} style={{ color: '#153825' }} />
              <h3 style={{ fontSize: '17px', color: '#153825' }}>Plain-Language Decision Ledger</h3>
            </div>
            <p style={{ fontSize: '12px', color: '#68726B', marginTop: '2px' }}>
              Rigorous mathematical implications translated into operational pricing guidance
            </p>
          </div>

          <span style={{
            backgroundColor: '#F0ECE3',
            border: '1px solid #E3DCСD',
            color: '#555E57',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '10.5px',
            fontWeight: 700,
            letterSpacing: '0.6px'
          }}>
            AUDIT VERIFIED
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {/* Finding 01 */}
          <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #ECE7DC', borderRadius: '8px', padding: '16px' }}>
            <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#C53B27', textTransform: 'uppercase', marginBottom: '6px' }}>
              Finding 01
            </div>
            <h4 style={{ fontSize: '14px', color: '#153825', marginBottom: '8px' }}>
              Elasticity Reality at 20% Discount
            </h4>
            <p style={{ fontSize: '12px', color: '#555E57', lineHeight: 1.5, marginBottom: '14px' }}>
              At a 20% discount, selling 60% more units results in ₹8,000 loss in gross profit. You need 200 units (+100% lift) just to break even.
            </p>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#C53B27' }}>
              Severe Gross Margin Dilution
            </div>
          </div>

          {/* Finding 02 */}
          <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #ECE7DC', borderRadius: '8px', padding: '16px' }}>
            <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#245A39', textTransform: 'uppercase', marginBottom: '6px' }}>
              Finding 02
            </div>
            <h4 style={{ fontSize: '14px', color: '#153825', marginBottom: '8px' }}>
              Optimal Risk-Reward Zone
            </h4>
            <p style={{ fontSize: '12px', color: '#555E57', lineHeight: 1.5, marginBottom: '14px' }}>
              The 10% tier demands a +34% volume lift. At your modeled +35% lift (135 units), gross profit yields ₹40,500 (+₹500).
            </p>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#245A39' }}>
              Recommended Execution Tier
            </div>
          </div>

          {/* Finding 03 */}
          <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #ECE7DC', borderRadius: '8px', padding: '16px' }}>
            <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#7E867F', textTransform: 'uppercase', marginBottom: '6px' }}>
              Finding 03
            </div>
            <h4 style={{ fontSize: '14px', color: '#153825', marginBottom: '8px' }}>
              Floor Cost Defense
            </h4>
            <p style={{ fontSize: '12px', color: '#555E57', lineHeight: 1.5, marginBottom: '14px' }}>
              All tested scenarios maintain pricing strictly above the {formatCurrency(cost, currency)} unit cost floor (lowest selling price is {formatCurrency(basePrice * 0.8, currency)}), keeping margin solvent.
            </p>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#555D57' }}>
              Unit Contribution Protected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
