'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { assinarContrato } from '@/app/matricula/actions/matricula-actions';
// Simplified toast implementation
const useToast = () => {
  const toast = ({ title, description, variant }: { 
    title: string; 
    description: string; 
    variant?: 'default' | 'destructive' 
  }) => {
    console.log(`Toast: ${title} - ${description}`);
    alert(`${title}\n${description}`);
  };
  
  return { toast };
};

interface SignContractFormProps {
  contratoId: string;
}

export default function SignContractForm({ contratoId }: SignContractFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      toast({
        title: 'Termos não aceitos',
        description: 'Você precisa aceitar os termos para assinar o contrato',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await assinarContrato({ contrato_id: contratoId });
      
      if (result.data?.success) {
        toast({
          title: 'Contrato assinado com sucesso',
          description: 'Seu contrato foi assinado e sua matrícula foi ativada',
          variant: 'default',
        });
        
        // Recarregar a página para mostrar o status atualizado
        window.location.reload();
      } else {
        toast({
          title: 'Erro ao assinar contrato',
          description: result.serverError || 'Ocorreu um erro ao assinar o contrato',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro ao assinar contrato',
        description: 'Ocorreu um erro ao processar sua solicitação',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="terms"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="h-4 w-4 shrink-0 rounded-sm border border-gray-300"
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Aceito os termos e condições do contrato
          </label>
          <p className="text-sm text-neutral-500">
            Ao marcar esta caixa, você concorda com todos os termos e condições descritos no contrato.
          </p>
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting || !termsAccepted}
      >
        {isSubmitting ? 'Processando...' : 'Assinar Contrato'}
      </Button>
    </form>
  );
}
