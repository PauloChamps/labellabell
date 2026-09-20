Abra index.html na raiz usando Open with Live Server.

# ImigraEuropa

Portal estático novo em HTML, CSS e JavaScript puro. Não há backend, framework, etapa de build ou dependência de produção. Todos os HTML são arquivos reais e editáveis. O domínio definitivo configurado é `https://imigraeuropa.com.br/`, mas este repositório é somente de desenvolvimento: nenhum deploy, DNS ou GitHub Pages foi ativado.

## Abrir no Visual Studio Code

1. Abra esta pasta no VS Code.
2. Na aba Extensions, instale **Live Server**, de Ritwick Dey.
3. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.
4. Use o endereço local exibido pelo VS Code. A busca e as vagas precisam de HTTP porque o navegador pode bloquear `fetch` em `file://`.

Alternativa no terminal, a partir da raiz:

```bash
python -m http.server 8000
```

Depois abra `http://localhost:8000/`. Abrir `index.html` diretamente ainda renderiza menu e rodapé, pois eles não usam `fetch`, mas busca e vagas exigem servidor.

## Onde editar

- **Home:** `index.html`.
- **Menu, países, categorias, rodapé e redes sociais:** `assets/js/site-data.js`.
- **Logo:** coloque o arquivo original em `assets/images/logo/` e substitua o texto da marca na função `header` de `assets/js/components.js`. Nenhum logo foi inventado.
- **Páginas editoriais:** arquivos HTML em `portugal/`, `espanha/`, `franca/` e `italia/`. Comentários no modelo indicam os trechos editáveis.
- **Novo artigo:** copie `modelo-artigo.html`, troque título, description, canonical, Open Graph, textos, alt, fontes e relacionados; remova `noindex` apenas após revisão.
- **Cadastro da busca:** `assets/data/search-index.json`. Use `status: "draft"` para ocultar um item; exemplos usam `status: "example"`.
- **Vagas:** `assets/data/jobs.json`. Os registos entregues são fictícios. Troque-os somente por vagas verificadas.
- **Calculadoras:** formulários em `ferramentas/` e regras em `assets/js/calculators.js`.
- **Vídeo:** informe o ID no atributo `data-video-id` do espaço da página e um título em `data-video-title`. Sem ID, nenhum iframe é criado.
- **Estilos:** arquivos separados em `assets/css/` para variáveis, base, layout, componentes, páginas e responsividade.
- **Imagens:** use as subpastas de `assets/images/` e sempre forneça texto alternativo adequado.

Cada página informa sua raiz em `data-root`: `""` na raiz e `"../"` em subpastas. Preserve isso ao copiar páginas para que menu, rodapé e recursos funcionem no Live Server e em uma subpasta do GitHub Pages.

## Publicidade, privacidade e indexação

`assets/js/site-data.js` mantém `adsEnabled: false`, publisher `ca-pub-4434635049222289` e slot `4084117607`. A biblioteca só pode ser carregada quando a opção for alterada explicitamente **e** o hostname for `imigraeuropa.com.br`. Não ative antes de revisar conteúdo, política e configuração do domínio. O código não atualiza anúncios em pesquisa, filtros ou modal.

Nenhum `ads.txt` verdadeiro foi fornecido. Por isso há somente `ads.example.txt`; substitua-o por `ads.txt` com a linha oficial exata fornecida pela plataforma. Não invente a declaração.

A política é estrutural e requer revisão. Antes de publicidade personalizada para visitantes do EEE, Reino Unido e Suíça, integre uma CMP certificada pelo Google. Não foi criado um botão que simule consentimento.

`robots.txt` bloqueia rastreamento enquanto este repositório for teste. Isso não protege dados privados. O `sitemap.xml` contém somente páginas consideradas completas e públicas; rascunhos, modelos, busca e demonstrações não aparecem nele. Antes de publicar, revise página por página, política, canonical, sitemap e robots.

## Revisar links e executar auditoria

Use Node.js 18 ou posterior apenas para a auditoria opcional — o site não precisa de Node.js para funcionar:

```bash
node tests/audit.js
```

Ela verifica a existência da Home, recursos e links internos, um H1 por página, caminhos relativos, placeholders proibidos, `noindex` em rascunhos, exclusão do sitemap, AdSense desativado, JSON válido e resultados numéricos finitos.

## Publicação futura

Somente após revisão: mantenha a estrutura inteira, escolha a origem do GitHub Pages e publique estes arquivos diretamente, sem pasta de saída. Se usar uma subpasta, os links relativos continuarão funcionando. Para o domínio definitivo, configure DNS e repositório de produção fora deste projeto, seguindo o processo responsável. Este repositório não realiza nem automatiza deploy.

## Limitações conhecidas

Os conteúdos de países e categorias são estruturas editoriais com `noindex`, não orientação migratória. Espanha, França e Itália são áreas futuras. Vagas e itens da busca são exemplos. Não há envio de formulário, conta de utilizador, analytics, CMP ou anúncio ativo. Testes visuais dependem de um navegador disponível no ambiente.
