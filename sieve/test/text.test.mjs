import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, tokenize, stem, stems, hash, tokenSimilarity } from '../extension/lib/text.js';

test('normalize strips accents, punctuation and case', () => {
  assert.equal(normalize('  Café — “Finance” 101! '), 'cafe finance 101');
  assert.equal(normalize("Don't Stop"), 'dont stop');
  assert.equal(normalize('#Shorts @channel'), 'shorts channel');
});

test('tokenize splits on normalized whitespace', () => {
  assert.deepEqual(tokenize('Mutual Funds, SIP!'), ['mutual', 'funds', 'sip']);
  assert.deepEqual(tokenize(''), []);
});

test('stem maps inflections together without merging unrelated words', () => {
  assert.equal(stem('investing'), stem('invest'));
  assert.equal(stem('investors'), stem('investor'));
  assert.equal(stem('funds'), stem('fund'));
  assert.equal(stem('running'), 'run');
  assert.notEqual(stem('news'), stem('new'));
  assert.equal(stem('ai'), 'ai');
  assert.equal(stem('economics'), 'economic');
});

test('stems is tokenize + stem', () => {
  assert.deepEqual(stems('Investing in Index Funds'), ['invest', 'in', 'index', 'fund']);
});

test('hash is stable and 8 hex chars', () => {
  assert.equal(hash('abc'), hash('abc'));
  assert.notEqual(hash('abc'), hash('abd'));
  assert.match(hash('anything'), /^[0-9a-f]{8}$/);
});

test('tokenSimilarity', () => {
  assert.equal(tokenSimilarity('The Dark Knight', 'the dark knight'), 1);
  assert.ok(tokenSimilarity('Dark Knight Rises', 'The Dark Knight') > 0.5);
  assert.equal(tokenSimilarity('Inception', 'Interstellar'), 0);
});
