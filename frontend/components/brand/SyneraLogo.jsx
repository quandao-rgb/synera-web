// Shared transparent brand asset derived from the image supplied by the owner.
const ASSET = '/assets/brand/synera-logo.png';
export default function SyneraLogo({ light = false, symbolOnly = false, className = '', decorative = false }) {
  return <span className={`synera-logo${light ? ' synera-logo--light' : ''}${symbolOnly ? ' synera-logo--symbol' : ''}${className ? ` ${className}` : ''}`} role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : 'SYNERA'} aria-hidden={decorative || undefined}>
    <svg className="synera-logo__mark" viewBox="145 117 441 490" width="441" height="490" aria-hidden="true" focusable="false"><image href={ASSET} width="2172" height="724" /></svg>
    {!symbolOnly && <svg className="synera-logo__word" viewBox="650 250 1400 256" width="1400" height="256" aria-hidden="true" focusable="false"><image href={ASSET} width="2172" height="724" /></svg>}
  </span>;
}
