import { createClient } from '@supabase/supabase-js';
import { LeadSubmission, COUNTRIES } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ixwcdkkskhcmwdopexwt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_PcHTPrXgoKsYikSqdzUYPQ_YjElfxwh';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const AGENCY_CONFIG = {
  name: import.meta.env.VITE_AGENCY_NAME || 'Codeengine',
  whatsappRaw: import.meta.env.VITE_AGENCY_WHATSAPP || '+244957459336',
  whatsappDigits: (import.meta.env.VITE_AGENCY_WHATSAPP || '+244957459336').replace(/\D/g, ''),
  email: import.meta.env.VITE_AGENCY_EMAIL || 'contato@codeengine1.com',
  managementUrl: import.meta.env.VITE_MANAGEMENT_URL || 'https://gestao.codeengine1.com',
};

/**
 * Register lead as a new Client in the shared Supabase database
 * and creates a high-priority notification for the management team.
 */
export async function submitLeadToManagementSystem(lead: LeadSubmission): Promise<{ success: boolean; clientId?: string; error?: string }> {
  try {
    const clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const countryConfig = COUNTRIES[lead.country] || COUNTRIES.AO;
    const currency = countryConfig.defaultCurrency;

    // Combine primary service + additional services in notes
    const comboServices = [lead.service, ...lead.additionalServices].filter(Boolean).join(', ');
    const fullNotes = [
      `[LEAD CAPTADO VIA LANDING PAGE CODEENGINE]`,
      `🎯 Serviço Principal: ${lead.service}`,
      lead.additionalServices.length > 0 ? `📦 Serviços Combinados: ${lead.additionalServices.join(', ')}` : null,
      lead.budgetRange ? `💰 Faixa de Investimento: ${lead.budgetRange}` : null,
      lead.notes ? `📝 Mensagem do Cliente: ${lead.notes}` : null,
    ].filter(Boolean).join('\n');

    // 1. Try to find the company_id if multi-tenant exists, or fallback to null/default
    let companyId: string | null = null;
    try {
      const { data: compData } = await supabase.from('companies').select('id').limit(1);
      if (compData && compData.length > 0) {
        companyId = compData[0].id;
      }
    } catch {
      // ignore
    }

    // 2. Insert into clients table
    const clientPayload: Record<string, any> = {
      id: clientId,
      name: lead.name.trim(),
      company: lead.company?.trim() || '',
      whatsapp: lead.whatsapp.trim(),
      email: lead.email?.trim() || '',
      type: mapServiceToClientType(lead.service),
      country: lead.country,
      currency: currency,
      notes: fullNotes,
      created_at: new Date().toISOString(),
    };

    if (companyId) {
      clientPayload.company_id = companyId;
    }

    const { error: clientError } = await supabase.from('clients').insert([clientPayload]);
    if (clientError) {
      console.warn('[Supabase Sync] Direct insert failed, trying upsert...', clientError.message);
      // Attempt upsert without created_at if table schema is strict
      const { error: upsertErr } = await supabase.from('clients').upsert(clientPayload);
      if (upsertErr) {
        console.error('[Supabase Sync] Upsert failed:', upsertErr.message);
      }
    }

    // 3. Create high-priority notification in management notifications table
    const notifId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const notificationPayload: Record<string, any> = {
      id: notifId,
      type: 'new_lead',
      title: '🚀 Novo Lead Captado na Landing Page!',
      message: `${lead.name} (${lead.company || 'Pessoa Física'}) solicitou [${comboServices}]. WhatsApp: ${lead.whatsapp}`,
      date: new Date().toISOString().split('T')[0],
      client_id: clientId,
      whatsapp_message: `Olá ${lead.name}, recebemos sua solicitação para ${lead.service} na Codeengine!`,
      whatsapp_phone: lead.whatsapp,
      severity: 'high',
      read: false,
      created_at: new Date().toISOString(),
    };

    if (companyId) {
      notificationPayload.company_id = companyId;
    }

    try {
      await supabase.from('notifications').insert([notificationPayload]);
    } catch (notifErr) {
      console.warn('[Supabase Sync] Notification insert warn:', notifErr);
    }

    return { success: true, clientId };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Erro ao sincronizar lead';
    console.error('[Supabase Sync] Exception caught:', errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * Maps agency service to standard client types used in the management dashboard
 */
function mapServiceToClientType(service: string): string {
  if (service.toLowerCase().includes('tráfego') || service.toLowerCase().includes('campanha') || service.toLowerCase().includes('anúncio')) {
    return 'Tráfego Pago';
  }
  if (service.toLowerCase().includes('landing') || service.toLowerCase().includes('web') || service.toLowerCase().includes('crm')) {
    return 'Desenvolvimento';
  }
  if (service.toLowerCase().includes('consultoria') || service.toLowerCase().includes('marketing') || service.toLowerCase().includes('funil')) {
    return 'Consultoria';
  }
  return 'Outro';
}

/**
 * Generate formatted WhatsApp URL with pre-filled message
 */
export function buildWhatsAppLeadUrl(lead: LeadSubmission): string {
  const phone = AGENCY_CONFIG.whatsappDigits;
  const countryFlag = COUNTRIES[lead.country]?.flag || '🌍';
  
  const additional = lead.additionalServices.length > 0 
    ? `\n*Serviços adicionais:* ${lead.additionalServices.join(', ')}` 
    : '';
  
  const budget = lead.budgetRange 
    ? `\n*Investimento pretendido:* ${lead.budgetRange}` 
    : '';

  const companyText = lead.company ? ` da empresa *${lead.company}*` : '';
  const notesText = lead.notes ? `\n\n*Detalhes do meu projeto:* \n"${lead.notes}"` : '';

  const text = 
`Olá equipa da *${AGENCY_CONFIG.name}*! 👋

Meu nome é *${lead.name}*${companyText}.
Acabei de preencher o formulário no site e gostaria de agendar uma reunião estratégica.

📌 *Serviço Principal:* ${lead.service}${additional}
📍 *País / Região:* ${countryFlag} ${COUNTRIES[lead.country]?.name || lead.country}${budget}${notesText}

Aguardo o vosso retorno para conversarmos sobre a execução do projeto!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
