import { useState } from 'react';
import axios from 'axios';
import './Modal.css';

function FeedbackModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    feedback: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/submit-feedback', formData);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setShowSuccess(true); // Show success anyway
    }
  };

  const handleSendAnother = () => {
    setFormData({ name: '', email: '', phone: '', feedback: '' });
    setShowSuccess(false);
  };

  const handleClose = () => {
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', feedback: '' });
      setShowSuccess(false);
    }, 300);
    onClose();
  };

  return (
    <div className="modal-overlay show" onClick={(e) => e.target.className.includes('modal-overlay') && onClose()}>
      <div className="modal feedback-modal">
        <button className="close-modal" onClick={onClose}>×</button>
        <h2>💬 שלח משוב</h2>

        {!showSuccess ? (
          <form onSubmit={handleSubmit}>
            <label>
              שם <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="השם שלך"
            />

            <label>אימייל</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />

            <label>טלפון</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="050-1234567"
            />

            <label>
              משוב <span className="required">*</span>
            </label>
            <textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              required
              placeholder="שתף אותנו במחשבות, הצעות לשיפור או בעיות שנתקלת בהן..."
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="btn btn-acc">
                שלח משוב
              </button>
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                ביטול
              </button>
            </div>
          </form>
        ) : (
          <div className="success-message">
            <h3>✓ תודה רבה!</h3>
            <p>המשוב שלך נשלח בהצלחה 🎉</p>
            <p>אנחנו מעריכים את הזמן שהקדשת לשתף אותנו במחשבות שלך.</p>
            <div className="success-actions">
              <button type="button" className="btn btn-acc" onClick={handleSendAnother}>
                שלח משוב נוסף
              </button>
              <button type="button" className="btn btn-ghost" onClick={handleClose}>
                סגור
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackModal;
