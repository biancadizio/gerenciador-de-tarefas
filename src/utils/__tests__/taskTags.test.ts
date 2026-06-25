import { formatTaskTags, parseTaskTags } from '../taskTags';

describe('task tags', () => {
  it('parses comma-separated tags', () => {
    expect(parseTaskTags('casa, estudos, urgente')).toEqual(['casa', 'estudos', 'urgente']);
  });

  it('trims whitespace and ignores empty tags', () => {
    expect(parseTaskTags(' casa, , estudos ,  ')).toEqual(['casa', 'estudos']);
  });

  it('removes duplicated tags ignoring case', () => {
    expect(parseTaskTags('Casa, casa, CASA, estudos')).toEqual(['Casa', 'estudos']);
  });

  it('formats tags for editing', () => {
    expect(formatTaskTags(['casa', 'estudos'])).toBe('casa, estudos');
  });

  it('formats missing tags as an empty input value', () => {
    expect(formatTaskTags()).toBe('');
  });
});
