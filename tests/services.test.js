import test from 'node:test';
import assert from 'node:assert/strict';
import {categories} from '../src/services/news-service.js';
test('ondersteunt alle negen nieuwsfilters',()=>assert.equal(categories.length,9));
