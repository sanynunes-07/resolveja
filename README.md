# ResolveJá — MVP inicial

Aplicativo web responsivo e PWA para prototipar um marketplace local de serviços.

## O que funciona nesta versão
- Página inicial responsiva e categorias de serviços.
- Formulário de solicitação de orçamento.
- Lista de solicitações salvas no navegador.
- Formulário de interesse para profissionais.
- Perfis de demonstração claramente identificados.
- Manifest e service worker para instalação como PWA em ambientes compatíveis.
- Layouts para celular e computador.

## Limitações importantes
Esta é uma primeira versão local, sem backend. Solicitações e interesses são armazenados no `localStorage` do navegador e não são enviados pela internet. Outros usuários e dispositivos não veem esses dados. Os perfis são demonstrativos, não prestadores reais. Não há autenticação real, mensagens, propostas online compartilhadas, pagamentos ou painel administrativo conectado.

## Como abrir
1. Extraia o ZIP.
2. Para uma prévia simples, abra `index.html` em um navegador.
3. Para testar instalação PWA, publique os arquivos em um host HTTPS ou execute um servidor local, pois service workers normalmente exigem HTTPS ou localhost.
4. Em desenvolvimento local com Python instalado, dentro desta pasta execute:
   `python -m http.server 8000`
   Depois abra `http://localhost:8000`.

## Como instalar
- Android/Chrome: abra a versão publicada em HTTPS e use o comando de instalação oferecido pelo navegador.
- iPhone/Safari: abra o site, toque em Compartilhar e escolha “Adicionar à Tela de Início”.
- A disponibilidade da instalação depende do navegador e da hospedagem.

## Próximas etapas para um serviço real
1. Criar um projeto de backend e banco de dados (por exemplo, Supabase ou Firebase).
2. Implementar autenticação e permissões seguras para clientes, profissionais e administradores.
3. Salvar pedidos, perfis e propostas no banco de dados compartilhado.
4. Implementar notificações e comunicação com consentimento.
5. Adicionar moderação, denúncias, política de privacidade e termos revisados.
6. Testar com profissionais reais em uma única cidade antes de expandir.

## Custos
Os arquivos são estáticos e não exigem APIs pagas. Hospedagem e banco de dados podem ter planos gratuitos, sujeitos a limites e mudanças. Domínio próprio, mensagens automáticas, pagamentos e publicação em lojas podem gerar custos adicionais.
