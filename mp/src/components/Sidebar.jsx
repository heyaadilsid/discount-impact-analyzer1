import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  PlusCircle,
  GitCompare,
  FolderArchive,
  Settings,
  HelpCircle,
  ChevronsLeft,
  Store,
  ExternalLink,
  Home
} from 'lucide-react';

export default function Sidebar({ collapsed, setCollapsed }) {
  const { currentPage, navigate, storeName, workspaceName } = useApp();

  const navItems = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'new-analysis', label: 'New Analysis', icon: PlusCircle },
    { id: 'scenario-comparison', label: 'Scenario Comparison', icon: GitCompare },
    { id: 'saved-analyses', label: 'Saved Analyses', icon: FolderArchive },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside style={{
      width: collapsed ? '72px' : '240px',
      backgroundColor: '#FAF8F5',
      borderRight: '1px solid #E6E1D4',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '100vh',
      position: 'sticky',
      top: 0,
      transition: 'width 0.2s ease',
      flexShrink: 0,
      zIndex: 40
    }}>
      {/* Top Header & Navigation */}
      <div>
        {/* Brand Header */}
        <div style={{
          padding: collapsed ? '18px 12px' : '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid #ECE7DC',
          cursor: 'pointer'
        }}
        onClick={() => navigate('overview')}
        title="Impact Analyzer"
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            backgroundColor: '#153825',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            flexShrink: 0
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
          </div>

          {!collapsed && (
            <div>
              <div style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
                fontSize: '15px',
                color: '#153825',
                letterSpacing: '-0.3px',
                lineHeight: 1.15
              }}>
                Impact Analyzer
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9.5px',
                fontWeight: 600,
                color: '#70776F',
                letterSpacing: '0.8px',
                marginTop: '2px'
              }}>
                DISCOUNT ENGINE
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: collapsed ? '10px 0' : '9px 12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: isActive ? '#DEE7DF' : 'transparent',
                  color: isActive ? '#143825' : '#4E554F',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                  position: 'relative'
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '4px',
                    bottom: '4px',
                    width: '3px',
                    backgroundColor: '#153825',
                    borderRadius: '0 2px 2px 0'
                  }} />
                )}
                <Icon size={17} strokeWidth={isActive ? 2.3 : 1.8} style={{ color: isActive ? '#153825' : '#687069' }} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Store & Support */}
      <div style={{ borderTop: '1px solid #ECE7DC', padding: '12px' }}>
        {/* Workspace Card */}
        <div
          onClick={() => navigate('settings')}
          title="Click to view workspace settings & accounts"
          style={{
            backgroundColor: '#F3EFE6',
            border: '1px solid #E3DDCF',
            borderRadius: '8px',
            padding: collapsed ? '8px 4px' : '9px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            marginBottom: '8px',
            cursor: 'pointer',
            transition: 'border-color 0.15s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = '#C9C2B2'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = '#E3DDCF'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              backgroundColor: '#DDD5C5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '11px',
              color: '#343B35',
              flexShrink: 0
            }}>
              A
            </div>
            {!collapsed && (
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1F2420',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {storeName}
                </div>
                <div style={{
                  fontSize: '10.5px',
                  color: '#6E7670',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {workspaceName}
                </div>
              </div>
            )}
          </div>
          {!collapsed && <Store size={14} style={{ color: '#7E867F', flexShrink: 0 }} />}
        </div>

        {/* Support & Guides */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: '6px 4px'
        }}>
          <button
            onClick={() => window.open('#faq', '_self')}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#555C56',
              fontSize: '12px',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <HelpCircle size={15} style={{ color: '#7E867F' }} />
            {!collapsed && <span>Support & Guides</span>}
          </button>

          {!collapsed && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              title="Collapse sidebar"
              style={{
                background: 'none',
                border: 'none',
                color: '#7E867F',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px'
              }}
            >
              <ChevronsLeft size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
