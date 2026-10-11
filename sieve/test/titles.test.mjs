import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseTitle, titleKey } from '../extension/lib/titles.js';

test('parseTitle handles plain, year, season, suffix and trailer forms', () => {
  assert.deepEqual(parseTitle('Inception'), { title: 'Inception', year: null, kind: null });
  assert.deepEqual(parseTitle('Inception (2010)'), { title: 'Inception', year: 2010, kind: null });
  assert.deepEqual(parseTitle('Stranger Things - Season 4'), { title: 'Stranger Things', year: null, kind: 'series' });
  assert.deepEqual(parseTitle('Stranger Things: Season 4 (2022)'), { title: 'Stranger Things', year: 2022, kind: 'series' });
  assert.deepEqual(parseTitle('Watch The Boys | Prime Video'), { title: 'The Boys', year: null, kind: null });
  assert.deepEqual(parseTitle('Dune: Part Two - Official Trailer'), { title: 'Dune: Part Two', year: null, kind: null });
  assert.deepEqual(parseTitle('Loki - Season 2 - Official Trailer'), { title: 'Loki', year: null, kind: 'series' });
  assert.deepEqual(parseTitle('Beef: Limited Series'), { title: 'Beef', year: null, kind: 'series' });
  assert.deepEqual(parseTitle('  Oppenheimer   (Trailer) '), { title: 'Oppenheimer', year: null, kind: null });
});

test('parseTitle leaves YouTube-style titles alone', () => {
  assert.equal(parseTitle('Fortnite chapter 7 gameplay').title, 'Fortnite chapter 7 gameplay');
  assert.equal(parseTitle('Part 2 of my finance journey').title, 'Part 2 of my finance journey');
  assert.deepEqual(parseTitle('Loki (Season 2)'), { title: 'Loki', year: null, kind: 'series' });
  assert.deepEqual(parseTitle('The Bear | Season 3 | Official Trailer'), { title: 'The Bear', year: null, kind: 'series' });
});

test('parseTitle keeps numbered titles intact', () => {
  assert.equal(parseTitle('Ocean\'s 11').title, "Ocean's 11");
  assert.equal(parseTitle('1917').title, '1917');
  assert.equal(parseTitle('3 Idiots').title, '3 Idiots');
});

test('titleKey normalizes and appends year', () => {
  assert.equal(titleKey('The Dark Knight', 2008), 'the dark knight|2008');
  assert.equal(titleKey('Amélie', null), 'amelie');
});
