import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, MapPin, Home, DollarSign, CheckCircle, AlertCircle, Loader, Building2 } from 'lucide-react';
import axios from 'axios';
import '../styles/Sell.css';

const MAX_IMAGES = 15;
const MAX_SIZE_MB = 5;

const CITIES = ['Mumbai', 'Pune', 'Bengaluru', 'Hyderabad', 'Delhi', 'Chennai', 'Kolkata', 'Ahmedabad'];

const STEPS = ['Basic Info', 'Details', 'Location', 'Images', 'Review'];

function Sell() {
  const navigate  = useNavigate();
  const fileInput = useRef(null);

  const [step,   setStep]   = useState(0);
  const [status, setStatus] = useState(null); // 'loading' | 'success' | 'error'
  const [error,  setError]  = useState('');

  const [form, setForm] = useState({
    title:           '',
    price:           '',
    purpose:         'rent',
    propertyType:    'apartment',
    city:            '',
    description:     '',
    bedrooms:        '',
    bathrooms:       '',
    area:            '',
    furnishedStatus: 'unfurnished',
    lat:             '',
    lng:             '',
  });

  const [images,    setImages]    = useState([]); // File objects
  const [previews,  setPreviews]  = useState([]); // data URLs

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  const update = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  // Image handling
  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files);
    const errors = [];

    const valid = files.filter(f => {
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        errors.push(`${f.name} exceeds ${MAX_SIZE_MB}MB`);
        return false;
      }
      return true;
    });

    if (images.length + valid.length > MAX_IMAGES) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images`);
      return;
    }

    if (errors.length) {
      setError(errors.join(', '));
      return;
    }

    setError('');
    const newImages   = [...images, ...valid];
    const newPreviews = [...previews];

    valid.forEach(f => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        newPreviews.push(ev.target.result);
        if (newPreviews.length === newImages.length) {
          setPreviews([...newPreviews]);
        }
      };
      reader.readAsDataURL(f);
    });

    setImages(newImages);
  };

  const removeImage = (i) => {
    setImages(prev  => prev.filter((_, idx)  => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  // Step validation
  const stepValid = () => {
    if (step === 0) return form.title && form.price && form.purpose && form.propertyType && form.city;
    if (step === 1) return form.description;
    if (step === 2) return form.lat && form.lng;
    if (step === 3) return images.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setStatus('loading');
    setError('');

    try {
      const token = localStorage.getItem('token');
      const data  = new FormData();

      Object.entries(form).forEach(([k, v]) => { if (v) data.append(k, v); });
      images.forEach(img => data.append('images', img));

      await axios.post('http://localhost:8000/api/properties', data, {
        headers: {
          'Content-Type':  'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  // ── Render states ──
  if (status === 'success') return (
    <div className="sell-fullpage">
      <div className="sell-result">
        <CheckCircle size={56} className="result-icon success" />
        <h2>Property listed successfully!</h2>
        <p>Your property is now live on GeoState.</p>
        <div className="result-actions">
          <button className="btn-primary" onClick={() => navigate('/home')}>Browse listings</button>
          <button className="btn-ghost" onClick={() => { setStatus(null); setStep(0); setForm({ title:'', price:'', purpose:'rent', propertyType:'apartment', city:'', description:'', bedrooms:'', bathrooms:'', area:'', furnishedStatus:'unfurnished', lat:'', lng:'' }); setImages([]); setPreviews([]); }}>
            List another
          </button>
        </div>
      </div>
    </div>
  );

  if (status === 'loading') return (
    <div className="sell-fullpage">
      <div className="sell-result">
        <Loader size={48} className="result-icon spinning" />
        <h2>Uploading your property…</h2>
        <p>This may take a moment depending on image sizes.</p>
      </div>
    </div>
  );

  return (
    <div className="sell-page">
      {/* Navbar */}
      <nav className="sell-nav">
        <div className="sell-nav-inner">
          <div className="sell-logo" onClick={() => navigate('/landing')}>
            <Building2 size={22} />
            <span>GeoState</span>
          </div>
          <button className="sell-back" onClick={() => navigate('/landing')}>← Back</button>
        </div>
      </nav>

      <div className="sell-body">
        {/* Progress */}
        <div className="sell-progress">
          {STEPS.map((s, i) => (
            <div key={s} className={`progress-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="step-dot">{i < step ? '✓' : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="sell-card">

          {/* Step 0 — Basic Info */}
          {step === 0 && (
            <div className="form-step">
              <h2>Basic Information</h2>
              <p className="step-subtitle">Start with the essentials about your property.</p>

              <div className="form-group">
                <label>Property Title *</label>
                <input
                  type="text"
                  placeholder="e.g. 2BHK Apartment in Baner"
                  value={form.title}
                  onChange={e => update('title', e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Purpose *</label>
                  <select value={form.purpose} onChange={e => update('purpose', e.target.value)}>
                    <option value="rent">For Rent</option>
                    <option value="sell">For Sale</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Property Type *</label>
                  <select value={form.propertyType} onChange={e => update('propertyType', e.target.value)}>
                    <option value="apartment">Apartment</option>
                    <option value="studio">Studio</option>
                    <option value="villa">Villa</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{form.purpose === 'rent' ? 'Monthly Rent (₹) *' : 'Sale Price (₹) *'}</label>
                  <input
                    type="number"
                    placeholder={form.purpose === 'rent' ? '25000' : '7500000'}
                    value={form.price}
                    onChange={e => update('price', e.target.value)}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>City *</label>
                  <select value={form.city} onChange={e => update('city', e.target.value)}>
                    <option value="">Select city</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 1 — Details */}
          {step === 1 && (
            <div className="form-step">
              <h2>Property Details</h2>
              <p className="step-subtitle">More detail = more trust from buyers and tenants.</p>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  rows={5}
                  placeholder="Describe the property — neighbourhood, nearby landmarks, special features…"
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Bedrooms</label>
                  <input type="number" min="0" max="20" placeholder="3"
                    value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Bathrooms</label>
                  <input type="number" min="0" max="20" placeholder="2"
                    value={form.bathrooms} onChange={e => update('bathrooms', e.target.value)} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Area (sqft)</label>
                  <input type="number" min="0" placeholder="1200"
                    value={form.area} onChange={e => update('area', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Furnished Status</label>
                  <select value={form.furnishedStatus} onChange={e => update('furnishedStatus', e.target.value)}>
                    <option value="furnished">Furnished</option>
                    <option value="semi-furnished">Semi-furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Location */}
          {step === 2 && (
            <div className="form-step">
              <h2>Property Location</h2>
              <p className="step-subtitle">Enter the coordinates so the property appears on the map accurately.</p>

              <div className="location-tip">
                <MapPin size={16} />
                <span>Go to <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"><strong>Google Maps</strong></a>, right-click your property location, and copy the coordinates shown.</span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Latitude *</label>
                  <input type="number" step="any" placeholder="18.5913"
                    value={form.lat} onChange={e => update('lat', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Longitude *</label>
                  <input type="number" step="any" placeholder="73.7163"
                    value={form.lng} onChange={e => update('lng', e.target.value)} />
                </div>
              </div>

              <p className="coord-note">First number from Google Maps = Latitude · Second = Longitude</p>
            </div>
          )}

          {/* Step 3 — Images */}
          {step === 3 && (
            <div className="form-step">
              <h2>Property Images</h2>
              <p className="step-subtitle">Upload up to {MAX_IMAGES} images. Max {MAX_SIZE_MB}MB per image. JPEG, PNG or WebP.</p>

              {images.length < MAX_IMAGES && (
                <div className="upload-zone" onClick={() => fileInput.current.click()}>
                  <Upload size={32} />
                  <p>Click to upload images</p>
                  <span>{images.length}/{MAX_IMAGES} uploaded</span>
                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    hidden
                    onChange={handleImageAdd}
                  />
                </div>
              )}

              {error && (
                <div className="form-error">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              {previews.length > 0 && (
                <div className="image-grid">
                  {previews.map((src, i) => (
                    <div key={i} className="image-thumb">
                      <img src={src} alt={`Property ${i + 1}`} />
                      <button className="remove-img" onClick={() => removeImage(i)}>
                        <X size={14} />
                      </button>
                      {i === 0 && <span className="cover-badge">Cover</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4 — Review */}
          {step === 4 && (
            <div className="form-step">
              <h2>Review & Submit</h2>
              <p className="step-subtitle">Check everything before listing.</p>

              <div className="review-grid">
                <div className="review-item"><span>Title</span><strong>{form.title}</strong></div>
                <div className="review-item"><span>Purpose</span><strong>{form.purpose === 'rent' ? 'For Rent' : 'For Sale'}</strong></div>
                <div className="review-item"><span>Type</span><strong style={{textTransform:'capitalize'}}>{form.propertyType}</strong></div>
                <div className="review-item"><span>Price</span><strong>₹{Number(form.price).toLocaleString('en-IN')}</strong></div>
                <div className="review-item"><span>City</span><strong>{form.city}</strong></div>
                {form.bedrooms  && <div className="review-item"><span>Bedrooms</span><strong>{form.bedrooms}</strong></div>}
                {form.bathrooms && <div className="review-item"><span>Bathrooms</span><strong>{form.bathrooms}</strong></div>}
                {form.area      && <div className="review-item"><span>Area</span><strong>{form.area} sqft</strong></div>}
                {form.furnishedStatus && <div className="review-item"><span>Furnished</span><strong style={{textTransform:'capitalize'}}>{form.furnishedStatus}</strong></div>}
                <div className="review-item"><span>Coordinates</span><strong>{form.lat}, {form.lng}</strong></div>
                <div className="review-item"><span>Images</span><strong>{images.length} uploaded</strong></div>
              </div>

              {error && (
                <div className="form-error">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="form-nav">
            {step > 0 && (
              <button className="btn-ghost" onClick={() => setStep(s => s - 1)}>Back</button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                className="btn-primary"
                disabled={!stepValid()}
                onClick={() => { setError(''); setStep(s => s + 1); }}
              >
                Continue
              </button>
            ) : (
              <button className="btn-primary" onClick={handleSubmit}>
                Submit listing
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sell;