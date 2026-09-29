/** Identidade e campanha: altere aqui sem refazer os componentes. */
export const siteConfig = {
  name: 'sua-marca',
  description: 'Um novo jeito de se ver. Armações com personalidade, curadoria de estilo e atendimento próximo na sua-marca.',
  collectionName: 'Coleção sua-marca',
  announcement: 'Um novo olhar para cada versão de você.',
  campaign: {
    label: 'OLHE DIFERENTE. SEJA VOCÊ.',
    title: 'Seu olhar.',
    emphasis: 'Suas regras.',
    description: 'Para os dias comuns. Para os seus grandes momentos. Descubra óculos que fazem parte de quem você é.',
    image: '/images/hero-editorial.png',
    imageAlt: 'Mulher usando óculos dourados em um ambiente iluminado pelo sol',
    caption: 'Leveza que acompanha você.',
  },
  contact: {
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5535998892492',
    phoneLabel: '(35) 99889-2492',
    // Preencha com os dados reais antes de publicar. Campos vazios não aparecem.
    address: '',
    hours: '',
    instagramUrl: '',
    instagramLabel: '',
  },
};
