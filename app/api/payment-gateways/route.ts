import { NextRequest, NextResponse } from 'next/server';
import { PaymentGateway, PaymentMethod } from '@/app/matricula/types/payment-integrations';
import { db } from '@/lib/db'; // TODO: Update to use centralized database client

/**
 * API para listar gateways de pagamento disponíveis
 * Retorna a lista de gateways configurados e disponíveis para uso
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check using main site's auth system
    // Authentication is now handled by the main site
    
    // Verificar gateways configurados no banco de dados
    const { data: configuredGateways, error } = await supabase
      .from('financial.payment_gateways')
      .select('*')
      .eq('active', true);
    
    if (error) {
      console.error('Erro ao buscar gateways de pagamento:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar gateways de pagamento' },
        { status: 500 }
      );
    }
    
    // Mapear gateways para formato de resposta
    const gateways = configuredGateways.map(gateway => ({
      id: gateway.id,
      name: gateway.name,
      code: gateway.code,
      logo: gateway.logo_url,
      methods: gateway.supported_methods,
      digitalWallets: gateway.digital_wallets,
      description: gateway.description,
      isDefault: gateway.is_default
    }));
    
    // Se não houver gateways configurados, retornar lista padrão
    if (gateways.length === 0) {
      return NextResponse.json({
        success: true,
        data: [
          {
            id: 'lytex',
            name: 'Lytex Pagamentos',
            code: PaymentGateway.LYTEX,
            logo: 'https://lytex.com.br/logo.png',
            methods: [
              PaymentMethod.CREDIT_CARD,
              PaymentMethod.BOLETO,
              PaymentMethod.PIX
            ],
            digitalWallets: [],
            description: 'Gateway de pagamento principal',
            isDefault: true
          },
          {
            id: 'mercadopago',
            name: 'Mercado Pago',
            code: PaymentGateway.MERCADOPAGO,
            logo: 'https://www.mercadopago.com.br/logo.png',
            methods: [
              PaymentMethod.CREDIT_CARD,
              PaymentMethod.BOLETO,
              PaymentMethod.PIX,
              PaymentMethod.DIGITAL_WALLET
            ],
            digitalWallets: ['mercadopago_wallet'],
            description: 'Integração com Mercado Pago',
            isDefault: false
          }
        ]
      });
    }
    
    return NextResponse.json({
      success: true,
      data: gateways
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
 * API para configurar um novo gateway de pagamento
 * Permite adicionar ou atualizar configurações de gateway
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check using main site's auth system
    // Authentication is now handled by the main site
    
    // Obter dados da requisição
    const body = await request.json();
    
    // Validar dados
    if (!body.name || !body.code) {
      return NextResponse.json(
        { error: 'Dados incompletos. Nome e código são obrigatórios.' },
        { status: 400 }
      );
    }
    
    // Verificar se gateway já existe
    const { data: existingGateway } = await supabase
      .from('financial.payment_gateways')
      .select('id')
      .eq('code', body.code)
      .maybeSingle();
    
    let result;
    
    if (existingGateway) {
      // Atualizar gateway existente
      const { data, error } = await supabase
        .from('financial.payment_gateways')
        .update({
          name: body.name,
          logo_url: body.logo,
          supported_methods: body.methods,
          digital_wallets: body.digitalWallets,
          description: body.description,
          is_default: body.isDefault || false,
          config: body.config,
          active: body.active !== undefined ? body.active : true,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingGateway.id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar gateway de pagamento:', error);
        return NextResponse.json(
          { error: 'Erro ao atualizar gateway de pagamento' },
          { status: 500 }
        );
      }
      
      result = data;
    } else {
      // Criar novo gateway
      const { data, error } = await supabase
        .from('financial.payment_gateways')
        .insert({
          name: body.name,
          code: body.code,
          logo_url: body.logo,
          supported_methods: body.methods,
          digital_wallets: body.digitalWallets,
          description: body.description,
          is_default: body.isDefault || false,
          config: body.config,
          active: body.active !== undefined ? body.active : true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar gateway de pagamento:', error);
        return NextResponse.json(
          { error: 'Erro ao criar gateway de pagamento' },
          { status: 500 }
        );
      }
      
      result = data;
    }
    
    // Se este gateway for definido como padrão, atualizar outros gateways
    if (body.isDefault) {
      await supabase
        .from('financial.payment_gateways')
        .update({ is_default: false })
        .neq('id', result.id);
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: result.id,
        name: result.name,
        code: result.code,
        logo: result.logo_url,
        methods: result.supported_methods,
        digitalWallets: result.digital_wallets,
        description: result.description,
        isDefault: result.is_default,
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
