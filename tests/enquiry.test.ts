import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyBrief, prepareEnquiry, validateBrief } from '../src/enquiry.ts';

const brief = { purpose:'A second home', propertyType:'Villa', area:'Palm Jumeirah', budget:'AED 5M–10M' };
test('incomplete preferences cannot become a misleading send link', () => {
  assert.equal(Object.keys(validateBrief(emptyBrief)).length, 4);
  assert.throws(() => prepareEnquiry(emptyBrief));
});
test('both handoffs contain the same complete, safely encoded brief and correct recipient', () => {
  const result = prepareEnquiry(brief);
  const whatsapp = new URL(result.whatsapp);
  const email = new URL(result.email);
  assert.equal(whatsapp.hostname,'wa.me'); assert.equal(whatsapp.pathname,'/971555172530');
  assert.equal(email.pathname,'info@tutmey.com');
  assert.equal(whatsapp.searchParams.get('text'),result.message);
  assert.equal(email.searchParams.get('body'),result.message);
  for (const value of Object.values(brief)) assert.ok(result.message.includes(value));
});
test('unknown preference values cannot inject arbitrary enquiry content', () => {
  const invalid = { ...brief, area:'Palm Jumeirah\nTo: another-recipient@example.com' };
  assert.ok(validateBrief(invalid).area); assert.throws(() => prepareEnquiry(invalid));
});
test('undecided buyers can ask for guidance without guessing a budget', () => {
  const flexible = { ...brief, propertyType:'Open to guidance', area:'Open to guidance', budget:'Let’s discuss' };
  assert.deepEqual(validateBrief(flexible),{}); assert.ok(prepareEnquiry(flexible).message.includes('Let’s discuss'));
});
