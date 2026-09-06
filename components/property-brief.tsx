'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowRight, Check, Mail, MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { areas, budgets, emptyBrief, prepareEnquiry, propertyTypes, purposes, validateBrief, type BriefErrors, type PropertyBrief } from '@/lib/enquiry';

interface BriefSelectProps { label: string; field: keyof PropertyBrief; options: readonly string[]; value: string; error?: string; onChange: (field: keyof PropertyBrief, value: string) => void; }
function BriefSelect({ label, field, options, value, error, onChange }: BriefSelectProps) {
  return <div className="brief-field">
    <label id={field+'-label'} htmlFor={field}>{label} <span aria-hidden="true">*</span></label>
    <Select value={value || null} onValueChange={(next) => onChange(field, next || '')} items={options.map(option => ({ label:option, value:option }))}>
      <SelectTrigger id={field} className="brief-select" aria-labelledby={field+'-label'} aria-invalid={!!error} aria-describedby={error ? field+'-error' : undefined} aria-required="true"><SelectValue placeholder="Select your preference" /></SelectTrigger>
      <SelectContent className="brief-options" alignItemWithTrigger={false}>{options.map(option => <SelectItem key={option} value={option} className="brief-option">{option}</SelectItem>)}</SelectContent>
    </Select>
    {error && <p className="field-error" id={field+'-error'}>{error}</p>}
  </div>;
}

export interface PropertyBriefProps { preferredArea: string; selectionVersion: number; }
export function PropertyBriefForm({ preferredArea, selectionVersion }: PropertyBriefProps) {
  const [brief, setBrief] = useState<PropertyBrief>(emptyBrief);
  const [errors, setErrors] = useState<BriefErrors>({});
  const [stage, setStage] = useState<'preferences'|'ready'>('preferences');
  const [ready, setReady] = useState<ReturnType<typeof prepareEnquiry> | null>(null);
  const [attempted, setAttempted] = useState(false);
  const resultHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (selectionVersion > 0) {
      setBrief(previous => ({ ...previous, area:preferredArea }));
      setErrors({}); setStage('preferences'); setReady(null); setAttempted(false);
    }
  }, [preferredArea, selectionVersion]);
  useEffect(() => { if (stage === 'ready') resultHeading.current?.focus(); }, [stage]);

  function update(field: keyof PropertyBrief, value: string) {
    const next = { ...brief, [field]:value };
    setBrief(next);
    if (attempted) setErrors(validateBrief(next));
  }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setAttempted(true);
    const nextErrors = validateBrief(brief); setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) { document.getElementById(firstError)?.focus(); return; }
    setReady(prepareEnquiry(brief)); setStage('ready');
  }

  return <div className="brief-panel">
    <div className="brief-progress" aria-label={stage === 'ready' ? 'Step 2 of 2: Send your brief' : 'Step 1 of 2: Your preferences'}><span className="active">01 <span>Your preferences</span></span><span className={stage === 'ready' ? 'active' : ''}>02 <span>Let’s connect</span></span></div>
    {stage === 'preferences' ? <form noValidate onSubmit={submit}>
      <h3>What does home look like to you?</h3><p className="form-note">Four simple preferences. A more focused conversation.</p>
      <div className="brief-grid">
        <BriefSelect label="I’m looking for" field="purpose" value={brief.purpose} options={purposes} error={errors.purpose} onChange={update} />
        <BriefSelect label="Property type" field="propertyType" value={brief.propertyType} options={propertyTypes} error={errors.propertyType} onChange={update} />
        <BriefSelect label="Preferred area" field="area" value={brief.area} options={areas} error={errors.area} onChange={update} />
        <BriefSelect label="Budget" field="budget" value={brief.budget} options={budgets} error={errors.budget} onChange={update} />
      </div>
      {attempted && Object.keys(errors).length > 0 && <p role="alert" className="field-error mb-4">Please complete the highlighted preferences. You can choose guidance if you are still exploring.</p>}
      <Button type="submit" className="action action-gold brief-submit">Prepare my property brief <ArrowRight aria-hidden="true" /></Button>
      <p className="privacy-note">All four preferences are required. Next, choose WhatsApp or email to send your brief. Nothing is sent automatically.</p>
    </form> : <div className="brief-result">
      <span className="result-icon" aria-hidden="true"><Check /></span><h3 ref={resultHeading} tabIndex={-1}>Your next chapter starts here.</h3><p className="form-note">Your brief is ready. Send it directly to Tutmey to begin your search.</p>
      <dl className="brief-summary"><div><dt>Looking for</dt><dd>{brief.purpose}</dd></div><div><dt>Property</dt><dd>{brief.propertyType}</dd></div><div><dt>Area</dt><dd>{brief.area}</dd></div><div><dt>Budget</dt><dd>{brief.budget}</dd></div></dl>
      <a href={ready?.whatsapp} className="action action-gold brief-submit" target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" /> Send on WhatsApp <ArrowRight aria-hidden="true" /></a>
      <a href={ready?.email} className="action action-outline brief-submit mt-3"><Mail aria-hidden="true" /> Open in email <ArrowRight aria-hidden="true" /></a>
      <p className="privacy-note">Your message opens as a draft. Review it and press Send in your chosen app. No message has been sent yet.</p>
      <Button variant="ghost" className="edit-brief" onClick={() => { setStage('preferences'); setTimeout(() => document.getElementById('purpose')?.focus(), 0); }}><ArrowLeft aria-hidden="true" /> Edit my preferences</Button>
    </div>}
  </div>;
}
