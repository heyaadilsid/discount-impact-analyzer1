import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatPercent } from '../utils/calculations';
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Scale,
  Percent,
  Sliders,
  DollarSign,
  ShieldCheck,
  FileSpreadsheet,
  ArrowUpRight
} from 'lucide-react';

export default function LandingPage() {
  const { navigate, currency, loadAnalysisIntoForm, openAuthModal, currentUser } = useApp();
  const [openFaq, setOpenFaq] = useState(0);

  // Live interactive calculator on landing page
  const [interactiveDiscount, setInteractiveDiscount] = useState(10);
  const [interactiveVolumeLift, setInteractiveVolumeLift] = useState(35);

  const basePrice = 1000;
  const cost = 600;
  const baseVolume = 100;
  const baseMargin = basePrice - cost; // 400
  const baseProfit = baseMargin * baseVolume; // 40,000

  const promoPrice = basePrice * (1 - interactiveDiscount / 100);
  const promoMargin = promoPrice - cost;
  const promoVolume = Math.round(baseVolume * (1 + interactiveVolumeLift / 100));
  const promoProfit = promoMargin * promoVolume;
  const profitDelta = promoProfit - baseProfit;
  const profitDeltaPct = (profitDelta / baseProfit) * 100;
  const breakEvenUnits = promoMargin > 0 ? Math.ceil(baseProfit / promoMargin) : 0;
  const breakEvenLift = ((breakEvenUnits - baseVolume) / baseVolume) * 100;

  const faqs = [
    {
      q: 'What is discount margin dilution and cannibalization?',
      a: 'Margin dilution occurs when the percentage or cash profit earned on each item decreases because of a price cut. Cannibalization happens when you offer discounts to customers who would have gladly bought at full retail price anyway, destroying margin without generating incremental brand growth.'
    },
    {
      q: 'How do I calculate the break-even lift of a discount?',
      a: 'The formula for Required Break-Even Volume Lift is: % Discount ÷ (Gross Margin % − % Discount). For example, if your baseline margin is 40% and you offer a 10% discount, you need a 10% ÷ (40% − 10%) = +33.3% increase in unit sales volume just to generate the exact same cash profit.'
    },
    {
      q: 'Isn’t a discount always profitable if volume increases?',
      a: 'No. This is the single biggest trap in retail. Because your unit gross profit drops with every percentage discounted, you must sell significantly more units. If you discount 20% on a 40% margin item, you need a +100% volume increase (double sales) simply to break even. A 50% volume increase would actually result in a net profit loss.'
    },
    {
      q: 'What does "break-even sales volume" mean?',
      a: 'Break-even sales volume represents the exact number of units you must sell at the promotional price so that total gross profit equals your baseline profit without any promotion. Any unit sold above this threshold generates incremental profit; any shortfall erodes your profit.'
    },
    {
      q: 'Can I compare multiple discount tiers simultaneously?',
      a: 'Yes! The Scenario Comparison tool allows you to model 5%, 10%, 15%, and 20% discount tiers side-by-side against your status quo baseline, visualizing gross profit yields and required volume surges instantly.'
    },
    {
      q: 'Are these calculations guaranteed projections?',
      a: 'The financial math of unit economics and break-even requirements is mathematically exact. The volume uplift percentages you enter are modeled assumptions based on your marketing channels, historical elasticity, and campaign expectations.'
    },
    {
      q: 'Do I need financial or accounting expertise to use this tool?',
      a: 'Not at all. Impact Analyzer was designed specifically for retail managers, e-commerce founders, and pricing strategists who want clear, instant answers without wrestling with complex financial formulas.'
    },
    {
      q: 'Does the calculation include all business expenses?',
      a: 'The core model focuses on Gross Profit and landed Cost of Goods Sold (COGS). In the New Analysis and Settings panels, you can configure landed costs, freight allocations, and floor thresholds for complete margin governance.'
    }
  ];

  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh', color: '#1B211C' }}>
      {/* Top Public Navigation */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(250, 248, 245, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #EBE5D8',
        padding: '0 32px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand */}
        <div
          onClick={() => navigate('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            backgroundColor: '#153825',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
          </div>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            fontSize: '17px',
            color: '#153825',
            letterSpacing: '-0.3px'
          }}>
            Discount Impact Analyzer
          </span>
        </div>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <a href="#features" style={{ textDecoration: 'none', color: '#4E5650', fontSize: '13.5px', fontWeight: 500 }}>Product</a>
          <a href="#how-it-works" style={{ textDecoration: 'none', color: '#4E5650', fontSize: '13.5px', fontWeight: 500 }}>How It Works</a>
          <a href="#benefits" style={{ textDecoration: 'none', color: '#4E5650', fontSize: '13.5px', fontWeight: 500 }}>Benefits</a>
          <a href="#faq" style={{ textDecoration: 'none', color: '#4E5650', fontSize: '13.5px', fontWeight: 500 }}>FAQ</a>
        </div>

        {/* Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => openAuthModal('signup')}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#153825',
              border: '1px solid #C4D6C7',
              padding: '7px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#EAF2EC';
              e.currentTarget.style.borderColor = '#153825';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.borderColor = '#C4D6C7';
            }}
          >
            Sign in / Sign up
          </button>

          <button
            onClick={() => navigate('overview')}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '13px' }}
          >
            Guest User
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '60px 24px 70px 24px',
        display: 'grid',
        gridTemplateColumns: '1.05fr 1fr',
        gap: '48px',
        alignItems: 'center'
      }}>
        {/* Left Hero Column */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#EAF2EC',
            border: '1px solid #BCD4C1',
            borderRadius: '999px',
            padding: '4px 12px',
            fontSize: '11.5px',
            fontWeight: 600,
            color: '#174028',
            marginBottom: '20px',
            letterSpacing: '0.4px',
            textTransform: 'uppercase'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#174028' }} />
            Brand Financial Clarity
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '52px',
            fontWeight: 600,
            lineHeight: 1.12,
            letterSpacing: '-1.2px',
            color: '#153825',
            marginBottom: '20px'
          }}>
            Know Your Profit Before You Offer a Discount.
          </h1>

          <p style={{
            fontSize: '16.5px',
            lineHeight: 1.6,
            color: '#4B534D',
            marginBottom: '32px',
            maxWidth: '540px'
          }}>
            Store discounts affect your margins. Calculate the impact before you reduce your prices,
            compare different scenarios, and understand how much additional sales volume you need
            to protect your profit.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
            <button
              onClick={() => {
                if (!currentUser?.isLoggedIn) {
                  openAuthModal('login');
                } else {
                  navigate('new-analysis');
                }
              }}
              className="btn-primary"
              style={{ padding: '12px 24px', fontSize: '14.5px', borderRadius: '8px' }}
            >
              Analyze a Discount
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => {
                if (!currentUser?.isLoggedIn) {
                  openAuthModal('login');
                } else {
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
                }
              }}
              className="btn-secondary"
              style={{ padding: '11px 20px', fontSize: '14px', borderRadius: '8px' }}
            >
              Explore a Sample Walkthrough
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5C655E', fontSize: '12.5px' }}>
            <CheckCircle2 size={15} style={{ color: '#245A39' }} />
            <span>Clear calculations. Practical margins. Better pricing decisions.</span>
          </div>
        </div>

        {/* Right Hero Preview Card: Quick Result Interactive Simulator */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #DDD7C9',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-md)',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #ECE7DC',
            paddingBottom: '16px',
            marginBottom: '18px'
          }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#7E867F', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                Quick Result
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#153825' }}>
                Evaluating the Impact (Cannibalization)
              </div>
            </div>
            <div style={{
              backgroundColor: '#FEF9EE',
              border: '1px solid #F6DFB5',
              color: '#824B05',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700
            }}>
              LIVE MODEL
            </div>
          </div>

          {/* 4 Mini Stat Boxes */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            marginBottom: '18px'
          }}>
            <div style={{ backgroundColor: '#F8F6F1', border: '1px solid #ECE5D7', borderRadius: '6px', padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: '10.5px', color: '#6A726B' }}>Original Price</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#1B211C', marginTop: '2px' }}>{formatCurrency(basePrice, currency)}</div>
            </div>
            <div style={{ backgroundColor: '#F8F6F1', border: '1px solid #ECE5D7', borderRadius: '6px', padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: '10.5px', color: '#6A726B' }}>Landed Cost</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#1B211C', marginTop: '2px' }}>{formatCurrency(cost, currency)}</div>
            </div>
            <div style={{ backgroundColor: '#F8F6F1', border: '1px solid #ECE5D7', borderRadius: '6px', padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: '10.5px', color: '#6A726B' }}>Discount</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#B96E0D', marginTop: '2px' }}>{interactiveDiscount}%</div>
            </div>
            <div style={{ backgroundColor: '#F8F6F1', border: '1px solid #ECE5D7', borderRadius: '6px', padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: '10.5px', color: '#6A726B' }}>Promo Price</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#153825', marginTop: '2px' }}>{formatCurrency(promoPrice, currency)}</div>
            </div>
          </div>

          {/* Interactive Sliders inside card */}
          <div style={{
            backgroundColor: '#F7F5EE',
            border: '1px solid #E5E0D2',
            borderRadius: '10px',
            padding: '14px',
            marginBottom: '18px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#384039' }}>Test Discount %</span>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#153825', fontFamily: 'var(--font-mono)' }}>{interactiveDiscount}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="1"
              value={interactiveDiscount}
              onChange={(e) => setInteractiveDiscount(Number(e.target.value))}
              style={{ marginBottom: '14px' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#384039' }}>Estimated Volume Lift %</span>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#153825', fontFamily: 'var(--font-mono)' }}>+{interactiveVolumeLift}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              step="5"
              value={interactiveVolumeLift}
              onChange={(e) => setInteractiveVolumeLift(Number(e.target.value))}
            />
          </div>

          {/* Primary Financial Comparison Box */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            border: '1px solid #DDD7C9',
            borderRadius: '8px',
            padding: '14px',
            marginBottom: '16px',
            backgroundColor: profitDelta >= 0 ? '#F6FAF7' : '#FEF5F4'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#6A736C' }}>Baseline Gross Profit</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#1C221D', marginTop: '2px' }}>
                {formatCurrency(baseProfit, currency)}
              </div>
              <div style={{ fontSize: '10.5px', color: '#7E867F', marginTop: '2px' }}>
                Baseline: {baseVolume} units
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: '#6A736C' }}>Projected Gross Profit</div>
              <div style={{
                fontSize: '20px',
                fontWeight: 700,
                color: profitDelta >= 0 ? '#153825' : '#C53B27',
                marginTop: '2px'
              }}>
                {formatCurrency(promoProfit, currency)}
              </div>
              <div style={{
                fontSize: '11px',
                fontWeight: 600,
                color: profitDelta >= 0 ? '#245A39' : '#C53B27',
                marginTop: '2px'
              }}>
                {profitDelta >= 0 ? '+' : ''}{formatCurrency(profitDelta, currency)} ({formatPercent(profitDeltaPct, true)})
              </div>
            </div>
          </div>

          {/* Break-even Units Meter */}
          <div style={{
            borderTop: '1px solid #ECE7DC',
            paddingTop: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px'
          }}>
            <div>
              <span style={{ color: '#5A635C' }}>Required Break-Even: </span>
              <strong style={{ color: '#153825', fontFamily: 'var(--font-mono)' }}>{breakEvenUnits} units</strong>
              <span style={{ color: '#7E867F' }}> (+{formatPercent(breakEvenLift)})</span>
            </div>
            <button
              onClick={() => {
                if (!currentUser?.isLoggedIn) {
                  openAuthModal('login');
                } else {
                  loadAnalysisIntoForm({
                    title: 'Simulated Discount Campaign',
                    sku: 'SIM-01',
                    basePrice,
                    cost,
                    baseVolume,
                    discountPercent: interactiveDiscount,
                    volumeUpliftPercent: interactiveVolumeLift
                  });
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#153825',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px'
              }}
            >
              Open in Analyzer <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Discounts Attract Customers. But What Do They Cost You? */}
      <section style={{
        backgroundColor: '#F3EFE6',
        borderTop: '1px solid #E6DFCF',
        borderBottom: '1px solid #E6DFCF',
        padding: '70px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#7E867F', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
              The Hidden Reality
            </div>
            <h2 style={{ fontSize: '36px', color: '#153825', marginBottom: '12px' }}>
              Discounts Attract Customers. But What Do They Cost You?
            </h2>
            <p style={{ fontSize: '15.5px', color: '#525B54', maxWidth: '720px' }}>
              Reducing prices can increase sales, but higher sales volume does not automatically mean higher profit.
              Understand the trade-off before launching a promotion.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {/* Card 1 */}
            <div className="panel-card" style={{ padding: '28px 24px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#EAF2EC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#245A39',
                marginBottom: '18px'
              }}>
                <DollarSign size={20} />
              </div>
              <h3 style={{ fontSize: '18px', color: '#153825', marginBottom: '10px' }}>
                Revenue ≠ Profit
              </h3>
              <p style={{ fontSize: '13.5px', color: '#525A54', lineHeight: 1.6 }}>
                You can make more sales while bringing in less profit if price cuts eat into unit contribution margins.
                Focus on real gross profit, not vanity top-line figures.
              </p>
              <div style={{ marginTop: '20px', fontSize: '11.5px', color: '#88918A', fontWeight: 600 }}>
                Focus on Gross Margin Retention
              </div>
            </div>

            {/* Card 2 */}
            <div className="panel-card" style={{ padding: '28px 24px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#FEF9EE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#B96E0D',
                marginBottom: '18px'
              }}>
                <Percent size={20} />
              </div>
              <h3 style={{ fontSize: '18px', color: '#153825', marginBottom: '10px' }}>
                Small Discounts Can Have a Big Impact
              </h3>
              <p style={{ fontSize: '13.5px', color: '#525A54', lineHeight: 1.6 }}>
                Even a modest price reduction can require significant additional sales to replace lost profit margin per unit.
                A 10% discount on a 40% margin item erodes 25% of unit profit.
              </p>
              <div style={{ marginTop: '20px', fontSize: '11.5px', color: '#88918A', fontWeight: 600 }}>
                Non-Linear Profit Dilution
              </div>
            </div>

            {/* Card 3 */}
            <div className="panel-card" style={{ padding: '28px 24px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#FDF3F1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C53B27',
                marginBottom: '18px'
              }}>
                <Scale size={20} />
              </div>
              <h3 style={{ fontSize: '18px', color: '#153825', marginBottom: '10px' }}>
                Guessing Makes Decisions Harder
              </h3>
              <p style={{ fontSize: '13.5px', color: '#525A54', lineHeight: 1.6 }}>
                Promotions rolled without financial modeling gamble your bottom line. Replace intuition with exact break-even math,
                so you never approve a money-losing promo.
              </p>
              <div style={{ marginTop: '20px', fontSize: '11.5px', color: '#88918A', fontWeight: 600 }}>
                Risk Elimination & Guardrails
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Everything You Need to Evaluate a Discount */}
      <section id="features" style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#7E867F', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
            Essential Toolset
          </div>
          <h2 style={{ fontSize: '36px', color: '#153825', marginBottom: '12px' }}>
            Everything You Need to Evaluate a Discount.
          </h2>
          <p style={{ fontSize: '15.5px', color: '#525B54', maxWidth: '720px' }}>
            From calculating the impact of a price reduction to comparing alternative offers, understand the numbers before you decide.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          {/* Pillar 1 */}
          <div className="panel-card" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '19px', color: '#153825' }}>Profit Impact Calculator</h3>
              <div style={{ color: '#245A39', backgroundColor: '#EAF2EC', padding: '6px', borderRadius: '6px' }}>
                <Sliders size={18} />
              </div>
            </div>
            <p style={{ fontSize: '13.5px', color: '#525A54', marginBottom: '20px' }}>
              Input price, cost, expected base quantity, and discount percentage to examine drops in unit gross profit.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              backgroundColor: '#F8F6F1',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '11.5px',
              textAlign: 'center'
            }}>
              <div><span style={{ color: '#7E867F' }}>Price:</span> <strong>₹1,000</strong></div>
              <div><span style={{ color: '#7E867F' }}>Cost:</span> <strong>₹600</strong></div>
              <div style={{ color: '#153825', fontWeight: 700 }}>Margin: 40%</div>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="panel-card" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '19px', color: '#153825' }}>Before-and-After Analysis</h3>
              <div style={{ color: '#245A39', backgroundColor: '#EAF2EC', padding: '6px', borderRadius: '6px' }}>
                <TrendingUp size={18} />
              </div>
            </div>
            <p style={{ fontSize: '13.5px', color: '#525A54', marginBottom: '20px' }}>
              Compare baseline and discounted revenue, gross profit, and gross margins in one clear ledger view.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              backgroundColor: '#F8F6F1',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '11.5px'
            }}>
              <div>Baseline Profit: <strong>₹40,000</strong></div>
              <div style={{ color: '#153825' }}>Promo Profit: <strong>₹40,500 (+₹500)</strong></div>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="panel-card" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '19px', color: '#153825' }}>Scenario Comparison</h3>
              <div style={{ color: '#245A39', backgroundColor: '#EAF2EC', padding: '6px', borderRadius: '6px' }}>
                <FileSpreadsheet size={18} />
              </div>
            </div>
            <p style={{ fontSize: '13.5px', color: '#525A54', marginBottom: '20px' }}>
              Compare discount tiers such as 5%, 10%, and 20% simultaneously using the same baseline assumptions.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              backgroundColor: '#F8F6F1',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '11.5px',
              textAlign: 'center'
            }}>
              <div>5% Off: <strong>₹40,250</strong></div>
              <div style={{ color: '#153825', fontWeight: 700 }}>10% Off: <strong>₹40,500</strong></div>
              <div style={{ color: '#C53B27', fontWeight: 700 }}>20% Off: <strong>₹32,000</strong></div>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="panel-card" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '19px', color: '#153825' }}>Break-Even Sales Analysis</h3>
              <div style={{ color: '#245A39', backgroundColor: '#EAF2EC', padding: '6px', borderRadius: '6px' }}>
                <ShieldCheck size={18} />
              </div>
            </div>
            <p style={{ fontSize: '13.5px', color: '#525A54', marginBottom: '20px' }}>
              Identify how many additional units you must sell to maintain your original gross profit after reducing your price.
            </p>
            <div style={{
              backgroundColor: '#F8F6F1',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '11.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>Required Break-Even: <strong>134 units</strong></span>
              <span style={{ color: '#153825', fontWeight: 600 }}>+34% Volume Surge Needed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Three Simple Steps to a Smarter Discount */}
      <section id="how-it-works" style={{
        backgroundColor: '#F3EFE6',
        borderTop: '1px solid #E6DFCF',
        borderBottom: '1px solid #E6DFCF',
        padding: '70px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#7E867F', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
              Simple Three-Step Flow
            </div>
            <h2 style={{ fontSize: '36px', color: '#153825', marginBottom: '12px' }}>
              Three Simple Steps to a Smarter Discount.
            </h2>
            <p style={{ fontSize: '15.5px', color: '#525B54', maxWidth: '720px' }}>
              You do not need extensive financial knowledge to model your discount's financial impact.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {/* Step 1 */}
            <div className="panel-card" style={{ padding: '28px 24px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: '#153825',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '13px',
                marginBottom: '16px'
              }}>
                01
              </div>
              <h3 style={{ fontSize: '18px', color: '#153825', marginBottom: '10px' }}>
                Enter Your Numbers
              </h3>
              <p style={{ fontSize: '13.5px', color: '#525A54', lineHeight: 1.6, marginBottom: '20px' }}>
                Add your current selling price, landed cost per unit, and expected sales volume.
              </p>
              <div style={{ backgroundColor: '#F8F6F1', border: '1px solid #ECE7DC', borderRadius: '6px', padding: '10px', fontSize: '11.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#7E867F' }}>Selling Price:</span> <strong>₹1,000</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#7E867F' }}>Unit Cost:</span> <strong>₹600</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#7E867F' }}>Base Volume:</span> <strong>100 units</strong>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="panel-card" style={{ padding: '28px 24px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: '#153825',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '13px',
                marginBottom: '16px'
              }}>
                02
              </div>
              <h3 style={{ fontSize: '18px', color: '#153825', marginBottom: '10px' }}>
                Test Your Discount
              </h3>
              <p style={{ fontSize: '13.5px', color: '#525A54', lineHeight: 1.6, marginBottom: '20px' }}>
                Choose a discount percentage and estimate how you believe volume might change.
              </p>
              <div style={{ backgroundColor: '#F8F6F1', border: '1px solid #ECE7DC', borderRadius: '6px', padding: '10px', fontSize: '11.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#7E867F' }}>Selected Discount:</span> <strong style={{ color: '#153825' }}>10%</strong>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#E9E4D8' }}>5%</span>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#153825', color: '#FFF' }}>10%</span>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#E9E4D8' }}>15%</span>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#E9E4D8' }}>20%</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="panel-card" style={{ padding: '28px 24px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: '#153825',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '13px',
                marginBottom: '16px'
              }}>
                03
              </div>
              <h3 style={{ fontSize: '18px', color: '#153825', marginBottom: '10px' }}>
                Understand the Impact
              </h3>
              <p style={{ fontSize: '13.5px', color: '#525A54', lineHeight: 1.6, marginBottom: '20px' }}>
                Review projected revenue, gross profit, net gain, and the additional sales volume needed to break even.
              </p>
              <div style={{ backgroundColor: '#F8F6F1', border: '1px solid #ECE7DC', borderRadius: '6px', padding: '10px', fontSize: '11.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#7E867F' }}>Projected Profit:</span> <strong style={{ color: '#153825' }}>₹40,500</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#7E867F' }}>Profit Variance:</span> <strong style={{ color: '#245A39' }}>+₹500 (+1.25%)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#7E867F' }}>Required Break-Even:</span> <strong>134 units (+34%)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: See the Impact Before You Launch (Live Table Comparison) */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#7E867F', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
            Multi-Tier Sensitivity
          </div>
          <h2 style={{ fontSize: '36px', color: '#153825', marginBottom: '12px' }}>
            See the Impact Before You Launch.
          </h2>
          <p style={{ fontSize: '15.5px', color: '#525B54' }}>
            Spot different discount tiers side by side and understand how each tier may affect your gross profit.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="panel-card" style={{ overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{
            backgroundColor: '#F5F2EA',
            padding: '12px 20px',
            borderBottom: '1px solid #E6E0D2',
            fontSize: '12.5px',
            color: '#49524B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <strong>Everyday Backpack:</strong> Original Price: <strong>₹1,000</strong> | Landed Cost: <strong>₹600</strong> | Baseline Expected Sales: <strong>100 units</strong>
            </div>
            <div style={{ fontSize: '11.5px', color: '#7E867F' }}>
              Ledger Currency: INR (₹)
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF8F4', borderBottom: '1px solid #EBE5D8', color: '#6A726B', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '12px 20px' }}>Discount Assumption</th>
                <th style={{ padding: '12px 16px' }}>Promo Price</th>
                <th style={{ padding: '12px 16px' }}>Projected Sales</th>
                <th style={{ padding: '12px 16px' }}>Gross Revenue</th>
                <th style={{ padding: '12px 16px' }}>Gross Margin</th>
                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Gross Profit Shift</th>
              </tr>
            </thead>
            <tbody>
              {/* Baseline */}
              <tr style={{ borderBottom: '1px solid #F0ECE2', backgroundColor: '#FFFFFF' }}>
                <td style={{ padding: '14px 20px', fontWeight: 600, color: '#153825' }}>
                  • Baseline (No Discount)
                </td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>₹1,000</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>100 units</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>₹100,000</td>
                <td style={{ padding: '14px 16px' }}>40.0%</td>
                <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 600, color: '#555C56' }}>Baseline (₹40,000)</td>
              </tr>

              {/* 5% Discount */}
              <tr style={{ borderBottom: '1px solid #F0ECE2', backgroundColor: '#FFFFFF' }}>
                <td style={{ padding: '14px 20px', fontWeight: 600, color: '#1B211C' }}>
                  • 5% Discount
                </td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>₹950</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>115 units</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>₹109,250</td>
                <td style={{ padding: '14px 16px' }}>36.8%</td>
                <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 600, color: '#245A39' }}>+₹250 (+0.6% profit)</td>
              </tr>

              {/* 10% Discount */}
              <tr style={{ borderBottom: '1px solid #F0ECE2', backgroundColor: '#FFFFFF' }}>
                <td style={{ padding: '14px 20px', fontWeight: 600, color: '#1B211C' }}>
                  • 10% Discount
                </td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>₹900</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>135 units</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>₹121,500</td>
                <td style={{ padding: '14px 16px' }}>33.3%</td>
                <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 600, color: '#245A39' }}>+₹500 (+1.25% profit)</td>
              </tr>

              {/* 20% Discount */}
              <tr style={{ backgroundColor: '#FFFDFD' }}>
                <td style={{ padding: '14px 20px', fontWeight: 600, color: '#C53B27' }}>
                  • 20% Discount
                </td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>₹800</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>160 units</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>₹128,000</td>
                <td style={{ padding: '14px 16px' }}>25.0%</td>
                <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 600, color: '#C53B27' }}>-₹8,000 (-20.0% profit)</td>
              </tr>
            </tbody>
          </table>

          {/* Bar comparison visualization */}
          <div style={{ padding: '20px', backgroundColor: '#FAF8F4', borderTop: '1px solid #EBE5D8' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#7E867F', textTransform: 'uppercase', marginBottom: '12px' }}>
              Gross Profit Comparison Across Scenarios
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                  <span>Baseline (No Discount)</span>
                  <span style={{ fontWeight: 600 }}>₹40,000</span>
                </div>
                <div style={{ height: '14px', backgroundColor: '#E4DFD3', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '80%', height: '100%', backgroundColor: '#444D46' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                  <span>5% Discount</span>
                  <span style={{ fontWeight: 600, color: '#245A39' }}>₹40,250 (+0.6%)</span>
                </div>
                <div style={{ height: '14px', backgroundColor: '#E4DFD3', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '80.5%', height: '100%', backgroundColor: '#245A39' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                  <span>10% Discount (Optimal Profit Yield)</span>
                  <span style={{ fontWeight: 600, color: '#245A39' }}>₹40,500 (+1.25%)</span>
                </div>
                <div style={{ height: '14px', backgroundColor: '#E4DFD3', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '81%', height: '100%', backgroundColor: '#153825' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                  <span>20% Discount (Margin Dilution)</span>
                  <span style={{ fontWeight: 600, color: '#C53B27' }}>₹32,000 (-20.0%)</span>
                </div>
                <div style={{ height: '14px', backgroundColor: '#E4DFD3', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '64%', height: '100%', backgroundColor: '#C53B27' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Takeaway Box */}
        <div style={{
          backgroundColor: '#FEF9EE',
          border: '1px solid #F6DFB5',
          borderRadius: '8px',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '13px',
          color: '#824B05'
        }}>
          <AlertTriangle size={18} style={{ color: '#B96E0D', flexShrink: 0 }} />
          <div>
            <strong>Key Takeaway:</strong> In the 20% discount scenario, even with a massive +60% sales surge (selling 160 units vs 100),
            unit profit drops so heavily (from ₹400 to ₹200) that you make <strong>₹8,000 LESS gross profit</strong>.
          </div>
        </div>
      </section>

      {/* Section 6: Make Pricing Decisions With More Clarity */}
      <section id="benefits" style={{
        backgroundColor: '#F3EFE6',
        borderTop: '1px solid #E6DFCF',
        borderBottom: '1px solid #E6DFCF',
        padding: '70px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#7E867F', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
              Management Framework
            </div>
            <h2 style={{ fontSize: '36px', color: '#153825', marginBottom: '12px' }}>
              Make Pricing Decisions With More Clarity.
            </h2>
            <p style={{ fontSize: '15.5px', color: '#525B54', maxWidth: '720px' }}>
              Understand your exposure before changing market prices. Give management transparent calculations to make protect-your-profit decisions.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '20px' }}>
            {/* The Margin Discipline Checklist */}
            <div className="panel-card" style={{ padding: '24px', gridRow: 'span 2' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#7E867F', textTransform: 'uppercase', marginBottom: '6px' }}>
                Management Checklist
              </div>
              <h3 style={{ fontSize: '20px', color: '#153825', marginBottom: '14px' }}>
                The Margin Discipline Checklist
              </h3>
              <p style={{ fontSize: '13px', color: '#525A54', marginBottom: '18px' }}>
                Four mandatory questions every pricing manager must answer before signing off on any campaign:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '4px', backgroundColor: '#EAF2EC', color: '#153825', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>1</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2420' }}>Unit Cost Baseline</div>
                    <div style={{ fontSize: '12px', color: '#666E67' }}>Have you included full landed COGS, including inbound freight and fulfillment?</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '4px', backgroundColor: '#EAF2EC', color: '#153825', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>2</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2420' }}>Elasticity Realism</div>
                    <div style={{ fontSize: '12px', color: '#666E67' }}>Can your acquisition channels realistically deliver the required volume break-even lift?</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '4px', backgroundColor: '#EAF2EC', color: '#153825', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>3</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2420' }}>Floor Price Guardrail</div>
                    <div style={{ fontSize: '12px', color: '#666E67' }}>Does the promo price remain comfortably above unit floor cost to prevent cash bleeding?</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '4px', backgroundColor: '#EAF2EC', color: '#153825', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>4</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2420' }}>Post-Promo Cannibalization</div>
                    <div style={{ fontSize: '12px', color: '#666E67' }}>Are you pulling forward existing demand at lower prices without acquiring new customers?</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 1 */}
            <div className="panel-card" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '17px', color: '#153825', marginBottom: '8px' }}>Understand Real Margins</h3>
              <p style={{ fontSize: '13px', color: '#555D57' }}>
                Determine exact cash contribution and multiplier margins for each SKU before committing promo dollars.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="panel-card" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '17px', color: '#153825', marginBottom: '8px' }}>Compare Before You Commit</h3>
              <p style={{ fontSize: '13px', color: '#555D57' }}>
                Evaluate aggressive versus moderate discount tiers side-by-side to find the optimal gross yield sweet spot.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="panel-card" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '17px', color: '#153825', marginBottom: '8px' }}>Estimate Required Sales Growth</h3>
              <p style={{ fontSize: '13px', color: '#555D57' }}>
                Know the exact mathematical volume lift required so marketing teams can target realistic campaign volumes.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="panel-card" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '17px', color: '#153825', marginBottom: '8px' }}>Make Decisions With Clear Numbers</h3>
              <p style={{ fontSize: '13px', color: '#555D57' }}>
                Replace guesswork and high-stakes promotional gambles with verified financial ledger audits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Transparent Formulas */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#7E867F', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
            Auditable Mathematical Rigor
          </div>
          <h2 style={{ fontSize: '36px', color: '#153825', marginBottom: '12px' }}>
            Understand the Numbers Behind Every Decision.
          </h2>
          <p style={{ fontSize: '15.5px', color: '#525B54' }}>
            Every calculation is auditable. Change inputs and observe real-time recalculations with mathematical transparency.
          </p>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #DDD7C9',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div style={{ backgroundColor: '#F8F6F1', border: '1px solid #ECE7DC', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '11px', color: '#7E867F', textTransform: 'uppercase', fontWeight: 700 }}>Unit Margin Formula</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#153825', marginTop: '6px', fontWeight: 600 }}>
                Selling Price − Landed Unit Cost
              </div>
            </div>

            <div style={{ backgroundColor: '#F8F6F1', border: '1px solid #ECE7DC', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '11px', color: '#7E867F', textTransform: 'uppercase', fontWeight: 700 }}>Gross Profit Formula</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#153825', marginTop: '6px', fontWeight: 600 }}>
                Units Sold × Unit Margin
              </div>
            </div>

            <div style={{ backgroundColor: '#F8F6F1', border: '1px solid #ECE7DC', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '11px', color: '#7E867F', textTransform: 'uppercase', fontWeight: 700 }}>Break-Even Volume Formula</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#153825', marginTop: '6px', fontWeight: 600 }}>
                Baseline Profit ÷ Promo Unit Margin
              </div>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: '#7E867F', borderTop: '1px solid #ECE7DC', paddingTop: '14px' }}>
            <strong>Framework Note:</strong> Calculations reflect gross profit after unit production/landed purchase costs. Indirect overhead, fixed corporate expenditures, and platform fees are accounted for in workspace ledger settings.
          </div>
        </div>
      </section>

      {/* Section 8: FAQ Accordion */}
      <section id="faq" style={{
        backgroundColor: '#F3EFE6',
        borderTop: '1px solid #E6DFCF',
        borderBottom: '1px solid #E6DFCF',
        padding: '70px 24px'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#7E867F', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
              Frequently Asked Questions
            </div>
            <h2 style={{ fontSize: '36px', color: '#153825', marginBottom: '12px' }}>
              Clear Answers on Discount Profitability.
            </h2>
            <p style={{ fontSize: '15px', color: '#555D57' }}>
              Everything you need to know about evaluating discount economics.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DDD7CA',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    transition: 'border-color 0.15s ease'
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '14.5px',
                      fontWeight: 600,
                      color: isOpen ? '#153825' : '#1C221D'
                    }}>
                      {index + 1}. {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp size={18} style={{ color: '#153825', flexShrink: 0 }} />
                    ) : (
                      <ChevronDown size={18} style={{ color: '#88918A', flexShrink: 0 }} />
                    )}
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: '0 20px 18px 20px',
                      fontSize: '13.5px',
                      lineHeight: 1.6,
                      color: '#4B534D',
                      borderTop: '1px solid #F0ECE4',
                      paddingTop: '12px'
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 9: Deep Green Call to Action Footer Banner */}
      <section style={{
        backgroundColor: '#153825',
        color: '#FFFFFF',
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: 'rgba(255,255,255,0.12)',
            color: '#B0DFBF',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '999px',
            padding: '4px 14px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: '20px'
          }}>
            Protection of Net Profit
          </div>

          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '46px',
            color: '#FFFFFF',
            fontWeight: 600,
            letterSpacing: '-0.8px',
            marginBottom: '18px',
            lineHeight: 1.15
          }}>
            Before You Reduce Your Price, Know the Impact.
          </h2>

          <p style={{
            fontSize: '16px',
            lineHeight: 1.6,
            color: '#C6D9CB',
            maxWidth: '600px',
            margin: '0 auto 32px auto'
          }}>
            Calculate your discount, compare repercussions, and understand the financial trade-offs before launching your next promotion.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => openAuthModal('signup')}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#153825',
                border: 'none',
                padding: '13px 28px',
                borderRadius: '8px',
                fontFamily: 'var(--font-sans)',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                transition: 'transform 0.15s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Create Free Account
            </button>

            <button
              onClick={() => navigate('overview')}
              style={{
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.4)',
                padding: '13px 24px',
                borderRadius: '8px',
                fontFamily: 'var(--font-sans)',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                e.target.style.borderColor = '#FFFFFF';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = 'rgba(255,255,255,0.4)';
              }}
            >
              Start Analysis Now →
            </button>
          </div>

          <div style={{ marginTop: '20px', fontSize: '12px', color: '#8FB49A' }}>
            Clear tools. Transparent calculations. Better pricing decisions.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#FAF8F5',
        borderTop: '1px solid #E6DFCF',
        padding: '40px 32px',
        fontSize: '12.5px',
        color: '#6E7670'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{ fontWeight: 700, color: '#153825', fontSize: '14px', marginBottom: '4px' }}>
              Discount Impact Analyzer
            </div>
            <div>A practical tool for understanding discount unit economics. Protect your gross profit.</div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('overview')}>Overview</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('new-analysis')}>New Analysis</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('scenario-comparison')}>Scenario Comparison</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('saved-analyses')}>Saved Analyses</span>
          </div>
        </div>

        <div style={{
          maxWidth: '1200px',
          margin: '20px auto 0 auto',
          borderTop: '1px solid #ECE7DC',
          paddingTop: '16px',
          fontSize: '11px',
          color: '#9CA39D',
          textAlign: 'center'
        }}>
          Financial calculations are for model projections and margin defense. Ensure all input assumptions accurately represent your business unit economics.
        </div>
      </footer>
    </div>
  );
}
