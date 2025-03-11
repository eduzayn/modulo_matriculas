'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { useAuth } from '../context/auth-context';

const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    setError(null);

    const { error } = await resetPassword(data.email);

    if (error) {
      setError('Erro ao enviar email de recuperação. Tente novamente.');
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Email Enviado</h1>
          <p className="text-gray-500">
            Enviamos um email com instruções para redefinir sua senha. Por favor, verifique sua caixa de entrada.
          </p>
        </div>
        <Link href="/auth/login">
          <Button variant="default" className="w-full">
            Voltar para Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Recuperar Senha</h1>
        <p className="text-gray-500">
          Digite seu email e enviaremos instruções para redefinir sua senha
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        {error && (
          <div className="p-3 bg-red-100 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <Button
          type="submit"
          variant="default"
          className="w-full mt-4"
          disabled={isLoading}
        >
          {isLoading ? 'Enviando...' : 'Enviar Instruções'}
        </Button>
      </form>
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Lembrou sua senha?{' '}
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            Voltar para Login
          </Link>
        </p>
      </div>
    </div>
  );
}
