import { useState } from 'react';
import FeedbackModal from '../components/FeedbackModal';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  innerContainer: {
    maxWidth: '600px',
    width: '90%',
    padding: '0 16px',
  },
  card: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '18px',
    boxShadow: 'var(--shadow)',
    padding: '32px',
  },
  h1: {
    margin: '0 0 0.6rem',
    fontSize: '2rem',
    textAlign: 'center',
  },
  kicker: {
    color: 'var(--muted)',
    fontSize: '0.95rem',
    textAlign: 'center',
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontWeight: '600',
    margin: '16px 0 8px',
  },
  input: {
    width: '100%',
    background: '#0b0e1a',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    padding: '12px 14px',
    borderRadius: '12px',
    outline: 'none',
    fontSize: '1rem',
  },
  inputFocus: {
    borderColor: 'var(--acc)',
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 20px',
    fontWeight: '700',
    cursor: 'pointer',
    width: '100%',
    marginTop: '16px',
    fontSize: '1rem',
    background: 'var(--acc)',
    color: '#0a1028',
  },
  error: {
    color: 'var(--danger)',
    fontSize: '0.9rem',
    marginTop: '8px',
    display: 'none',
  },
  errorShow: {
    display: 'block',
  },
  info: {
    background: '#0b0e1a',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '16px',
    marginTop: '20px',
    fontSize: '0.9rem',
    lineHeight: '1.6',
  },
  infoStrong: {
    color: 'var(--acc)',
  },
  links: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    flexWrap: 'wrap',
  },
  linkBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    background: '#0b0e1a',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    color: 'var(--text)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
};

function HomePage({ onWebhookSubmit }) {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [error, setError] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = webhookUrl.trim();
    const webhookPattern = /^https:\/\/hook\..*\.make\.com\/.+/;
    
    if (!webhookPattern.test(url)) {
      setError('נא להזין כתובת Webhook תקינה מ-Make');
      return;
    }
    
    setError('');
    
    try {
      await onWebhookSubmit(url);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    setWebhookUrl(e.target.value);
    setError('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        <div style={styles.card}>
          <h1 style={styles.h1}>🚀 מחולל הצעות מחיר</h1>
          <div style={styles.kicker}>הזן את כתובת ה-Webhook של Make כדי להתחיל</div>
          
          <form onSubmit={handleSubmit}>
            <label htmlFor="webhookUrl" style={styles.label}>
              כתובת Webhook מ-Make
            </label>
            <input
              type="url"
              id="webhookUrl"
              value={webhookUrl}
              onChange={handleInputChange}
              placeholder="https://hook.eu2.make.com/..."
              required
              style={styles.input}
            />
            <div style={{ ...styles.error, ...(error ? styles.errorShow : {}) }}>
              {error || 'נא להזין כתובת Webhook תקינה מ-Make'}
            </div>
            
            <button type="submit" style={styles.btn}>
              המשך לטופס ←
            </button>
          </form>
          
          <div style={styles.info}>
            <strong style={styles.infoStrong}>💡 איפה מוצאים את ה-Webhook?</strong><br />
            1. היכנס ל-Make.com<br />
            2. צור תרחיש חדש עם טריגר "Webhook"<br />
            3. העתק את כתובת ה-Webhook<br />
            4. הדבק אותה כאן למעלה
          </div>
          
          <div style={styles.links}>
            <a 
              href="/Contract Generator.blueprint.json" 
              download 
              style={styles.linkBtn}
            >
              📥 הורד Blueprint של Make
            </a>
            <button
              onClick={() => setShowFeedback(true)}
              style={{ ...styles.linkBtn, border: '1px solid var(--border)' }}
            >
              💬 שלח משוב
            </button>
          </div>
        </div>
      </div>
      
      {showFeedback && (
        <FeedbackModal onClose={() => setShowFeedback(false)} />
      )}
    </div>
  );
}

export default HomePage;
