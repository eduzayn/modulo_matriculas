-- Create email_templates table
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  category VARCHAR(50) DEFAULT 'general'
);

-- Create email_logs table for tracking sent emails
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content_preview TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status VARCHAR(50) DEFAULT 'sent',
  template_id UUID REFERENCES public.email_templates(id),
  error_message TEXT
);

-- Create default email templates
INSERT INTO public.email_templates (name, subject, content, category)
VALUES
  (
    'welcome_email',
    'Bem-vindo à Edunéxia',
    '<h1>Bem-vindo à Edunéxia!</h1><p>Olá {{name}},</p><p>Estamos felizes em tê-lo conosco. Sua matrícula foi criada com sucesso.</p><p>Número da matrícula: {{enrollment_id}}</p><p>Curso: {{course_name}}</p><p>Para acessar sua área do aluno, <a href="{{login_url}}">clique aqui</a>.</p><p>Atenciosamente,<br>Equipe Edunéxia</p>',
    'matricula'
  ),
  (
    'document_approval',
    'Documentos Aprovados - Edunéxia',
    '<h1>Seus documentos foram aprovados!</h1><p>Olá {{name}},</p><p>Temos o prazer de informar que seus documentos foram analisados e aprovados.</p><p>Próximos passos:</p><ol><li>Assinar o contrato</li><li>Efetuar o pagamento</li><li>Acessar o ambiente virtual</li></ol><p>Para continuar o processo, <a href="{{next_steps_url}}">clique aqui</a>.</p><p>Atenciosamente,<br>Equipe Edunéxia</p>',
    'matricula'
  ),
  (
    'payment_confirmation',
    'Confirmação de Pagamento - Edunéxia',
    '<h1>Pagamento Confirmado</h1><p>Olá {{name}},</p><p>Seu pagamento no valor de R$ {{amount}} foi confirmado com sucesso.</p><p>Detalhes do pagamento:</p><ul><li>Data: {{payment_date}}</li><li>Método: {{payment_method}}</li><li>Referência: {{reference}}</li></ul><p>Para acessar seu comprovante, <a href="{{receipt_url}}">clique aqui</a>.</p><p>Atenciosamente,<br>Equipe Edunéxia</p>',
    'financeiro'
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for email_templates
CREATE TRIGGER update_email_templates_updated_at
BEFORE UPDATE ON public.email_templates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for email_templates
CREATE POLICY "Allow read access to email_templates for authenticated users"
  ON public.email_templates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert/update/delete access to email_templates for admin users only"
  ON public.email_templates
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM public.admin_users
  ));

-- Create policies for email_logs
CREATE POLICY "Allow read access to email_logs for authenticated users"
  ON public.email_logs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert access to email_logs for authenticated users"
  ON public.email_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
