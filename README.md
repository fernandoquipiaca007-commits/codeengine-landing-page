# Codeengine — Landing Page & Site Institucional

Landing page oficial de alta conversão da **Codeengine**, especializada em Gestão de Tráfego Pago, Montagem de Funil de Palestras, Criação de Landing Pages, Edição de Vídeos Estratégicos e Soluções 360° de Marketing.

---

## ⚡ Integração em Tempo Real com o Sistema de Gestão

Este site está conectado diretamente ao Supabase compartilhado do sistema de gestão:
- **Cadastro Automático de Leads**: Visitantes que preenchem o formulário são cadastrados instantaneamente na tabela `clients`.
- **Notificações em Tempo Real**: Um alerta com severidade `high` é enviado para o painel de notificações do sistema de gestão.
- **Redirecionamento Inteligente para WhatsApp**: O lead é encaminhado com a mensagem formatada para o WhatsApp oficial (+244 957 459 336).

---

## 🚀 Como Fazer o Deploy na Vercel

1. Importe este repositório no seu painel da [Vercel](https://vercel.com).
2. Configure as seguintes **Environment Variables**:
   - `VITE_SUPABASE_URL`: `https://ixwcdkkskhcmwdopexwt.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `sb_publishable_PcHTPrXgoKsYikSqdzUYPQ_YjElfxwh`
   - `VITE_AGENCY_NAME`: `Codeengine`
   - `VITE_AGENCY_WHATSAPP`: `+244957459336`
   - `VITE_AGENCY_EMAIL`: `contato@codeengine1.com`
   - `VITE_MANAGEMENT_URL`: `https://gestao.codeengine1.com`
3. Clique em **Deploy**.
4. Vincule seu domínio personalizado nas configurações da Vercel (ex: `codeengine1.com`).

---

## 💻 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Rodar servidor local (porta 3001)
npm run dev

# Build de produção
npm run build
```
