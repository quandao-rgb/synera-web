// Adapted from Tailark Mist Features 2. MIT © 2025 Irung.
import { SOLUTIONS } from './landing-data.mjs';
import { useRef } from 'react';
import { Package, Users, Truck, ArrowRight } from 'lucide-react';
import { useSolutionMotion } from './useLandingMotion';
import { ProductPreview } from './ProductPreview';
export default function Features({ active, onChange }) {
  const root = useRef(null);
  useSolutionMotion(root, active);
  const onKeys = event => {
    const current = SOLUTIONS.findIndex(solution => solution.id === active);
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : event.key === 'ArrowRight' ? (current + 1) % 3 : event.key === 'ArrowLeft' ? (current + 2) % 3 : null;
    if (index === null) return;
    event.preventDefault(); onChange(SOLUTIONS[index].id);
    event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[index]?.focus();
  };
  return <section ref={root} className="sl-section sl-solutions" id="solutions" aria-labelledby="sl-solutions-title"><div className="sl-container"><div className="sl-section-heading" data-reveal><h2 id="sl-solutions-title">Một nền tảng, kết nối mọi khâu</h2></div>
    <div className="sl-solution-tabs" role="tablist" aria-label="Ba gợi ý của SYNERA">{SOLUTIONS.map((solution, index) => { const Icon = [Package, Users, Truck][index]; return <button key={solution.id} id={`sl-tab-${solution.id}`} role="tab" aria-selected={active === solution.id} aria-controls={`sl-panel-${solution.id}`} tabIndex={active === solution.id ? 0 : -1} onClick={() => onChange(solution.id)} onKeyDown={onKeys}><Icon size={23} aria-hidden="true" /><span>{solution.label}</span></button>; })}</div>
    <div id="demo" className="sl-demo-anchor">{SOLUTIONS.map(item => <div className={`sl-solution-panel${active === item.id ? ' is-active' : ''}`} key={item.id} id={`sl-panel-${item.id}`} role="tabpanel" aria-labelledby={`sl-tab-${item.id}`} aria-hidden={active !== item.id} inert={active !== item.id} tabIndex={active === item.id ? 0 : -1}><div className="sl-solution-panel__copy"><h3>{item.title}</h3><p>{item.description}</p><a className="sl-text-link" href="#workflow">Khám phá quy trình <ArrowRight size={17} aria-hidden="true" /></a></div><ProductPreview key={`${item.id}-${active === item.id}`} mode={item.id} /></div>)}</div>
  </div></section>;
}
