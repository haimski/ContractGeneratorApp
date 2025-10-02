import './Modal.css';

function ThankYouModal({ onClose }) {
  return (
    <div className="modal-overlay show" onClick={(e) => e.target.className.includes('modal-overlay') && onClose()}>
      <div className="modal">
        <h2>✓ הפרטים נשלחו בהצלחה!</h2>
        <p>תודה רבה על שליחת הצעת המחיר.</p>
        <p>הפרטים התקבלו במערכת ויטופלו בהקדם.</p>
        <button type="button" className="btn btn-ok" onClick={onClose}>
          סגור
        </button>
      </div>
    </div>
  );
}

export default ThankYouModal;
