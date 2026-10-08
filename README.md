# Ótica Nezzo

Site da Ótica Nezzo, em Varginha (MG), com identidade em azul escuro, catálogo por marca e sugestões de armações por visagismo. Construído com Next.js 16, React 19, TypeScript e Tailwind CSS 3.

## Acesse o site

O projeto está publicado na Vercel: [nezzo-otica-projeto.vercel.app](https://nezzo-otica-projeto.vercel.app/).

> **Estado do projeto:** protótipo navegável. O painel agora exige autenticação no servidor; o catálogo continua salvo somente no navegador utilizado, sem compartilhamento entre visitantes. Não é uma loja com checkout. A versão publicada precisa receber as novas variáveis e um novo deploy para aplicar estas correções.

## O que mudou nesta atualização

- Identidade **Ótica Nezzo**, com nome, campanha e contatos da loja nas telas e mensagens.
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
- Endereço, CEP, telefone, horários e redes sociais da Ótica Nezzo centralizados em `src/lib/site-config.ts`, com links de localização, ligação e atendimento.

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
| Produtos no painel administrativo | `/admin` (`/admsecreto` redireciona) |

As marcas disponíveis nos filtros são extraídas automaticamente do campo **Marca / Coleção** dos produtos. Não é preciso editar o layout para acrescentar uma marca.

Para uma alteração distribuída a todos os visitantes nesta versão, altere o catálogo inicial no código e publique uma nova versão. Alterações feitas no editor não são distribuídas a outros aparelhos. Catálogos já salvos no navegador continuam prevalecendo sobre os produtos iniciais até a restauração manual.

Dados configurados no projeto: Rua Presidente Antônio Carlos, Centro, Varginha - MG, CEP 37002-000; telefone (35) 3677-1170; atendimento de segunda a sexta, das 09h às 18h30, e sábado, das 09h às 13h. As redes sociais configuradas são [Instagram @oticanezzo](https://www.instagram.com/oticanezzo/) e [Facebook Nezzo Visão](https://www.facebook.com/nezzovisao). A variável `NEXT_PUBLIC_WHATSAPP_NUMBER` substitui o destino dos links de WhatsApp; os dados de ligação estão em `phoneLabel` e `phoneHref`.

## Painel administrativo

Acesse `/admin`. O código antigo foi removido. A senha é validada no servidor usando scrypt; a sessão dura oito horas em cookie HttpOnly, Secure em produção e SameSite=Strict. Sem configuração válida, o painel fica bloqueado.

```bash
npm run setup:admin
npm run dev
```

O primeiro comando gera uma senha aleatória, grava somente seu hash e a chave de sessão em `.env.local` e entrega a senha em `.admin-credentials.local.txt`. Ambos os arquivos são privados e ignorados pelo Git. Guarde a senha em um gerenciador; não publique o arquivo de credenciais. Para escolher uma senha, defina `ADMIN_NEW_PASSWORD` no ambiente antes de executar o comando (16 a 128 caracteres).

Para trocar a senha, execute novamente `npm run setup:admin` e reinicie o servidor. A troca também gera uma nova chave e invalida sessões anteriores após a nova configuração entrar em vigor.

Na Vercel, configure `ADMIN_PASSWORD_HASH` e `ADMIN_SESSION_SECRET` a partir de `.env.local`, como variáveis privadas nos ambientes desejados. Configure também `APP_ORIGIN` com a origem exata do site, como `https://nezzo-otica-projeto.vercel.app`, e faça um novo deploy. Em Preview, use a origem do respectivo endereço. Não use `NEXT_PUBLIC_` nestes valores. Nenhuma configuração local altera automaticamente a Vercel.

É possível adicionar, editar, excluir, exportar e importar produtos. Fotos JPG, PNG ou WebP de até 10 MB são reduzidas antes do salvamento. O navegador possui limite de armazenamento; faça exportações periódicas e mantenha as imagens pequenas.

As chaves antigas de armazenamento do catálogo foram mantidas para preservar cadastros locais. Alterar `sessionStorage` não autentica o painel. A autenticação não transforma os dados de `localStorage` em um banco compartilhado ou em registros confiáveis de servidor.

## Visagismo

1. Abra **Descubra seu estilo**.
2. Envie uma foto frontal ou permita a captura pela câmera.
3. Autorize o uso da foto e clique em **Analisar com IA**.
4. Escolha grau ou sol e seu estilo preferido; compare as sugestões do catálogo real.
5. Compare as fotos das armações recomendadas e consulte a equipe pelo WhatsApp para confirmar o ajuste e a disponibilidade.

O botão único usa MediaPipe no navegador. Quando essa análise funciona, a foto não é enviada à API de análise. Em caso de falha técnica no carregamento do modelo, serviços em nuvem configurados podem ser usados. Fotos sem rosto ou com múltiplos rostos são rejeitadas. O modelo local depende de WebAssembly e do carregamento dos arquivos preparados pelo projeto.

O recurso oferece orientação de estilo, sem identificação pessoal ou diagnóstico. Não estima medidas em milímetros nem o tamanho físico da armação a partir do enquadramento. A foto fica na sessão e é removida ao reiniciar. Os modelos do catálogo vieram de prints fornecidos e de uma publicação pública da ótica; preços e estoque atual exigem confirmação. O provador virtual foi retirado desta apresentação; o resultado mostra recomendações com fotos reais e contato com a equipe.

### Integrações opcionais

Copie `.env.local.example` para `.env.local` e configure somente os serviços que serão usados:

| Variável | Uso |
| --- | --- |
| `ADMIN_PASSWORD_HASH` / `ADMIN_SESSION_SECRET` | Autenticação administrativa no servidor |
| `APP_ORIGIN` | Origem pública fixa para validar login, logout e análise atrás de proxy |
| `TRUSTED_PROXY_IP_HEADER` | Opcional; somente se o ingresso substitui esse cabeçalho e bloqueia acesso direto |
| `GEMINI_API_KEY` / `GEMINI_MODEL` | Provedor de análise em nuvem |
| `HUGGINGFACE_API_KEY` / `HUGGINGFACE_MODEL` | Provedor alternativo |
| `NVIDIA_API_KEY` / `NVIDIA_MODEL` | Provedor alternativo |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Destino dos links de atendimento |
| `NEXT_PUBLIC_FIREBASE_*` | Configuração opcional do SDK Firebase |

As integrações dependem das credenciais, cotas, modelos e termos dos respectivos fornecedores. O código prevê alternativas em caso de indisponibilidade, mas não garante continuidade ilimitada. A configuração do Firebase, isoladamente, **não conecta o catálogo a um banco nem protege o painel**.

As chaves privadas não devem usar o prefixo `NEXT_PUBLIC_` nem ser enviadas ao Git. Antes de habilitar o fluxo em nuvem para visitantes, documente provedores, finalidade, retenção, base legal, aviso de privacidade e autorizações aplicáveis. Não se presume descarte imediato da imagem por serviços externos.

`node --env-file=.env.local scripts/check-gemini-key.mjs` verifica a conexão com uma resposta curta e sem exibir a chave. `npm run test:recommendations` verifica preferências e recomendações do catálogo, sem enviar fotos à nuvem.

Na Vercel, adicione `GEMINI_API_KEY` como variável **Secret** em **Settings → Environment Variables**, no ambiente **Production** (e **Preview** se necessário). Configure também `GEMINI_MODEL=gemini-3.5-flash-lite` como **Config** se quiser explicitar o modelo. Salve e faça um novo deploy. `.env.local` fica apenas no computador e não é publicado pelo Git. As chamadas ao Gemini partem do servidor; a chave não usa o prefixo `NEXT_PUBLIC_`.

## Verificar a aplicação

```bash
npm run lint
npm run typecheck
npm run build
npm run test:security
```

Com o servidor em execução e o Google Chrome instalado:

```bash
npm run test:site
npm run test:visagismo
```

Para testar outro endereço, defina `DEMO_BASE_URL`. O teste do site também exige `ADMIN_TEST_PASSWORD` com a senha do servidor de testes. Se o endereço acessado difere da URL interna do servidor, configure `APP_ORIGIN` com a origem usada no navegador.

`test:security` exige uma compilação prévia, inicia um servidor isolado com senha temporária e sem chaves de IA, testa o código antigo, flags de sessão antigas, cookies adulterados/expirados, rotação, origem, limites por IP e leitura de JSON por chunks. Capturas de login ficam no diretório temporário do sistema ou em `SECURITY_ARTIFACT_DIR`, quando definido. O teste não imprime a senha nem usa provedores pagos.

O limitador atua por processo. Sem um ingresso comprovadamente confiável, as requisições compartilham uma cota: cinco tentativas de login a cada dez minutos e doze análises em nuvem por minuto. Há ainda limites globais por processo e duas análises simultâneas. Reinícios e múltiplas instâncias não compartilham essas cotas; produção com escala exige armazenamento central para o limitador.

O teste do site cobre catálogo, busca, filtros, ordenação, cadastro com centavos, persistência de catálogo vazio, navegação móvel, preferência de movimento reduzido, validação da API e visagismo local. Capturas de tela ficam em `artifacts/`, fora do Git.

`npm run demo` executa o roteiro de demonstração existente. Os retratos de `scripts/fixtures/` são imagens fictícias de teste.

## Antes de usar comercialmente

- Configurar os segredos administrativos na hospedagem e implementar armazenamento central persistente de produtos e imagens, com autorização em cada operação de servidor.
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
