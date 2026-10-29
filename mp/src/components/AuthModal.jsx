import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Mail,
  Lock,
  User,
  Store,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthModal() {
  const {
    authModalOpen,
    closeAuthModal,
    authMode,
    setAuthMode,
    loginUser,
    demoLoginUser,
    signupUser
  } = useApp();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign up form state
  const [signupName, setSignupName] = useState('');
  const [signupStore, setSignupStore] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  if (!authModalOpen) return null;

  const handleModeChange = (mode) => {
    setErrorMessage('');
    setAuthMode(mode);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await loginUser({
        email: loginEmail,
        password: loginPassword
      });
    } catch (err) {
      setErrorMessage(err.message || 'Wrong email or password! Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!signupName.trim()) return;
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await signupUser({
        name: signupName,
        storeName: signupStore || `${signupName}'s Store`,
        email: signupEmail,
        password: signupPassword
      });

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#153825', '#245A39', '#86EFAC']
      });
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed! Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await demoLoginUser();
    } catch (err) {
      setErrorMessage(err.message || 'Demo login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password strength estimation
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    return score; // 1, 2, 3
  };

  const strength = getPasswordStrength(signupPassword);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(18, 30, 22, 0.65)',
      backdropFilter: 'blur(4px)',
      zIndex: 9990,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #DDD7C9',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '460px',
        boxShadow: '0 20px 40px -10px rgba(15, 30, 20, 0.25)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: '#7E867F',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '50%',
            transition: 'background-color 0.15s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F5F2EA'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <X size={18} />
        </button>

        {/* Modal Top Banner */}
        <div style={{
          backgroundColor: '#FAF8F4',
          borderBottom: '1px solid #ECE7DC',
          padding: '24px 28px 18px 28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#153825',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700
            }}>
              IA
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#7E867F', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              Impact Analyzer Access
            </span>
          </div>

          <h2 style={{ fontSize: '22px', color: '#153825', fontWeight: 700, marginBottom: '4px' }}>
            {authMode === 'login' ? 'Sign In to Workspace' : 'Create Free Account'}
          </h2>
          <p style={{ fontSize: '12.5px', color: '#5C655F', lineHeight: 1.4 }}>
            {authMode === 'login'
              ? 'Enter your credentials to access your stored retail analyses and financial ledgers.'
              : 'Join thousands of managers protecting gross profit with exact break-even modeling.'}
          </p>

          {/* Mode Switch Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: '#ECE7DC',
            borderRadius: '8px',
            padding: '3px',
            marginTop: '16px',
            gap: '2px'
          }}>
            <button
              type="button"
              onClick={() => handleModeChange('login')}
              style={{
                padding: '7px 0',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: authMode === 'login' ? '#FFFFFF' : 'transparent',
                color: authMode === 'login' ? '#153825' : '#6A726B',
                fontWeight: authMode === 'login' ? 700 : 500,
                fontSize: '12.5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Sign In / Log In
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('signup')}
              style={{
                padding: '7px 0',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: authMode === 'signup' ? '#FFFFFF' : 'transparent',
                color: authMode === 'signup' ? '#153825' : '#6A726B',
                fontWeight: authMode === 'signup' ? 700 : 500,
                fontSize: '12.5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Modal Form Content */}
        <div style={{ padding: '24px 28px' }}>
          {/* Error Message Box */}
          {errorMessage && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              color: '#991B1B',
              fontSize: '12.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              fontWeight: 500,
              animation: 'fadeIn 0.2s ease'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0, color: '#DC2626' }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {authMode === 'login' ? (
            /* =================== LOG IN TAB =================== */
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#3A423C', marginBottom: '6px' }}>
                  Work Email Address
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={15} style={{ position: 'absolute', left: '12px', color: '#88918A' }} />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="name@company.com"
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 36px',
                      borderRadius: '6px',
                      border: '1px solid #DDD7CA',
                      fontSize: '13px',
                      color: '#1B211C',
                      outline: 'none',
                      fontFamily: 'var(--font-sans)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#153825'}
                    onBlur={(e) => e.target.style.borderColor = '#DDD7CA'}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#3A423C', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '12px', color: '#88918A' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Enter your password"
                    style={{
                      width: '100%',
                      padding: '9px 36px 9px 36px',
                      borderRadius: '6px',
                      border: '1px solid #DDD7CA',
                      fontSize: '13px',
                      color: '#1B211C',
                      outline: 'none',
                      fontFamily: 'var(--font-sans)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#153825'}
                    onBlur={(e) => e.target.style.borderColor = '#DDD7CA'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      background: 'none',
                      border: 'none',
                      color: '#88918A',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#153825', cursor: 'pointer' }}
                />
                <label htmlFor="remember" style={{ fontSize: '12px', color: '#555E57', cursor: 'pointer' }}>
                  Remember this device for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '11px',
                  fontSize: '13.5px',
                  borderRadius: '6px',
                  marginTop: '4px',
                  opacity: isSubmitting ? 0.75 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                <span>{isSubmitting ? 'Verifying Credentials...' : 'Sign In to Workspace'}</span>
                <ArrowRight size={15} />
              </button>

              {/* Demo 1-Click Login Button */}
              <div style={{
                position: 'relative',
                textAlign: 'center',
                margin: '6px 0',
                borderTop: '1px solid #EBE5D8',
                paddingTop: '14px'
              }}>
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  style={{
                    width: '100%',
                    padding: '9px',
                    borderRadius: '6px',
                    border: '1px solid #BCD4C1',
                    backgroundColor: '#EAF2EC',
                    color: '#174028',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Sparkles size={14} />
                  <span>One-Click Demo Manager Login</span>
                </button>
              </div>

              <div style={{ textAlign: 'center', fontSize: '12px', color: '#68726A', marginTop: '2px' }}>
                Don't have an account yet?{' '}
                <strong
                  onClick={() => setAuthMode('signup')}
                  style={{ color: '#153825', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Create an account
                </strong>
              </div>
            </form>
          ) : (
            /* =================== CREATE ACCOUNT TAB =================== */
            <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#3A423C', marginBottom: '5px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={15} style={{ position: 'absolute', left: '12px', color: '#88918A' }} />
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Arjun Verma"
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 36px',
                      borderRadius: '6px',
                      border: '1px solid #DDD7CA',
                      fontSize: '13px',
                      color: '#1B211C',
                      outline: 'none',
                      fontFamily: 'var(--font-sans)'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#3A423C', marginBottom: '5px' }}>
                  Store / Retail Brand Name
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Store size={15} style={{ position: 'absolute', left: '12px', color: '#88918A' }} />
                  <input
                    type="text"
                    value={signupStore}
                    onChange={(e) => setSignupStore(e.target.value)}
                    placeholder="e.g. Modern Goods Co."
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 36px',
                      borderRadius: '6px',
                      border: '1px solid #DDD7CA',
                      fontSize: '13px',
                      color: '#1B211C',
                      outline: 'none',
                      fontFamily: 'var(--font-sans)'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#3A423C', marginBottom: '5px' }}>
                  Work Email Address
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={15} style={{ position: 'absolute', left: '12px', color: '#88918A' }} />
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="arjun@company.com"
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 36px',
                      borderRadius: '6px',
                      border: '1px solid #DDD7CA',
                      fontSize: '13px',
                      color: '#1B211C',
                      outline: 'none',
                      fontFamily: 'var(--font-sans)'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#3A423C', marginBottom: '5px' }}>
                  Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '12px', color: '#88918A' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create a strong password"
                    style={{
                      width: '100%',
                      padding: '8px 36px 8px 36px',
                      borderRadius: '6px',
                      border: '1px solid #DDD7CA',
                      fontSize: '13px',
                      color: '#1B211C',
                      outline: 'none',
                      fontFamily: 'var(--font-sans)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      background: 'none',
                      border: 'none',
                      color: '#88918A',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Password strength visual */}
                {signupPassword && (
                  <div style={{ marginTop: '6px' }}>
                    <div style={{ display: 'flex', gap: '4px', height: '4px', marginBottom: '4px' }}>
                      <div style={{ flex: 1, borderRadius: '2px', backgroundColor: strength >= 1 ? (strength === 1 ? '#C53B27' : strength === 2 ? '#B96E0D' : '#245A39') : '#E6E0D2' }} />
                      <div style={{ flex: 1, borderRadius: '2px', backgroundColor: strength >= 2 ? (strength === 2 ? '#B96E0D' : '#245A39') : '#E6E0D2' }} />
                      <div style={{ flex: 1, borderRadius: '2px', backgroundColor: strength >= 3 ? '#245A39' : '#E6E0D2' }} />
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#7E867F' }}>
                      Strength: {strength === 1 ? 'Weak' : strength === 2 ? 'Fair' : 'Strong & Protected'}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ accentColor: '#153825', marginTop: '2px', cursor: 'pointer' }}
                />
                <label htmlFor="agree" style={{ fontSize: '11.5px', color: '#555E57', lineHeight: 1.4, cursor: 'pointer' }}>
                  I agree to the <span style={{ textDecoration: 'underline' }}>Ledger Governance Terms</span> and mathematical modeling privacy disclosures.
                </label>
              </div>

              <button
                type="submit"
                disabled={!agreeTerms || isSubmitting}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '11px',
                  fontSize: '13.5px',
                  borderRadius: '6px',
                  opacity: (!agreeTerms || isSubmitting) ? 0.65 : 1,
                  cursor: (!agreeTerms || isSubmitting) ? 'not-allowed' : 'pointer',
                  marginTop: '4px'
                }}
              >
                <span>{isSubmitting ? 'Creating Account...' : 'Create Account & Start Analyzing'}</span>
                <ArrowRight size={15} />
              </button>

              <div style={{ textAlign: 'center', fontSize: '12px', color: '#68726A' }}>
                Already have an account?{' '}
                <strong
                  onClick={() => handleModeChange('login')}
                  style={{ color: '#153825', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Sign In
                </strong>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
