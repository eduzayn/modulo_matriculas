'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface UseMatriculaNotificationsProps {
  matriculaId: string;
}

export function useMatriculaNotifications({ matriculaId }: UseMatriculaNotificationsProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchNotifications() {
      try {
        setIsLoading(true);
        setError(null);

        // Em uma implementação real, isso buscaria as notificações do backend
        // Por enquanto, usamos dados simulados
        const response = await fetch(`/api/matricula/${matriculaId}/notifications`);
        
        if (!response.ok) {
          throw new Error('Falha ao buscar notificações');
        }
        
        const data = await response.json();
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error('Erro ao buscar notificações:', err);
        setError('Não foi possível carregar as notificações');
      } finally {
        setIsLoading(false);
      }
    }

    if (matriculaId) {
      fetchNotifications();
    }
  }, [matriculaId]);

  const sendNotification = async (
    eventType: string,
    channel: 'email' | 'sms' | 'whatsapp',
    metadata?: Record<string, any>
  ) => {
    try {
      // Em uma implementação real, isso enviaria a notificação através do backend
      const response = await fetch(`/api/matricula/${matriculaId}/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: eventType,
          channel,
          metadata,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar notificação');
      }

      const result = await response.json();
      
      // Atualizar a lista de notificações
      setNotifications((prev) => [result.notification, ...prev]);
      
      toast({
        title: 'Notificação enviada',
        description: `A notificação foi enviada com sucesso por ${channel}.`,
      });
      
      return true;
    } catch (err) {
      console.error('Erro ao enviar notificação:', err);
      
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a notificação.',
        variant: 'destructive',
      });
      
      return false;
    }
  };

  const resendNotification = async (notificationId: string) => {
    try {
      // Em uma implementação real, isso reenviaria a notificação através do backend
      const response = await fetch(`/api/matricula/notifications/${notificationId}/resend`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Falha ao reenviar notificação');
      }

      const result = await response.json();
      
      // Atualizar a notificação na lista
      setNotifications((prev) => 
        prev.map((notification) => 
          notification.id === notificationId ? result.notification : notification
        )
      );
      
      toast({
        title: 'Notificação reenviada',
        description: 'A notificação foi reenviada com sucesso.',
      });
      
      return true;
    } catch (err) {
      console.error('Erro ao reenviar notificação:', err);
      
      toast({
        title: 'Erro',
        description: 'Não foi possível reenviar a notificação.',
        variant: 'destructive',
      });
      
      return false;
    }
  };

  return {
    notifications,
    isLoading,
    error,
    sendNotification,
    resendNotification,
  };
}
