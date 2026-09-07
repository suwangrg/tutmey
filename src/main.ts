import './styles.css';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import 'lenis/dist/lenis.css';
import { areas, prepareEnquiry, validateBrief, type PropertyBrief } from './enquiry';
import type Lenis from 'lenis';

// Every page is complete HTML. JavaScript enhances navigation, motion and the enquiry handoff.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let smoothScroll: Lenis | undefined;
let motionVersion = 0;
async function configureMotion() {
  const version = ++motionVersion;
  smoothScroll?.destroy(); smoothScroll = undefined;
  if (reducedMotion.matches) return;
  try {
    const { default: LenisConstructor } = await import('lenis');
    if (version !== motionVersion || reducedMotion.matches) return;
    smoothScroll = new LenisConstructor({
      autoRaf: true, lerp: 0.14, smoothWheel: true, syncTouch: false,
      anchors: { offset: -144 },
      prevent: node => !!node.closest('dialog, select, textarea, [data-native-scroll]'),
    });
    if (document.querySelector('dialog[open]')) smoothScroll.stop();
  } catch { /* Native scrolling remains available if the optional enhancement cannot load. */ }
}
void configureMotion();
reducedMotion.addEventListener('change', () => {
  void configureMotion();
  if (reducedMotion.matches) document.querySelectorAll('.will-reveal').forEach(node => node.classList.remove('will-reveal'));
});

const header = document.querySelector<HTMLElement>('#site-header');
function updateHeader() { header?.classList.toggle('is-scrolled', window.scrollY > 32); }
updateHeader(); window.addEventListener('scroll', updateHeader, { passive:true });
document.querySelectorAll<HTMLElement>('[data-year]').forEach(node => { node.textContent = String(new Date().getFullYear()); });

const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll<HTMLAnchorElement>('.desktop-nav a, .mobile-menu nav a, .site-footer nav a').forEach(link => {
  if (new URL(link.href).pathname.split('/').pop() === currentPage) link.setAttribute('aria-current', 'page');
});

// Native dialog provides a focus trap, Escape dismissal and an inert background.
const menu = document.querySelector<HTMLDialogElement>('#mobile-menu');
const menuOpen = document.querySelector<HTMLButtonElement>('#menu-open');
menuOpen?.addEventListener('click', () => {
  menu?.showModal(); menuOpen.setAttribute('aria-expanded', 'true'); smoothScroll?.stop();
});
menu?.querySelector('[data-close-menu]')?.addEventListener('click', () => menu.close());
menu?.addEventListener('close', () => {
  menuOpen?.setAttribute('aria-expanded', 'false'); smoothScroll?.start(); menuOpen?.focus();
});
menu?.addEventListener('click', event => { if (event.target === menu) menu.close(); });
const desktop = window.matchMedia('(min-width: 1001px)');
desktop.addEventListener('change', () => { if (desktop.matches && menu?.open) menu.close(); });

// Content stays visible without JavaScript; only offscreen elements receive a reveal class.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove('will-reveal'); observer.unobserve(entry.target); }
    });
  }, { threshold:0.05, rootMargin:'0px 0px 32px 0px' });
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(node => {
    if (node.getBoundingClientRect().top > window.innerHeight) node.classList.add('will-reveal');
    observer.observe(node);
  });
}

const form = document.querySelector<HTMLFormElement>('#enquiry-form');
if (form) {
  const fields = ['purpose', 'propertyType', 'area', 'budget'] as const;
  const result = document.querySelector<HTMLElement>('#brief-result')!;
  const errorSummary = document.querySelector<HTMLElement>('#brief-error')!;
  const submitButton = document.querySelector<HTMLButtonElement>('#prepare-brief')!;
  let attempted = false;
  const readBrief = (): PropertyBrief => Object.fromEntries(fields.map(field => [field, (form.elements.namedItem(field) as HTMLSelectElement).value])) as unknown as PropertyBrief;

  function showErrors(brief: PropertyBrief) {
    const errors = validateBrief(brief);
    fields.forEach(field => {
      const control = form!.elements.namedItem(field) as HTMLSelectElement;
      const message = document.getElementById(field+'-error')!;
      control.setAttribute('aria-invalid', String(!!errors[field]));
      message.textContent = errors[field] || ''; message.hidden = !errors[field];
    });
    errorSummary.textContent = Object.keys(errors).length ? 'Please complete the highlighted preferences. Choose guidance if you are still exploring.' : '';
    errorSummary.hidden = !Object.keys(errors).length;
    return errors;
  }
  const selectedArea = new URLSearchParams(location.search).get('area');
  if (selectedArea && (areas as readonly string[]).includes(selectedArea)) (form.elements.namedItem('area') as HTMLSelectElement).value = selectedArea;
  form.addEventListener('change', () => { if (attempted) showErrors(readBrief()); });
  form.addEventListener('submit', async event => {
    event.preventDefault(); attempted = true;
    const brief = readBrief(); const errors = showErrors(brief);
    const firstError = fields.find(field => errors[field]);
    if (firstError) { (form.elements.namedItem(firstError) as HTMLSelectElement).focus(); return; }
    submitButton.disabled = true; submitButton.setAttribute('aria-busy', 'true');
    const originalLabel = submitButton.innerHTML;
    submitButton.textContent = 'Preparing your brief…';
    // Let the busy feedback paint; there is no artificial delay or background submission.
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    try {
      const prepared = prepareEnquiry(brief);
      fields.forEach(field => { document.querySelector<HTMLElement>('[data-summary="'+field+'"]')!.textContent = brief[field]; });
      document.querySelector<HTMLAnchorElement>('#send-whatsapp')!.href = prepared.whatsapp;
      document.querySelector<HTMLAnchorElement>('#send-email')!.href = prepared.email;
      form.hidden = true; result.hidden = false;
      document.getElementById('brief-step-two')?.classList.add('active');
      document.getElementById('brief-progress')?.setAttribute('aria-label', 'Step 2 of 2: Send your brief');
      document.getElementById('result-heading')?.focus({ preventScroll:true });
      document.getElementById('property-brief')?.scrollIntoView({ behavior:'auto', block:'start' });
    } catch {
      errorSummary.hidden = false; errorSummary.textContent = 'We could not prepare the brief. Please try again or contact us directly at info@tutmey.com.';
    } finally { submitButton.disabled = false; submitButton.removeAttribute('aria-busy'); submitButton.innerHTML = originalLabel; }
  });
  document.getElementById('edit-brief')?.addEventListener('click', () => {
    result.hidden = true; form.hidden = false;
    document.getElementById('brief-step-two')?.classList.remove('active');
    document.getElementById('brief-progress')?.setAttribute('aria-label', 'Step 1 of 2: Your preferences');
    (form.elements.namedItem('purpose') as HTMLSelectElement).focus({ preventScroll:true });
  });
}

window.addEventListener('pagehide', () => { smoothScroll?.destroy(); smoothScroll = undefined; });
window.addEventListener('pageshow', event => { if (event.persisted) void configureMotion(); });
