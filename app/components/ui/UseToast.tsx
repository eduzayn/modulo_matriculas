'use client';

import { useState, useEffect } from 'react';

type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
};

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prevToasts) => prevToasts.slice(1));
      }, toasts[0].duration || 3000);
      
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const toast = (props: ToastProps | string) => {
    if (typeof props === 'string') {
      setToasts((prevToasts) => [...prevToasts, { message: props, duration: 3000 }]);
    } else {
      setToasts((prevToasts) => [...prevToasts, { ...props, duration: props.duration || 3000 }]);
    }
  };

  return { toast, toasts };
};

export const Toaster = () => {
  const { toasts } = useToast();
  
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast, index) => {
        const bgColor = 
          toast.type === 'success' ? 'bg-green-500' :
          toast.type === 'error' ? 'bg-red-500' :
          toast.type === 'warning' ? 'bg-yellow-500' :
          'bg-blue-500';
        
        return (
          <div 
            key={index}
            className={`${bgColor} text-white px-4 py-2 rounded shadow-lg max-w-xs animate-fade-in`}
          >
            {toast.message}
          </div>
        );
      })}
    </div>
  );
};
