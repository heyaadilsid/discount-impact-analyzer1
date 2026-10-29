import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings as SettingsIcon,
  Store,
  Banknote,
  ShieldCheck,
  AlertTriangle,
  Download,
  RotateCcw,
  CheckCircle2,
  Save
} from 'lucide-react';

export default function SettingsPage() {
  const {
    storeName,
    setStoreName,
    workspaceName,
    setWorkspaceName,
    currency,
    setCurrency,
    savedAnalyses,
    exportLedgerCSV,
    addToast,
    currentUser,
    openAuthModal,
    logoutUser
  } = useApp();

  const [minFloorMargin, setMinFloorMargin] = useState(25);
  const [elasticityWarning, setElasticityWarning] = useState(100);
  const [includeFreight, setIncludeFreight] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Workspace settings saved successfully', 'success');
  };

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
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
          Configuration & Financial Guardrails
        </div>
        <h1 style={{
          fontSize: '32px',
          color: '#153825',
          fontWeight: 700,
          letterSpacing: '-0.5px',
          marginBottom: '6px'
        }}>
          Settings
        </h1>
        <p style={{
          fontSize: '14.5px',
          color: '#555E57',
          lineHeight: 1.5
        }}>
          Configure retail store workspace parameters, currency defaults, and financial margin defense thresholds.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Workspace Identity */}
        <div className="panel-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
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
              <Store size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', color: '#153825' }}>Retail Workspace Identity</h3>
              <p style={{ fontSize: '12px', color: '#666F68' }}>Used across decision ledgers and PDF exports.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#313833', marginBottom: '6px' }}>
                Store / Brand Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #DDD7CA',
                  fontSize: '13px',
                  color: '#1B211C',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#313833', marginBottom: '6px' }}>
                Workspace Category / Department
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #DDD7CA',
                  fontSize: '13px',
                  color: '#1B211C',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Currency & Accounting Settings */}
        <div className="panel-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
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
              <Banknote size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', color: '#153825' }}>Reporting Currency</h3>
              <p style={{ fontSize: '12px', color: '#666F68' }}>Set primary ledger currency denomination.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[
              { code: 'INR', label: 'Indian Rupee', symbol: '₹' },
              { code: 'USD', label: 'US Dollar', symbol: '$' },
              { code: 'EUR', label: 'Euro', symbol: '€' },
              { code: 'GBP', label: 'British Pound', symbol: '£' },
            ].map(c => {
              const isSelected = currency === c.code;
              return (
                <div
                  key={c.code}
                  onClick={() => setCurrency(c.code)}
                  style={{
                    border: '1px solid',
                    borderColor: isSelected ? '#153825' : '#DDD7CA',
                    backgroundColor: isSelected ? '#F0F5F1' : '#FFFFFF',
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: isSelected ? '#153825' : '#222824', fontSize: '14px' }}>{c.code}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', color: isSelected ? '#153825' : '#70776F' }}>{c.symbol}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#68726A', marginTop: '4px' }}>{c.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Guardrails & Thresholds */}
        <div className="panel-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: '#FEF9EE',
              color: '#B96E0D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', color: '#153825' }}>Automated Guardrails & Alerts</h3>
              <p style={{ fontSize: '12px', color: '#666F68' }}>Rule criteria for triggering "Margin Dilution Alert" flags.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#313833', marginBottom: '6px' }}>
                Floor Gross Margin Minimum (%):
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  value={minFloorMargin}
                  onChange={(e) => setMinFloorMargin(Number(e.target.value))}
                  style={{
                    width: '80px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #DDD7CA',
                    fontSize: '13px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600
                  }}
                />
                <span style={{ fontSize: '12px', color: '#68726A' }}>Any promotional margin below this triggers an alert.</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#313833', marginBottom: '6px' }}>
                Elasticity Surge Limit (% Lift):
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  value={elasticityWarning}
                  onChange={(e) => setElasticityWarning(Number(e.target.value))}
                  style={{
                    width: '80px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #DDD7CA',
                    fontSize: '13px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600
                  }}
                />
                <span style={{ fontSize: '12px', color: '#68726A' }}>Flag break-even requirements exceeding this as unrealistic.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save button & export */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => exportLedgerCSV()}
            className="btn-secondary"
            style={{ fontSize: '13px', padding: '9px 16px', gap: '6px' }}
          >
            <Download size={15} />
            <span>Export Complete Fiscal Ledger</span>
          </button>

          <button
            type="submit"
            className="btn-primary"
            style={{ fontSize: '13px', padding: '9px 24px', gap: '6px' }}
          >
            <Save size={15} />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
