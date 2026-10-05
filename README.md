<div align="center">

# 💬 Confy WhatsApp
### Plataforma Profissional de Atendimento Omnichannel, Chatbot e Gateway de WhatsApp

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Sistema completo de atendimento humanizado com painel estilo WhatsApp Web, filas de espera, roteamento por departamentos, métricas de CSAT, disparos em massa com cadência inteligente e integração via Webhooks.**

</div>

---

## 🌟 Principais Recursos

- **📱 Atendimento Multiatendente Estilo WhatsApp Web**: Interface dark nativa rápida, intuitiva, com suporte a áudios, imagens, vídeos, documentos, respostas citadas e notas internas da equipe.
- **🏢 Gestão de Setores & Filas (Triagem)**: Distribuição automática de conversas para departamentos (Suporte, Comercial, Financeiro) e atendentes responsáveis.
- **⭐ Pesquisas de Satisfação CSAT & Relatórios**: Monitoramento do tempo de resposta, resolução e nota média de satisfação dos clientes após o encerramento do ticket.
- **⚡ Respostas Rápidas**: Atalhos de teclado (`/atalho`) para respostas ágeis de mensagens frequentes.
- **🏷️ Etiquetas & CRM Integrado**: Categorização de contatos com campos contratuais, plano, observações comerciais e dados do cliente.
- **📢 Disparos em Massa com Fila Persistente**: Envio em lote com controle seguro de cadência anti-bloqueio.
- **🛡️ Proteção Anti-Ban Inteligente**: Atrasos humanizados aleatórios entre disparos para manter sua conta segura.
- **🤖 Automação & Respostas por Gatilhos**: Respostas automáticas configuráveis baseadas em palavras-chave.
- **🔗 Webhooks em Tempo Real**: Notificações automáticas para integração com CRMs e plataformas externas.

---

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 20+ (Node.js 22 recomendado)
- Banco de Dados MySQL ou PostgreSQL
- Git e PM2

### Instalação

```bash
# 1. Instalar as dependências
npm install

# 2. Configurar as variáveis de ambiente
cp .env.example .env

# 3. Aplicar as migrações do banco de dados
npm run db:push

# 4. Criar o usuário administrador inicial
npm run make-admin admin@seudominio.com suasenha123
```

### Executar em Desenvolvimento

```bash
npm run dev
```

### Executar em Produção com PM2

```bash
# Compilar e iniciar
npm run build
pm2 start ecosystem.config.js
```

---

<div align="center">
  Confy WhatsApp • Todos os direitos reservados.
</div>
