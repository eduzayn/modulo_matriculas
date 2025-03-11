import React from 'react';
import { UpdatePasswordForm } from '../../components/update-password-form';
import Link from 'next/link';

export default function UpdatePasswordPage() {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-blue-500">Edunéxia</h1>
          </div>
          <UpdatePasswordForm />
        </div>
      </div>
      <div
        className="hidden lg:flex flex-col justify-center items-center w-1/2 p-8 text-white bg-gradient-to-r from-blue-500 to-blue-600"
      >
        <div className="max-w-lg text-center">
          <h1 className="text-4xl font-bold mb-4">Redefinir Senha</h1>
          <p className="text-xl">
            Crie uma nova senha segura para sua conta e mantenha seus dados protegidos.
          </p>
        </div>
      </div>
    </div>
  );
}
