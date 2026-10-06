/** Configurações oficiais da Ótica Nezzo (Varginha - MG) */
export const siteConfig = {
  id: 'nezzo',
  name: 'Ótica Nezzo',
  legalName: 'Ótica Nezzo Ltda',
  tagline: 'Sua visão com personalidade.',
  description: 'Curadoria exclusiva de armações solares e de grau em Varginha - MG. Tecnologia em lentes de precisão e visagismo facial inteligente.',
  collectionName: 'Coleção Nezzo',
  announcement: 'Atendimento com curadoria e laboratório de alta precisão · Varginha, MG',
  campaign: {
    label: 'CURADORIA DE ESTILO & PRECISÃO ÓPTICA',
    title: 'Sua visão com',
    emphasis: 'personalidade.',
    description: 'Design de ponta, armações exclusivas e análise visagista por inteligência artificial para encontrar a moldura perfeita para seus traços únicos.',
    image: '/images/hero-editorial.png',
    imageAlt: 'Armações exclusivas Ótica Nezzo com acabamento premium',
    caption: 'Elegância e conforto que acompanham sua rotina.',
  },
  contact: {
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '553536771170',
    phoneLabel: '(35) 3677-1170',
    phoneHref: 'tel:+553536771170',
    address: 'Centro — Varginha - MG',
    street: 'Rua Presidente Antônio Carlos, Centro',
    city: 'Varginha, MG',
    state: 'MG',
    postalCode: '37002-000',
    hours: 'Segunda a Sexta: 09h às 18h30 · Sábado: 09h às 13h',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Ótica Nezzo Varginha MG'),
    instagramUrl: 'https://www.instagram.com/oticanezzo/',
    instagramLabel: '@oticanezzo',
    facebookUrl: 'https://www.facebook.com/nezzovisao',
  },
  features: [
    {
      title: 'Laboratório de Montagem',
      description: 'Lentes lapidadas com precisão computadorizada para encaixe perfeito e máximo conforto visual.',
    },
    {
      title: 'Visagismo IA 2.0',
      description: 'Mapeamento das proporções do seu rosto para indicar o formato, tamanho e contraste ideais.',
    },
    {
      title: 'Atendimento Personalizado',
      description: 'Consultoria técnica dedicada e suporte contínuo via WhatsApp direto com especialistas.',
    },
  ],
};
