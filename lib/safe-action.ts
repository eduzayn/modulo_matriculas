'use server';

import { z } from 'zod';
import { AppError } from './errors';
import type { ActionResponse } from '../types/actions';

export function createSafeActionClient() {
  return {
    action: <TInput, TOutput>(
      schema: z.Schema<TInput>,
      handler: (input: TInput) => Promise<ActionResponse<TOutput>>
    ) => {
      return async (input: TInput): Promise<ActionResponse<TOutput>> => {
        try {
          // Validate input
          const validationResult = schema.safeParse(input);
          
          if (!validationResult.success) {
            return {
              success: false,
              error: new AppError('VALIDATION_ERROR', 'Validation failed' as any)
            };
          }
          
          // Call handler with validated input
          return await handler(validationResult.data);
        } catch (error) {
          if (error instanceof AppError) {
            return {
              success: false,
              error
            };
          }
          
          return {
            success: false,
            error: new AppError('UNEXPECTED_ERROR', 'An unexpected error occurred' as any)
          };
        }
      };
    }
  };
}

export const { action } = createSafeActionClient();
