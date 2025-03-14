'use server'

export async function getContratoData(id) {
  try {
    // Mock data for development
    return {
      contrato: {
        id: id,
        status: 'Pendente',
        data_emissao: new Date().toISOString(),
        arquivo_url: '#',
      },
      matricula: {
        id: id,
        curso_nome: 'Desenvolvimento Web Full Stack',
        valor_total: 12000,
        data_inicio: new Date().toISOString(),
        data_termino: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
      }
    };
  } catch (error) {
    console.error('Error fetching contrato data:', error);
    return { error: 'Failed to load contract data' };
  }
}
