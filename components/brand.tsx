export interface BrandProps { footer?: boolean; }
export function Brand({ footer = false }: BrandProps) {
  return <a className={footer ? 'brand footer-brand' : 'brand'} href="#top" aria-label="Tutmey Real Estate home">
    <img src="/images/monogram.webp" width="48" height="48" alt="" />
    <span><span className="brand-name">TUTMEY</span><span className="brand-sub">REAL ESTATE</span></span>
  </a>;
}
