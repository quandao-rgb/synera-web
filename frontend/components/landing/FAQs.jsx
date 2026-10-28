// Adapted from Tailark Mist FAQs 1. MIT © 2025 Irung.
import { Plus } from 'lucide-react';
import { CONTACT, FAQS } from './landing-data.mjs';
export default function FAQs() {
  return <section className="sl-section sl-faq" id="support" aria-labelledby="sl-faq-title"><div className="sl-container sl-faq__grid"><div data-reveal><h2 id="sl-faq-title">Câu hỏi thường gặp</h2><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></div><div className="sl-faq__items">{FAQS.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={20} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></div></section>;
}
