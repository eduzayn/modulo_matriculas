import { MatriculaStatus, DocumentoStatus, AssinaturaStatus, FormaPagamento } from '@/app/(matricula)/types/matricula';
import { matriculaRoutes } from '@/app/(matricula)/routes';

// Exportar tipos
export {
  MatriculaStatus,
  DocumentoStatus,
  AssinaturaStatus,
  FormaPagamento,
};

// Exportar rotas
export { matriculaRoutes };

// Exportar constantes
export const DOCUMENTOS_OBRIGATORIOS = [
  { id: 'rg', nome: 'RG', obrigatorio: true },
  { id: 'cpf', nome: 'CPF', obrigatorio: true },
  { id: 'historico_escolar', nome: 'Histórico Escolar', obrigatorio: true },
  { id: 'diploma', nome: 'Diploma', obrigatorio: false },
  { id: 'comprovante_residencia', nome: 'Comprovante de Residência', obrigatorio: true },
  { id: 'foto', nome: 'Foto', obrigatorio: true },
];

export const FORMAS_PAGAMENTO = [
  { id: FormaPagamento.BOLETO, nome: 'Boleto Bancário' },
  { id: FormaPagamento.CARTAO_CREDITO, nome: 'Cartão de Crédito' },
  { id: FormaPagamento.PIX, nome: 'PIX' },
  { id: FormaPagamento.TRANSFERENCIA, nome: 'Transferência Bancária' },
];

export const STATUS_MATRICULA = [
  { id: MatriculaStatus.PENDENTE, nome: 'Pendente', cor: 'bg-yellow-100 text-yellow-800' },
  { id: MatriculaStatus.APROVADO, nome: 'Aprovado', cor: 'bg-blue-100 text-blue-800' },
  { id: MatriculaStatus.REJEITADO, nome: 'Rejeitado', cor: 'bg-red-100 text-red-800' },
  { id: MatriculaStatus.ATIVO, nome: 'Ativo', cor: 'bg-green-100 text-green-800' },
  { id: MatriculaStatus.TRANCADO, nome: 'Trancado', cor: 'bg-purple-100 text-purple-800' },
  { id: MatriculaStatus.CANCELADO, nome: 'Cancelado', cor: 'bg-red-100 text-red-800' },
  { id: MatriculaStatus.CONCLUIDO, nome: 'Concluído', cor: 'bg-green-100 text-green-800' },
];

export const STATUS_DOCUMENTO = [
  { id: DocumentoStatus.PENDENTE, nome: 'Pendente', cor: 'bg-yellow-100 text-yellow-800' },
  { id: DocumentoStatus.APROVADO, nome: 'Aprovado', cor: 'bg-green-100 text-green-800' },
  { id: DocumentoStatus.REJEITADO, nome: 'Rejeitado', cor: 'bg-red-100 text-red-800' },
];

// Exportar funções utilitárias
export function getStatusMatriculaLabel(status: MatriculaStatus): string {
  const statusObj = STATUS_MATRICULA.find(s => s.id === status);
  return statusObj ? statusObj.nome : status;
}

export function getStatusDocumentoLabel(status: DocumentoStatus): string {
  const statusObj = STATUS_DOCUMENTO.find(s => s.id === status);
  return statusObj ? statusObj.nome : status;
}

export function getFormaPagamentoLabel(formaPagamento: FormaPagamento): string {
  const formaPagamentoObj = FORMAS_PAGAMENTO.find(f => f.id === formaPagamento);
  return formaPagamentoObj ? formaPagamentoObj.nome : formaPagamento;
}

// Exportar configurações do módulo
export const matriculaModuleConfig = {
  name: 'Matrículas',
  description: 'Gerenciamento de matrículas de alunos',
  icon: 'FileText',
  routes: matriculaRoutes,
  permissions: {
    view: ['admin', 'secretary'],
    create: ['admin', 'secretary'],
    edit: ['admin', 'secretary'],
    delete: ['admin'],
  },
};

// Exportar integrações
export const matriculaIntegrations = {
  financeiro: {
    geracaoBoletos: true,
    controlePagamentos: true,
    acordosFinanceiros: true,
  },
  academico: {
    alocacaoTurmas: true,
    controleVagas: true,
    gradeCurricular: true,
  },
  comunicacao: {
    notificacoes: true,
    emailsAutomaticos: true,
    sms: true,
  },
};

// Exportar módulo
export default {
  config: matriculaModuleConfig,
  routes: matriculaRoutes,
  integrations: matriculaIntegrations,
};
