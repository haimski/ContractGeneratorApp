import { useState, useEffect } from 'react';
import axios from 'axios';
import FeedbackModal from '../components/FeedbackModal';
import ThankYouModal from '../components/ThankYouModal';
import '../styles/FormPage.css';

function FormPage({ webhookUrl, onChangeWebhook }) {
  // Base fields
  const [clientName, setClientName] = useState('');
  const [quoteId, setQuoteId] = useState('');
  const [quoteDate, setQuoteDate] = useState('');
  const [vendor, setVendor] = useState('');
  const [goal, setGoal] = useState('');
  const [model, setModel] = useState('');

  // Fixed model
  const [fixedTotal, setFixedTotal] = useState('');
  const [fixedValidity, setFixedValidity] = useState('14');
  const [fixedTerms, setFixedTerms] = useState('');
  const [fixedItems, setFixedItems] = useState([{ name: '', desc: '', price: 0 }]);

  // Discovery model
  const [discPrice, setDiscPrice] = useState('');
  const [discMeetings, setDiscMeetings] = useState('3');
  const [discFlow, setDiscFlow] = useState('כן');
  const [discValidity, setDiscValidity] = useState('14');
  const [discDelivery, setDiscDelivery] = useState('');

  // Hours model
  const [hourRate, setHourRate] = useState('350');
  const [hoursValidity, setHoursValidity] = useState('90');
  const [hoursReporting, setHoursReporting] = useState('');
  const [packs, setPacks] = useState([{ hours: 10, note: '', sum: 3500 }]);

  // UI state
  const [showFeedback, setShowFeedback] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');

  // Initialize date
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setQuoteDate(today);
  }, []);

  // Calculate fixed items sum
  const getFixedItemsSum = () => {
    return fixedItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  };

  // Calculate packs sum
  const getPacksSum = () => {
    return packs.reduce((sum, pack) => sum + (pack.sum || 0), 0);
  };

  // Add/Remove fixed items
  const addFixedItem = () => {
    setFixedItems([...fixedItems, { name: '', desc: '', price: 0 }]);
  };

  const removeFixedItem = (index) => {
    setFixedItems(fixedItems.filter((_, i) => i !== index));
  };

  const updateFixedItem = (index, field, value) => {
    const updated = [...fixedItems];
    updated[index][field] = value;
    setFixedItems(updated);
  };

  // Add/Remove packs
  const addPack = () => {
    const rate = parseFloat(hourRate) || 0;
    setPacks([...packs, { hours: 10, note: '', sum: 10 * rate }]);
  };

  const removePack = (index) => {
    setPacks(packs.filter((_, i) => i !== index));
  };

  const updatePack = (index, field, value) => {
    const updated = [...packs];
    updated[index][field] = value;
    
    if (field === 'hours') {
      const rate = parseFloat(hourRate) || 0;
      updated[index].sum = parseInt(value) * rate;
    }
    
    setPacks(updated);
  };

  // Recalculate pack sums when hourRate changes
  useEffect(() => {
    const rate = parseFloat(hourRate) || 0;
    setPacks(packs.map(pack => ({
      ...pack,
      sum: pack.hours * rate
    })));
  }, [hourRate]);

  // Collect all form data
  const collectData = () => {
    const base = {
      clientName,
      quoteId,
      quoteDate,
      vendor,
      goal,
      model
    };

    let extra = {};

    if (model === 'fixed') {
      extra = {
        fixedTotal: parseFloat(fixedTotal) || 0,
        fixedValidity: parseInt(fixedValidity) || 14,
        fixedTerms,
        items: fixedItems
      };
    }

    if (model === 'discovery') {
      extra = {
        discPrice: parseFloat(discPrice) || 0,
        discMeetings: parseInt(discMeetings) || 0,
        discFlow,
        discValidity: parseInt(discValidity) || 14,
        discDelivery
      };
    }

    if (model === 'hours') {
      extra = {
        hourRate: parseFloat(hourRate) || 0,
        hoursValidity: parseInt(hoursValidity) || 90,
        reporting: hoursReporting,
        packs
      };
    }

    return { ...base, ...extra };
  };

  // Generate preview HTML
  const generatePreview = () => {
    const data = collectData();
    const html = renderPreview(data);
    setPreviewHtml(html);
  };

  // Render preview based on model
  const renderPreview = (d) => {
    if (!d.model) {
      return '<div class="muted">בחר מודל ליצירת תצוגה.</div>';
    }

    const currency = (n) => (n || 0).toLocaleString('he-IL') + ' ₪';
    const esc = (s) => (s || '').toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const header = `
      <div class="grid cols-2">
        <div>
          <h3>ללקוח: ${esc(d.clientName || '')}</h3>
          <div class="muted">מטרה: ${esc(d.goal || '')}</div>
        </div>
        <div>
          <div class="muted">מס׳ הצעה: ${esc(d.quoteId || '')}</div>
          <div class="muted">תאריך: ${esc(d.quoteDate || '')}</div>
          <div class="muted">ספק: ${esc(d.vendor || '')}</div>
        </div>
      </div>
      <div class="hr"></div>`;

    if (d.model === 'fixed') {
      const items = (d.items || [])
        .map(r => `<tr><td>${esc(r.name)}</td><td>${esc(r.desc)}</td><td style="text-align:left">${currency(r.price)}</td></tr>`)
        .join('');
      const itemsTable = d.items && d.items.length ? `
        <h3>רכיבי הפרויקט</h3>
        <table class="table"><thead><tr><th>רכיב</th><th>תיאור</th><th style="text-align:left">מחיר</th></tr></thead><tbody>${items}</tbody></table>` : '';
      
      return header + `
        <h3>מודל: פרויקט קבוע</h3>
        <p><strong>מחיר כולל:</strong> ${currency(d.fixedTotal)} • <strong>תוקף:</strong> ${esc(d.fixedValidity)} ימים</p>
        <p><strong>תנאי תשלום:</strong> ${esc(d.fixedTerms || 'לפי אבני דרך')}</p>
        ${itemsTable}
      `;
    }

    if (d.model === 'discovery') {
      return header + `
        <h3>מודל: אפיון בתשלום → פרויקט</h3>
        <p><strong>מחיר אפיון:</strong> ${currency(d.discPrice)} • <strong>פגישות:</strong> ${esc(d.discMeetings)} • <strong>תרשים זרימה:</strong> ${esc(d.discFlow)}</p>
        <p><strong>טווח לביצוע לאחר אפיון:</strong> ${esc(d.discDelivery || 'יוגדר בהצעת הביצוע')}</p>
        <p class="muted">לאחר אישור האפיון החתום, תוגש הצעת ביצוע מדויקת. תוקף ההצעה: ${esc(d.discValidity)} ימים.</p>
      `;
    }

    if (d.model === 'hours') {
      const rows = (d.packs || [])
        .map(p => `<tr><td>${p.hours} שעות</td><td>${esc(p.note || '')}</td><td style="text-align:left">${currency(p.sum)}</td></tr>`)
        .join('');
      const total = (d.packs || []).reduce((a, b) => a + (b.sum || 0), 0);
      
      return header + `
        <h3>מודל: בנק שעות</h3>
        <p><strong>מחיר לשעה:</strong> ${currency(d.hourRate)} • <strong>תוקף ניצול:</strong> ${esc(d.hoursValidity)} ימים</p>
        <h3>חבילות נבחרות</h3>
        <table class="table"><thead><tr><th>חבילה</th><th>הערות</th><th style="text-align:left">סה"כ</th></tr></thead><tbody>${rows || '<tr><td colspan="3" class="muted">לא נבחרו חבילות</td></tr>'}</tbody><tfoot><tr><td colspan="2" class="sum">סה"כ</td><td style="text-align:left" class="sum">${currency(total)}</td></tr></tfoot></table>
        <p><strong>דיווח:</strong> ${esc(d.reporting || 'דוח שעות שבועי/חודשי ישלח ללקוח')}</p>
      `;
    }

    return '';
  };

  // Copy HTML to clipboard
  const copyToClipboard = async () => {
    if (!previewHtml) {
      alert('אין תצוגה להעתיק. צור תצוגה מקדימה קודם.');
      return;
    }

    try {
      await navigator.clipboard.writeText(previewHtml);
      alert('התצוגה הועתקה ל-Clipboard כ-HTML.');
    } catch (e) {
      alert('העתקה נכשלה. נסה לבחור ולהעתיק ידנית.');
    }
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Reset form
  const handleReset = () => {
    if (confirm('לאפס את כל הטופס?')) {
      window.location.reload();
    }
  };

  // Submit to Make.com
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = collectData();

    // Prepare data for backend
    const payload = {
      clientName: data.clientName,
      quoteId: data.quoteId,
      quoteDate: data.quoteDate,
      vendor: data.vendor,
      goal: data.goal,
      model: data.model
    };

    if (data.model === 'fixed') {
      payload.fixedTotal = data.fixedTotal;
      payload.fixedValidity = data.fixedValidity;
      payload.fixedTerms = data.fixedTerms;
      if (data.items && data.items.length > 0) {
        payload.itemsJSON = JSON.stringify(data.items);
        payload.itemsCount = data.items.length;
      }
    }

    if (data.model === 'discovery') {
      payload.discPrice = data.discPrice;
      payload.discMeetings = data.discMeetings;
      payload.discFlow = data.discFlow;
      payload.discValidity = data.discValidity;
      payload.discDelivery = data.discDelivery;
    }

    if (data.model === 'hours') {
      payload.hourRate = data.hourRate;
      payload.hoursValidity = data.hoursValidity;
      payload.reporting = data.reporting;
      if (data.packs && data.packs.length > 0) {
        payload.packsJSON = JSON.stringify(data.packs);
        payload.packsCount = data.packs.length;
      }
    }

    try {
      await axios.post('/api/submit-quote', payload);
      setShowThankYou(true);
    } catch (error) {
      console.error('Error submitting quote:', error);
      setShowThankYou(true); // Show success anyway
    }
  };

  const modelNames = {
    fixed: 'פרויקט קבוע',
    discovery: 'אפיון בתשלום',
    hours: 'בנק שעות'
  };

  return (
    <div className="form-page">
      <form onSubmit={handleSubmit}>
        <div className="container">
          <header className="section-title">
            <div>
              <h1>מחולל הצעת מחיר לאוטומציה</h1>
              <div className="kicker">
                מילוי טופס דינמי לפי מודל התמחור שבחרת, יוצר תקציר והצעה להדפסה/ייצוא.
              </div>
            </div>
            <div className="no-print" style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={onChangeWebhook}
                className="btn btn-ghost"
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              >
                שנה Webhook
              </button>
              <button
                type="button"
                onClick={() => setShowFeedback(true)}
                className="btn btn-ghost"
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              >
                💬 משוב
              </button>
            </div>
          </header>

          <div className="grid cols-2">
            {/* Base Details */}
            <section className="card">
              <h2>פרטי בסיס</h2>
              <div className="row">
                <div>
                  <label>שם הלקוח/החברה</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="לדוגמה: חברת אלפא בע"
                  />
                </div>
                <div>
                  <label>מס׳ הצעה</label>
                  <input
                    type="text"
                    value={quoteId}
                    onChange={(e) => setQuoteId(e.target.value)}
                    placeholder="Q-2025-001"
                  />
                </div>
              </div>
              <div className="row">
                <div>
                  <label>תאריך</label>
                  <input
                    type="date"
                    value={quoteDate}
                    onChange={(e) => setQuoteDate(e.target.value)}
                  />
                </div>
                <div>
                  <label>פרטי הספק</label>
                  <input
                    type="text"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    placeholder="שם העסק • טל׳ • דוא"
                  />
                </div>
              </div>
              <label>מטרת הפרויקט (תקציר)</label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="מה הבעיה העסקית והתוצאה הרצויה"
              />
            </section>

            {/* Model Selection */}
            <section className="card">
              <h2>בחירת מודל תמחור</h2>
              <label htmlFor="model">מודל</label>
              <select
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                <option value="">— בחר מודל —</option>
                <option value="fixed">פרויקט קבוע (Fixed)</option>
                <option value="discovery">אפיון בתשלום → פרויקט</option>
                <option value="hours">בנק שעות (Retainer)</option>
              </select>
              <div className="hr"></div>
              <div className="muted">השדות יופיעו בהמשך בהתאם לבחירה.</div>
            </section>
          </div>

          {/* Fixed Model */}
          {model === 'fixed' && (
            <section className="card">
              <div className="section-title">
                <h2>מודל פרויקט קבוע</h2>
                <span className="pill">Fixed</span>
              </div>
              <div className="row">
                <div>
                  <label>מחיר הפרויקט (₪, לפני מע"מ)</label>
                  <input
                    type="number"
                    value={fixedTotal}
                    onChange={(e) => setFixedTotal(e.target.value)}
                    min="0"
                    step="50"
                    placeholder="לדוגמה: 18000"
                  />
                </div>
                <div>
                  <label>תוקף הצעה (ימים)</label>
                  <input
                    type="number"
                    value={fixedValidity}
                    onChange={(e) => setFixedValidity(e.target.value)}
                    min="1"
                    step="1"
                  />
                </div>
              </div>
              <label>תנאי תשלום</label>
              <input
                type="text"
                value={fixedTerms}
                onChange={(e) => setFixedTerms(e.target.value)}
                placeholder="40% הזמנה • 40% לאחר פיתוח • 20% במסירה"
              />

              <div className="hr"></div>
              <div className="section-title">
                <h3>רכיבים מפורטים (אופציונלי)</h3>
                <button
                  type="button"
                  className="btn btn-ghost no-print"
                  onClick={addFixedItem}
                >
                  הוסף רכיב
                </button>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>רכיב</th>
                    <th>תיאור</th>
                    <th style={{ width: '140px' }}>מחיר (₪)</th>
                    <th className="no-print" style={{ width: '80px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {fixedItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateFixedItem(index, 'name', e.target.value)}
                          placeholder="לדוגמה: אפיון"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={item.desc}
                          onChange={(e) => updateFixedItem(index, 'desc', e.target.value)}
                          placeholder="תיאור קצר"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateFixedItem(index, 'price', e.target.value)}
                          min="0"
                          step="50"
                        />
                      </td>
                      <td className="no-print">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removeFixedItem(index)}
                        >
                          מחק
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="2" className="sum">סה״כ מפורט</td>
                    <td className="sum">{getFixedItemsSum().toLocaleString('he-IL')}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </section>
          )}

          {/* Discovery Model */}
          {model === 'discovery' && (
            <section className="card">
              <div className="section-title">
                <h2>מודל אפיון בתשלום → פרויקט</h2>
                <span className="pill">Discovery</span>
              </div>
              <div className="row">
                <div>
                  <label>מחיר אפיון (₪)</label>
                  <input
                    type="number"
                    value={discPrice}
                    onChange={(e) => setDiscPrice(e.target.value)}
                    min="0"
                    step="50"
                    placeholder="לדוגמה: 3500"
                  />
                </div>
                <div>
                  <label>מס׳ פגישות אפיון</label>
                  <input
                    type="number"
                    value={discMeetings}
                    onChange={(e) => setDiscMeetings(e.target.value)}
                    min="1"
                    step="1"
                  />
                </div>
              </div>
              <div className="row">
                <div>
                  <label>כולל תרשים זרימה</label>
                  <select value={discFlow} onChange={(e) => setDiscFlow(e.target.value)}>
                    <option value="כן">כן</option>
                    <option value="לא">לא</option>
                  </select>
                </div>
                <div>
                  <label>תוקף הצעה (ימים)</label>
                  <input
                    type="number"
                    value={discValidity}
                    onChange={(e) => setDiscValidity(e.target.value)}
                    min="1"
                    step="1"
                  />
                </div>
              </div>
              <label>טווח משוער לביצוע לאחר אפיון (שבועות)</label>
              <input
                type="text"
                value={discDelivery}
                onChange={(e) => setDiscDelivery(e.target.value)}
                placeholder="לדוגמה: 4–6 שבועות מביצוע הזמנה"
              />
              <div className="muted">
                לאחר סיום האפיון והחתימה, תוגש הצעת מחיר מדויקת לביצוע.
              </div>
            </section>
          )}

          {/* Hours Model */}
          {model === 'hours' && (
            <section className="card">
              <div className="section-title">
                <h2>מודל בנק שעות</h2>
                <span className="pill">Hours</span>
              </div>
              <div className="row">
                <div>
                  <label>מחיר לשעה (₪)</label>
                  <input
                    type="number"
                    value={hourRate}
                    onChange={(e) => setHourRate(e.target.value)}
                    min="50"
                    step="10"
                  />
                </div>
                <div>
                  <label>תוקף ניצול (ימים)</label>
                  <input
                    type="number"
                    value={hoursValidity}
                    onChange={(e) => setHoursValidity(e.target.value)}
                    min="7"
                    step="1"
                  />
                </div>
              </div>

              <div className="section-title">
                <h3>בחר חבילות</h3>
                <button
                  type="button"
                  className="btn btn-ghost no-print"
                  onClick={addPack}
                >
                  הוסף חבילה
                </button>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: '160px' }}>חבילה</th>
                    <th>הערות</th>
                    <th style={{ width: '140px' }}>סה"כ (₪)</th>
                    <th className="no-print" style={{ width: '80px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {packs.map((pack, index) => (
                    <tr key={index}>
                      <td>
                        <select
                          value={pack.hours}
                          onChange={(e) => updatePack(index, 'hours', e.target.value)}
                        >
                          <option value="5">5 שעות</option>
                          <option value="10">10 שעות</option>
                          <option value="20">20 שעות</option>
                          <option value="50">50 שעות</option>
                          <option value="100">100 שעות</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={pack.note}
                          onChange={(e) => updatePack(index, 'note', e.target.value)}
                          placeholder="לדוגמה: התאקלמות/פיילוט"
                        />
                      </td>
                      <td className="pack-sum">{pack.sum.toLocaleString('he-IL')}</td>
                      <td className="no-print">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removePack(index)}
                        >
                          מחק
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="2" className="sum">סה״כ חבילות</td>
                    <td className="sum">{getPacksSum().toLocaleString('he-IL')}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>

              <div className="hr"></div>
              <label>דיווח ושקיפות</label>
              <input
                type="text"
                value={hoursReporting}
                onChange={(e) => setHoursReporting(e.target.value)}
                placeholder="קישור/תיאור: Google Sheet עם לוג שעות ומשימות"
              />
            </section>
          )}

          {/* Action Buttons */}
          <section className="card no-print">
            <div className="row">
              <button type="button" className="btn btn-acc" onClick={generatePreview}>
                צור תצוגה מקדימה
              </button>
              <button type="button" className="btn btn-ok" onClick={copyToClipboard}>
                העתקה ל-Clipboard (HTML)
              </button>
              <button type="button" className="btn btn-warn" onClick={handlePrint}>
                הדפס / שמור כ-PDF
              </button>
              <button type="button" className="btn btn-ghost" onClick={handleReset}>
                איפוס טופס
              </button>
              <button type="submit" className="btn btn-ok">
                שלח לטיפול (Make)
              </button>
            </div>
            <div className="footer muted">
              טיפ: לאחר יצירת התצוגה, ניתן להדפיס או להדביק ל-Word/Docs.
            </div>
          </section>

          {/* Preview */}
          <section className="card" id="previewCard">
            <div className="section-title">
              <h2>פרטי הצעת מחיר</h2>
              <span className="pill">{model ? modelNames[model] : '—'}</span>
            </div>
            <div id="preview" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </section>
        </div>
      </form>

      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
      {showThankYou && <ThankYouModal onClose={() => setShowThankYou(false)} />}
    </div>
  );
}

export default FormPage;
