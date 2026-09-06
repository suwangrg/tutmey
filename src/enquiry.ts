export const propertyTypes = ['Villa', 'Apartment', 'Penthouse', 'Open to guidance'] as const;
export const areas = ['Palm Jumeirah', 'Downtown Dubai', 'Dubai Marina', 'Open to guidance'] as const;
export const budgets = ['AED 2M–5M', 'AED 5M–10M', 'AED 10M–20M', 'AED 20M+', 'Let’s discuss'] as const;
export const purposes = ['A home to live in', 'A second home', 'An investment'] as const;

export interface PropertyBrief { propertyType: string; area: string; budget: string; purpose: string; }
export type BriefErrors = Partial<Record<keyof PropertyBrief, string>>;
export const emptyBrief: PropertyBrief = { propertyType:'', area:'', budget:'', purpose:'' };

export function validateBrief(brief: PropertyBrief): BriefErrors {
  const errors: BriefErrors = {};
  if (!(propertyTypes as readonly string[]).includes(brief.propertyType)) errors.propertyType = 'Choose a property type.';
  if (!(areas as readonly string[]).includes(brief.area)) errors.area = 'Choose an area or ask for guidance.';
  if (!(budgets as readonly string[]).includes(brief.budget)) errors.budget = 'Choose a budget or select “Let’s discuss”.';
  if (!(purposes as readonly string[]).includes(brief.purpose)) errors.purpose = 'Tell us what you are looking for.';
  return errors;
}

/** A prepared brief is not a submitted lead. The visitor explicitly sends it in their chosen app. */
export function prepareEnquiry(brief: PropertyBrief) {
  if (Object.keys(validateBrief(brief)).length) throw new Error('Please complete your property preferences.');
  const message = ['Hello Tutmey, I would like to discuss a Dubai property search.', '', 'Purpose: '+brief.purpose, 'Property type: '+brief.propertyType, 'Preferred area: '+brief.area, 'Budget: '+brief.budget, '', 'Please help me explore suitable properties.'].join('\n');
  return {
    message,
    whatsapp: 'https://wa.me/971555172530?text='+encodeURIComponent(message),
    email: 'mailto:info@tutmey.com?subject='+encodeURIComponent('My Dubai property brief')+'&body='+encodeURIComponent(message),
  };
}
