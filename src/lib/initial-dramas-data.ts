export interface InitialEpisodeData {
    number: number;
    title: string;
    description: string;
    youtubeUrl: string;
    durationSeconds?: number;
    isFree: boolean;
}

export interface InitialDramaData {
    id: string;
    title: string;
    slug: string;
    synopsis: string;
    coverUrl: string;
    bannerUrl?: string;
    category: string;
    tags: string;
    totalEpisodes: number;
    freeEpisodesCount: number;
    isFeatured: boolean;
    isVertical: boolean;
    viewsCount: number;
    likesCount: number;
    episodes: InitialEpisodeData[];
}

export const INITIAL_YOUTUBE_DRAMAS: InitialDramaData[] = [
    {
        id: "tdx-refugio-perigoso",
        title: "Refúgio Perigoso (Dublado)",
        slug: "refugio-perigoso-dublado",
        synopsis: "A noiva fugitiva Olivia encontra refúgio nos braços de Edward, um temido e impiedoso chefe da máfia que se torna seu protetor e sua maior obsessão.",
        coverUrl: "https://img.youtube.com/vi/S-nggtnvDNQ/hqdefault.jpg",
        bannerUrl: "https://img.youtube.com/vi/S-nggtnvDNQ/hqdefault.jpg",
        category: "Dublado",
        tags: "anuncio,bombando,tendencias,dublado,mafia,romance",
        totalEpisodes: 4,
        freeEpisodesCount: 1,
        isFeatured: true,
        isVertical: true,
        viewsCount: 14850,
        likesCount: 5210,
        episodes: [
            {
                number: 1,
                title: "Parte 1: A Noiva Fugitiva",
                description: "Olivia escapa de seu casamento forçado e encontra abrigo nos braços de Edward.",
                youtubeUrl: "https://youtu.be/S-nggtnvDNQ",
                durationSeconds: 900,
                isFree: true
            },
            {
                number: 2,
                title: "Parte 2: Sob a Proteção da Máfia",
                description: "Edward impõe suas regras enquanto os homens da família de Olivia cercam o refúgio.",
                youtubeUrl: "https://youtu.be/fFhxQI6y3wE",
                durationSeconds: 900,
                isFree: false
            },
            {
                number: 3,
                title: "Parte 3: Segredos e Conspirações",
                description: "Uma armadilha é armada para desmascarar quem traiu Olivia dentro do clã.",
                youtubeUrl: "https://youtu.be/SKIMEY6-ly0",
                durationSeconds: 900,
                isFree: false
            },
            {
                number: 4,
                title: "Parte 4: O Resgate Final",
                description: "O confronto decisivo entre Edward e os algozes de Olivia pelo amor e pela liberdade.",
                youtubeUrl: "https://youtu.be/-LRRoOu6aI0",
                durationSeconds: 900,
                isFree: false
            }
        ]
    },
    {
        id: "tdx-sabio-implacavel",
        title: "O Retorno do Sábio Implacável (Dublado)",
        slug: "o-retorno-do-sabio-implacavel-dublado",
        synopsis: "Um mestre supremo retorna dos confins do esquecimento com poderes ancestrais para recuperar sua honra, punir os traidores e proteger aqueles que ama.",
        coverUrl: "https://img.youtube.com/vi/7lGa1ZBtqaE/hqdefault.jpg",
        bannerUrl: "https://img.youtube.com/vi/7lGa1ZBtqaE/hqdefault.jpg",
        category: "Dublado",
        tags: "anuncio,tendencias,dublado,artes-marciais,vinganca,poder",
        totalEpisodes: 3,
        freeEpisodesCount: 1,
        isFeatured: true,
        isVertical: true,
        viewsCount: 13920,
        likesCount: 4890,
        episodes: [
            {
                number: 1,
                title: "Parte 1: O Despertar do Sábio",
                description: "Após anos no anonimato, o sábio manifesta pela primeira vez seu poder lendário.",
                youtubeUrl: "https://youtu.be/7lGa1ZBtqaE",
                durationSeconds: 900,
                isFree: true
            },
            {
                number: 2,
                title: "Parte 2: Ajuste de Contas",
                description: "Os clãs rivais tentam intimidar a família, sem saber quem realmente está por trás da defesa.",
                youtubeUrl: "https://youtu.be/A5I4l6InJrk",
                durationSeconds: 900,
                isFree: false
            },
            {
                number: 3,
                title: "Parte 3: O Julgamento Supremo",
                description: "O clímax da batalha onde a justiça divina é imposta pelo sábio implacável.",
                youtubeUrl: "https://youtu.be/_z72kxxi2Eo",
                durationSeconds: 900,
                isFree: false
            }
        ]
    },
    {
        id: "tdx-corrida-coracao",
        title: "Corrida para o Meu Coração (Dublado)",
        slug: "corrida-para-o-meu-coracao-dublado",
        synopsis: "Ele é meu meio-irmão — Enzo Hawthorne, a nova estrela das pistas. Um romance veloz e proibido acelerando corações e superando limites familiares.",
        coverUrl: "https://img.youtube.com/vi/QScWtqBd8F4/hqdefault.jpg",
        bannerUrl: "https://img.youtube.com/vi/QScWtqBd8F4/hqdefault.jpg",
        category: "Dublado",
        tags: "anuncio,bombando,em_alta,dublado,romance,esportes",
        totalEpisodes: 3,
        freeEpisodesCount: 1,
        isFeatured: true,
        isVertical: true,
        viewsCount: 12400,
        likesCount: 4320,
        episodes: [
            {
                number: 1,
                title: "Parte 1: Velozes & Proibidos",
                description: "A chegada de Enzo no circuito mexe com as estruturas da família e acende faíscas proibidas.",
                youtubeUrl: "https://youtu.be/QScWtqBd8F4",
                durationSeconds: 900,
                isFree: true
            },
            {
                number: 2,
                title: "Parte 2: Curvas Perigosas",
                description: "A tensão cresce antes do campeonato enquanto os dois tentam negar a atração irresistível.",
                youtubeUrl: "https://youtu.be/PAMRUyD7gA8",
                durationSeconds: 900,
                isFree: false
            },
            {
                number: 3,
                title: "Parte 3: Linha de Chegada",
                description: "A corrida decisiva na pista e a decisão que definirá o futuro de ambos.",
                youtubeUrl: "https://youtu.be/X2cpywRmP1A",
                durationSeconds: 900,
                isFree: false
            }
        ]
    },
    {
        id: "tdx-noiva-falsa-bebe",
        title: "Um Bilionário, Uma Noiva Falsa, Um Bebê Inesperado",
        slug: "um-bilionario-uma-noiva-falsa-um-bebe-inesperado",
        synopsis: "Daisy engravida por engano de Axel, um bilionário poderoso. Ela se muda para a mansão como noiva contratada — e um amor que nenhum dos dois viu chegar desperta.",
        coverUrl: "https://img.youtube.com/vi/CCX-X2TOW6w/hqdefault.jpg",
        bannerUrl: "https://img.youtube.com/vi/CCX-X2TOW6w/hqdefault.jpg",
        category: "Dublado",
        tags: "anuncio,bombando,tendencias,dublado,bilionario,bebe-secreto,romance",
        totalEpisodes: 1,
        freeEpisodesCount: 1,
        isFeatured: true,
        isVertical: true,
        viewsCount: 16200,
        likesCount: 5800,
        episodes: [
            {
                number: 1,
                title: "Filme Completo (1h12): Do Contrato ao Amor",
                description: "Filme completo dublado acompanhando a jornada completa de Daisy e Axel do contrato ao verdadeiro amor.",
                youtubeUrl: "https://youtu.be/CCX-X2TOW6w",
                durationSeconds: 4320,
                isFree: true
            }
        ]
    },
    {
        id: "tdx-rei-dragao",
        title: "Casada com o Rei Dragão (Dublado)",
        slug: "casada-com-o-rei-dragao-dublado",
        synopsis: "Prometida em casamento ao temido e lendário Rei Dragão para salvar seu povo, ela descobre um guerreiro nobre aprisionado em maldições ancestrais.",
        coverUrl: "https://img.youtube.com/vi/K83ELHdnPBY/hqdefault.jpg",
        bannerUrl: "https://img.youtube.com/vi/K83ELHdnPBY/hqdefault.jpg",
        category: "Dublado",
        tags: "anuncio,tendencias,dublado,fantasia,alfa,romance",
        totalEpisodes: 2,
        freeEpisodesCount: 1,
        isFeatured: true,
        isVertical: true,
        viewsCount: 11800,
        likesCount: 4100,
        episodes: [
            {
                number: 1,
                title: "Parte 1: A Oferenda ao Reino",
                description: "A chegada ao castelo das brumas e a revelação da verdadeira face do Rei Dragão.",
                youtubeUrl: "https://youtu.be/K83ELHdnPBY",
                durationSeconds: 900,
                isFree: true
            },
            {
                number: 2,
                title: "Parte 2: O Despertar do Fogo",
                description: "O poder do dragão desperta para defender a noiva da inveja dos nobres conspiradores.",
                youtubeUrl: "https://youtu.be/QWLnkw74WMA",
                durationSeconds: 900,
                isFree: false
            }
        ]
    },
    {
        id: "tdx-cura-comeca-com-ela",
        title: "Minha Cura Começa com Ela (Dublado)",
        slug: "minha-cura-comeca-com-ela-dublado",
        synopsis: "O supremo Imortal Daniel renasce no corpo de um jovem desacreditado e descobre que a única pessoa capaz de purificar seu veneno espiritual e reacender seu poder é a mulher que o acolheu.",
        coverUrl: "https://img.youtube.com/vi/qaunJuAqKM4/hqdefault.jpg",
        bannerUrl: "https://img.youtube.com/vi/qaunJuAqKM4/hqdefault.jpg",
        category: "Dublado",
        tags: "anuncio,bombando,tendencias,dublado,sobrenatural,reencarnacao,artes-marciais",
        totalEpisodes: 7,
        freeEpisodesCount: 1,
        isFeatured: true,
        isVertical: true,
        viewsCount: 15400,
        likesCount: 5400,
        episodes: [
            {
                number: 1,
                title: "Parte 1: O Renascimento do Imortal",
                description: "Daniel desperta em seu novo corpo e tem seu primeiro encontro com a jovem curandeira.",
                youtubeUrl: "https://youtu.be/qaunJuAqKM4",
                durationSeconds: 900,
                isFree: true
            },
            {
                number: 2,
                title: "Parte 2: O Toque que Cura",
                description: "A purificação do veneno começa a restabelecer os meridianos espirituais de Daniel.",
                youtubeUrl: "https://youtu.be/L6ixni7YbtQ",
                durationSeconds: 900,
                isFree: false
            },
            {
                number: 3,
                title: "Parte 3: Inimigos Ocultos",
                description: "Os agressores do antigo hospedeiro retornam para cobrar dívidas e são surpreendidos.",
                youtubeUrl: "https://youtu.be/5nzT6noh3zo",
                durationSeconds: 900,
                isFree: false
            },
            {
                number: 4,
                title: "Parte 4: A Força Recuperada",
                description: "Daniel demonstra sua maestria em medicina ancestral e salva a matriarca do clã.",
                youtubeUrl: "https://youtu.be/ouyG-_dm86g",
                durationSeconds: 900,
                isFree: false
            },
            {
                number: 5,
                title: "Parte 5: Confronto no Clã",
                description: "A facção corrupta da família tenta tomar a liderança à força durante o banquete anual.",
                youtubeUrl: "https://youtu.be/EDIZ-dSCcs8",
                durationSeconds: 900,
                isFree: false
            },
            {
                number: 6,
                title: "Parte 6: A Grande Batalha",
                description: "Com suas técnicas celestiais restauradas, Daniel enfrenta o mestre enviado para destruí-lo.",
                youtubeUrl: "https://youtu.be/XilJu6-FOhI",
                durationSeconds: 900,
                isFree: false
            },
            {
                number: 7,
                title: "Parte 7: O Ápice do Poder",
                description: "O desfecho épico com a consagração do novo líder e a união definitiva com sua amada.",
                youtubeUrl: "https://youtu.be/0-aTwQBQsXw",
                durationSeconds: 900,
                isFree: false
            }
        ]
    },
    {
        id: "tdx-amor-marcado-destino",
        title: "Um Amor Marcado pelo Destino (Dublado)",
        slug: "um-amor-marcado-pelo-destino-dublado",
        synopsis: "A jovem Ivy tem uma noite inesquecível com o CEO Brian e engravida em segredo. Anos depois, reencontram-se no mundo corporativo e a antiga paixão ressurge com intensidade.",
        coverUrl: "https://img.youtube.com/vi/hgnoGxS1cng/hqdefault.jpg",
        bannerUrl: "https://img.youtube.com/vi/hgnoGxS1cng/hqdefault.jpg",
        category: "Dublado",
        tags: "bombando,em_alta,dublado,romance,ceo,bebe-secreto",
        totalEpisodes: 3,
        freeEpisodesCount: 1,
        isFeatured: false,
        isVertical: true,
        viewsCount: 10900,
        likesCount: 3950,
        episodes: [
            {
                number: 1,
                title: "Parte 1: A Noite Inesquecível",
                description: "Uma noite de paixão sem nomes que mudará para sempre o destino de Ivy e Brian.",
                youtubeUrl: "https://youtu.be/hgnoGxS1cng",
                durationSeconds: 900,
                isFree: true
            },
            {
                number: 2,
                title: "Parte 2: O Reencontro Empresarial",
                description: "Ivy é contratada pela holding de Brian e o choque do reencontro vem à tona.",
                youtubeUrl: "https://youtu.be/wcXyLk1Zyac",
                durationSeconds: 900,
                isFree: false
            },
            {
                number: 3,
                title: "Parte 3: A Revelação do Herdeiro",
                description: "Brian descobre a verdade sobre a criança e luta para reconquistar a família que sempre sonhou.",
                youtubeUrl: "https://youtu.be/_8Zv3Lvm-Yk",
                durationSeconds: 900,
                isFree: false
            }
        ]
    },
    {
        id: "tdx-natal-rei-mafia",
        title: "Natal com Meu Rei da Máfia (Dublado)",
        slug: "natal-com-meu-rei-da-mafia-dublado",
        synopsis: "Aroura é atraída para Nova York pelo próprio pai para quitar dívidas. Salva pelo mais temido líder da máfia da cidade, ela passará o Natal sob sua custódia e sedução inegável.",
        coverUrl: "https://img.youtube.com/vi/v4aM5xwsXeU/hqdefault.jpg",
        bannerUrl: "https://img.youtube.com/vi/v4aM5xwsXeU/hqdefault.jpg",
        category: "Dublado",
        tags: "em_alta,dublado,mafia,romance,especial",
        totalEpisodes: 1,
        freeEpisodesCount: 1,
        isFeatured: false,
        isVertical: true,
        viewsCount: 9800,
        likesCount: 3500,
        episodes: [
            {
                number: 1,
                title: "Filme Completo: Neve, Sangue & Paixão",
                description: "Filme completo dublado mostrando o Natal intenso e apaixonante de Aroura com o chefão da máfia.",
                youtubeUrl: "https://youtu.be/v4aM5xwsXeU",
                durationSeconds: 3600,
                isFree: true
            }
        ]
    },
    {
        id: "tdx-quando-nos-reencontrarmos",
        title: "Quando Nos Reencontrarmos (Dublado)",
        slug: "quando-nos-reencontrarmos-dublado",
        synopsis: "Evan, herdeiro bilionário, é violentamente separado da grávida Emily pelo pai intransigente. O reencontro anos depois testa o amor verdadeiro contra mentiras do passado.",
        coverUrl: "https://img.youtube.com/vi/dSdKVObAngk/hqdefault.jpg",
        bannerUrl: "https://img.youtube.com/vi/dSdKVObAngk/hqdefault.jpg",
        category: "Dublado",
        tags: "em_alta,dublado,drama,reencontro,romance,bilionario",
        totalEpisodes: 2,
        freeEpisodesCount: 1,
        isFeatured: false,
        isVertical: true,
        viewsCount: 9400,
        likesCount: 3280,
        episodes: [
            {
                number: 1,
                title: "Parte 1: A Separação Injusta",
                description: "As manipulações da família patriarcal para afastar o jovem casal.",
                youtubeUrl: "https://youtu.be/dSdKVObAngk",
                durationSeconds: 900,
                isFree: true
            },
            {
                number: 2,
                title: "Parte 2: O Retorno das Promessas",
                description: "Evan reencontra Emily e a filha e desmascara as intrigas do passado.",
                youtubeUrl: "https://youtu.be/Xz55hf1uCAQ",
                durationSeconds: 900,
                isFree: false
            }
        ]
    },
    {
        id: "tdx-superando-guarda-costas",
        title: "Superando Meu Guarda-Costas (Dublado)",
        slug: "superando-meu-guarda-costas-dublado",
        synopsis: "Enganada por seu segurança que cortejava sua meia-irmã traíra, Kelly dá o troco casando-se com Will Claflin, o homem mais poderoso da cidade, e assiste à queda dos seus algozes.",
        coverUrl: "https://img.youtube.com/vi/6_Jcsv3jA8s/hqdefault.jpg",
        bannerUrl: "https://img.youtube.com/vi/6_Jcsv3jA8s/hqdefault.jpg",
        category: "Dublado",
        tags: "bombando,dublado,vinganca,volta-por-cima,bilionario",
        totalEpisodes: 1,
        freeEpisodesCount: 1,
        isFeatured: false,
        isVertical: true,
        viewsCount: 11200,
        likesCount: 4050,
        episodes: [
            {
                number: 1,
                title: "Filme Completo (1h09): A Volta por Cima da Herdeira",
                description: "Filme completo dublado mostrando toda a virada de Kelly contra a falsidade do ex e de sua meia-irmã.",
                youtubeUrl: "https://youtu.be/6_Jcsv3jA8s",
                durationSeconds: 4140,
                isFree: true
            }
        ]
    },
    {
        id: "tdx-rei-sem-alcance",
        title: "O Rei Sem Alcance (Dublado)",
        slug: "o-rei-sem-alcance-dublado",
        synopsis: "Chamado de fraco e sem lobo pelos nobres arrogantes, ele guardava em segredo o poder ancestral dos reis primordiais que faz o reino inteiro se curvar.",
        coverUrl: "https://img.youtube.com/vi/XJ666WDzZwc/hqdefault.jpg",
        bannerUrl: "https://img.youtube.com/vi/XJ666WDzZwc/hqdefault.jpg",
        category: "Dublado",
        tags: "tendencias,dublado,alfa,fantasia,poder-oculto",
        totalEpisodes: 1,
        freeEpisodesCount: 1,
        isFeatured: false,
        isVertical: true,
        viewsCount: 8900,
        likesCount: 3120,
        episodes: [
            {
                number: 1,
                title: "Parte 1: O Despertar do Rei Adormecido",
                description: "A revelação esmagadora do lobo primordial diante do conselho do reino.",
                youtubeUrl: "https://youtu.be/XJ666WDzZwc",
                durationSeconds: 1200,
                isFree: true
            }
        ]
    },
    {
        id: "tdx-brilho-por-tras-disfarce",
        title: "O Brilho por Trás do Disfarce (Dublado)",
        slug: "o-brilho-por-tras-do-disfarce-dublado",
        synopsis: "Humilhada pela família do noivo por parecer uma mulher simples do interior, ninguém suspeitava que por trás de seu disfarce modesto ela era a maior investidora e estilista do país.",
        coverUrl: "https://img.youtube.com/vi/PJFkq8I5PJc/hqdefault.jpg",
        bannerUrl: "https://img.youtube.com/vi/PJFkq8I5PJc/hqdefault.jpg",
        category: "Dublado",
        tags: "em_alta,dublado,identidade-secreta,volta-por-cima,romance",
        totalEpisodes: 1,
        freeEpisodesCount: 1,
        isFeatured: false,
        isVertical: true,
        viewsCount: 9600,
        likesCount: 3410,
        episodes: [
            {
                number: 1,
                title: "Parte 1: O Segredo da Magnata Secreta",
                description: "A humilhação inicial e a reviravolta monumental no grande leilão de caridade.",
                youtubeUrl: "https://youtu.be/PJFkq8I5PJc",
                durationSeconds: 1200,
                isFree: true
            }
        ]
    },
    {
        id: "tdx-meu-rival-no-gelo",
        title: "Meu Rival no Gelo",
        slug: "meu-rival-no-gelo",
        synopsis: "No rink de hóquei a rivalidade é impiedosa, mas nos vestiários uma carta de amor anônima desencadeia faíscas que mudam a vida dos dois maiores atletas da liga.",
        coverUrl: "https://img.youtube.com/vi/pmcMbVFw1vY/hqdefault.jpg",
        bannerUrl: "https://img.youtube.com/vi/pmcMbVFw1vY/hqdefault.jpg",
        category: "Legendado",
        tags: "legendado,romance,esportes,lgbt,rivais-amantes",
        totalEpisodes: 1,
        freeEpisodesCount: 1,
        isFeatured: false,
        isVertical: true,
        viewsCount: 8400,
        likesCount: 2980,
        episodes: [
            {
                number: 1,
                title: "Parte 1: Faíscas Dentro e Fora do Gelo",
                description: "A descoberta da carta secreta e o primeiro confronto nos bastidores do estádio.",
                youtubeUrl: "https://youtu.be/pmcMbVFw1vY",
                durationSeconds: 1200,
                isFree: true
            }
        ]
    },
    {
        id: "tdx-olho-divino",
        title: "Olho Divino, Poder Sem Limites (Dublado)",
        slug: "olho-divino-poder-sem-limites-dublado",
        synopsis: "Enzo, discípulo excluído do Portal do Caos, desperta acidentalmente o Olho Celestial dos Antigos, adquirindo visão microscópica de meridianos e poder ilimitado.",
        coverUrl: "https://img.youtube.com/vi/azBf5joCVOE/hqdefault.jpg",
        bannerUrl: "https://img.youtube.com/vi/azBf5joCVOE/hqdefault.jpg",
        category: "Dublado",
        tags: "tendencias,dublado,artes-marciais,acao,fantasia,poder-oculto",
        totalEpisodes: 1,
        freeEpisodesCount: 1,
        isFeatured: false,
        isVertical: true,
        viewsCount: 9200,
        likesCount: 3340,
        episodes: [
            {
                number: 1,
                title: "Parte 1: A Visão Sagrada dos Deuses",
                description: "O despertar ocular que choca os anciãos da seita e muda o equilíbrio de forças.",
                youtubeUrl: "https://youtu.be/azBf5joCVOE",
                durationSeconds: 1200,
                isFree: true
            }
        ]
    },
    {
        id: "tdx-dormindo-30-anos",
        title: "Dormindo por 30 Anos, Irmãos Arrependidos (Dublado)",
        slug: "dormindo-por-30-anos-irmaos-arrependidos-dublado",
        synopsis: "Stella, filha querida dos Newsom, entra em coma por 30 anos após um acidente orquestrado. Ao acordar jovem como no dia em que adormeceu, encontra seus irmãos idosos desesperados por redenção.",
        coverUrl: "https://img.youtube.com/vi/CxElAK0XVG8/hqdefault.jpg",
        bannerUrl: "https://img.youtube.com/vi/CxElAK0XVG8/hqdefault.jpg",
        category: "Dublado",
        tags: "dublado,drama,familia,emocionante,redencao",
        totalEpisodes: 1,
        freeEpisodesCount: 1,
        isFeatured: false,
        isVertical: true,
        viewsCount: 8750,
        likesCount: 3100,
        episodes: [
            {
                number: 1,
                title: "Parte 1: Trinta Anos Depois",
                description: "O emocionante despertar e o reencontro com os irmãos já velhos e arrependidos.",
                youtubeUrl: "https://youtu.be/CxElAK0XVG8",
                durationSeconds: 1200,
                isFree: true
            }
        ]
    },
    {
        id: "tdx-noiva-virgem-alfa",
        title: "Noiva Virgem do Alfa (Dublado)",
        slug: "noiva-virgem-do-alfa-dublado",
        synopsis: "Bella foge desesperadamente de um casamento forçado e passa a noite com um misterioso estranho nos bosques sombrios, sem saber que ele é o implacável Alfa Supremo da alcateia.",
        coverUrl: "https://img.youtube.com/vi/FtkAYFMqQ5w/hqdefault.jpg",
        bannerUrl: "https://img.youtube.com/vi/FtkAYFMqQ5w/hqdefault.jpg",
        category: "Dublado",
        tags: "bombando,dublado,alfa,lobisomem,romance-sobrenatural",
        totalEpisodes: 1,
        freeEpisodesCount: 1,
        isFeatured: false,
        isVertical: true,
        viewsCount: 10100,
        likesCount: 3670,
        episodes: [
            {
                number: 1,
                title: "Parte 1: A Fuga para a Floresta Sagrada",
                description: "A noite no bosque que uniu para sempre os caminhos de Bella e do temido Alfa.",
                youtubeUrl: "https://youtu.be/FtkAYFMqQ5w",
                durationSeconds: 1200,
                isFree: true
            }
        ]
    },
    {
        id: "tdx-filho-do-alfa",
        title: "Filho do Alfa, Segredo do Amor (Dublado)",
        slug: "filho-do-alfa-segredo-do-amor-dublado",
        synopsis: "Seis anos atrás, ela fugiu após uma noite proibida que selou seu destino. Agora retorna com um pequeno garoto que carrega as marcas inconfundíveis da linhagem real dos alfas.",
        coverUrl: "https://img.youtube.com/vi/_LNJDsA8lwQ/hqdefault.jpg",
        bannerUrl: "https://img.youtube.com/vi/_LNJDsA8lwQ/hqdefault.jpg",
        category: "Dublado",
        tags: "em_alta,dublado,filho-secreto,alfa,romance",
        totalEpisodes: 1,
        freeEpisodesCount: 1,
        isFeatured: false,
        isVertical: true,
        viewsCount: 9950,
        likesCount: 3540,
        episodes: [
            {
                number: 1,
                title: "Parte 1: O Retorno do Pequeno Príncipe",
                description: "O retorno à cidade e o primeiro encontro entre o pai supremo e seu herdeiro desconhecido.",
                youtubeUrl: "https://youtu.be/_LNJDsA8lwQ",
                durationSeconds: 1200,
                isFree: true
            }
        ]
    },
    {
        id: "tdx-fortuna-e-poder",
        title: "Fortuna e Poder em Minutos (Dublado)",
        slug: "fortuna-e-poder-em-minutos-dublado",
        synopsis: "O entregador humilde Lucas Silva salva a CEO Bárbara Mendes de uma emboscada perigosa após um pequeno acidente. Recompensado com recursos bilionários, ele vira o jogo contra quem o humilhou.",
        coverUrl: "https://img.youtube.com/vi/Txf9isUWRmA/hqdefault.jpg",
        bannerUrl: "https://img.youtube.com/vi/Txf9isUWRmA/hqdefault.jpg",
        category: "Brasileiro",
        tags: "bombando,dublado,brasileiro,nacional,volta-por-cima,bilionario,acao",
        totalEpisodes: 2,
        freeEpisodesCount: 1,
        isFeatured: false,
        isVertical: true,
        viewsCount: 10450,
        likesCount: 3820,
        episodes: [
            {
                number: 1,
                title: "Parte 1: O Acidente que Mudou Tudo",
                description: "O socorro prestado por Lucas à presidente do conglomerado e sua primeira grande recompensa.",
                youtubeUrl: "https://youtu.be/Txf9isUWRmA",
                durationSeconds: 900,
                isFree: true
            },
            {
                number: 2,
                title: "Parte 2: O Novo Dono do Jogo",
                description: "Lucas assume a liderança das operações e cala os nobres que zombavam de suas origens.",
                youtubeUrl: "https://youtu.be/roTyx4Ywxnk",
                durationSeconds: 900,
                isFree: false
            }
        ]
    }
];
