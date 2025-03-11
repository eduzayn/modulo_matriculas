'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function DebtNegotiationForm({ studentId, debts }) {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDebts, setSelectedDebts] = useState([]);
  const [negotiationTerms, setNegotiationTerms] = useState({
    valorOriginal: 0,
    valorNegociado: 0,
    numeroParcelas: 1,
    dataPrimeiraParcela: format(new Date(), 'yyyy-MM-dd'),
    observacoes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Função para selecionar/deselecionar dívidas
  const toggleDebtSelection = (debt) => {
    if (selectedDebts.some(d => d.id === debt.id)) {
      setSelectedDebts(selectedDebts.filter(d => d.id !== debt.id));
    } else {
      setSelectedDebts([...selectedDebts, debt]);
    }
  };

  // Função para atualizar termos de negociação
  const updateNegotiationTerms = (field, value) => {
    setNegotiationTerms({
      ...negotiationTerms,
      [field]: value
    });
  };

  // Função para calcular valor total das dívidas selecionadas
  const calculateTotalDebt = () => {
    return selectedDebts.reduce((total, debt) => total + debt.valor, 0);
  };

  // Função para avançar para próxima etapa
  const nextStep = () => {
    if (activeStep === 0 && selectedDebts.length === 0) {
      setError('Selecione pelo menos uma dívida para negociar');
      return;
    }

    if (activeStep === 1) {
      // Validar termos de negociação
      if (negotiationTerms.valorNegociado <= 0) {
        setError('O valor negociado deve ser maior que zero');
        return;
      }
      if (negotiationTerms.numeroParcelas <= 0) {
        setError('O número de parcelas deve ser maior que zero');
        return;
      }
    }

    setError(null);
    setActiveStep(activeStep + 1);
  };

  // Função para voltar para etapa anterior
  const prevStep = () => {
    setActiveStep(activeStep - 1);
  };

  // Função para submeter negociação
  const submitNegotiation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Aqui seria feita a chamada à API para registrar a negociação
      // Por enquanto, apenas simulamos o sucesso após um delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError('Erro ao processar negociação. Tente novamente.');
      setLoading(false);
    }
  };

  // Renderizar etapa de seleção de dívidas
  const renderDebtSelection = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Selecione as dívidas para negociação</h3>
        
        {debts && debts.length > 0 ? (
          <div className="space-y-2">
            {debts.map(debt => (
              <div 
                key={debt.id} 
                className={`p-4 border rounded-md cursor-pointer ${
                  selectedDebts.some(d => d.id === debt.id) 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`}
                onClick={() => toggleDebtSelection(debt)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Parcela {debt.numeroParcela}</p>
                    <p className="text-sm text-gray-500">Vencimento: {format(new Date(debt.dataVencimento), 'dd/MM/yyyy')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {debt.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <p className="text-xs text-red-500">
                      {debt.diasAtraso > 0 ? `${debt.diasAtraso} dias em atraso` : 'No prazo'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500">Nenhuma dívida encontrada para negociação</p>
        )}
        
        {selectedDebts.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between">
              <span className="font-medium">Total selecionado:</span>
              <span className="font-bold">
                {calculateTotalDebt().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Renderizar etapa de definição de termos
  const renderNegotiationTerms = () => {
    const totalDebt = calculateTotalDebt();
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Defina os termos da negociação</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor original
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
              value={totalDebt.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              disabled
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor negociado
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={negotiationTerms.valorNegociado}
              onChange={(e) => updateNegotiationTerms('valorNegociado', parseFloat(e.target.value))}
              min="0"
              step="0.01"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de parcelas
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={negotiationTerms.numeroParcelas}
              onChange={(e) => updateNegotiationTerms('numeroParcelas', parseInt(e.target.value))}
              min="1"
              max="36"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data da primeira parcela
            </label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={negotiationTerms.dataPrimeiraParcela}
              onChange={(e) => updateNegotiationTerms('dataPrimeiraParcela', e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observações
          </label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            value={negotiationTerms.observacoes}
            onChange={(e) => updateNegotiationTerms('observacoes', e.target.value)}
            rows={3}
          />
        </div>
        
        {negotiationTerms.valorNegociado > 0 && negotiationTerms.numeroParcelas > 0 && (
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Valor da parcela:</span>
              <span className="font-bold">
                {(negotiationTerms.valorNegociado / negotiationTerms.numeroParcelas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Desconto:</span>
              <span className={`font-bold ${totalDebt > negotiationTerms.valorNegociado ? 'text-green-600' : 'text-red-600'}`}>
                {totalDebt > negotiationTerms.valorNegociado 
                  ? `${((1 - negotiationTerms.valorNegociado / totalDebt) * 100).toFixed(2)}%`
                  : '0%'
                }
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Renderizar etapa de confirmação
  const renderConfirmation = () => {
    const totalDebt = calculateTotalDebt();
    const valorParcela = negotiationTerms.valorNegociado / negotiationTerms.numeroParcelas;
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Confirme os termos da negociação</h3>
        
        <div className="p-4 bg-gray-50 rounded-md space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">Dívidas selecionadas:</span>
            <span>{selectedDebts.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Valor original:</span>
            <span>{totalDebt.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Valor negociado:</span>
            <span>{negotiationTerms.valorNegociado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Desconto:</span>
            <span className="text-green-600">
              {totalDebt > negotiationTerms.valorNegociado 
                ? `${((1 - negotiationTerms.valorNegociado / totalDebt) * 100).toFixed(2)}%`
                : '0%'
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Número de parcelas:</span>
            <span>{negotiationTerms.numeroParcelas}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Valor da parcela:</span>
            <span>{valorParcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Data da primeira parcela:</span>
            <span>{format(new Date(negotiationTerms.dataPrimeiraParcela), 'dd/MM/yyyy')}</span>
          </div>
          {negotiationTerms.observacoes && (
            <div>
              <span className="font-medium block">Observações:</span>
              <p className="text-sm mt-1">{negotiationTerms.observacoes}</p>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            Ao confirmar esta negociação, um novo acordo será criado e as dívidas selecionadas serão marcadas como negociadas.
            Este processo não pode ser desfeito.
          </p>
        </div>
      </div>
    );
  };

  // Renderizar etapa de sucesso
  const renderSuccess = () => {
    return (
      <div className="text-center py-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Negociação realizada com sucesso!</h3>
        <p className="text-sm text-gray-500 mb-6">
          Um novo acordo foi criado e as dívidas selecionadas foram marcadas como negociadas.
        </p>
        <div className="flex justify-center">
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            onClick={() => window.location.reload()}
          >
            Voltar para Dívidas
          </button>
        </div>
      </div>
    );
  };

  // Renderizar conteúdo com base na etapa atual
  const renderStepContent = () => {
    if (success) {
      return renderSuccess();
    }
    
    switch (activeStep) {
      case 0:
        return renderDebtSelection();
      case 1:
        return renderNegotiationTerms();
      case 2:
        return renderConfirmation();
      default:
        return null;
    }
  };

  // Renderizar botões de navegação
  const renderNavigation = () => {
    if (success) {
      return null;
    }
    
    return (
      <div className="flex justify-between mt-6">
        {activeStep > 0 ? (
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            onClick={prevStep}
            disabled={loading}
          >
            Voltar
          </button>
        ) : (
          <div></div>
        )}
        
        {activeStep < 2 ? (
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            onClick={nextStep}
          >
            Continuar
          </button>
        ) : (
          <button
            type="button"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center"
            onClick={submitNegotiation}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </>
            ) : (
              'Confirmar Negociação'
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Indicador de progresso */}
      {!success && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {['Selecionar Dívidas', 'Definir Condições', 'Confirmar Negociação'].map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  index < activeStep ? 'bg-green-500' : 
                  index === activeStep ? 'bg-blue-500' : 'bg-gray-200'
                } text-white text-sm font-medium`}>
                  {index < activeStep ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`text-xs mt-1 ${
                  index <= activeStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-between">
              {[0, 1, 2].map((index) => (
                <div key={index} className={`w-1/3 ${
                  index < 2 ? 'border-t-2' : ''
                } ${
                  index < activeStep ? 'border-blue-500' : 'border-transparent'
                }`}></div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Mensagem de erro */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {/* Conteúdo da etapa atual */}
      {renderStepContent()}
      
      {/* Botões de navegação */}
      {renderNavigation()}
    </div>
  );
}

// Componente de exemplo para demonstração
export default function DebtNegotiationDemo() {
  // Dados de exemplo
  const studentId = '123';
  const mockDebts = [
    {
      id: '1',
      numeroParcela: 3,
      dataVencimento: '2025-01-15',
      valor: 750.00,
      diasAtraso: 55
    },
    {
      id: '2',
      numeroParcela: 4,
      dataVencimento: '2025-02-15',
      valor: 750.00,
      diasAtraso: 25
    },
    {
      id: '3',
      numeroParcela: 5,
      dataVencimento: '2025-03-15',
      valor: 750.00,
      diasAtraso: 0
    }
  ];
  
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Negociação de Dívidas</h2>
      <DebtNegotiationForm studentId={studentId} debts={mockDebts} />
    </div>
  );
}
