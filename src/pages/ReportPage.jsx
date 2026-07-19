import React, { useState } from 'react';
import { PlusCircle, Upload, CheckCircle2, AlertCircle, X, Image as ImageIcon } from 'lucide-react';

export default function ReportPage({ initialReportType, onAddItemSuccess, setActiveRoute }) {
  const [reportStatus, setReportStatus] = useState(initialReportType || 'lost');
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState(null);

  const isLost = reportStatus === 'lost';

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setErrors((prev) => ({ ...prev, image: 'Only JPEG or PNG images are allowed.' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: 'Image size must be 5MB or smaller.' }));
        return;
      }

      setErrors((prev) => ({ ...prev, image: null }));
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!category) newErrors.category = 'Category is required.';
    if (!description.trim()) newErrors.description = 'Description is required.';
    if (!date) newErrors.date = 'Date is required.';
    if (!location.trim()) newErrors.location = 'Location is required.';
    if (!contactName.trim()) newErrors.contactName = 'Contact name is required.';

    if (contactEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contactEmail.trim())) {
      newErrors.contactEmail = 'Enter a valid email address.';
    }

    if (!contactEmail.trim() && !contactPhone.trim()) {
      newErrors.contactEmail = 'Provide an email address or phone number.';
      newErrors.contactPhone = 'Provide an email address or phone number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('status', reportStatus);
    formData.append('title', title.trim());
    formData.append('category', category);
    formData.append('description', description.trim());
    formData.append('date', date);
    formData.append('location', location.trim());
    formData.append('contactName', contactName.trim());
    formData.append('contactEmail', contactEmail.trim());
    formData.append('contactPhone', contactPhone.trim());

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit report.');
      }

      const newItem = await response.json();
      onAddItemSuccess(newItem);
      
      setSubmitSuccess(true);
      // Reset form fields
      setTitle('');
      setCategory('');
      setDescription('');
      setDate('');
      setLocation('');
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      removeImage();
      setErrors({});
    } catch (err) {
      console.error('Submission error:', err);
      setServerError(err.message || 'Could not connect to the backend server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '0 auto 2rem auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
          Report an Item
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>
          Fill out the details below to log a lost or found item with our community registry.
        </p>
      </div>

      <div className="form-card">
        <div className="form-toggle-tabs" role="tablist">
          <button
            className={`toggle-tab ${isLost ? 'active-lost' : ''}`}
            onClick={() => {
              setReportStatus('lost');
              setSubmitSuccess(false);
            }}
            type="button"
          >
            <PlusCircle size={17} /> Report Lost Item
          </button>
          <button
            className={`toggle-tab ${!isLost ? 'active-found' : ''}`}
            onClick={() => {
              setReportStatus('found');
              setSubmitSuccess(false);
            }}
            type="button"
          >
            <CheckCircle2 size={17} /> Report Found Item
          </button>
        </div>

        {serverError && (
          <div className="empty-state" style={{ padding: '1rem', borderColor: '#fca5a5', background: '#fef2f2', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626' }}>
              <AlertCircle size={18} />
              <span style={{ fontWeight: 600 }}>{serverError}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">
                Title <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.title ? 'is-invalid' : ''}`}
                placeholder="e.g. Blue Leather Wallet"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Category <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                className={`form-input form-select ${errors.category ? 'is-invalid' : ''}`}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
                <option value="Documents">Documents</option>
                <option value="Keys">Keys</option>
                <option value="Others">Others</option>
              </select>
              {errors.category && <span className="form-error">{errors.category}</span>}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">
              Description <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              className={`form-input ${errors.description ? 'is-invalid' : ''}`}
              rows={4}
              placeholder="Provide distinctive features, brand, color, or condition..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">
                Date {isLost ? 'Lost' : 'Found'} <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="date"
                className={`form-input ${errors.date ? 'is-invalid' : ''}`}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              {errors.date && <span className="form-error">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Location {isLost ? 'Lost' : 'Found'} <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.location ? 'is-invalid' : ''}`}
                placeholder="e.g. Central Library, 2nd Floor"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              {errors.location && <span className="form-error">{errors.location}</span>}
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">
                Contact Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.contactName ? 'is-invalid' : ''}`}
                placeholder="Your name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
              {errors.contactName && <span className="form-error">{errors.contactName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input
                type="email"
                className={`form-input ${errors.contactEmail ? 'is-invalid' : ''}`}
                placeholder="name@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
              {errors.contactEmail && <span className="form-error">{errors.contactEmail}</span>}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Contact Phone</label>
            <input
              type="tel"
              className={`form-input ${errors.contactPhone ? 'is-invalid' : ''}`}
              placeholder="e.g. +1 555 019 2831"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
            {errors.contactPhone && <span className="form-error">{errors.contactPhone}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Item Photo (Optional)</label>
            <div className="file-dropzone" onClick={() => document.getElementById('report-file-input')?.click()}>
              <input
                id="report-file-input"
                type="file"
                accept="image/png, image/jpeg"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <Upload size={24} color="#ef4444" style={{ marginBottom: '0.4rem' }} />
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                Click or drag image to upload
              </p>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                Supports PNG and JPEG (Max 5MB)
              </p>

              {imagePreview && (
                <div className="preview-container" onClick={(e) => e.stopPropagation()}>
                  <img src={imagePreview} alt="Upload preview" className="preview-image" />
                  <button type="button" className="remove-image-btn" onClick={removeImage} title="Remove image">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
            {errors.image && <span className="form-error">{errors.image}</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ width: '100%', maxWidth: '200px' }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>

          {submitSuccess && (
            <div className="success-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckCircle2 size={20} />
                <span style={{ fontWeight: 600 }}>Your report has been successfully submitted!</span>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem' }}
                onClick={() => {
                  setActiveRoute('items');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                View Items List
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
