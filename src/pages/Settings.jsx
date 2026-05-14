import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, User, Lock, AlertTriangle, Bell,
  ChevronRight, Eye, EyeOff, LogOut, Trash2, Check, X, Home, MapPin, Key, TrendingUp, Ruler, FileText, Compass, IndianRupee
} from 'lucide-react';
import '../styles/Settings.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';


/* ─────────────────────────────────────────
   Floating Background Icons
   Used in: Recommendations + Services sections
───────────────────────────────────────── */
const FLOAT_ICONS = [
  // [Icon, size, top%, left%, animDuration, animDelay, animation]
  { Icon: Home,       size: 78, top: '12%',  left: '2%',   dur: '7s',   delay: '0s',    anim: 'geoFloat' },
  { Icon: MapPin,     size: 66, top: '65%',  left: '18%', dur: '9s',   delay: '0s',  anim: 'geoPulse' },
  { Icon: Key,        size: 70, top: '35%',  left: '94%',  dur: '8s',   delay: '0s',  anim: 'geoFloat' },
  { Icon: Building2,  size: 72, top: '72%',  left: '75%',  dur: '10s',  delay: '0s',    anim: 'geoPulse' },
  { Icon: TrendingUp, size: 64, top: '8%',   left: '55%',  dur: '6.5s', delay: '0s',  anim: 'geoFloat' },
  { Icon: Ruler,      size: 68, top: '50%',  left: '40%',  dur: '7.5s', delay: '0s',  anim: 'geoPulse' },
  { Icon: FileText,   size: 62, top: '80%',  left: '30%',   dur: '8.5s', delay: '0s',    anim: 'geoFloat' },
  { Icon: Compass,    size: 62, top: '25%',  left: '65%', dur: '11s',  delay: '0s',  anim: 'geoPulse' },
  { Icon: IndianRupee, size: 60, top: '90%',  left: '85%',  dur: '7s',   delay: '0s',  anim: 'geoFloat' },
  { Icon: Home,       size: 68, top: '55%',  left: '50%',  dur: '9.5s', delay: '0s',  anim: 'geoPulse' },
];

const floatAnimStyles = `
  @keyframes geoFloat {
    0%   { transform: translateY(0px);    opacity: 0.13; }
    50%  { transform: translateY(-18px);  opacity: 0.22; }
    100% { transform: translateY(0px);    opacity: 0.13; }
  }
  @keyframes geoPulse {
    0%   { transform: scale(1);    opacity: 0.10; }
    50%  { transform: scale(1.12); opacity: 0.20; }
    100% { transform: scale(1);    opacity: 0.10; }
  }
`;

const FloatingIcons = () => (
  <>
    <style>{floatAnimStyles}</style>
    {FLOAT_ICONS.map(({ Icon, size, top, left, dur, delay, anim }, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          top,
          left,
          zIndex: 0,
          pointerEvents: 'none',
          animation: `${anim} ${dur} ease-in-out ${delay} infinite`,
          color: 'rgba(101, 78, 52, 0.55)',   /* warm brown to match cream bg */
        }}
      >
        <Icon size={size} strokeWidth={1.2} />
      </div>
    ))}
  </>
);



export default function Settings() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [activeSection, setActiveSection] = useState('account');

  // ── Account ──
  const [user,          setUser]          = useState(null);
  const [accountForm,   setAccountForm]   = useState({ name: '', phone: '' });
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountMsg,    setAccountMsg]    = useState({ type: '', text: '' });

  // ── Security ──
  const [pwForm,       setPwForm]       = useState({ current: '', next: '', confirm: '' });
  const [showPw,       setShowPw]       = useState({ current: false, next: false, confirm: false });
  const [pwSaving,     setPwSaving]     = useState(false);
  const [pwMsg,        setPwMsg]        = useState({ type: '', text: '' });

  // ── Preferences ──
  const [prefs, setPrefs] = useState({ emailNotifs: true, propertyAlerts: false });

  // ── Danger ──
  const [deleteInput, setDeleteInput] = useState('');
  const [deleting,    setDeleting]    = useState(false);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const res  = await fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setAccountForm({ name: data.user.name, phone: data.user.phone || '' });
      }
    } catch { /* silent */ }
  }

  async function handleAccountSave() {
    setAccountSaving(true);
    setAccountMsg({ type: '', text: '' });
    try {
      const res  = await fetch(`${API}/auth/update-profile`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ name: accountForm.name, phone: accountForm.phone }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...stored, name: data.user.name }));
        setAccountMsg({ type: 'success', text: 'Account updated successfully.' });
      } else {
        setAccountMsg({ type: 'error', text: data.error || 'Update failed.' });
      }
    } catch {
      setAccountMsg({ type: 'error', text: 'Something went wrong.' });
    } finally {
      setAccountSaving(false);
    }
  }

  async function handlePasswordChange() {
    setPwMsg({ type: '', text: '' });

    if (!pwForm.current) {
      setPwMsg({ type: 'error', text: 'Enter your current password.' });
      return;
    }
    if (pwForm.next.length < 6) {
      setPwMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPwSaving(true);
    try {
      const res  = await fetch(`${API}/auth/change-password`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      const data = await res.json();
      if (data.success) {
        setPwMsg({ type: 'success', text: 'Password changed successfully.' });
        setPwForm({ current: '', next: '', confirm: '' });
      } else {
        setPwMsg({ type: 'error', text: data.error || 'Failed to change password.' });
      }
    } catch {
      setPwMsg({ type: 'error', text: 'Something went wrong.' });
    } finally {
      setPwSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (deleteInput !== 'DELETE') return;
    setDeleting(true);
    try {
      const res  = await fetch(`${API}/auth/delete-account`, {
        method:  'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        localStorage.clear();
        navigate('/landing');
      }
    } catch { /* silent */ }
    finally { setDeleting(false); }
  }

  const SECTIONS = [
    { id: 'account',     label: 'Account Info', icon: User          },
    { id: 'security',    label: 'Security',      icon: Lock          },
    { id: 'preferences', label: 'Preferences',   icon: Bell          },
    { id: 'danger',      label: 'Danger Zone',   icon: AlertTriangle },
  ];

  const PW_FIELDS = [
    { key: 'current', label: 'Current Password'     },
    { key: 'next',    label: 'New Password'          },
    { key: 'confirm', label: 'Confirm New Password'  },
  ];

  return (
    <div className="settings-page">

      {/* ── Navbar ── */}
      <nav className="settings-nav">
        <div className="settings-nav-inner">
          <div className="settings-logo" onClick={() => navigate('/landing')}>
            <Building2 size={22} />
            <span>GeoState</span>
          </div>
          <button className="settings-back" onClick={() => navigate(-1)}>← Back</button>
        </div>
      </nav>

      {/* Floating icons — behind all content */}
        <FloatingIcons />

      <div className="settings-container">

        {/* ── Page header ── */}
        <div className="settings-header">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Manage your account, security, and preferences</p>
        </div>

        <div className="settings-layout">

          {/* ── Sidebar ── */}
          <aside className="settings-sidebar">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`settings-nav-item ${activeSection === id ? 'active' : ''} ${id === 'danger' ? 'danger-nav' : ''}`}
                onClick={() => setActiveSection(id)}
              >
                <Icon size={15} />
                <span>{label}</span>
                <ChevronRight size={13} className="s-nav-arrow" />
              </button>
            ))}
          </aside>

          {/* ── Content ── */}
          <div className="settings-content">

            {/* ════ ACCOUNT INFO ════ */}
            {activeSection === 'account' && (
              <div className="settings-card">
                <div className="settings-card-head">
                  <div className="settings-card-icon-wrap">
                    <User size={18} />
                  </div>
                  <div>
                    <h2 className="settings-card-title">Account Info</h2>
                    <p className="settings-card-sub">Update your personal information</p>
                  </div>
                </div>

                <div className="settings-fields">
                  <div className="settings-field">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={accountForm.name}
                      onChange={e => setAccountForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="settings-field">
                    <label>
                      Email Address
                      <span className="field-note">Read-only — contact support to change</span>
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="input-disabled"
                    />
                  </div>

                  <div className="settings-field">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={accountForm.phone}
                      onChange={e => setAccountForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                {accountMsg.text && (
                  <div className={`settings-msg ${accountMsg.type}`}>
                    {accountMsg.type === 'success' ? <Check size={13} /> : <X size={13} />}
                    {accountMsg.text}
                  </div>
                )}

                <div className="settings-card-footer">
                  <button
                    className="btn-settings-primary"
                    onClick={handleAccountSave}
                    disabled={accountSaving}
                  >
                    {accountSaving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* ════ SECURITY ════ */}
            {activeSection === 'security' && (
              <div className="settings-card">
                <div className="settings-card-head">
                  <div className="settings-card-icon-wrap">
                    <Lock size={18} />
                  </div>
                  <div>
                    <h2 className="settings-card-title">Security</h2>
                    <p className="settings-card-sub">Change your account password</p>
                  </div>
                </div>

                <div className="settings-fields">
                  {PW_FIELDS.map(({ key, label }) => (
                    <div className="settings-field" key={key}>
                      <label>{label}</label>
                      <div className="pw-input-wrap">
                        <input
                          type={showPw[key] ? 'text' : 'password'}
                          value={pwForm[key]}
                          onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="pw-toggle"
                          onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))}
                        >
                          {showPw[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {pwMsg.text && (
                  <div className={`settings-msg ${pwMsg.type}`}>
                    {pwMsg.type === 'success' ? <Check size={13} /> : <X size={13} />}
                    {pwMsg.text}
                  </div>
                )}

                <div className="settings-card-footer">
                  <button
                    className="btn-settings-primary"
                    onClick={handlePasswordChange}
                    disabled={pwSaving}
                  >
                    {pwSaving ? 'Updating…' : 'Update Password'}
                  </button>
                </div>
              </div>
            )}

            {/* ════ PREFERENCES ════ */}
            {activeSection === 'preferences' && (
              <div className="settings-card">
                <div className="settings-card-head">
                  <div className="settings-card-icon-wrap">
                    <Bell size={18} />
                  </div>
                  <div>
                    <h2 className="settings-card-title">Preferences</h2>
                    <p className="settings-card-sub">Notifications and display settings</p>
                  </div>
                </div>

                <div className="settings-toggles">
                  <div className="toggle-row">
                    <div className="toggle-info">
                      <p className="toggle-label">Email Notifications</p>
                      <p className="toggle-sub">Receive updates about your listings and saved properties</p>
                    </div>
                    <button
                      className={`toggle-switch ${prefs.emailNotifs ? 'on' : ''}`}
                      onClick={() => setPrefs(p => ({ ...p, emailNotifs: !p.emailNotifs }))}
                    />
                  </div>

                  <div className="toggle-row">
                    <div className="toggle-info">
                      <p className="toggle-label">Property Alerts</p>
                      <p className="toggle-sub">Get notified when new properties match your saved searches</p>
                    </div>
                    <button
                      className={`toggle-switch ${prefs.propertyAlerts ? 'on' : ''}`}
                      onClick={() => setPrefs(p => ({ ...p, propertyAlerts: !p.propertyAlerts }))}
                    />
                  </div>

                  <div className="toggle-row toggle-row-disabled">
                    <div className="toggle-info">
                      <p className="toggle-label">
                        Dark Mode
                        <span className="coming-soon-badge">Coming soon</span>
                      </p>
                      <p className="toggle-sub">Switch between light and dark themes</p>
                    </div>
                    <button className="toggle-switch" disabled />
                  </div>
                </div>
              </div>
            )}

            {/* ════ DANGER ZONE ════ */}
            {activeSection === 'danger' && (
              <div className="settings-card danger-card">
                <div className="settings-card-head">
                  <div className="settings-card-icon-wrap danger-icon-wrap">
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <h2 className="settings-card-title">Danger Zone</h2>
                    <p className="settings-card-sub">These actions are permanent. Proceed with caution.</p>
                  </div>
                </div>

                {/* Logout all devices */}
                <div className="danger-row">
                  <div className="danger-row-info">
                    <div className="danger-row-title">
                      <LogOut size={15} />
                      <span>Log out from all devices</span>
                    </div>
                    <p className="danger-row-desc">
                      Clears your session from every browser and device. You will need to log in again.
                    </p>
                  </div>
                  <button
                    className="btn-danger-outline"
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      navigate('/login');
                    }}
                  >
                    Log out everywhere
                  </button>
                </div>

                <div className="danger-divider" />

                {/* Delete account */}
                <div className="danger-row">
                  <div className="danger-row-info">
                    <div className="danger-row-title">
                      <Trash2 size={15} />
                      <span>Delete Account</span>
                    </div>
                    <p className="danger-row-desc">
                      Permanently deletes your account and all your listings. This cannot be undone.
                    </p>
                  </div>
                </div>

                <div className="delete-confirm-block">
                  <label className="delete-confirm-label">
                    Type <strong>DELETE</strong> to confirm
                  </label>
                  <div className="delete-confirm-row">
                    <input
                      type="text"
                      className="delete-confirm-input"
                      value={deleteInput}
                      onChange={e => setDeleteInput(e.target.value)}
                      placeholder="DELETE"
                      autoComplete="off"
                    />
                    <button
                      className="btn-danger-solid"
                      onClick={handleDeleteAccount}
                      disabled={deleteInput !== 'DELETE' || deleting}
                    >
                      {deleting ? 'Deleting…' : 'Delete Account'}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}