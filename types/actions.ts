import { AppError } from '@/lib/errors';

export type ActionResponse<T = unknown> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: AppError;
    };
