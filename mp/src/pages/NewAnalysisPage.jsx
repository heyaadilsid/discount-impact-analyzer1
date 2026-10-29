import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatPercent, calculateAnalysis } from '../utils/calculations';
import {
  Save,
  RotateCcw,
  GitCompare,
  FileSpreadsheet,
  TrendingDown,
  TrendingUp,
  Tag,
  DollarSign,
  Scale,
  Percent,
  Layers,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function NewAnalysisPage() {
  const {
    currentForm,
    setCurrentForm,
    saveCurrentAnalysis,
    loadIntoScenarioComparison,
    currency,
    loadAnalysisIntoForm,
    addToast,
    openImportModal
  } = useApp();

  const [formulasOpen, setFormulasOpen] = useState(false);

  // Calculate live results based on form inputs
  const calc = calculateAnalysis(currentForm);

  const horizons = ['Weekend', '7-Day Flash', '30-Day', 'Quarterly'];
  const discountPresets = [5, 10, 15, 20, 25];

  const handleInputChange = (field, value) => {
    setCurrentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setCurrentForm({
      title: 'Q4 Festive Flash — Canvas Backpack',
      sku: 'BP-102',
      horizon: '7-Day Flash',
      basePrice: 1000,
      cost: 600,
      baseVolume: 100,
      discountPercent: 10,
      volumeUpliftPercent: 35
    });
    addToast('Reset analysis parameters to default', 'info');
  };

  const handleSaveWithCelebration = () => {
    saveCurrentAnalysis();
    if (calc.grossProfitDelta >= 0) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#245A39', '#153825', '#86EFAC']
      });
    }
  };

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '26px'
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
            Promotional Margin Simulator — Fiscal Archival Record #2024-Q4-B
          </div>
          <h1 style={{
            fontSize: '32px',
            color: '#153825',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            marginBottom: '6px'
          }}>
            New Analysis
          </h1>
          <p style={{
            fontSize: '14.5px',
            color: '#555E57',
            maxWidth: '680px',
            lineHeight: 1.5
          }}>
            Model gross profit erosion, unit elasticity, and break-even sales volume required before announcing a price cut.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={openImportModal}
            className="btn-secondary"
            style={{ fontSize: '12.5px', padding: '7px 12px', gap: '6px' }}
            title="Import product parameters from a CSV or Google Sheet"
          >
            <FileSpreadsheet size={14} style={{ color: '#153825' }} />
            <span>Import from Sheet</span>
          </button>

          <button
            onClick={() => {
              loadAnalysisIntoForm({
                title: 'Everyday Backpack — 10% Flash Sale',
                sku: 'BP-102',
                horizon: '7-Day Flash',
                basePrice: 1000,
                cost: 600,
                baseVolume: 100,
                discountPercent: 10,
                volumeUpliftPercent: 35
              }, false);
            }}
            className="btn-secondary"
            style={{ fontSize: '12.5px', padding: '7px 12px' }}
          >
            <Layers size={14} />
            <span>Load Sample SKU</span>
          </button>

          <button
            onClick={() => loadIntoScenarioComparison(currentForm)}
            className="btn-secondary"
            style={{ fontSize: '12.5px', padding: '7px 12px' }}
          >
            <GitCompare size={14} />
            <span>Compare Scenarios</span>
          </button>

          <button
            onClick={handleReset}
            className="btn-secondary"
            style={{ fontSize: '12.5px', padding: '7px 12px' }}
          >
            <RotateCcw size={14} />
            <span>Reset Form</span>
          </button>

          <button
            onClick={handleSaveWithCelebration}
            className="btn-primary"
            style={{ fontSize: '12.5px', padding: '8px 16px' }}
          >
            <Save size={14} />
            <span>Save Analysis</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.05fr 1.35fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* LEFT COLUMN: Input Panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 1: Analysis Details (SECTION 01) */}
          <div className="panel-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#153825' }} />
                <h3 style={{ fontSize: '16px', color: '#153825' }}>Analysis Details</h3>
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#7E867F', letterSpacing: '0.6px' }}>
                SECTION 01
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#444D46', marginBottom: '6px' }}>
                  Analysis / Campaign Title
                </label>
                <input
                  type="text"
                  value={currentForm.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #DDD7CA',
                    fontSize: '13px',
                    fontFamily: 'var(--font-sans)',
                    color: '#1A201B',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#153825'}
                  onBlur={(e) => e.target.style.borderColor = '#DDD7CA'}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#444D46', marginBottom: '6px' }}>
                  SKU Code
                </label>
                <input
                  type="text"
                  value={currentForm.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #DDD7CA',
                    fontSize: '13px',
                    fontFamily: 'var(--font-mono)',
                    color: '#1A201B',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#153825'}
                  onBlur={(e) => e.target.style.borderColor = '#DDD7CA'}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#444D46', marginBottom: '6px' }}>
                  Analysis Horizon
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {horizons.map(h => {
                    const isSelected = currentForm.horizon === h;
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => handleInputChange('horizon', h)}
                        style={{
                          padding: '7px 4px',
                          borderRadius: '6px',
                          border: '1px solid',
                          borderColor: isSelected ? '#153825' : '#DDD7CA',
                          backgroundColor: isSelected ? '#F0F5F1' : '#FFFFFF',
                          color: isSelected ? '#153825' : '#525B54',
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {h}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Baseline Economics (SECTION 02) */}
          <div className="panel-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#153825' }} />
                <h3 style={{ fontSize: '16px', color: '#153825' }}>Baseline Economics</h3>
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#7E867F', letterSpacing: '0.6px' }}>
                SECTION 02
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#444D46', marginBottom: '6px' }}>
                  Base Selling Price
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: '10px', color: '#7E867F', fontFamily: 'var(--font-mono)' }}>
                    {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}
                  </span>
                  <input
                    type="number"
                    value={currentForm.basePrice}
                    onChange={(e) => handleInputChange('basePrice', Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '8px 10px 8px 24px',
                      borderRadius: '6px',
                      border: '1px solid #DDD7CA',
                      fontSize: '13px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      color: '#1A201B',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#444D46', marginBottom: '6px' }}>
                  Landed Unit Cost
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: '10px', color: '#7E867F', fontFamily: 'var(--font-mono)' }}>
                    {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}
                  </span>
                  <input
                    type="number"
                    value={currentForm.cost}
                    onChange={(e) => handleInputChange('cost', Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '8px 10px 8px 24px',
                      borderRadius: '6px',
                      border: '1px solid #DDD7CA',
                      fontSize: '13px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      color: '#1A201B',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#444D46', marginBottom: '6px' }}>
                  Base Volume
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="number"
                    value={currentForm.baseVolume}
                    onChange={(e) => handleInputChange('baseVolume', Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '8px 46px 8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #DDD7CA',
                      fontSize: '13px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      color: '#1A201B',
                      outline: 'none'
                    }}
                  />
                  <span style={{ position: 'absolute', right: '10px', fontSize: '10.5px', color: '#7E867F', fontWeight: 700 }}>
                    UNITS
                  </span>
                </div>
              </div>
            </div>

            {/* Calculated Baseline Preview Bar */}
            <div style={{
              backgroundColor: '#F8F6F1',
              border: '1px solid #ECE7DC',
              borderRadius: '6px',
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px'
            }}>
              <div>
                <span style={{ color: '#68726A' }}>Unit Margin: </span>
                <strong style={{ color: '#153825', fontFamily: 'var(--font-mono)' }}>
                  {formatCurrency(calc.baselineUnitMargin, currency)} ({calc.baselineMarginPercent.toFixed(1)}%)
                </strong>
              </div>
              <div>
                <span style={{ color: '#68726A' }}>Base Profit: </span>
                <strong style={{ color: '#153825', fontFamily: 'var(--font-mono)' }}>
                  {formatCurrency(calc.baselineGrossProfit, currency)}
                </strong>
              </div>
            </div>
          </div>

          {/* Card 3: Discount & Volume Elasticity (SECTION 03) */}
          <div className="panel-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#153825' }} />
                <h3 style={{ fontSize: '16px', color: '#153825' }}>Discount & Volume Elasticity</h3>
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#7E867F', letterSpacing: '0.6px' }}>
                SECTION 03
              </span>
            </div>

            {/* Target Discount Slider + Input */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#313833' }}>
                  Target Discount Percentage
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={currentForm.discountPercent}
                    onChange={(e) => handleInputChange('discountPercent', Number(e.target.value))}
                    style={{
                      width: '52px',
                      padding: '4px 6px',
                      borderRadius: '4px',
                      border: '1px solid #DDD7CA',
                      fontSize: '13px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      textAlign: 'right',
                      outline: 'none'
                    }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#4E554F' }}>%</span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={currentForm.discountPercent}
                onChange={(e) => handleInputChange('discountPercent', Number(e.target.value))}
                style={{ marginBottom: '10px' }}
              />

              {/* Presets */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#7E867F', marginRight: '4px' }}>Presets:</span>
                {discountPresets.map(dp => {
                  const isActive = currentForm.discountPercent === dp;
                  return (
                    <button
                      key={dp}
                      type="button"
                      onClick={() => handleInputChange('discountPercent', dp)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        border: '1px solid',
                        borderColor: isActive ? '#153825' : '#DDD7CA',
                        backgroundColor: isActive ? '#153825' : '#FFFFFF',
                        color: isActive ? '#FFFFFF' : '#333A35',
                        fontSize: '11.5px',
                        fontWeight: isActive ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {dp}%
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Estimated Volume Uplift */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#313833' }}>
                  Estimated Volume Uplift (%)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#245A39' }}>+</span>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={currentForm.volumeUpliftPercent}
                    onChange={(e) => handleInputChange('volumeUpliftPercent', Number(e.target.value))}
                    style={{
                      width: '52px',
                      padding: '4px 6px',
                      borderRadius: '4px',
                      border: '1px solid #DDD7CA',
                      fontSize: '13px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      textAlign: 'right',
                      outline: 'none'
                    }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#4E554F' }}>%</span>
                </div>
              </div>

              <div style={{ fontSize: '11.5px', color: '#7E867F', fontStyle: 'italic', marginBottom: '14px' }}>
                Estimated volume lift is a user-modeled assumption, not a guaranteed projection.
              </div>

              {/* Margin Erosion Callout */}
              <div style={{
                backgroundColor: '#FAF5EE',
                border: '1px solid #F0E3D0',
                borderRadius: '8px',
                padding: '12px 14px',
                display: 'flex',
                gap: '10px'
              }}>
                <TrendingDown size={18} style={{ color: '#B96E0D', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#824B05', marginBottom: '2px' }}>
                    Margin Erosion Impact
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#554228', lineHeight: 1.45 }}>
                    At {currentForm.discountPercent}% discount, unit gross profit drops from {formatCurrency(calc.baselineUnitMargin, currency)} to {formatCurrency(calc.promoUnitMargin, currency)} ({calc.unitMarginDeltaPct.toFixed(1)}%).
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Calculated Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 1: Executive Impact Summary */}
          <div className="panel-card" style={{ padding: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#153825' }}>
                  <Scale size={18} />
                </span>
                <h3 style={{ fontSize: '17px', color: '#153825' }}>
                  Executive Impact Summary
                </h3>
              </div>

              {calc.grossProfitDelta >= 0 ? (
                <span className="badge-sustainable">
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#245A39' }} />
                  Profitable Scenario ({formatPercent(calc.grossProfitDeltaPct, true)})
                </span>
              ) : (
                <span className="badge-alert">
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#C53B27' }} />
                  Profit Loss ({formatPercent(calc.grossProfitDeltaPct, true)})
                </span>
              )}
            </div>

            {/* 4 Summary Metric Tiles */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '14px',
              marginBottom: '22px'
            }}>
              {/* Promo Unit Price */}
              <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #ECE7DC', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7E867F', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                  <span>Promo Unit Price</span>
                  <Tag size={14} />
                </div>
                <div style={{ fontSize: '26px', fontWeight: 700, color: '#153825', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                  {formatCurrency(calc.promoUnitPrice, currency)}
                  <span style={{ fontSize: '13px', color: '#C53B27', marginLeft: '6px', fontWeight: 500 }}>
                    {formatCurrency(calc.priceDelta, currency)}
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#7E867F', marginTop: '4px' }}>
                  Baseline: {formatCurrency(calc.basePrice, currency)} / unit
                </div>
              </div>

              {/* Projected Revenue */}
              <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #ECE7DC', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7E867F', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                  <span>Projected Revenue</span>
                  <DollarSign size={14} />
                </div>
                <div style={{ fontSize: '26px', fontWeight: 700, color: '#153825', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                  {formatCurrency(calc.promoGrossRevenue, currency)}
                  <span style={{ fontSize: '13px', color: '#245A39', marginLeft: '6px', fontWeight: 500 }}>
                    {formatPercent(calc.revenueDeltaPct, true)}
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#7E867F', marginTop: '4px' }}>
                  Baseline: {formatCurrency(calc.baselineGrossRevenue, currency)} ({calc.promoVolume} units)
                </div>
              </div>

              {/* Projected Gross Profit */}
              <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #ECE7DC', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7E867F', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                  <span>Projected Gross Profit</span>
                  <Scale size={14} />
                </div>
                <div style={{
                  fontSize: '26px',
                  fontWeight: 700,
                  color: calc.grossProfitDelta >= 0 ? '#153825' : '#C53B27',
                  marginTop: '6px',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {formatCurrency(calc.promoGrossProfit, currency)}
                  <span style={{
                    fontSize: '13px',
                    color: calc.grossProfitDelta >= 0 ? '#245A39' : '#C53B27',
                    marginLeft: '6px',
                    fontWeight: 600
                  }}>
                    {calc.grossProfitDelta >= 0 ? '+' : ''}{formatCurrency(calc.grossProfitDelta, currency)}
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#7E867F', marginTop: '4px' }}>
                  Net shift: {formatPercent(calc.grossProfitDeltaPct, true)} vs base {formatCurrency(calc.baselineGrossProfit, currency)}
                </div>
              </div>

              {/* Required Break-Even */}
              <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #ECE7DC', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7E867F', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                  <span>Required Break-Even</span>
                  <TrendingUp size={14} />
                </div>
                <div style={{ fontSize: '26px', fontWeight: 700, color: '#153825', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                  {calc.breakEvenVolume} units
                  <span style={{ fontSize: '13px', color: '#68726A', marginLeft: '6px', fontWeight: 500 }}>
                    (+{calc.requiredVolumeLiftPct.toFixed(1)}%)
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#7E867F', marginTop: '4px' }}>
                  Volume needed just to keep {formatCurrency(calc.baselineGrossProfit, currency)} profit
                </div>
              </div>
            </div>

            {/* Break-Even Elasticity Progress Bar */}
            <div style={{
              backgroundColor: '#F7F5EE',
              border: '1px solid #ECE5D7',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#1B211C' }}>
                    Break-Even Elasticity Threshold
                  </span>
                  <span style={{
                    marginLeft: '8px',
                    fontSize: '11.5px',
                    color: calc.volumeBuffer >= 0 ? '#245A39' : '#C53B27',
                    fontWeight: 600
                  }}>
                    {calc.volumeBuffer >= 0 ? `Slightly Profitable (+${calc.volumeBuffer} unit buffer)` : `Deficit: ${Math.abs(calc.volumeBuffer)} units below break-even`}
                  </span>
                </div>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: '#444C45' }}>
                  {calc.promoVolume} / {calc.breakEvenVolume} units
                </div>
              </div>

              {/* Progress track */}
              <div style={{
                height: '14px',
                backgroundColor: '#DCD6C7',
                borderRadius: '999px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, (calc.promoVolume / Math.max(1, calc.breakEvenVolume * 1.5)) * 100)}%`,
                  backgroundColor: calc.volumeBuffer >= 0 ? '#153825' : '#C53B27',
                  borderRadius: '999px',
                  transition: 'width 0.25s ease'
                }} />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: '#7E867F',
                marginTop: '6px'
              }}>
                <span>0 units</span>
                <span style={{ color: '#153825', fontWeight: 600 }}>• Break-Even Floor: {calc.breakEvenVolume}</span>
                <span>200+ units</span>
              </div>
            </div>
          </div>

          {/* Card 2: Gross Profit Ledger & Variance (TABULAR AUDIT) */}
          <div className="panel-card" style={{ overflow: 'hidden' }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #ECE7DC',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileSpreadsheet size={16} style={{ color: '#153825' }} />
                <h3 style={{ fontSize: '16px', color: '#153825' }}>Gross Profit Ledger & Variance</h3>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#7E867F', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                Tabular Audit
              </span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
              <thead>
                <tr style={{
                  backgroundColor: '#FAF8F4',
                  borderBottom: '1px solid #EBE5D8',
                  color: '#70776F',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <th style={{ padding: '10px 18px' }}>Ledger Line Item</th>
                  <th style={{ padding: '10px 14px' }}>Baseline</th>
                  <th style={{ padding: '10px 14px' }}>Proposed Promo</th>
                  <th style={{ padding: '10px 14px' }}>Absolute Δ</th>
                  <th style={{ padding: '10px 18px', textAlign: 'right' }}>% Shift</th>
                </tr>
              </thead>
              <tbody>
                {/* 1. Unit Selling Price */}
                <tr style={{ borderBottom: '1px solid #F0ECE2' }}>
                  <td style={{ padding: '10px 18px', fontWeight: 600, color: '#252C26' }}>Unit Selling Price</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>{formatCurrency(calc.basePrice, currency)}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatCurrency(calc.promoUnitPrice, currency)}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#C53B27' }}>{formatCurrency(calc.priceDelta, currency)}</td>
                  <td style={{ padding: '10px 18px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#C53B27', fontWeight: 600 }}>
                    {formatPercent(calc.priceDeltaPct)}
                  </td>
                </tr>

                {/* 2. Landed Unit Cost (COGS) */}
                <tr style={{ borderBottom: '1px solid #F0ECE2' }}>
                  <td style={{ padding: '10px 18px', fontWeight: 600, color: '#252C26' }}>Landed Unit Cost (COGS)</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>{formatCurrency(calc.cost, currency)}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>{formatCurrency(calc.cost, currency)}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#7E867F' }}>{currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}0</td>
                  <td style={{ padding: '10px 18px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#7E867F' }}>0.0%</td>
                </tr>

                {/* 3. Unit Margin (Gross Profit) */}
                <tr style={{ borderBottom: '1px solid #F0ECE2' }}>
                  <td style={{ padding: '10px 18px', fontWeight: 600, color: '#252C26' }}>Unit Margin (Gross Profit)</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>{formatCurrency(calc.baselineUnitMargin, currency)}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatCurrency(calc.promoUnitMargin, currency)}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#C53B27' }}>{formatCurrency(calc.unitMarginDelta, currency)}</td>
                  <td style={{ padding: '10px 18px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#C53B27', fontWeight: 600 }}>
                    {formatPercent(calc.unitMarginDeltaPct)}
                  </td>
                </tr>

                {/* 4. Units Sold (Volume) */}
                <tr style={{ borderBottom: '1px solid #F0ECE2' }}>
                  <td style={{ padding: '10px 18px', fontWeight: 600, color: '#252C26' }}>Units Sold (Volume)</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>{calc.baseVolume}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{calc.promoVolume}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#245A39' }}>+{calc.volumeDelta}</td>
                  <td style={{ padding: '10px 18px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#245A39', fontWeight: 600 }}>
                    +{calc.volumeDeltaPct.toFixed(1)}%
                  </td>
                </tr>

                {/* 5. Gross Revenue */}
                <tr style={{ borderBottom: '1px solid #F0ECE2' }}>
                  <td style={{ padding: '10px 18px', fontWeight: 600, color: '#252C26' }}>Gross Revenue</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>{formatCurrency(calc.baselineGrossRevenue, currency)}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatCurrency(calc.promoGrossRevenue, currency)}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#245A39' }}>+{formatCurrency(calc.revenueDelta, currency)}</td>
                  <td style={{ padding: '10px 18px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#245A39', fontWeight: 600 }}>
                    +{calc.revenueDeltaPct.toFixed(1)}%
                  </td>
                </tr>

                {/* 6. Total Landed COGS Expense */}
                <tr style={{ borderBottom: '1px solid #F0ECE2' }}>
                  <td style={{ padding: '10px 18px', fontWeight: 600, color: '#252C26' }}>Total Landed COGS Expense</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>{formatCurrency(calc.baselineCOGS, currency)}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>{formatCurrency(calc.promoCOGS, currency)}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#C53B27' }}>+{formatCurrency(calc.cogsDelta, currency)}</td>
                  <td style={{ padding: '10px 18px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#C53B27', fontWeight: 600 }}>
                    +{calc.cogsDeltaPct.toFixed(1)}%
                  </td>
                </tr>

                {/* 7. Total Gross Profit */}
                <tr style={{ borderBottom: '1px solid #F0ECE2', backgroundColor: '#F9FBF9' }}>
                  <td style={{ padding: '12px 18px', fontWeight: 700, color: '#153825' }}>Total Gross Profit</td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatCurrency(calc.baselineGrossProfit, currency)}</td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: calc.grossProfitDelta >= 0 ? '#153825' : '#C53B27' }}>
                    {formatCurrency(calc.promoGrossProfit, currency)}
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: calc.grossProfitDelta >= 0 ? '#245A39' : '#C53B27' }}>
                    {calc.grossProfitDelta >= 0 ? '+' : ''}{formatCurrency(calc.grossProfitDelta, currency)}
                  </td>
                  <td style={{ padding: '12px 18px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700, color: calc.grossProfitDelta >= 0 ? '#245A39' : '#C53B27' }}>
                    {formatPercent(calc.grossProfitDeltaPct, true)}
                  </td>
                </tr>

                {/* 8. Gross Margin % */}
                <tr>
                  <td style={{ padding: '11px 18px', fontWeight: 600, color: '#252C26' }}>Gross Margin %</td>
                  <td style={{ padding: '11px 14px', fontFamily: 'var(--font-mono)' }}>{calc.baselineMarginPercent.toFixed(1)}%</td>
                  <td style={{ padding: '11px 14px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{calc.promoMarginPercent.toFixed(1)}%</td>
                  <td style={{ padding: '11px 14px', fontFamily: 'var(--font-mono)', color: '#C53B27' }}>{calc.marginShiftPts.toFixed(1)}%</td>
                  <td style={{ padding: '11px 18px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#C53B27', fontWeight: 600 }}>
                    {calc.marginShiftPts.toFixed(1)} pp
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Card 3: Expandable Financial Calculation Formulas & Methodology */}
          <div className="panel-card" style={{ overflow: 'hidden' }}>
            <button
              onClick={() => setFormulasOpen(!formulasOpen)}
              style={{
                width: '100%',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#153825' }}>Σ</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1B211C' }}>
                  Financial Calculation Formulas & Methodology
                </span>
              </div>
              {formulasOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {formulasOpen && (
              <div style={{
                padding: '16px 20px',
                borderTop: '1px solid #ECE7DC',
                backgroundColor: '#FAF8F4',
                fontSize: '12px',
                color: '#4B534D',
                lineHeight: 1.6
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '12px' }}>
                  <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E0D2', borderRadius: '6px', padding: '10px' }}>
                    <div style={{ fontWeight: 700, color: '#153825', marginBottom: '4px' }}>Break-Even Volume Formula</div>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#153825' }}>
                      Break-Even = Baseline Profit ÷ Promo Unit Margin
                    </code>
                  </div>
                  <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E0D2', borderRadius: '6px', padding: '10px' }}>
                    <div style={{ fontWeight: 700, color: '#153825', marginBottom: '4px' }}>Required Lift % Formula</div>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#153825' }}>
                      Lift % = % Discount ÷ (Margin % − % Discount)
                    </code>
                  </div>
                </div>
                <div>
                  This mathematical relationship illustrates the steep non-linear erosion of discounts. Because discounts are deducted directly from gross profit (not the fixed cost component), low-margin products experience extreme sensitivity to price reductions.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
