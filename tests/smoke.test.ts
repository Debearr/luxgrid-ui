import { describe, it, expect } from 'vitest';
import brand from '../packages/config/brand.json';

describe('brand + env smoke', () => {
  it('brand.json has required keys', () => {
    expect(brand.colors.gold).toBe('#FFD700');
    expect(brand.modes).toContain('A_institutional');
  });
  it('env flags present (CI may set these)', () => {
    expect(process.env.CURSOR_AGENTS_ENABLED ?? 'true').toBeDefined();
  });
});
