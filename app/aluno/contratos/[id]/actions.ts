'use server'

export async function getContratoData(id: string) {
  // Mock data for static generation
  return {
    contrato: {
      id: id,
      status: 'Pendente',
      data_emissao: new Date().toISOString(),
      arquivo_url: '#'
    },
    matricula: {
      id: '123',
      curso_nome: 'Desenvolvimento Web Full Stack',
      valor_total: 12000,
      data_inicio: new Date().toISOString(),
      data_termino: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString()
    }
  };
}
