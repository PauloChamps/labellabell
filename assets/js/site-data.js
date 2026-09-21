window.IMIGRA_EUROPA = {
  name: "ImigraEuropa",
  domain: "https://imigraeuropa.com.br/",

  // Configurações dos anúncios
  adsEnabled: false,
  adsPublisher: "ca-pub-4434635049222289",
  adsSlot: "4084117607",

  // Menu principal e menu lateral
  countries: [
    {
  label: "Portugal",
  url: "portugal/index.html",

  children: [
    {
      label: "Visão geral",
      url: "portugal/index.html"
    },

    {
      label: "Documentação",
      url: "portugal/documentacao.html",

      children: [
        {
          label: "Como obter o NIF",
          url: "portugal/documentacao/como-obter-nif.html"
        },
        {
          label: "Como obter o NISS",
          url: "portugal/documentacao/como-obter-niss.html"
        },
        {
          label: "Número de utente",
          url: "portugal/documentacao/numero-utente.html"
        }
      ]
    },

    {
      label: "Vistos",
      url: "portugal/vistos.html",

      children: [
        {
          label: "Visto de procura de trabalho",
          url: "portugal/vistos/visto-procura-trabalho.html"
        },
        {
          label: "Visto D7",
          url: "portugal/vistos/visto-d7.html"
        },
        {
          label: "Visto de estudo",
          url: "portugal/vistos/visto-estudo.html"
        },
        {
          label: "Visto para nómadas digitais",
          url: "portugal/vistos/visto-nomade-digital.html"
        }
      ]
    },

    {
      label: "Trabalho",
      url: "portugal/trabalho.html",

      children: [
        {
          label: "Vagas em Portugal",
          url: "vagas/index.html"
        },
        {
          label: "Como procurar emprego",
          url: "portugal/trabalho/como-procurar-emprego.html"
        },
        {
          label: "Salário mínimo",
          url: "portugal/trabalho/salario-minimo.html"
        }
      ]
    },

    {
      label: "Moradia",
      url: "portugal/moradia.html",

      children: [
        {
          label: "Alugar casa",
          url: "portugal/moradia/alugar-casa.html"
        },
        {
          label: "Contrato de arrendamento",
          url: "portugal/moradia/contrato-arrendamento.html"
        },
        {
          label: "Como evitar fraudes",
          url: "portugal/moradia/evitar-fraudes.html"
        }
      ]
    },

    {
      label: "Educação",
      url: "portugal/educacao.html",
      children: []
    },

    {
      label: "Saúde",
      url: "portugal/saude.html",
      children: []
    },

    {
      label: "Mobilidade",
      url: "portugal/mobilidade.html",
      children: []
    },

    {
      label: "Finanças",
      url: "portugal/financas.html",
      children: []
    },

    {
      label: "Turismo",
      url: "portugal/turismo.html",
      children: []
    },

    {
      label: "Comunidade",
      url: "portugal/comunidade.html",
      children: []
    },

    {
      label: "Extras",
      url: "portugal/extras.html",
      children: []
    }
  ]
},

    {
      label: "Espanha",
      url: "espanha/index.html",
      children: []
    },

    {
      label: "França",
      url: "franca/index.html",
      children: []
    },

    {
      label: "Itália",
      url: "italia/index.html",
      children: []
    }
  ],

  // Links exibidos no rodapé
  footer: [
    ["Sobre", "sobre.html"],
    ["Contato", "contato.html"],
    ["Política de privacidade", "politica-de-privacidade.html"],
    ["Ferramentas", "ferramentas.html"],
    ["Vagas", "vagas/index.html"]
  ],

  // Redes sociais
  socials: [],

  // Componente de vídeo do YouTube
  video: {
    render: function (target, id, title, caption) {
      if (!target || !id) {
        return;
      }

      const figure = document.createElement("figure");
      figure.className = "video-component";

      const frame = document.createElement("div");
      frame.className = "video-frame";

      const iframe = document.createElement("iframe");
      iframe.src =
        "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id);

      iframe.title = title || "Vídeo relacionado";
      iframe.loading = "lazy";
      iframe.allowFullscreen = true;

      frame.append(iframe);
      figure.append(frame);

      if (caption) {
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = caption;
        figure.append(figcaption);
      }

      target.replaceChildren(figure);
    }
  }
};