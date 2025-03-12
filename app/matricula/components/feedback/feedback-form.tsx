'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FeedbackType, SatisfactionLevel } from '@/app/matricula/lib/services/feedback-service';
import { Button } from '@/app/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { toast } from '@/components/ui/use-toast';

// Schema para validação do formulário
const feedbackFormSchema = z.object({
  type: z.enum([
    FeedbackType.BUG,
    FeedbackType.FEATURE_REQUEST,
    FeedbackType.USABILITY,
    FeedbackType.PERFORMANCE,
    FeedbackType.GENERAL
  ]),
  message: z.string().min(10, {
    message: 'A mensagem deve ter pelo menos 10 caracteres'
  }).max(1000, {
    message: 'A mensagem deve ter no máximo 1000 caracteres'
  }),
  satisfactionLevel: z.nativeEnum(SatisfactionLevel).optional(),
  module: z.string(),
  feature: z.string().optional()
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

interface FeedbackFormProps {
  defaultModule?: string;
  defaultFeature?: string;
  onSuccess?: () => void;
}

export function FeedbackForm({ defaultModule = 'financeiro', defaultFeature, onSuccess }: FeedbackFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      type: FeedbackType.GENERAL,
      message: '',
      module: defaultModule,
      feature: defaultFeature
    }
  });
  
  async function onSubmit(data: FeedbackFormValues) {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro ao enviar feedback');
      }
      
      toast({
        title: 'Feedback enviado com sucesso!',
        description: 'Agradecemos por compartilhar sua opinião.',
        variant: 'default'
      });
      
      // Limpar formulário
      form.reset({
        type: FeedbackType.GENERAL,
        message: '',
        module: defaultModule,
        feature: defaultFeature
      });
      
      // Callback de sucesso
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      
      toast({
        title: 'Erro ao enviar feedback',
        description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Envie seu feedback</CardTitle>
        <CardDescription>
          Sua opinião é importante para melhorarmos continuamente o sistema.
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de feedback</Label>
            <Select
              defaultValue={form.getValues().type}
              onValueChange={(value) => form.setValue('type', value as FeedbackType)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Selecione o tipo de feedback" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={FeedbackType.BUG}>Reportar um problema</SelectItem>
                <SelectItem value={FeedbackType.FEATURE_REQUEST}>Sugerir uma funcionalidade</SelectItem>
                <SelectItem value={FeedbackType.USABILITY}>Feedback sobre usabilidade</SelectItem>
                <SelectItem value={FeedbackType.PERFORMANCE}>Feedback sobre desempenho</SelectItem>
                <SelectItem value={FeedbackType.GENERAL}>Feedback geral</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.type && (
              <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              placeholder="Descreva seu feedback em detalhes..."
              rows={5}
              {...form.register('message')}
            />
            {form.formState.errors.message && (
              <p className="text-sm text-red-500">{form.formState.errors.message.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="satisfactionLevel">Nível de satisfação</Label>
            <Select
              defaultValue={form.getValues().satisfactionLevel?.toString()}
              onValueChange={(value) => form.setValue('satisfactionLevel', parseInt(value) as SatisfactionLevel)}
            >
              <SelectTrigger id="satisfactionLevel">
                <SelectValue placeholder="Selecione seu nível de satisfação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SatisfactionLevel.VERY_DISSATISFIED.toString()}>Muito insatisfeito</SelectItem>
                <SelectItem value={SatisfactionLevel.DISSATISFIED.toString()}>Insatisfeito</SelectItem>
                <SelectItem value={SatisfactionLevel.NEUTRAL.toString()}>Neutro</SelectItem>
                <SelectItem value={SatisfactionLevel.SATISFIED.toString()}>Satisfeito</SelectItem>
                <SelectItem value={SatisfactionLevel.VERY_SATISFIED.toString()}>Muito satisfeito</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="module">Módulo</Label>
            <Input
              id="module"
              placeholder="Ex: financeiro, matrícula, etc."
              {...form.register('module')}
            />
            {form.formState.errors.module && (
              <p className="text-sm text-red-500">{form.formState.errors.module.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feature">Funcionalidade (opcional)</Label>
            <Input
              id="feature"
              placeholder="Ex: dashboard, pagamentos, etc."
              {...form.register('feature')}
            />
            {form.formState.errors.feature && (
              <p className="text-sm text-red-500">{form.formState.errors.feature.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar feedback'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default FeedbackForm;
