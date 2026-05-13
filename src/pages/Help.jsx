import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2, Search, Home, Tag, Users, CreditCard,
  ChevronDown, ChevronUp, Mail, Send, CheckCircle,
  MessageSquare, AlertCircle, ArrowRight, X, MapPin, Key, TrendingUp, Ruler, FileText, Compass, IndianRupee
} from 'lucide-react';
import '../styles/Help.css';

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


/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const CATEGORIES = [
  {
    id: 'buying',
    label: 'Buying & Renting',
    icon: Home,
    color: '#1b5e3b',
    bg: '#e8f4ec',
    topics: [
      'How to search properties',
      'How to contact owner/agent',
      'How to save properties',
      'How to schedule a visit',
    ],
  },
  {
    id: 'selling',
    label: 'Selling a Property',
    icon: Tag,
    color: '#b85c38',
    bg: '#fdf0eb',
    topics: [
      'How to list a property',
      'What details are required',
      'How to upload images',
      'How to edit or delete a listing',
    ],
  },
  {
    id: 'agents',
    label: 'Agents',
    icon: Users,
    color: '#5b3fa0',
    bg: '#f0edf8',
    topics: [
      'How to find agents',
      'How to contact them',
      'Are agents verified?',
      'How to become a listed agent',
    ],
  },
  {
    id: 'payments',
    label: 'Payments & Mortgage',
    icon: CreditCard,
    color: '#2c5f8a',
    bg: '#e8f0f8',
    topics: [
      'How the mortgage calculator works',
      'Are there any fees?',
      'What loan types are supported?',
    ],
  },
];

const FAQS = [
  // Buying & Renting
  { id: 1,  category: 'buying',   q: 'How do I search for properties?',             a: 'Use the search bar on the home page — enter a city, locality, or pincode. You can then filter by price, property type, number of bedrooms, and more.' },
  { id: 2,  category: 'buying',   q: 'How do I contact a property owner or agent?', a: 'Open any property listing and click "Contact Agent" or "Message Owner". You must be logged in to send a message.' },
  { id: 3,  category: 'buying',   q: 'How do I save a property?',                   a: 'Click the bookmark icon on any listing card or listing detail page. Saved properties appear in your account under "Saved Homes".' },
  { id: 4,  category: 'buying',   q: 'Can I schedule a property visit?',             a: 'Yes. On the listing page, click "Schedule a Visit" and pick a date and time. The agent or owner will confirm within 24 hours.' },
  { id: 5,  category: 'buying',   q: 'Is GeoState available outside India?',         a: 'Currently GeoState covers 12 major Indian cities. International listings are on our roadmap.' },

  // Selling
  { id: 6,  category: 'selling',  q: 'Is listing my property free?',                a: 'Yes, basic listings are completely free. We do not charge a commission or upfront fee to post a property.' },
  { id: 7,  category: 'selling',  q: 'What details do I need to list a property?',  a: 'You need the property type, address, size (sqft), price, number of bedrooms and bathrooms, and at least one photo. A description is strongly recommended.' },
  { id: 8,  category: 'selling',  q: 'How do I upload images for my listing?',      a: 'During the listing flow, you can upload up to 10 images. We support JPG and PNG formats under 5MB each. The first image becomes the cover photo.' },
  { id: 9,  category: 'selling',  q: 'Can I edit or delete my listing later?',      a: 'Yes. Go to your account, open "My Listings", and click Edit or Delete on any active listing. Changes go live immediately.' },
  { id: 10, category: 'selling',  q: 'How long does listing approval take?',        a: 'Most listings are reviewed and approved within 2–4 hours. You will receive an email notification once your listing is live.' },

  // Agents
  { id: 11, category: 'agents',   q: 'How do I find a verified agent?',             a: 'Visit the "Find an Agent" page. Filter by city, specialty, and rating. All agents on GeoState have been manually verified by our team.' },
  { id: 12, category: 'agents',   q: 'How do I contact an agent?',                  a: 'On any agent card, click "Contact" to get their phone number or "Message" to send them a direct message. You must be logged in.' },
  { id: 13, category: 'agents',   q: 'Are agents on GeoState verified?',            a: 'Yes. Every agent goes through an ID and license verification process before being listed. Look for the verified badge on their profile.' },
  { id: 14, category: 'agents',   q: 'Can I become a listed agent on GeoState?',    a: 'Yes. Email us at agents@geostate.com with your RERA registration number and we will review your application within 3 business days.' },

  // Payments & Mortgage
  { id: 15, category: 'payments', q: 'How does the mortgage calculator work?',      a: 'Enter the property price, your down payment, loan tenure, and interest rate. The calculator instantly shows your estimated EMI and total interest payable.' },
  { id: 16, category: 'payments', q: 'Are there any fees on GeoState?',             a: 'No platform fees for buyers or renters. Sellers list for free. Agents pay a verified badge fee annually. We do not take commissions.' },
  { id: 17, category: 'payments', q: 'What loan types does the calculator support?', a: 'Currently home loans and construction loans. Loan-against-property support is coming soon.' },

  // General
  { id: 18, category: 'general',  q: 'How do I reset my password?',                 a: 'On the login page, click "Forgot password?" and enter your email. You will receive a reset link within a few minutes. Check your spam folder if it does not arrive.' },
  { id: 19, category: 'general',  q: 'How do I delete my account?',                 a: 'Go to Settings > Account > Delete Account. This action is permanent and removes all your listings and saved properties.' },
  { id: 20, category: 'general',  q: 'Is my personal data safe on GeoState?',       a: 'We do not sell your data to third parties. Your contact information is only shared when you choose to contact an owner or agent.' },
];

const POPULAR_TAGS = [
  { label: 'Listing',        category: 'selling'  },
  { label: 'Login',          category: 'general'  },
  { label: 'Agents',         category: 'agents'   },
  { label: 'Mortgage',       category: 'payments' },
  { label: 'Rent',           category: 'buying'   },
  { label: 'Delete listing', category: 'selling'  },
  { label: 'Reset password', category: 'general'  },
  { label: 'Fees',           category: 'payments' },
];

/* ─────────────────────────────────────────
   FAQ Accordion Item
───────────────────────────────────────── */
const FAQItem = ({ faq, isOpen, onToggle }) => (
  <div className={`faq-item ${isOpen ? 'faq-item-open' : ''}`}>
    <button className="faq-question" onClick={onToggle}>
      <span>{faq.q}</span>
      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </button>
    {isOpen && <div className="faq-answer">{faq.a}</div>}
  </div>
);

/* ─────────────────────────────────────────
   Contact Form
───────────────────────────────────────── */
const ContactForm = () => {
  const [form, setForm]       = useState({ name: '', email: '', message: '', type: 'question' });
  const [submitted, setSubmit] = useState(false);

  const handle = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmit(true);
  };

  if (submitted) {
    return (
      <div className="contact-success">
        <CheckCircle size={44} className="success-icon" />
        <h3>Message sent!</h3>
        <p>We'll get back to you at <strong>{form.email}</strong> within 24 hours.</p>
        <button className="contact-reset-btn" onClick={() => { setSubmit(false); setForm({ name: '', email: '', message: '', type: 'question' }); }}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
  onSubmit={onSubmit}
  style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    width: '50%',
    marginLeft: '45%',
    marginTop: '6%'
  }}
>
      <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label className="contact-form-label">Your name</label>
          <input
            className="contact-form-input"
            type="text"
            placeholder="Rahul Sharma"
            value={form.name}
            onChange={handle('name')}
            required
          />
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label className="contact-form-label">Email address</label>
          <input
            className="contact-form-input"
            type="email"
            placeholder="rahul@email.com"
            value={form.email}
            onChange={handle('email')}
            required
          />
        </div>
      </div>

      <div className="contact-form-group">
        <label>What is this about?</label>
        <select value={form.type} onChange={handle('type')}>
          <option value="question">General question</option>
          <option value="listing">Listing issue</option>
          <option value="account">Account issue</option>
          <option value="agent">Agent-related</option>
          <option value="report">Report an issue</option>
        </select>
      </div>

      <div className="contact-form-group">
        <label>Message</label>
        <textarea
          placeholder="Describe your issue or question…"
          value={form.message}
          onChange={handle('message')}
          rows={5}
          required
        />
      </div>

      <button type="submit" className="contact-submit-btn">
        <Send size={16} />
        Send message
      </button>
    </form>
  );
};

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
const Help = () => {
  const navigate = useNavigate();

  const [search,      setSearch]      = useState('');
  const [activeCategory, setCategory] = useState(null); // null = all
  const [openFAQ,     setOpenFAQ]     = useState(null);
  const [scrolled,    setScrolled]    = useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Filter FAQs by search + category */
  const filteredFAQs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchSearch   = !search || faq.q.toLowerCase().includes(search.toLowerCase()) || faq.a.toLowerCase().includes(search.toLowerCase());
      const matchCategory = !activeCategory || faq.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [search, activeCategory]);

  const handleTagClick = (tag) => {
    setCategory(tag.category);
    setSearch(tag.label);
    document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategoryClick = (catId) => {
    setCategory(activeCategory === catId ? null : catId);
    setSearch('');
    document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearSearch = () => {
    setSearch('');
    setCategory(null);
  };

  return (
    <div className="help-page">

      {/* ── Navbar ── */}
      <nav className={`landing-navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="landing-navbar-content">
          <div className="landing-logo" onClick={() => navigate('/landing')} style={{ cursor: 'pointer' }}>
            <Building2 size={28} className="logo-icon" />
            <span className="logo-text">GeoState</span>
          </div>
          
          <div className="landing-nav-actions">
            <button className="sell-back" onClick={() => navigate(-1)}>← Back</button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="help-hero">
        <div className="help-hero-content">
          <div className="section-eyebrow">Support Centre</div>
          <h1 className="help-hero-title">How can we help you?</h1>
          <p className="help-hero-sub">Search our knowledge base or browse by category below.</p>

          <div className="help-search-bar">
            <Search size={18} className="help-search-icon" />
            <input
              type="text"
              placeholder="Search for help…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCategory(null); }}
              className="help-search-input"
            />
            {(search || activeCategory) && (
              <button className="help-search-clear" onClick={clearSearch}>
                <X size={15} />
              </button>
            )}
          </div>

          {/* Popular tags */}
          <div className="help-popular-tags">
            <span className="popular-label">Popular:</span>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag.label}
                className={`popular-tag ${activeCategory === tag.category && search === tag.label ? 'popular-tag-active' : ''}`}
                onClick={() => handleTagClick(tag)}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="help-categories-section">

        {/* Floating icons — behind all content */}
        <FloatingIcons />

        <div className="help-inner">
          <h2 className="help-section-title">Browse by category</h2>
          <div className="help-categories-grid">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  className={`help-category-card ${isActive ? 'help-category-card-active' : ''}`}
                  onClick={() => handleCategoryClick(cat.id)}
                  style={{ '--cat-color': cat.color, '--cat-bg': cat.bg }}
                >
                  <div className="help-cat-icon-wrap">
                    <Icon size={26} />
                  </div>
                  <h3 className="help-cat-label">{cat.label}</h3>
                  <ul className="help-cat-topics">
                    {cat.topics.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <span className="help-cat-cta">
                    {isActive ? 'Clear filter' : 'View answers'} <ArrowRight size={13} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="help-faq-section" id="faq-section">

        {/* Floating icons — behind all content */}
        <FloatingIcons />

        <div className="help-inner">
          <div className="help-faq-header">
            <h2 className="help-section-title">
              {activeCategory
                ? `${CATEGORIES.find((c) => c.id === activeCategory)?.label} — FAQs`
                : search
                ? `Results for "${search}"`
                : 'Frequently asked questions'}
            </h2>
            {(search || activeCategory) && (
              <button className="faq-clear-filter" onClick={clearSearch}>
                <X size={13} /> Clear filter
              </button>
            )}
          </div>

          {filteredFAQs.length > 0 ? (
            <div className="faq-list">
              {filteredFAQs.map((faq) => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  isOpen={openFAQ === faq.id}
                  onToggle={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                />
              ))}
            </div>
          ) : (
            <div className="faq-empty">
              <AlertCircle size={40} className="faq-empty-icon" />
              <h3>No results found</h3>
              <p>Try a different search term or <button onClick={clearSearch} className="faq-empty-link">browse all FAQs</button>.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Contact Support ── */}
      <section className="help-contact-section">

          {/* Floating icons — behind all content */}
        <FloatingIcons />

        <div className="help-inner">
          {/* Inline styles used to guarantee layout — global CSS was overriding grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.3fr',
            gap: '48px',
            alignItems: 'start',
            width: '100%',
            boxSizing: 'border-box',
          }}>

            {/* Left — contact info */}
            <div style={{ minWidth: 0 }}>
              <div className="section-eyebrow">Get in touch</div>
              <h2 className="help-section-title">Still need help?</h2>
              <p className="help-contact-sub">
                Can't find what you're looking for? Our support team responds within 24 hours.
              </p>
              <div className="contact-info-cards">
                <div className="contact-info-card">
                  <Mail size={20} className="contact-info-icon" />
                  <div>
                    <div className="contact-info-label">Email support</div>
                    <a href="mailto:support@geostate.com" className="contact-info-value">support@geostate.com</a>
                  </div>
                </div>
                <div className="contact-info-card">
                  <MessageSquare size={20} className="contact-info-icon" />
                  <div>
                    <div className="contact-info-label">Response time</div>
                    <div className="contact-info-value">Within 24 hours</div>
                  </div>
                </div>
                <div className="contact-info-card">
                  <AlertCircle size={20} className="contact-info-icon" />
                  <div>
                    <div className="contact-info-label">Report an issue</div>
                    <div className="contact-info-value">Use the form — select "Report an issue"</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — form */}
            <ContactForm />

          </div>
        </div>
      </section>

      {/* ── CTA Block ── */}
      <section className="help-cta-section">
        <div className="help-cta-inner">
          <h2>Ready to get started?</h2>
          <p>Browse thousands of properties across India — buy, rent, or sell with confidence.</p>
          <div className="help-cta-actions">
            <button className="help-cta-btn-primary" onClick={() => navigate('/home')}>
              Browse properties <ArrowRight size={16} />
            </button>
            <button className="help-cta-btn-secondary" onClick={() => navigate('/agents')}>
              Find an agent
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Help;