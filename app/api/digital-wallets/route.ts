import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { DigitalWallet } from '@/app/matricula/types/payment-integrations';

/**
 * API para listar carteiras digitais disponíveis
 * Retorna a lista de carteiras digitais configuradas e disponíveis para uso
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    // Verificar carteiras digitais configuradas no banco de dados
    const { data: configuredWallets, error } = await supabase
      .from('financial.digital_wallets')
      .select('*')
      .eq('active', true);
    
    if (error) {
      console.error('Erro ao buscar carteiras digitais:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar carteiras digitais' },
        { status: 500 }
      );
    }
    
    // Mapear carteiras para formato de resposta
    const wallets = configuredWallets.map(wallet => ({
      id: wallet.id,
      name: wallet.name,
      code: wallet.code,
      logo: wallet.logo_url,
      description: wallet.description,
      supportedGateways: wallet.supported_gateways
    }));
    
    // Se não houver carteiras configuradas, retornar lista padrão
    if (wallets.length === 0) {
      return NextResponse.json({
        success: true,
        data: [
          {
            id: 'google_pay',
            name: 'Google Pay',
            code: DigitalWallet.GOOGLE_PAY,
            logo: 'https://www.gstatic.com/pay/logos/googlepay_mark.svg',
            description: 'Pagamento via Google Pay',
            supportedGateways: ['mercadopago', 'stripe']
          },
          {
            id: 'mercadopago_wallet',
            name: 'Carteira Mercado Pago',
            code: DigitalWallet.MERCADOPAGO_WALLET,
            logo: 'https://www.mercadopago.com.br/wallet-logo.png',
            description: 'Pagamento via carteira Mercado Pago',
            supportedGateways: ['mercadopago']
          },
          {
            id: 'picpay',
            name: 'PicPay',
            code: DigitalWallet.PICPAY,
            logo: 'https://www.picpay.com/logo.png',
            description: 'Pagamento via PicPay',
            supportedGateways: ['picpay']
          }
        ]
      });
    }
    
    return NextResponse.json({
      success: true,
      data: wallets
    });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

/**
 * API para configurar uma nova carteira digital
 * Permite adicionar ou atualizar configurações de carteira digital
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    // Obter dados da requisição
    const body = await request.json();
    
    // Validar dados
    if (!body.name || !body.code) {
      return NextResponse.json(
        { error: 'Dados incompletos. Nome e código são obrigatórios.' },
        { status: 400 }
      );
    }
    
    // Verificar se carteira já existe
    const { data: existingWallet } = await supabase
      .from('financial.digital_wallets')
      .select('id')
      .eq('code', body.code)
      .maybeSingle();
    
    let result;
    
    if (existingWallet) {
      // Atualizar carteira existente
      const { data, error } = await supabase
        .from('financial.digital_wallets')
        .update({
          name: body.name,
          logo_url: body.logo,
          description: body.description,
          supported_gateways: body.supportedGateways,
          config: body.config,
          active: body.active !== undefined ? body.active : true,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingWallet.id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar carteira digital:', error);
        return NextResponse.json(
          { error: 'Erro ao atualizar carteira digital' },
          { status: 500 }
        );
      }
      
      result = data;
    } else {
      // Criar nova carteira
      const { data, error } = await supabase
        .from('financial.digital_wallets')
        .insert({
          name: body.name,
          code: body.code,
          logo_url: body.logo,
          description: body.description,
          supported_gateways: body.supportedGateways,
          config: body.config,
          active: body.active !== undefined ? body.active : true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar carteira digital:', error);
        return NextResponse.json(
          { error: 'Erro ao criar carteira digital' },
          { status: 500 }
        );
      }
      
      result = data;
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: result.id,
        name: result.name,
        code: result.code,
        logo: result.logo_url,
        description: result.description,
        supportedGateways: result.supported_gateways,
        active: result.active
      }
    });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
