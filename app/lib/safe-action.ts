import { createSafeActionClient } from 'next-safe-action';

export class ActionError extends Error {}

export const action = createSafeActionClient({
  handleServerError: (error) => {
    if (error instanceof ActionError) {
      return error.message;
    }
    return 'Erro interno do servidor';
  },
}); 