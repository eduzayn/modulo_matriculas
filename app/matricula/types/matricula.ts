import { z } from 'zod';

// Enums
export enum MatriculaStatus {
  PENDENTE = 'pendente',
  APROVADO = 'aprovado',
  REJEITADO = 'rejeitado',
  ATIVO = 'ativo',
  TRANCADO = 'trancado',
  CANCELADO = 'cancelado',
  CONCLUIDO = 'concluido',
}

export enum DocumentoStatus {
  PENDENTE = 'pendente',
  APROVADO = 'aprovado',
  REJEITADO = 'rejeitado',
}

export enum AssinaturaStatus {
  PENDENTE = 'pendente',
  ASSINADO = 'assinado',
  EXPIRADO = 'expirado',
}

export enum FormaPagamento {
  CARTAO_CREDITO = 'cartao_credito',
  BOLETO = 'boleto',
  PIX = 'pix',
  TRANSFERENCIA = 'transferencia',
}

// Interfaces básicas
export interface PersonalData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  rg: string;
  dataNascimento: Date;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
}

export interface Document {
  id: string;
  tipo: string;
  nome: string;
  url: string;
  dataEnvio: Date;
  status: DocumentoStatus;
  observacoes?: string;
}

export interface CourseSelection {
  cursoId: string;
  cursoNome: string;
  turmaId?: string;
  turmaNome?: string;
  modalidade: 'presencial' | 'online' | 'hibrido';
  dataInicio: Date;
  cargaHoraria: number;
}

export interface Contract {
  id: string;
  titulo: string;
  versao: string;
  conteudo: string;
  dataGeracao: Date;
  url: string;
}

export interface Installment {
  numero: number;
  valor: number;
  dataVencimento: Date;
  status: 'pendente' | 'pago' | 'atrasado' | 'cancelado';
  formaPagamento?: FormaPagamento;
  dataPagamento?: Date;
  comprovante?: string;
}

export interface Discount {
  id: string;
  nome: string;
  tipo: 'percentual' | 'valor_fixo';
  valor: number;
  dataInicio: Date;
  dataFim?: Date;
  ativo: boolean;
  regras?: Record<string, any>;
}

export interface CheckList {
  items: Array<{
    id: string;
    nome: string;
    obrigatorio: boolean;
    status: 'pendente' | 'aprovado' | 'rejeitado';
  }>;
}

export interface ValidationStatus {
  status: 'pendente' | 'em_analise' | 'aprovado' | 'rejeitado';
  responsavel?: string;
  dataAnalise?: Date;
  observacoes?: string;
}

export interface RevisionHistory {
  id: string;
  data: Date;
  responsavel: string;
  acao: string;
  detalhes: Record<string, any>;
}

export interface Report {
  id: string;
  titulo: string;
  descricao: string;
  dados: any;
  filtros: Record<string, any>;
  dataGeracao: Date;
}

export interface Campaign {
  id: string;
  nome: string;
  descricao: string;
  dataInicio: Date;
  dataFim: Date;
  descontos: Discount[];
  regras: Record<string, any>;
  ativo: boolean;
}

export interface Scholarship {
  id: string;
  nome: string;
  descricao: string;
  percentualCobertura: number;
  criterios: string[];
  documentosNecessarios: string[];
  processo: Record<string, any>;
}

export interface ReferralProgram {
  id: string;
  nome: string;
  descricao: string;
  recompensaIndicador: Discount;
  recompensaIndicado: Discount;
  regras: Record<string, any>;
  ativo: boolean;
}

export interface FAQSection {
  categorias: Array<{
    id: string;
    nome: string;
    perguntas: Array<{
      id: string;
      pergunta: string;
      resposta: string;
    }>;
  }>;
}

// Interfaces principais do módulo
export interface MatriculaProcess {
  etapas: {
    preMatricula: {
      dadosPessoais: PersonalData;
      documentacao: Document[];
      curso: CourseSelection;
    };
    
    analiseDocumental: {
      status: DocumentoStatus;
      observacoes: string;
      documentosPendentes: string[];
    };
    
    contratoMatricula: {
      termos: Contract;
      assinaturaDigital: boolean;
      dataAceite: Date;
    };
    
    pagamento: {
      formasPagamento: FormaPagamento[];
      parcelas: Installment[];
      desconto: Discount;
    };
  };
}

export interface DocumentManagement {
  documentosObrigatorios: {
    rg: Document;
    cpf: Document;
    historicoEscolar: Document;
    diploma: Document;
    comprovanteResidencia: Document;
    foto: Document;
  };

  validacao: {
    checklistDocumentos: CheckList;
    statusValidacao: ValidationStatus;
    historicoRevisoes: RevisionHistory[];
  };
}

export interface AdminFeatures {
  gestao: {
    // Controle de matrículas
    controleMatriculas: {
      ativas: number;
      pendentes: number;
      canceladas: number;
      trancadas: number;
    };

    // Análise documental
    analiseDocumental: {
      filaAnalise: number;
      tempoMedioAnalise: string;
      taxaAprovacao: string;
    };

    // Relatórios
    relatorios: {
      matriculasPorPeriodo: Report;
      taxaConversao: Report;
      indicadoresFinanceiros: Report;
    };
  };
}

export interface Integrations {
  // Integrações com outros módulos
  integracoes: {
    financeiro: {
      geracaoBoletos: boolean;
      controlePagamentos: boolean;
      acordosFinanceiros: boolean;
    };
    
    academico: {
      alocacaoTurmas: boolean;
      controleVagas: boolean;
      gradeCurricular: boolean;
    };
    
    comunicacao: {
      notificacoes: boolean;
      emailsAutomaticos: boolean;
      sms: boolean;
    };
  };
}

export interface AutomatedNotifications {
  notificacoes: {
    documentosPendentes: 'email';
    aprovacaoMatricula: 'email' | 'sms';
    boletoPagamento: 'email';
    confirmacaoMatricula: 'email' | 'sms';
    lembreteDocumentos: 'whatsapp';
  };
}

export interface AutomatedValidations {
  validacoes: {
    documentosObrigatorios: boolean;
    dadosPessoais: boolean;
    requisitosAcademicos: boolean;
    situacaoFinanceira: boolean;
  };
}

export interface DiscountManagement {
  descontos: {
    convenios: Discount[];
    campanhas: Campaign[];
    bolsas: Scholarship[];
    programaIndicacao: ReferralProgram;
  };
}

export interface StudentSupport {
  suporte: {
    chatOnline: boolean;
    centralAjuda: boolean;
    atendimentoTelefonico: boolean;
    faq: FAQSection;
  };
}

export interface SecurityCompliance {
  seguranca: {
    criptografiaDados: boolean;
    assinaturaDigital: boolean;
    conformidadeLGPD: boolean;
    backupAutomatico: boolean;
  };
}

// Interface principal da matrícula
export interface Matricula {
  id: string;
  aluno_id: string;
  curso_id: string;
  status: MatriculaStatus;
  processo: MatriculaProcess;
  documentos: DocumentManagement;
  integracoes: Integrations;
  notificacoes: AutomatedNotifications;
  validacoes: AutomatedValidations;
  descontos: DiscountManagement;
  suporte: StudentSupport;
  seguranca: SecurityCompliance;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

// Interface para filtros de matrícula
export interface MatriculaFilters {
  search?: string;
  status?: MatriculaStatus;
  curso?: string;
  aluno?: string;
  dataInicio?: Date;
  dataFim?: Date;
}
