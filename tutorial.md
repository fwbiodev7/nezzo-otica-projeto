# Guia de uso da sua-marca

## Explorar os modelos

Abra **Nossos óculos**. Busque por nome, marca, cor ou estilo, combine os filtros e ordene os modelos por preço. **Quero conhecer** abre o WhatsApp com a mensagem do produto; confirme o envio no aplicativo. Os produtos e preços iniciais são demonstrativos.

## Usar o visagismo

1. Abra **Descubra seu estilo**.
2. Envie uma foto frontal ou permita a câmera, com autorização da pessoa fotografada.
3. Use **Analisar neste aparelho** para processar a foto localmente.
4. Confira os formatos sugeridos e converse com a equipe.

O recurso oferece sugestões de estilo, sem diagnóstico ou prescrição. Não sobrepõe óculos ao rosto em tempo real. O modo local depende de carregar os arquivos do modelo. A opção em nuvem envia a imagem a serviços externos; suas condições de privacidade devem ser revisadas antes de uso comercial.

## Editar o catálogo de demonstração

Acesse o endereço do site seguido de **/admsecreto**. O código demonstrativo é **2000**. Ele é público e não substitui autenticação de produção.

**As alterações ficam apenas neste navegador e não aparecem para visitantes em outros aparelhos.**

- Use o botão de adicionar para cadastrar nome, marca, tipo, formato, preço, cor e foto.
- Em **Marca / Coleção**, informe a marca desejada. O filtro da vitrine se atualiza automaticamente.
- Use os botões de edição e exclusão de cada produto para fazer alterações.
- Envie fotos JPG, PNG ou WebP de até 10 MB. Elas serão reduzidas antes de salvar.
- Use **Exportar Backup** para guardar uma cópia. A importação substitui o catálogo por um arquivo válido.
- A restauração do catálogo padrão substitui seus cadastros pelos exemplos iniciais. Faça um backup antes.

Não limpe os dados do navegador sem guardar uma cópia. Caso o armazenamento esteja cheio, reduza as imagens e tente novamente.

## Personalizar a identidade

Nome, campanha, foto principal e contatos ficam em `src/lib/site-config.ts`. As cores ficam no início de `src/app/globals.css`. O responsável pelo código pode alterar esses arquivos e publicar uma nova versão sem reconstruir as páginas.

Para gestão comercial compartilhada, ainda é necessário implementar autenticação no servidor, banco central e backup. Veja o [README](README.md) para execução, testes e requisitos de publicação.
