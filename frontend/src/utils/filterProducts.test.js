import { describe, expect, it } from 'vitest';
import { buildCompanyList } from './filterProducts.js';

describe('buildCompanyList', () => {
  it('returns All and unique companies', () => {
    const companies = buildCompanyList([
      { company: 'Toyota' },
      { company: 'Honda' },
      { company: 'Toyota' }
    ]);

    expect(companies).toEqual(['All', 'Toyota', 'Honda']);
  });
});
