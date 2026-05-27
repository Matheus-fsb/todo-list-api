import { describe, expect, it } from '@jest/globals';
import { errorResponse, successResponse } from '../src/utils/apiResponse.js';

describe('api response helpers', () => {
  it('creates a success response without data', () => {
    expect(successResponse('OK')).toEqual({ success: true, message: 'OK' });
  });

  it('creates a success response with data', () => {
    expect(successResponse('Created', { id: '1' })).toEqual({
      success: true,
      message: 'Created',
      data: { id: '1' },
    });
  });

  it('creates an error response with errors', () => {
    expect(errorResponse('Validation error', [{ path: 'email' }])).toEqual({
      success: false,
      message: 'Validation error',
      errors: [{ path: 'email' }],
    });
  });
});
