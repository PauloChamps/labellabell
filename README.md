# ImigraEuropa — primeira entrega

Novo site estático, sem backend ou dependências de produção. Esta entrega contém a estrutura editorial, gerador local, design responsivo, navegação compartilhada, home, quatro páginas-base de países e um modelo de artigo. Os HTML prontos ficam em `dist/`.

> **Estado do conteúdo:** as páginas dos países e o modelo são rascunhos, usam `noindex` e só aparecem na prévia. Não publique conteúdo sem preenchê-lo, revisá-lo e alterar o respetivo `status` para `published`.

## Requisitos

- Node.js 18 ou mais recente.
- Nenhum `npm install` é necessário: o projeto usa apenas módulos nativos do Node.js.

## Gerar e visualizar

```bash
npm run build
npm run serve
```

Abra `http://127.0.0.1:4173/`. O servidor serve somente os arquivos estáticos já gerados. Encerre-o com `Ctrl+C`.

Comandos disponíveis:

| Comando | Resultado |
| --- | --- |
| `npm run build` | Prévia local em `dist/`, incluindo rascunhos e aplicando `noindex` a tudo. |
| `npm run build:public` | Saída pública usando `basePath`, excluindo páginas em rascunho. |
| `npm run build:pages` | Atalho público atual para a base `/labellabell/`. |
| `npm test` | Testa geração, componentes compartilhados, links, base path, rascunhos e ausência do AdSense. |

Também é possível testar outra base sem editar a configuração:

```bash
node scripts/build.js --mode public --base /nome-do-repositorio/
```

Não abra os HTML com `file://`: use o servidor para reproduzir corretamente caminhos e comportamento do GitHub Pages.

## Onde editar

- **Textos, títulos, imagens, vídeo e estado das páginas:** `content/pages.json`. Para uma imagem, coloque o arquivo em `src/assets/images/` e informe, por exemplo, `"src": "assets/images/portugal.jpg"` e um `alt` descritivo. Para vídeo, informe somente o ID do YouTube em `videoId`.
- **Menu e categorias:** `content/menu.json`. Um item sem destino deve usar `"comingSoon": true`; assim ele não vira link quebrado.
- **Rodapé:** `content/footer.json`.
- **Nome, domínio, base de publicação, logo, redes e configuração futura de anúncios:** `config/site.json`.
- **Aparência:** `src/assets/css/styles.css`.
- **Interações do menu:** `src/assets/js/site.js`.
- **Estrutura HTML compartilhada:** `templates/page.html` e funções de renderização em `scripts/build.js`.

Não edite `dist/`: a pasta é recriada integralmente a cada geração.

### Logo

Nenhum logo original foi fornecido, portanto o cabeçalho usa temporariamente apenas o nome **ImigraEuropa**, sem símbolo inventado. Para adicionar o original, copie-o para `src/assets/images/` e defina `logo` em `config/site.json`, por exemplo `"logo": "assets/images/logo.svg"`.

### GitHub Pages e domínio

Antes da publicação futura, substitua `siteUrl` pelo domínio real. Para GitHub Pages, mantenha nele `https://SEU-USUARIO.github.io` e ajuste `basePath` ao nome exato do repositório. Para domínio próprio na raiz, use o domínio completo em `siteUrl` e `"basePath": "/"`.

Esta entrega **não publica nem configura deploy**. O diretório `dist/` resultante de `build:public` é a saída estática que poderá ser publicada quando o conteúdo estiver aprovado.

### Rascunhos, sitemap e publicidade

- `preview`: inclui rascunhos para revisão, marca todas as páginas `noindex` e bloqueia rastreamento em `robots.txt`.
- `public`: não gera rascunhos; o sitemap inclui somente páginas com `status: "published"`.
- Os espaços de publicidade são apenas placeholders. O publisher e slot fornecidos estão guardados na configuração, com `ads.enabled` falso. Nenhuma chamada ao AdSense existe nesta fase. A integração real será feita na revisão final e nunca deverá ocorrer em rascunhos.
- `robots.txt` orienta robôs, mas não protege informação privada. Não coloque segredos nos arquivos do site.

## Escopo e próximas entregas

Esta primeira etapa não contém ainda categorias publicáveis, páginas institucionais, busca, calculadoras, vagas, paginação, janela de contacto, 404 ou integração real do AdSense. Esses itens pertencem às próximas entregas solicitadas. As indicações “Em breve” são texto, não links falsos. O modelo já reserva imagem, vídeo opcional e publicidade, mas nenhum dado migratório, preço, lei, perfil social ou contacto foi inventado.

