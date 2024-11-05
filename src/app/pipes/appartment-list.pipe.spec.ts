import { AppartmentListPipe } from './appartment-list.pipe';

describe('AppartmentListPipe', () => {
  let pipe: AppartmentListPipe;

  beforeEach(() => {
    pipe = new AppartmentListPipe();
  });

  it('should return the original array if no search string is provided', () => {
    const value = [
      { name: 'Apartment 1' },
      { name: 'Apartment 2' },
      { name: 'Apartment 3' },
    ];
    expect(pipe.transform(value)).toEqual(value);
  });

  it('should filter the array based on the search string', () => {
    const value = [
      { name: 'Apartment 1' },
      { name: 'Studio Apartment' },
      { name: 'Condo' },
    ];
    const searchString = 'Apartment';
    const result = [{ name: 'Apartment 1' }, { name: 'Studio Apartment' }];
    expect(pipe.transform(value, searchString)).toEqual(result);
  });

  it('should be case-insensitive', () => {
    const value = [
      { name: 'Apartment 1' },
      { name: 'Studio Apartment' },
      { name: 'Condo' },
    ];
    const searchString = 'apartment';
    const result = [{ name: 'Apartment 1' }, { name: 'Studio Apartment' }];
    expect(pipe.transform(value, searchString)).toEqual(result);
  });

  it('should return an empty array if no items match the search string', () => {
    const value = [
      { name: 'Apartment 1' },
      { name: 'Studio Apartment' },
      { name: 'Condo' },
    ];
    const searchString = 'Villa';
    expect(pipe.transform(value, searchString)).toEqual([]);
  });
});
