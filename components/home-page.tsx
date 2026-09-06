'use client';
import { ArrowDown, ArrowRight, MapPin } from 'lucide-react';
export default function HomePage() {
 return <>
  <a className="skip-link" href="#main">Skip to content</a>
  <header className="site-header"><div className="shell header-inner">
   <a className="brand" href="#" aria-label="Tutmey Real Estate home"><img src="/images/monogram.webp" width="48" height="48" alt="" /><span><span className="brand-name">TUTMEY</span><span className="brand-sub">REAL ESTATE</span></span></a>
   <nav className="desktop-nav" aria-label="Main navigation"><a href="#collection">The collection</a><a href="#approach">Our approach</a><a href="#about">About Tutmey</a><a className="action action-outline" href="#enquire">Let’s talk <ArrowRight aria-hidden="true" /></a></nav>
  </div></header>
  <main id="main">
   <section className="hero" aria-labelledby="hero-heading">
    <img className="hero-image" src="/images/hero-1800.webp" srcSet="/images/hero-800.webp 800w, /images/hero-1600.webp 1600w, /images/hero-1800.webp 1800w" sizes="100vw" width="1800" height="1304" fetchPriority="high" alt="The Burj Khalifa and Dubai skyline across the water at golden hour" />
    <div className="shell hero-content"><div className="eyebrow">A more personal perspective on Dubai</div><h1 id="hero-heading">Exceptional homes.<br /><em>A life well chosen.</em></h1><a href="#enquire" className="action action-gold">Find my Dubai home <ArrowRight aria-hidden="true" /></a></div>
    <div className="shell hero-bottom"><span><MapPin aria-hidden="true" /> Dubai, United Arab Emirates</span><span><span className="scroll-line" /> A considered way forward <ArrowDown aria-hidden="true" /></span></div>
   </section>
   <section className="section shell intro" id="about"><div><div className="eyebrow">The Tutmey perspective</div><h2>A home is personal.<br />So is our approach.</h2></div><div className="intro-copy"><p>Some decisions deserve a little more attention. We help you find a Dubai property that reflects the way you want to live, what you value, and what comes next.</p><p className="mt-6">Considered choices. Clear guidance. A relationship built around you.</p><a className="text-link" href="https://wa.me/971555172530" target="_blank" rel="noopener noreferrer">Start a conversation <ArrowRight aria-hidden="true" /></a></div></section>
   <section className="section shell" id="enquire"><div className="eyebrow">Your next chapter</div><h2 className="mt-6">Let’s find your place in Dubai.</h2><a className="action action-gold mt-8" href="https://wa.me/971555172530" target="_blank" rel="noopener noreferrer">Speak with Tutmey <ArrowRight aria-hidden="true" /></a></section>
  </main>
 </>;
}
