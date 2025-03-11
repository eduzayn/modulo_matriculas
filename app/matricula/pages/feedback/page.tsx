import { Metadata } from 'next';
import { FeedbackForm } from '@/app/matricula/components/feedback/feedback-form';

export const metadata: Metadata = {
  title: 'Feedback | Sistema de Matrículas',
  description: 'Envie seu feedback para melhorarmos o sistema'
};

export default function FeedbackPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Sua opinião é importante</h1>
          <p className="text-muted-foreground">
            Ajude-nos a melhorar o sistema compartilhando sua experiência e sugestões.
          </p>
        </div>
        
        <FeedbackForm />
        
        <div className="mt-8 text-center max-w-md">
          <h2 className="text-xl font-semibold mb-2">Como usamos seu feedback</h2>
          <p className="text-muted-foreground">
            Todos os feedbacks são analisados pela nossa equipe e utilizados para priorizar melhorias e correções.
            Estamos comprometidos em oferecer a melhor experiência possível para nossos usuários.
          </p>
        </div>
      </div>
    </div>
  );
}
