import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatPercent, calculateAnalysis } from '../utils/calculations';
import {
  Archive,
  Percent,
  TrendingDown,
  TrendingUp,
  Download,
  Filter,
  ArrowRight,
  ExternalLink,
  Plus,
  Play,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export default function OverviewPage() {
  const {
    navigate,
    currency,
    savedAnalyses,
    loadAnalysisIntoForm,
    exportLedgerCSV,
    globalSearch
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewEmptyState, setViewEmptyState] = useState(false);

  // Filter analyses
  const filteredAnalyses = savedAnalyses.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = !globalSearch ||
      item.campaign.toLowerCase().includes(globalSearch.toLowerCase()) ||
      item.sku.toLowerCase().includes(globalSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(globalSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Travel Gear', 'Apparel', 'Home Goods', 'Workspace'];

  // Calculate high-level summary KPIs
  const activeCount = savedAnalyses.length;
  const avgDiscount = (savedAnalyses.reduce((acc, curr) => acc + curr.discountPercent, 0) / (activeCount || 1)).toFixed(1);

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '28px'
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
            Executive Decision Ledger
          </div>
          <h1 style={{
            fontSize: '32px',
            color: '#153825',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            marginBottom: '8px'
          }}>
            Overview
          </h1>
          <p style={{
            fontSize: '14.5px',
            color: '#555E57',
            maxWidth: '680px',
            lineHeight: 1.5
          }}>
            Understand how discounts affect your profit before launching a promotion. Model margin dilution, floor costs, and required volume break-even points.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              });
            }}
            className="btn-secondary"
            style={{ fontSize: '13px', padding: '8px 14px', gap: '6px' }}
          >
            <span>Try a sample analysis</span>
            <span style={{
              backgroundColor: '#FEF08A',
              color: '#854D0E',
              fontSize: '10px',
              fontWeight: 800,
              padding: '1px 5px',
              borderRadius: '3px'
            }}>
              SAMPLE
            </span>
          </button>

          <button
            onClick={() => navigate('new-analysis')}
            className="btn-primary"
            style={{ fontSize: '13px', padding: '8px 16px', gap: '6px' }}
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Start new analysis</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Card 1 */}
        <div className="panel-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#7E867F', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              Saved Analyses
            </span>
            <Archive size={16} style={{ color: '#7E867F' }} />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#153825', letterSpacing: '-0.5px' }}>
            {viewEmptyState ? '0 Active' : `${activeCount} Active`}
          </div>
          <div style={{ fontSize: '12px', color: '#687069', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>Across 3 product categories</span>
          </div>
          <div style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid #ECE7DC',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11.5px',
            color: '#7E867F'
          }}>
            <span>Target Period</span>
            <span style={{ fontWeight: 600, color: '#313833' }}>Q4 Festive / Peak</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="panel-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#7E867F', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              Avg. Planned Discount
            </span>
            <Percent size={16} style={{ color: '#7E867F' }} />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#153825', letterSpacing: '-0.5px' }}>
            {viewEmptyState ? '0.0%' : `${avgDiscount}%`}
          </div>
          <div style={{ fontSize: '12px', color: '#687069', marginTop: '4px' }}>
            Range: 5.0% — 20.0%
          </div>
          <div style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid #ECE7DC',
            fontSize: '11.5px',
            color: '#7E867F'
          }}>
            Weighted By Baseline Revenue
          </div>
        </div>

        {/* Card 3 */}
        <div className="panel-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#7E867F', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              Total Margin Exposure
            </span>
            <TrendingDown size={16} style={{ color: '#C53B27' }} />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#C53B27', letterSpacing: '-0.5px' }}>
            {viewEmptyState ? '₹0' : `- ${currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}38,500`}
          </div>
          <div style={{ fontSize: '12px', color: '#687069', marginTop: '4px' }}>
            Gross profit variance if volume stalls
          </div>
          <div style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid #ECE7DC',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11.5px'
          }}>
            <span style={{ color: '#7E867F' }}>Erosion Impact</span>
            <span style={{
              backgroundColor: '#FDF3F1',
              color: '#C53B27',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 700
            }}>
              -19.8% Portfolio GP
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="panel-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#7E867F', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              Avg. Required Volume Lift
            </span>
            <TrendingUp size={16} style={{ color: '#245A39' }} />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#153825', letterSpacing: '-0.5px' }}>
            {viewEmptyState ? '+0.0%' : '+28.4%'}
          </div>
          <div style={{ fontSize: '12px', color: '#687069', marginTop: '4px' }}>
            Units needed to break-even on average
          </div>
          <div style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid #ECE7DC',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11.5px'
          }}>
            <span style={{ color: '#7E867F' }}>Elasticity Required</span>
            <span style={{
              backgroundColor: '#EAF2EC',
              color: '#153825',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 700
            }}>
              High (+2.27x)
            </span>
          </div>
        </div>
      </div>

      {/* Middle Two Control Cards: Dataset Visibility & Illustrative Sample */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {/* Left: Dataset Visibility */}
        <div className="panel-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#7E867F', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              Dataset Visibility
            </span>
            <span style={{ fontSize: '10.5px', backgroundColor: '#F0ECE3', padding: '2px 7px', borderRadius: '4px', color: '#626B64', fontWeight: 600 }}>
              Read-only store cache
            </span>
          </div>
          <h3 style={{ fontSize: '17px', color: '#153825', marginBottom: '4px' }}>
            Showing {viewEmptyState ? '0' : '4'} saved active analyses.
          </h3>
          <p style={{ fontSize: '13px', color: '#5C655F', marginBottom: '16px', lineHeight: 1.5 }}>
            Switch between your ongoing active promotional models or preview the clean slate guidance mode used when establishing fresh SKUs.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <button
              onClick={() => setViewEmptyState(false)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: !viewEmptyState ? '#153825' : '#DDD7CA',
                backgroundColor: !viewEmptyState ? '#153825' : '#FFFFFF',
                color: !viewEmptyState ? '#FFFFFF' : '#49524B',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              • Active Analyses ({savedAnalyses.length})
            </button>
            <button
              onClick={() => setViewEmptyState(true)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: viewEmptyState ? '#153825' : '#DDD7CA',
                backgroundColor: viewEmptyState ? '#153825' : '#FFFFFF',
                color: viewEmptyState ? '#FFFFFF' : '#49524B',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              First-Time Empty State Preview
            </button>
          </div>

          <div style={{ fontSize: '11.5px', color: '#6B736D', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <CheckCircle size={14} style={{ color: '#245A39' }} />
            <span>Ledger rules enforced</span>
          </div>
        </div>

        {/* Right: Illustrative Sample */}
        <div className="panel-card" style={{ padding: '20px', borderLeft: '3px solid #B96E0D' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#B96E0D', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              Illustrative Sample
            </span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#7E867F' }}>
              SKU: BP-102
            </span>
          </div>
          <h3 style={{ fontSize: '17px', color: '#153825', marginBottom: '2px' }}>
            Everyday Backpack — 10% Flash Sale
          </h3>
          <p style={{ fontSize: '12px', color: '#5C655F', marginBottom: '14px' }}>
            Quick mini simulation on gross margin compression
          </p>

          <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #ECE7DC', borderRadius: '6px', padding: '10px 12px', marginBottom: '14px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#6C756F' }}>Baseline Profit:</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>₹40,000 (100 units)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#6C756F' }}>Post-Discount Profit:</span>
              <strong style={{ color: '#C53B27', fontFamily: 'var(--font-mono)' }}>₹30,000 (at flat vol)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6C756F' }}>Required Break-Even:</span>
              <strong style={{ color: '#153825', fontFamily: 'var(--font-mono)' }}>+34 Units (+34% lift)</strong>
            </div>
          </div>

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
              });
            }}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '12.5px', padding: '7px' }}
          >
            <ExternalLink size={14} />
            <span>Load into Analyzer</span>
          </button>
        </div>
      </div>

      {/* Table: Recent Promotional Analyses */}
      <div className="panel-card" style={{ marginBottom: '28px', overflow: 'hidden' }}>
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #ECE7DC',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '19px', color: '#153825', marginBottom: '4px' }}>
              Recent Promotional Analyses
            </h2>
            <p style={{ fontSize: '12.5px', color: '#68726B' }}>
              Break-even volume thresholds and gross margin sensitivity across registered runs.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} style={{ color: '#7E867F' }} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid #DDD7CA',
                  backgroundColor: '#FFFFFF',
                  fontSize: '12px',
                  color: '#262D28',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>Filter: {cat === 'All' ? 'All Categories' : cat}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => exportLedgerCSV(filteredAnalyses)}
              title="Download ledger CSV"
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #DDD7CA',
                backgroundColor: '#FFFFFF',
                color: '#343B35',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Download size={14} />
            </button>
          </div>
        </div>

        {viewEmptyState ? (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#F3EFE6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto',
              color: '#7E867F'
            }}>
              <Archive size={22} />
            </div>
            <h3 style={{ fontSize: '17px', color: '#153825', marginBottom: '6px' }}>No Saved Analyses In Preview Mode</h3>
            <p style={{ fontSize: '13px', color: '#6A726C', maxWidth: '420px', margin: '0 auto 20px auto' }}>
              Create your first promotional discount simulation to evaluate unit contribution, margin dilution, and break-even elasticity.
            </p>
            <button
              onClick={() => navigate('new-analysis')}
              className="btn-primary"
              style={{ fontSize: '13px', padding: '8px 18px' }}
            >
              + Create First Analysis
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
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
                  <th style={{ padding: '12px 20px' }}>Campaign & Product</th>
                  <th style={{ padding: '12px 16px' }}>Base Price / Cost</th>
                  <th style={{ padding: '12px 16px' }}>Discount</th>
                  <th style={{ padding: '12px 16px' }}>Projected Profit Shift</th>
                  <th style={{ padding: '12px 16px' }}>Volume Break-Even</th>
                  <th style={{ padding: '12px 16px' }}>Risk Classification</th>
                  <th style={{ padding: '12px 16px' }}>Updated</th>
                  <th style={{ padding: '12px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnalyses.map((item, idx) => {
                  const calc = calculateAnalysis(item);
                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: idx === filteredAnalyses.length - 1 ? 'none' : '1px solid #F0ECE2',
                        backgroundColor: '#FFFFFF',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FCFBF9'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                    >
                      {/* Campaign & Product */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontWeight: 600, color: '#153825' }}>
                          {item.campaign}
                        </div>
                        <div style={{ fontSize: '11px', color: '#707A72', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{item.edition}</span>
                          <span>•</span>
                          <span style={{ backgroundColor: '#F0ECE4', padding: '1px 5px', borderRadius: '3px' }}>{item.category}</span>
                        </div>
                      </td>

                      {/* Base Price / Cost */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#1E2520', fontFamily: 'var(--font-mono)' }}>
                          {formatCurrency(item.basePrice, currency)}
                        </div>
                        <div style={{ fontSize: '11px', color: '#7E867F', marginTop: '1px', fontFamily: 'var(--font-mono)' }}>
                          Cost: {formatCurrency(item.cost, currency)}
                        </div>
                      </td>

                      {/* Discount */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: '#F3EFE6',
                          padding: '3px 7px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          fontSize: '12px',
                          color: '#245A39'
                        }}>
                          {item.discountPercent}%
                          <span style={{ fontWeight: 400, color: '#68726A', fontSize: '11px' }}>
                            ({formatCurrency(calc.promoUnitPrice, currency)})
                          </span>
                        </div>
                      </td>

                      {/* Projected Profit Shift */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                          color: calc.grossProfitDelta >= 0 ? '#245A39' : '#C53B27'
                        }}>
                          {formatCurrency(calc.grossProfitDelta, currency, true)}
                        </div>
                        <div style={{ fontSize: '11px', color: '#7E867F', marginTop: '1px' }}>
                          {calc.baselineMarginPercent.toFixed(1)}% → {calc.promoMarginPercent.toFixed(1)}% ({calc.marginShiftPts >= 0 ? '+' : ''}{calc.marginShiftPts.toFixed(1)} pts)
                        </div>
                      </td>

                      {/* Volume Break-Even */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#1B211C', fontFamily: 'var(--font-mono)' }}>
                          {calc.breakEvenVolume} units
                        </div>
                        <div style={{
                          fontSize: '11px',
                          marginTop: '1px',
                          color: calc.requiredVolumeLiftPct > 100 ? '#C53B27' : '#5E6760',
                          fontWeight: calc.requiredVolumeLiftPct > 100 ? 700 : 400
                        }}>
                          +{calc.requiredVolumeLiftPct.toFixed(1)}% lift needed
                        </div>
                      </td>

                      {/* Risk Classification */}
                      <td style={{ padding: '14px 16px' }}>
                        {calc.riskBadgeType === 'sustainable' ? (
                          <span className="badge-sustainable">
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#245A39' }} />
                            Sustainable
                          </span>
                        ) : calc.riskBadgeType === 'warning' ? (
                          <span className="badge-warning">
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#B96E0D' }} />
                            High Lift Needed
                          </span>
                        ) : (
                          <span className="badge-alert">
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#C53B27' }} />
                            Margin Dilution Alert
                          </span>
                        )}
                      </td>

                      {/* Updated */}
                      <td style={{ padding: '14px 16px', color: '#7E867F', fontSize: '11.5px' }}>
                        {item.updated}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button
                          onClick={() => loadAnalysisIntoForm(item)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#153825',
                            fontWeight: 600,
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <span>Reopen</span>
                          <ArrowRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div style={{
          padding: '12px 24px',
          backgroundColor: '#FAF8F4',
          borderTop: '1px solid #ECE7DC',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11.5px',
          color: '#70776F'
        }}>
          <div>
            All calculations use landed Unit Cost including supplier price, duty, and standard packaging allocations.
          </div>
          <div>
            Showing {filteredAnalyses.length} of {savedAnalyses.length} stored records
          </div>
        </div>
      </div>

      {/* Bottom Row: Checklist for Managers & 3-Parameter Rapid Model */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: '20px'
      }}>
        {/* Left: Discount Discipline Checklist for Managers */}
        <div className="panel-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '17px', color: '#153825' }}>
              Discount Discipline Checklist for Managers
            </h3>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#7E867F', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              Retail Guardrails
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #ECE7DC', borderRadius: '8px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#EAF2EC', color: '#153825', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>1</span>
                <strong style={{ fontSize: '12.5px', color: '#1B211C' }}>Unit Cost Baseline</strong>
              </div>
              <p style={{ fontSize: '11.5px', color: '#5A625C', lineHeight: 1.5 }}>
                Always verify your landed COGS includes freight allocations, packaging, and platform fulfillment tariffs before applying discounts.
              </p>
            </div>

            <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #ECE7DC', borderRadius: '8px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#EAF2EC', color: '#153825', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>2</span>
                <strong style={{ fontSize: '12.5px', color: '#1B211C' }}>Elasticity Reality</strong>
              </div>
              <p style={{ fontSize: '11.5px', color: '#5A625C', lineHeight: 1.5 }}>
                Can your acquisition channels honestly drive +34% to +60% additional volume? If conversion traffic is constrained, discounts erode margin irrevocably.
              </p>
            </div>

            <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #ECE7DC', borderRadius: '8px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#EAF2EC', color: '#153825', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>3</span>
                <strong style={{ fontSize: '12.5px', color: '#1B211C' }}>Floor Price Limit</strong>
              </div>
              <p style={{ fontSize: '11.5px', color: '#5A625C', lineHeight: 1.5 }}>
                Strictly cap promotions above floor unit threshold (e.g., minimum ₹1,100 on low-margin accessories) to avoid zero-margin operations.
              </p>
            </div>
          </div>
        </div>

        {/* Right: 3-Parameter Rapid Model */}
        <div className="panel-card" style={{ padding: '24px', backgroundColor: '#F7F5EE' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Sparkles size={16} style={{ color: '#153825' }} />
            <h3 style={{ fontSize: '17px', color: '#153825' }}>
              3-Parameter Rapid Model
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: '#555C56', lineHeight: 1.5, marginBottom: '14px' }}>
            Starting your very first calculation? You don’t need complex enterprise ledgers. Enter just <strong>3 baseline figures</strong> to derive immediate volume defense numbers:
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', fontSize: '12px', color: '#333A35', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>• <strong>Baseline Selling Price</strong> (e.g., ₹1,200)</li>
            <li>• <strong>Total Landed Cost</strong> (e.g., ₹750)</li>
            <li>• <strong>Expected Base Units</strong> (e.g., 100 qty)</li>
          </ul>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E6E0D2', paddingTop: '12px' }}>
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#7E867F', textTransform: 'uppercase' }}>Instant Output</span>
            <button
              onClick={() => {
                loadAnalysisIntoForm({
                  title: 'Rapid 3-Parameter Run',
                  sku: 'RAPID-01',
                  basePrice: 1200,
                  cost: 750,
                  baseVolume: 100,
                  discountPercent: 10,
                  volumeUpliftPercent: 25
                });
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#153825',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Launch Formula</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
