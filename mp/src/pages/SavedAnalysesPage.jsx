import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatPercent, calculateAnalysis } from '../utils/calculations';
import {
  Download,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Trash2,
  GitCompare,
  AlertTriangle,
  CheckCircle2,
  Info,
  Calendar,
  Layers,
  Archive,
  FileSpreadsheet
} from 'lucide-react';

export default function SavedAnalysesPage() {
  const {
    savedAnalyses,
    currency,
    navigate,
    loadAnalysisIntoForm,
    loadIntoScenarioComparison,
    deleteAnalysis,
    exportLedgerCSV,
    openImportModal
  } = useApp();

  const [activeTab, setActiveTab] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [localSearch, setLocalSearch] = useState('');

  // Counts for tabs
  const countAll = savedAnalyses.length;
  const countSustainable = savedAnalyses.filter(item => {
    const calc = calculateAnalysis(item);
    return calc.riskBadgeType === 'sustainable';
  }).length;
  const countHighLift = savedAnalyses.filter(item => {
    const calc = calculateAnalysis(item);
    return calc.riskBadgeType === 'warning';
  }).length;
  const countDilution = savedAnalyses.filter(item => {
    const calc = calculateAnalysis(item);
    return calc.riskBadgeType === 'alert';
  }).length;

  const categories = ['All', 'Travel Gear', 'Apparel', 'Home Goods', 'Workspace', 'General Merchandising'];

  // Filtered list
  const filteredList = savedAnalyses.filter(item => {
    const calc = calculateAnalysis(item);

    // Tab filter
    if (activeTab === 'Sustainable' && calc.riskBadgeType !== 'sustainable') return false;
    if (activeTab === 'High Lift' && calc.riskBadgeType !== 'warning') return false;
    if (activeTab === 'Dilution Alert' && calc.riskBadgeType !== 'alert') return false;

    // Category filter
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;

    // Search filter
    if (localSearch) {
      const q = localSearch.toLowerCase();
      const matchName = item.campaign.toLowerCase().includes(q);
      const matchSku = item.sku.toLowerCase().includes(q);
      const matchId = item.id.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchId) return false;
    }

    return true;
  });

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Page Header */}
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
            Analysis Archive & Report Audit
          </div>
          <h1 style={{
            fontSize: '32px',
            color: '#153825',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            marginBottom: '6px'
          }}>
            Saved Analyses
          </h1>
          <p style={{
            fontSize: '14.5px',
            color: '#555E57',
            maxWidth: '680px',
            lineHeight: 1.5
          }}>
            Review previously modeled promotional campaigns, audit financial performance projections, and export executive reports.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={openImportModal}
            className="btn-secondary"
            style={{ fontSize: '12.5px', padding: '7px 12px', gap: '6px' }}
            title="Import campaign records from a CSV file or Google Sheet"
          >
            <FileSpreadsheet size={14} style={{ color: '#153825' }} />
            <span>Import from Sheet</span>
          </button>

          <button
            onClick={() => exportLedgerCSV(filteredList)}
            className="btn-secondary"
            style={{ fontSize: '12.5px', padding: '7px 12px' }}
          >
            <Download size={14} />
            <span>Export All Ledger</span>
          </button>

          <button
            onClick={() => navigate('new-analysis')}
            className="btn-primary"
            style={{ fontSize: '12.5px', padding: '8px 16px' }}
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          border: '1px solid #DDD7CA',
          borderRadius: '8px',
          padding: '3px'
        }}>
          {[
            { id: 'All', label: `All Runs (${countAll})` },
            { id: 'Sustainable', label: `Sustainable (${countSustainable})` },
            { id: 'High Lift', label: `High Lift (${countHighLift})` },
            { id: 'Dilution Alert', label: `Dilution Alert (${countDilution})` },
          ].map(tab => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: isSelected ? '#153825' : 'transparent',
                  color: isSelected ? '#FFFFFF' : '#4E554F',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search & Category Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Category Dropdown */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #DDD7CA',
            borderRadius: '6px',
            padding: '4px 10px'
          }}>
            <Filter size={13} style={{ color: '#7E867F' }} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '12px',
                color: '#262D28',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', color: '#889189' }} />
            <input
              type="text"
              placeholder="Search campaign or SKU..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              style={{
                padding: '6px 12px 6px 30px',
                fontSize: '12px',
                borderRadius: '6px',
                border: '1px solid #DDD7CA',
                backgroundColor: '#FFFFFF',
                color: '#1C221D',
                width: '210px',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Saved Analyses Table */}
      <div className="panel-card" style={{ overflow: 'hidden', marginBottom: '24px' }}>
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
              <th style={{ padding: '12px 24px' }}>Campaign & Product</th>
              <th style={{ padding: '12px 16px' }}>Category / SKU</th>
              <th style={{ padding: '12px 16px' }}>Discount & Price</th>
              <th style={{ padding: '12px 16px' }}>Baseline → Projected</th>
              <th style={{ padding: '12px 16px' }}>Profit Variance</th>
              <th style={{ padding: '12px 16px' }}>Break-Even Lift</th>
              <th style={{ padding: '12px 24px', textAlign: 'right' }}>Assessment / Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '48px 24px', textAlign: 'center', color: '#7E867F' }}>
                  No promotional analyses match your current filters.
                </td>
              </tr>
            ) : (
              filteredList.map((item, idx) => {
                const calc = calculateAnalysis(item);
                const isDilution = calc.riskBadgeType === 'alert';

                return (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: idx === filteredList.length - 1 ? 'none' : '1px solid #F0ECE2',
                      backgroundColor: '#FFFFFF',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FCFBF9'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  >
                    {/* Campaign & Product */}
                    <td style={{ padding: '14px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: isDilution ? '#C53B27' : calc.riskBadgeType === 'warning' ? '#B96E0D' : '#245A39',
                          flexShrink: 0
                        }} />
                        <div>
                          <div style={{ fontWeight: 600, color: '#153825' }}>
                            {item.campaign}
                          </div>
                          <div style={{ fontSize: '11px', color: '#7E867F', fontFamily: 'var(--font-mono)' }}>
                            Ref: {item.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category / SKU */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ color: '#2C332E', fontWeight: 500 }}>
                        {item.category}
                      </div>
                      <div style={{ fontSize: '11px', color: '#7E867F', fontFamily: 'var(--font-mono)' }}>
                        SKU - {item.sku}
                      </div>
                    </td>

                    {/* Discount & Price */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{
                        display: 'inline-block',
                        backgroundColor: isDilution ? '#FDF2F0' : '#EAF2EC',
                        color: isDilution ? '#962818' : '#174028',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        marginBottom: '3px'
                      }}>
                        {item.discountPercent}% off
                      </div>
                      <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                        <span style={{ textDecoration: 'line-through', color: '#889189', marginRight: '6px' }}>
                          {formatCurrency(item.basePrice, currency)}
                        </span>
                        <strong style={{ color: '#153825' }}>
                          {formatCurrency(calc.promoUnitPrice, currency)}
                        </strong>
                      </div>
                    </td>

                    {/* Baseline -> Projected */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '12.5px', fontFamily: 'var(--font-mono)', color: '#444C46' }}>
                        {formatCurrency(calc.baselineGrossProfit, currency)}
                      </div>
                      <div style={{ fontSize: '11px', color: '#7E867F', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>↓</span>
                        <strong style={{ color: isDilution ? '#C53B27' : '#153825', fontFamily: 'var(--font-mono)' }}>
                          {formatCurrency(calc.promoGrossProfit, currency)}
                        </strong>
                      </div>
                    </td>

                    {/* Profit Variance */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: calc.grossProfitDelta >= 0 ? '#EAF2EC' : '#FDF3F1',
                        color: calc.grossProfitDelta >= 0 ? '#174028' : '#C53B27',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px'
                      }}>
                        {calc.grossProfitDelta >= 0 ? '+' : ''}{formatCurrency(calc.grossProfitDelta, currency)} ({formatPercent(calc.grossProfitDeltaPct, true)})
                      </div>
                    </td>

                    {/* Break-Even Lift */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        color: calc.requiredVolumeLiftPct > 100 ? '#C53B27' : '#153825'
                      }}>
                        +{calc.requiredVolumeLiftPct.toFixed(1)}%
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: calc.requiredVolumeLiftPct > 100 ? '#C53B27' : '#7E867F'
                      }}>
                        {calc.breakEvenVolume} units {calc.requiredVolumeLiftPct > 100 ? '(Unrealistic)' : 'needed'}
                      </div>
                    </td>

                    {/* Assessment / Actions */}
                    <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        {calc.riskBadgeType === 'sustainable' ? (
                          <span className="badge-sustainable">
                            <CheckCircle2 size={12} />
                            Sustainable
                          </span>
                        ) : calc.riskBadgeType === 'warning' ? (
                          <span className="badge-warning">
                            <AlertTriangle size={12} />
                            High Lift
                          </span>
                        ) : (
                          <span className="badge-alert">
                            <AlertTriangle size={12} />
                            Margin Dilution
                          </span>
                        )}

                        <button
                          onClick={() => loadAnalysisIntoForm(item)}
                          title="Open in Simulator"
                          style={{
                            background: 'none',
                            border: '1px solid #DDD7CA',
                            borderRadius: '4px',
                            color: '#153825',
                            padding: '4px 6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <ArrowRight size={13} />
                        </button>

                        <button
                          onClick={() => loadIntoScenarioComparison(item)}
                          title="Compare in Scenarios"
                          style={{
                            background: 'none',
                            border: '1px solid #DDD7CA',
                            borderRadius: '4px',
                            color: '#153825',
                            padding: '4px 6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <GitCompare size={13} />
                        </button>

                        <button
                          onClick={() => deleteAnalysis(item.id)}
                          title="Delete"
                          style={{
                            background: 'none',
                            border: '1px solid #DDD7CA',
                            borderRadius: '4px',
                            color: '#C53B27',
                            padding: '4px 6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Footer info bar */}
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
            Showing <strong>{filteredList.length}</strong> of {savedAnalyses.length} analyses • <span style={{ color: '#245A39', fontWeight: 600 }}>{countSustainable} Sustainable</span> • <span style={{ color: '#C53B27', fontWeight: 600 }}>{countDilution} Dilution Alert</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>
            FINANCIAL LEDGER REV 4.12 • ALL FIGURES IN {currency} ({currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'})
          </div>
        </div>
      </div>

      {/* Bottom Card: Audit Framework Guidelines (as seen in Image 5) */}
      <div className="panel-card" style={{
        padding: '20px',
        backgroundColor: '#F8F6F1',
        border: '1px solid #E6DFCF',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px'
      }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: '#EDE7DC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#555E57',
          flexShrink: 0,
          marginTop: '2px'
        }}>
          <Info size={16} />
        </div>
        <div>
          <h4 style={{ fontSize: '14.5px', color: '#153825', marginBottom: '4px' }}>
            Audit Framework Guidelines
          </h4>
          <p style={{ fontSize: '12.5px', color: '#4E5750', lineHeight: 1.6 }}>
            The <strong>Break-Even Volume Lift</strong> is calculated mathematically as <code style={{ fontFamily: 'var(--font-mono)', backgroundColor: '#EAE4D7', padding: '1px 5px', borderRadius: '3px' }}>% Discount ÷ (Gross Margin % − % Discount)</code>. Projections flagging <span style={{ color: '#C53B27', fontWeight: 700 }}>Margin Dilution Alert</span> reflect scenarios where required unit expansion exceeds historical elasticity bounds (&gt;100%), presenting severe net income attrition risk.
          </p>
        </div>
      </div>
    </div>
  );
}
