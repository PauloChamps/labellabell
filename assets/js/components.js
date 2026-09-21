(function () {
  "use strict";

  const siteData = window.IMIGRA_EUROPA;

  if (!siteData) {
    console.error("As configurações do ImigraEuropa não foram encontradas.");
    return;
  }

  const root = document.body.dataset.root || "";

  /**
   * Adiciona o caminho relativo necessário para cada página.
   */
  function getUrl(path) {
    return root + path;
  }

  /**
   * Cria um elemento HTML.
   */
  function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (text !== undefined && text !== null) {
      element.textContent = text;
    }

    return element;
  }

  /**
   * Cria um link interno do site.
   */
  function createLink(label, path, className) {
    const anchor = createElement("a", className, label);
    anchor.href = getUrl(path);

    return anchor;
  }

  /**
   * Converte itens do formato antigo para o novo formato.
   *
   * Formato antigo:
   * ["Documentação", "portugal/documentacao.html"]
   *
   * Formato novo:
   * {
   *   label: "Documentação",
   *   url: "portugal/documentacao.html",
   *   children: []
   * }
   */
  function normalizeMenuItem(item) {
    if (Array.isArray(item)) {
      return {
        label: item[0],
        url: item[1],
        children: []
      };
    }

    return {
      label: item.label || "",
      url: item.url || "",
      children: Array.isArray(item.children) ? item.children : []
    };
  }

  /**
   * Cria um item do menu lateral.
   * A função também suporta subpáginas.
   */
  function createMenuItem(menuItem, level) {
    const item = normalizeMenuItem(menuItem);
    const listItem = createElement("li", "menu-item");

    listItem.dataset.menuLevel = String(level);

    if (item.children.length === 0) {
      if (item.url) {
        listItem.append(
          createLink(item.label, item.url, "menu-link")
        );
      } else {
        listItem.append(
          createElement("span", "menu-label", item.label)
        );
      }

      return listItem;
    }

    const details = createElement("details", "menu-submenu");

    const summary = createElement(
      "summary",
      "menu-submenu-title",
      item.label
    );

    details.append(summary);

    const submenuList = createElement("ul", "menu-submenu-list");

    /*
     * Cria um link para a página principal da categoria.
     */
    if (item.url) {
      const overviewItem = createElement(
        "li",
        "menu-item menu-overview-item"
      );

      overviewItem.dataset.menuLevel = String(level + 1);

      overviewItem.append(
        createLink(
          "Visão geral de " + item.label,
          item.url,
          "menu-link menu-overview-link"
        )
      );

      submenuList.append(overviewItem);
    }

    /*
     * Cria as subpáginas.
     */
    item.children.forEach(function (child) {
      submenuList.append(
        createMenuItem(child, level + 1)
      );
    });

    details.append(submenuList);
    listItem.append(details);

    return listItem;
  }

  /**
   * Monta o cabeçalho.
   */
  function renderHeader() {
    const host = document.querySelector("#site-header");

    if (!host) {
      return;
    }

    host.className = "site-header";
    host.replaceChildren();

    /*
     * Botão do menu móvel.
     */
    const menuButton = createElement(
      "button",
      "menu-toggle",
      "☰ Menu"
    );

    menuButton.type = "button";
    menuButton.dataset.menuOpen = "";
    menuButton.setAttribute("aria-controls", "site-sidebar");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu principal");

    host.append(menuButton);

    /*
     * Nome ou logótipo do site.
     */
    const brand = createLink(
      siteData.name || "ImigraEuropa",
      "index.html",
      "brand"
    );

    host.append(brand);

    /*
     * Acesso rápido aos países.
     */
    const countryNavigation = createElement(
      "nav",
      "quick-nav"
    );

    countryNavigation.setAttribute(
      "aria-label",
      "Acesso rápido aos países"
    );

    const countryList = createElement("ul");

    siteData.countries.forEach(function (country) {
      const listItem = createElement("li");

      listItem.append(
        createLink(country.label, country.url)
      );

      countryList.append(listItem);
    });

    countryNavigation.append(countryList);
    host.append(countryNavigation);

    /*
     * Campo de pesquisa.
     */
    const searchForm = createElement(
      "form",
      "header-search"
    );

    searchForm.action = getUrl("busca.html");
    searchForm.method = "get";
    searchForm.setAttribute("role", "search");

    const searchLabel = createElement(
      "label",
      "sr-only",
      "Pesquisar no ImigraEuropa"
    );

    searchLabel.htmlFor = "header-q";

    const searchInput = createElement("input");

    searchInput.id = "header-q";
    searchInput.name = "q";
    searchInput.type = "search";
    searchInput.placeholder = "Pesquisar";
    searchInput.autocomplete = "off";
    searchInput.setAttribute(
      "aria-label",
      "Pesquisar no ImigraEuropa"
    );

    const searchButton = createElement(
      "button",
      "",
      "Buscar"
    );

    searchButton.type = "submit";

    searchForm.append(
      searchLabel,
      searchInput,
      searchButton
    );

    host.append(searchForm);
  }

  /**
   * Monta o menu lateral.
   */
  function renderSidebar() {
    const host = document.querySelector("#site-sidebar");

    if (!host) {
      return;
    }

    host.className = "sidebar";
    host.replaceChildren();

    /*
     * Cabeçalho do menu lateral.
     */
    const sidebarTop = createElement(
      "div",
      "sidebar-top"
    );

    const sidebarTitle = createElement(
      "strong",
      "",
      "Explorar"
    );

    const closeButton = createElement(
      "button",
      "sidebar-close",
      "×"
    );

    closeButton.type = "button";
    closeButton.dataset.menuClose = "";
    closeButton.setAttribute(
      "aria-label",
      "Fechar menu principal"
    );

    sidebarTop.append(sidebarTitle, closeButton);
    host.append(sidebarTop);

    /*
     * Navegação principal.
     */
    const navigation = createElement("nav");

    navigation.setAttribute(
      "aria-label",
      "Navegação principal"
    );

    siteData.countries.forEach(function (country) {
      const countryDetails = createElement(
        "details",
        "menu-country"
      );

      /*
       * Portugal começa aberto.
       
      if (countryIndex === 0) {
        countryDetails.open = true;
      }*/

      const countrySummary = createElement(
        "summary",
        "menu-country-title",
        country.label
      );

      countryDetails.append(countrySummary);

      const countryList = createElement(
        "ul",
        "menu-country-list"
      );

      const children = Array.isArray(country.children)
        ? country.children
        : [];

      /*
       * Verifica se a página inicial do país já foi cadastrada
       * como "Visão geral", evitando links duplicados.
       */
      const hasCountryOverview = children.some(function (child) {
        const normalizedChild = normalizeMenuItem(child);
        return normalizedChild.url === country.url;
      });

      if (!hasCountryOverview && country.url) {
        const overviewItem = createElement(
          "li",
          "menu-item menu-overview-item"
        );

        overviewItem.dataset.menuLevel = "1";

        overviewItem.append(
          createLink(
            "Visão geral",
            country.url,
            "menu-link menu-overview-link"
          )
        );

        countryList.append(overviewItem);
      }

      children.forEach(function (child) {
        countryList.append(
          createMenuItem(child, 1)
        );
      });

      countryDetails.append(countryList);
      navigation.append(countryDetails);
    });

    host.append(navigation);
  }

  /**
   * Monta o rodapé.
   */
  function renderFooter() {
    const host = document.querySelector("#site-footer");

    if (!host) {
      return;
    }

    host.className = "site-footer";
    host.replaceChildren();

    /*
     * Informações institucionais.
     */
    const about = createElement(
      "div",
      "footer-about"
    );

    const footerBrand = createLink(
      siteData.name || "ImigraEuropa",
      "index.html",
      "footer-brand"
    );

    const disclaimer = createElement(
      "p",
      "",
      "Conteúdo informativo. Confirme decisões em fontes oficiais."
    );

    about.append(footerBrand, disclaimer);
    host.append(about);

    /*
     * Links do rodapé.
     */
    if (Array.isArray(siteData.footer)) {
      const footerNavigation = createElement("nav");

      footerNavigation.setAttribute(
        "aria-label",
        "Links do rodapé"
      );

      const footerList = createElement(
        "ul",
        "footer-links"
      );

      siteData.footer.forEach(function (footerItem) {
        const normalizedItem = normalizeMenuItem(footerItem);
        const listItem = createElement("li");

        listItem.append(
          createLink(
            normalizedItem.label,
            normalizedItem.url
          )
        );

        footerList.append(listItem);
      });

      footerNavigation.append(footerList);
      host.append(footerNavigation);
    }

    /*
     * Redes sociais.
     */
    if (
      Array.isArray(siteData.socials) &&
      siteData.socials.length > 0
    ) {
      const socialNavigation = createElement("nav");

      socialNavigation.setAttribute(
        "aria-label",
        "Redes sociais"
      );

      const socialList = createElement(
        "ul",
        "footer-links footer-socials"
      );

      siteData.socials.forEach(function (socialItem) {
        const listItem = createElement("li");

        const socialLink = createElement(
          "a",
          "",
          socialItem.label
        );

        socialLink.href = socialItem.url;
        socialLink.target = "_blank";
        socialLink.rel = "noopener noreferrer";

        listItem.append(socialLink);
        socialList.append(listItem);
      });

      socialNavigation.append(socialList);
      host.append(socialNavigation);
    }

    /*
     * Direitos autorais.
     */
    const currentYear = new Date().getFullYear();

    const copyright = createElement(
      "p",
      "copyright",
      "© " + currentYear + " ImigraEuropa. Todos os direitos reservados."
    );

    host.append(copyright);
  }

  /**
   * Carrega os vídeos configurados nas páginas.
   */
  function renderVideos() {
    if (
      !siteData.video ||
      typeof siteData.video.render !== "function"
    ) {
      return;
    }

    const videoTargets = document.querySelectorAll(
      "[data-video-id]"
    );

    videoTargets.forEach(function (target) {
      siteData.video.render(
        target,
        target.dataset.videoId,
        target.dataset.videoTitle,
        target.dataset.videoCaption
      );
    });
  }

  /**
   * Confirma se o site está no domínio oficial.
   */
  function isOfficialDomain() {
    const hostname = window.location.hostname.toLowerCase();

    return (
      hostname === "imigraeuropa.com.br" ||
      hostname === "www.imigraeuropa.com.br"
    );
  }

  /**
   * Carrega o Google AdSense somente no domínio oficial.
   */
  function renderAds() {
    if (!siteData.adsEnabled || !isOfficialDomain()) {
      return;
    }

    /*
     * Evita carregar o script do AdSense mais de uma vez.
     */
    const existingScript = document.querySelector(
      'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
    );

    if (!existingScript) {
      const adsenseScript = document.createElement("script");

      adsenseScript.async = true;
      adsenseScript.crossOrigin = "anonymous";
      adsenseScript.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" +
        "?client=" +
        encodeURIComponent(siteData.adsPublisher);

      document.head.append(adsenseScript);
    }

    const adSlots = document.querySelectorAll(
      ".ad-slot[data-real-ad]"
    );

    adSlots.forEach(function (slot) {
      if (slot.dataset.initialized === "true") {
        return;
      }

      slot.dataset.initialized = "true";

      const ad = createElement("ins", "adsbygoogle");

      ad.style.display = "block";
      ad.dataset.adClient = siteData.adsPublisher;
      ad.dataset.adSlot = siteData.adsSlot;
      ad.dataset.adFormat = "auto";
      ad.dataset.fullWidthResponsive = "true";

      slot.replaceChildren(ad);

      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch (error) {
        console.warn(
          "Não foi possível inicializar este espaço publicitário.",
          error
        );
      }
    });
  }

  /**
   * Inicialização dos componentes compartilhados.
   */
  function initializeComponents() {
    renderHeader();
    renderSidebar();
    renderFooter();
    renderVideos();
    renderAds();
  }

  initializeComponents();
})();