export const ESPEC_TEC = {
  meta: {
    versao: 'Novembro / 2025',
    consultoria: 'Q7 Ops',
    responsavel: 'Núcleo de Engenharia ÉPICO',
  },
  backendSupabase: {
    title: 'Backend — Supabase',
    specs: [
      'PostgreSQL (500 MB de armazenamento)',
      '2 GB/mês de transferência de dados',
      'Storage de arquivos (1 GB)',
      'Logs com rotatividade (50 MB)',
      'Autenticação nativa (usuário e senha) + tokens JWT',
      'API REST + GraphQL automáticas',
      'Tempo de resposta médio < 200 ms',
    ],
    limitacoes: [
      'Uptime médio > 99,5%',
      'Confira limitações no Relatório de Capacidade & Escalonamento',
      'Backup semanal'
    ],
    traducao: 'O Supabase é o cérebro do sistema — guarda os dados com segurança e responde rápido para o painel e automações.'
  },
  frontendVercel: {
    title: 'Frontend — Vercel',
    specs: [
      'CDN global (hospedagem distribuída)',
      'Build automático a cada atualização',
      'SSL grátis (HTTPS) incluído',
      '100 GB/mês de largura de banda',
      'Deploys automáticos e reversíveis',
    ],
    limitacoes: [
      'Confira limitações no Relatório de Capacidade & Escalonamento',
      'Recomendado até ~10 mil acessos mensais (acima disso, upgrade)'
    ],
    traducao: 'A Vercel é onde o painel vive. Garante que tudo esteja no ar, rápido e seguro, com atualizações automáticas.'
  },
  storageSupabase: {
    title: 'Armazenamento — Supabase Storage',
    specs: [
      '1 GB (expansível)',
      'Acesso controlado por políticas (JWT)',
      'Redundância em múltiplos data centers'
    ],
    traducao: 'Fotos e documentos ficam salvos com segurança, protegidos por login e cópias de segurança.'
  },
  sslFrontend: {
    title: 'Criptografia — SSL (Frontend)',
    specs: [
      'Conexão criptografada entre navegador e servidor',
      'Integridade e confidencialidade de dados em trânsito'
    ],
    traducao: 'A conexão é criptografada — o mesmo padrão usado por bancos e e‑commerce.'
  },
  securityBackend: {
    title: 'Segurança — Autenticação e Acesso',
    specs: [
      'Autenticação por usuário e senha + tokens JWT',
      'Níveis de permissão por usuário',
      'Expiração automática de tokens',
      'Logs de acesso e revisão semanal de permissões'
    ],
    traducao: 'Cada pessoa terá um login. Só quem tem permissão acessa e edita informações.'
  },
  contingencyVPS: {
    title: 'Infra de Contingência — VPS (Hostinger)',
    specs: [
      'Linux (2 vCPU / 4 GB RAM / 80 GB SSD) + Docker',
      'Backups automáticos diários e semanais',
      'SSL ativo e monitoramento 24/7',
      'Plano de migração emergencial (export Supabase → restore VPS)'
    ],
    traducao: 'Se a nuvem principal falhar, existe uma estrutura reserva pronta — a imobiliária não para.'
  },
  supportMaint: {
    title: 'Suporte, Manutenção e Atualizações',
    specs: [
      'Atualizações de segurança e correções de bugs vitalícios',
      'Manutenção preventiva mensal (logs, backups, SSL)',
      'Suporte técnico e resposta à incidentes vitalícios',
      'Migração de infraestrutura a qualquer momento, sem perda de dados',
      'Consultoria em desenvolvimento e pequenas alterações de workflows por 12 meses incluso - após 12 meses, necessário avaliação técnica (em média 200,00/hora)'
    ]
  },
  pitch: 'Base moderna e acessível (Supabase + Vercel), com contingência própria. Comunicação criptografada, acessos controlados e conformidade com a LGPD.'
};

export type EspecTec = typeof ESPEC_TEC;
