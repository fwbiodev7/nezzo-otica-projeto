# sua-marca

Site da sua-marca, em Varginha (MG), com identidade em azul escuro, catálogo por marca e sugestões de armações por visagismo. Construído com Next.js 16, React 19, TypeScript e Tailwind CSS 3.

> **Estado do projeto:** protótipo navegável. O editor atual salva o catálogo somente no navegador utilizado. Ainda não há autenticação administrativa no servidor nem catálogo compartilhado entre visitantes. Não é uma loja com checkout.

## O que mudou nesta atualização

- Nova identidade **sua-marca**, substituindo os nomes antigos nas telas e mensagens.
- Design em azul marinho com tons de azul nos destaques e fundos, logotipo próprio, fotografia editorial, vitrine e seções redesenhadas.
- Animações de entrada, faixa em movimento, selo giratório, efeitos nos produtos e ilustração animada do visagismo.
- Respeito à preferência de movimento reduzido, menu móvel com fechamento por Escape e link para pular ao conteúdo.
- Identidade, campanha e contatos centralizados; cores controladas por variáveis compartilhadas.
- Busca por nome, marca, cor e estilo, sem diferenciar acentos; filtro de marcas gerado a partir do catálogo e ordenação por preço ou nome.
- Atalhos de grau e sol que abrem o catálogo já filtrado.
- Página inicial sincronizada com o catálogo editado no mesmo navegador.
- Retirada dos controles de cadastro e exclusão da vitrine pública; edição concentrada no editor de demonstração.
- Correções no catálogo vazio, preço zero e centavos, validação de backups, identificadores dos produtos e avisos de falha ao salvar.
- Fotos de cadastro validadas e reduzidas antes do armazenamento, modal acessível e tratamento de imagens indisponíveis nos cards.
- Recomendações exibidas apenas para produtos presentes no catálogo atual, com alternativas por formato quando necessário.
- Validação de origem da API corrigida, sem liberar automaticamente domínios externos terminados em `.vercel.app`.
- Comando de lint atualizado para a versão atual do Next.js.
- Endereço, CEP e telefone da sua-marca conforme a referência fornecida, com links de localização e ligação. Horários completos e redes sociais não informados não são apresentados como fatos.

## Executar localmente

Requer Node.js 20.9 ou superior e npm. A validação desta atualização utilizou Node.js 24.

```bash
npm ci
npm run dev
```

Abra [localhost:3000](http://localhost:3000).

Os comandos de desenvolvimento e compilação preparam os arquivos do MediaPipe. No primeiro uso, o projeto precisa de internet para baixar o modelo facial e conferir sua integridade. Os arquivos gerados ficam em `public/mediapipe/` e não entram no Git.

## Personalizar para as marcas da loja

| O que mudar | Onde |
| --- | --- |
| Nome, descrição, campanha, foto principal e contatos | `src/lib/site-config.ts` |
| Cores da identidade | Variáveis `--brand-*` em `src/app/globals.css` |
| Produtos iniciais, marcas, preços e imagens | `src/lib/mock-data.ts` |
| Imagens próprias | `public/images/` |
| Produtos no editor de demonstração | `/admsecreto` |

As marcas disponíveis nos filtros são extraídas automaticamente do campo **Marca / Coleção** dos produtos. Não é preciso editar o layout para acrescentar uma marca.

Para uma alteração distribuída a todos os visitantes nesta versão, altere o catálogo inicial no código e publique uma nova versão. Alterações feitas no editor não são distribuídas a outros aparelhos. Catálogos já salvos no navegador continuam prevalecendo sobre os produtos iniciais até a restauração manual.

Dados informados: Rua Alves e Silva, 61, Centro, Varginha - MG, CEP 37002-190; telefone (35) 99889-2492. A referência mostra uma abertura às 09h na sexta-feira, mas não uma grade completa: o site orienta a consultar o horário com a equipe. Instagram permanece oculto por não ter sido informado. A variável `NEXT_PUBLIC_WHATSAPP_NUMBER` substitui o destino dos links de WhatsApp; os dados de ligação estão em `phoneLabel` e `phoneHref`.

## Editor de demonstração

Acesse `/admsecreto` e use o código demonstrativo **2000**.

É possível adicionar, editar, excluir, exportar e importar produtos. Fotos JPG, PNG ou WebP de até 10 MB são reduzidas antes do salvamento. O navegador possui limite de armazenamento; faça exportações periódicas e mantenha as imagens pequenas.

**Esse código público não é uma senha de produção.** As chaves antigas de armazenamento foram mantidas para preservar os cadastros locais existentes.

## Visagismo

1. Abra **Descubra seu estilo**.
2. Envie uma foto frontal ou permita a captura pela câmera.
3. Autorize o uso da foto e clique em **Analisar com IA**.
4. Escolha grau ou sol e seu estilo preferido; compare as sugestões do catálogo real.
5. Veja a simulação ilustrativa ou gere uma prévia com Gemini, quando configurado. Consulte a equipe pelo WhatsApp para confirmar o ajuste.

O botão único usa MediaPipe no navegador. Quando essa análise funciona, a foto não é enviada à API de análise. Em caso de falha técnica no carregamento do modelo, serviços em nuvem configurados podem ser usados. Fotos sem rosto ou com múltiplos rostos são rejeitadas. O modelo local depende de WebAssembly e do carregamento dos arquivos preparados pelo projeto.

O recurso oferece orientação de estilo, sem identificação pessoal ou diagnóstico. Não estima medidas em milímetros nem o tamanho físico da armação a partir do enquadramento. A simulação local alinha um desenho do formato e da cor aproximados aos olhos; não reproduz todos os detalhes do produto. A prévia em nuvem usa a foto real da armação, pode alterar detalhes e só é solicitada ao clicar em gerar. Fotos e prévias ficam na sessão e são removidas ao reiniciar. Os modelos do catálogo vieram de prints fornecidos e de uma publicação pública da ótica; preços e estoque atual exigem confirmação.

### Integrações opcionais

Copie `.env.local.example` para `.env.local` e configure somente os serviços que serão usados:

| Variável | Uso |
| --- | --- |
| `GEMINI_API_KEY` / `GEMINI_MODEL` | Provedor de análise em nuvem |
| `GEMINI_IMAGE_MODEL` | Modelo de geração da prévia do provador |
| `HUGGINGFACE_API_KEY` / `HUGGINGFACE_MODEL` | Provedor alternativo |
| `NVIDIA_API_KEY` / `NVIDIA_MODEL` | Provedor alternativo |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Destino dos links de atendimento |
| `NEXT_PUBLIC_FIREBASE_*` | Configuração opcional do SDK Firebase |

As integrações dependem das credenciais, cotas, modelos e termos dos respectivos fornecedores. O código prevê alternativas em caso de indisponibilidade, mas não garante continuidade ilimitada. A configuração do Firebase, isoladamente, **não conecta o catálogo a um banco nem protege o painel**.

As chaves privadas não devem usar o prefixo `NEXT_PUBLIC_` nem ser enviadas ao Git. Antes de habilitar o fluxo em nuvem para visitantes, documente provedores, finalidade, retenção, base legal, aviso de privacidade e autorizações aplicáveis. Não se presume descarte imediato da imagem por serviços externos.

`node --env-file=.env.local scripts/check-gemini-key.mjs` verifica a conexão com uma resposta curta e sem exibir a chave. `npm run test:provador` simula as chamadas de geração, sem enviar fotos à nuvem. O teste opcional `scripts/test-gemini-live.mjs` envia a foto de teste `scripts/fixtures/face-round.png` e a referência da armação NZ Vision Azul ao Gemini; execute somente após autorizar esse envio. Pode consumir a cota do provedor.

## Verificar a aplicação

```bash
npm run lint
npm run typecheck
npm run build
```

Com o servidor em execução e o Google Chrome instalado:

```bash
npm run test:site
npm run test:visagismo
```

Para testar outro endereço, defina `DEMO_BASE_URL`, por exemplo `http://127.0.0.1:3001`.

O teste do site cobre catálogo, busca, filtros, ordenação, cadastro com centavos, persistência de catálogo vazio, navegação móvel, preferência de movimento reduzido, validação da API e visagismo local. Capturas de tela ficam em `artifacts/`, fora do Git.

`npm run demo` executa o roteiro de demonstração existente. Os retratos de `scripts/fixtures/` são imagens fictícias de teste.

## Antes de usar comercialmente

- Implementar autenticação e autorização no servidor e armazenamento central persistente de produtos e imagens.
- Configurar backup e testar restauração. A exportação local não é backup automático.
- Confirmar contatos, preços, disponibilidade e autorização para uso de marcas e imagens.
- Definir a política de privacidade e as condições do processamento facial, especialmente em nuvem.
- Usar hospedagem compatível com atividade comercial. O [plano Hobby da Vercel](https://vercel.com/docs/plans/hobby) é destinado a uso pessoal e não comercial.
- Substituir o limitador de requisições em memória por uma solução compartilhada se houver múltiplas instâncias.
- Configurar domínio, credenciais de produção, cotas e limites de gasto dos provedores.

A compilação e os testes locais não representam certificação de segurança, conformidade jurídica ou disponibilidade de provedores externos.

## Estrutura

```text
src/app/               Páginas e API de visagismo
src/components/        Interface e componentes reutilizáveis
src/lib/site-config.ts Identidade, campanha e contatos
src/lib/mock-data.ts   Catálogo inicial
src/lib/               Persistência local e análise facial
public/images/         Fotografias da vitrine
scripts/               Preparação do modelo e verificações
```

Documentos particulares de contrato, análises contratuais e arquivos temporários não fazem parte do código do site nem devem ser publicados na pasta pública.
