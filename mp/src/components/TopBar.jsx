import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, ChevronDown, User, Banknote } from 'lucide-react';

export default function TopBar() {
  const {
    currentPage,
    navigate,
    currency,
    setCurrency,
    globalSearch,
    setGlobalSearch,
    currentUser,
    openAuthModal,
    logoutUser,
    storeName,
    backendConnected
  } = useApp();

  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Map currentPage to breadcrumb label
  const pageTitles = {
    overview: 'Overview',
    'new-analysis': 'Section',
    'scenario-comparison': 'Section',
    'saved-analyses': 'Archive',
    settings: 'Settings'
  };

  const currencies = [
    { code: 'INR', symbol: '₹', label: 'INR (₹)' },
    { code: 'USD', symbol: '$', label: 'USD ($)' },
    { code: 'EUR', symbol: '€', label: 'EUR (€)' },
    { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  ];

  return (
    <header style={{
      height: '56px',
      backgroundColor: '#FAF8F5',
      borderBottom: '1px solid #E6E1D4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }}>
      {/* Left: Breadcrumbs & Currency Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          fontSize: '12.5px',
          color: '#6F7771',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('overview')}>Workspace</span>
          <span>&rsaquo;</span>
          <span style={{ color: '#1B211C', fontWeight: 500 }}>
            {pageTitles[currentPage] || 'Overview'}
          </span>
        </div>

        <div style={{ width: '1px', height: '16px', backgroundColor: '#D9D3C5' }} />

        {/* Currency Switcher Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #DDD7CA',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: 500,
              color: '#1E2520',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)'
            }}
          >
            <Banknote size={13} style={{ color: '#556057' }} />
            <span>Currency: {currency} ({currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'})</span>
            <ChevronDown size={12} style={{ color: '#7E867F' }} />
          </button>

          {currencyDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '4px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #DDD7CA',
              borderRadius: '6px',
              boxShadow: 'var(--shadow-md)',
              width: '140px',
              zIndex: 50,
              overflow: 'hidden'
            }}>
              {currencies.map(curr => (
                <button
                  key={curr.code}
                  onClick={() => {
                    setCurrency(curr.code);
                    setCurrencyDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: currency === curr.code ? '#EEF4EF' : 'transparent',
                    color: currency === curr.code ? '#173D26' : '#2D3530',
                    fontWeight: currency === curr.code ? 600 : 400,
                    fontSize: '12px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span>{curr.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#707A72' }}>{curr.symbol}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* MongoDB Atlas Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 9px',
          borderRadius: '12px',
          backgroundColor: backendConnected ? '#EAF5EC' : '#F7F6F3',
          border: `1px solid ${backendConnected ? '#BCDDC1' : '#E0DBD0'}`,
          fontSize: '11px',
          fontWeight: 600,
          color: backendConnected ? '#1A4D2B' : '#737C75'
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: backendConnected ? '#10B981' : '#F59E0B',
            boxShadow: backendConnected ? '0 0 6px rgba(16, 185, 129, 0.6)' : 'none'
          }} />
          <span>{backendConnected ? 'MongoDB Live' : 'Backend Ready'}</span>
        </div>
      </div>

      {/* Right: Search, + New Analysis CTA, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Search input */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', color: '#889189' }} />
          <input
            type="text"
            placeholder="Search analyses or products..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            style={{
              padding: '6px 12px 6px 30px',
              fontSize: '12.5px',
              borderRadius: '6px',
              border: '1px solid #DDD7CA',
              backgroundColor: '#FFFFFF',
              color: '#1C221D',
              width: '210px',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              transition: 'all 0.15s ease'
            }}
            onFocus={(e) => {
              e.target.style.width = '260px';
              e.target.style.borderColor = '#153825';
            }}
            onBlur={(e) => {
              e.target.style.width = '210px';
              e.target.style.borderColor = '#DDD7CA';
            }}
          />
        </div>

        {/* + New Analysis CTA */}
        <button
          onClick={() => navigate('new-analysis')}
          className="btn-primary"
          style={{
            padding: '6px 13px',
            fontSize: '12px',
            borderRadius: '6px',
            gap: '5px'
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>New Analysis</span>
        </button>

        {/* Profile Avatar & Interactive Account Menu */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            title="Account & Profile"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: '#153825',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)',
              border: userMenuOpen ? '2px solid #245A39' : '1px solid transparent',
              fontSize: '12px',
              fontWeight: 700
            }}
          >
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <User size={15} />}
          </div>

          {userMenuOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #DDD7CA',
              borderRadius: '10px',
              boxShadow: 'var(--shadow-lg)',
              width: '240px',
              zIndex: 99,
              overflow: 'hidden',
              animation: 'fadeIn 0.15s ease'
            }}>
              {/* Profile Header */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #ECE7DC', backgroundColor: '#FAF8F4' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#153825',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '13px'
                  }}>
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1B211C', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {currentUser?.name || 'Store Manager'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#7E867F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {currentUser?.email || 'manager@retailstore.com'}
                    </div>
                  </div>
                </div>
                <div style={{
                  marginTop: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#EAF2EC',
                  color: '#174028',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10.5px',
                  fontWeight: 600
                }}>
                  <span>Store: {storeName}</span>
                </div>
              </div>

              {/* Menu Actions */}
              <div style={{ padding: '6px' }}>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    openAuthModal('signup');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 10px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#153825',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    borderRadius: '6px',
                    textAlign: 'left'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#EAF2EC'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Plus size={14} />
                  <span>Create New Account</span>
                </button>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    openAuthModal('login');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 10px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#2E3530',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    textAlign: 'left'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F5F2EA'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <User size={14} />
                  <span>Sign In / Switch User</span>
                </button>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate('settings');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 10px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#2E3530',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    textAlign: 'left'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F5F2EA'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span style={{ fontSize: '13px' }}>⚙</span>
                  <span>Workspace Settings</span>
                </button>

                <div style={{ height: '1px', backgroundColor: '#ECE7DC', margin: '4px 0' }} />

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    logoutUser();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 10px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#C53B27',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    borderRadius: '6px',
                    textAlign: 'left'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FDF2F0'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
