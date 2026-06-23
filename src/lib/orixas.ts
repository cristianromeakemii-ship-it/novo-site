export type OrixaArticle = {
  slug: string
  nome: string
  saudacao: string
  cores: string
  dia: string
  dominio: string
  resumo: string
  paragrafos: string[]
  faq: { pergunta: string; resposta: string }[]
  categoriaSub: string // slug da subcategoria de produtos correspondente
}

// Conteudo informacional sobre os orixas (visao da Umbanda/Candomble).
// Pode variar entre casas e nacoes; textos com tom respeitoso.
export const orixas: OrixaArticle[] = [
  {
    slug: "oxala",
    nome: "Oxalá",
    saudacao: "Epa Babá!",
    cores: "Branco",
    dia: "Sexta-feira",
    dominio: "Criação, paz, fé e sabedoria",
    resumo: "Orixá da criação e da paz, associado à cor branca e à serenidade.",
    paragrafos: [
      "Oxalá é reverenciado como o orixá da criação, da paz e da fé. Pai de todos os orixás em muitas tradições, representa a calma, a sabedoria e a pureza. Sua cor é o branco, e a sexta-feira costuma ser dedicada a ele — dia em que muitos vestem branco em sinal de respeito.",
      "As guias (colares de contas) de Oxalá são geralmente feitas com contas brancas leitosas ou cristal, simbolizando luz, proteção e elevação espiritual. No sincretismo religioso, Oxalá é frequentemente associado a Jesus Cristo e ao Senhor do Bonfim.",
    ],
    faq: [
      { pergunta: "Qual a cor da guia de Oxalá?", resposta: "A guia de Oxalá é tradicionalmente branca, com contas leitosas ou de cristal, simbolizando paz e luz." },
      { pergunta: "Qual o dia de Oxalá?", resposta: "A sexta-feira é o dia mais associado a Oxalá em muitas casas; alguns também o cultuam no domingo." },
      { pergunta: "Qual a saudação de Oxalá?", resposta: "A saudação é 'Epa Babá!', que reverencia o pai da criação." },
    ],
    categoriaSub: "oxala",
  },
  {
    slug: "oxum",
    nome: "Oxum",
    saudacao: "Ora ieiê ô!",
    cores: "Dourado e amarelo",
    dia: "Sábado",
    dominio: "Amor, fertilidade, águas doces e prosperidade",
    resumo: "Orixá das águas doces, do amor e da prosperidade, ligada ao ouro e ao dourado.",
    paragrafos: [
      "Oxum é a orixá das águas doces — rios e cachoeiras —, do amor, da fertilidade e da prosperidade. Símbolo de beleza, doçura e maternidade, é também associada ao ouro, o que explica o dourado de suas guias e adornos.",
      "As guias de Oxum costumam usar contas douradas, amarelas ou cristal âmbar. No sincretismo, Oxum é associada a Nossa Senhora da Conceição e a Nossa Senhora Aparecida em diversas regiões do Brasil.",
    ],
    faq: [
      { pergunta: "Qual a cor da guia de Oxum?", resposta: "A guia de Oxum é dourada ou amarela, refletindo sua ligação com o ouro e as águas doces." },
      { pergunta: "O que Oxum representa?", resposta: "Oxum representa o amor, a fertilidade, a prosperidade e as águas doces (rios e cachoeiras)." },
      { pergunta: "Qual a saudação de Oxum?", resposta: "A saudação é 'Ora ieiê ô!'." },
    ],
    categoriaSub: "oxum",
  },
  {
    slug: "iemanja",
    nome: "Iemanjá",
    saudacao: "Odoyá!",
    cores: "Azul-claro, branco e prata",
    dia: "Sábado",
    dominio: "Maternidade, mar e proteção",
    resumo: "A Rainha do Mar, orixá da maternidade e da proteção, ligada ao azul e ao branco.",
    paragrafos: [
      "Iemanjá é a Rainha do Mar, mãe que acolhe e protege. Orixá da maternidade e das águas salgadas, é uma das mais populares e amadas no Brasil, homenageada em festas à beira-mar com flores e oferendas.",
      "As guias de Iemanjá usam tons de azul-claro, branco e cristal, lembrando o mar e a espuma das ondas. No sincretismo, é associada a Nossa Senhora dos Navegantes e a Nossa Senhora da Conceição.",
    ],
    faq: [
      { pergunta: "Qual a cor da guia de Iemanjá?", resposta: "Azul-claro, branco e cristal/prata, em referência ao mar." },
      { pergunta: "Qual a saudação de Iemanjá?", resposta: "A saudação é 'Odoyá!'." },
      { pergunta: "Quando se celebra Iemanjá?", resposta: "Há celebrações em 2 de fevereiro e na virada do ano, com oferendas de flores ao mar." },
    ],
    categoriaSub: "iemanja",
  },
  {
    slug: "ogum",
    nome: "Ogum",
    saudacao: "Ogunhê!",
    cores: "Azul-escuro, vermelho e verde",
    dia: "Terça-feira",
    dominio: "Trabalho, caminhos, guerra e proteção",
    resumo: "Orixá guerreiro do ferro, do trabalho e da abertura de caminhos.",
    paragrafos: [
      "Ogum é o orixá guerreiro, senhor do ferro, das batalhas e da abertura de caminhos. Protetor incansável, é também o orixá do trabalho e da tecnologia, invocado para vencer obstáculos e conquistar vitórias.",
      "As guias de Ogum costumam ser azul-escuras (em algumas casas, vermelhas ou verdes). No sincretismo, Ogum é amplamente associado a São Jorge, o santo guerreiro.",
    ],
    faq: [
      { pergunta: "Qual a cor da guia de Ogum?", resposta: "Geralmente azul-escura; em algumas casas, vermelha ou verde." },
      { pergunta: "Qual o dia de Ogum?", resposta: "A terça-feira é o dia mais associado a Ogum." },
      { pergunta: "Qual a saudação de Ogum?", resposta: "A saudação é 'Ogunhê!'." },
    ],
    categoriaSub: "ogum",
  },
  {
    slug: "iansa",
    nome: "Iansã",
    saudacao: "Eparrei!",
    cores: "Vermelho e coral",
    dia: "Quarta-feira",
    dominio: "Ventos, tempestades, raios e coragem",
    resumo: "Orixá dos ventos e dos raios, guerreira de coragem e paixão.",
    paragrafos: [
      "Iansã (Oyá) é a orixá dos ventos, das tempestades e dos raios. Guerreira corajosa e apaixonada, é senhora dos movimentos e das transformações, conhecida também por conduzir os espíritos (eguns).",
      "As guias de Iansã usam o vermelho e o coral. No sincretismo, é associada a Santa Bárbara, padroeira contra os raios e tempestades.",
    ],
    faq: [
      { pergunta: "Qual a cor da guia de Iansã?", resposta: "Vermelha ou coral, em referência ao fogo e aos raios." },
      { pergunta: "O que Iansã representa?", resposta: "Iansã representa os ventos, as tempestades, os raios, a coragem e a paixão." },
      { pergunta: "Qual a saudação de Iansã?", resposta: "A saudação é 'Eparrei!'." },
    ],
    categoriaSub: "iansa",
  },
  {
    slug: "xango",
    nome: "Xangô",
    saudacao: "Kaô Kabecilê!",
    cores: "Marrom, vermelho e branco",
    dia: "Quarta-feira",
    dominio: "Justiça, fogo, trovão e pedreiras",
    resumo: "Orixá da justiça e do trovão, senhor das pedreiras e do fogo.",
    paragrafos: [
      "Xangô é o orixá da justiça, do fogo e do trovão, senhor das pedreiras. Firme e justo, é invocado em causas que pedem equilíbrio e julgamento reto. Seu símbolo é o machado de dois gumes (oxê).",
      "As guias de Xangô costumam combinar marrom com vermelho e branco. No sincretismo, é associado a São Jerônimo e, em algumas regiões, a São João Batista.",
    ],
    faq: [
      { pergunta: "Qual a cor da guia de Xangô?", resposta: "Marrom, frequentemente combinada com vermelho e branco." },
      { pergunta: "O que Xangô representa?", resposta: "Xangô representa a justiça, o fogo, o trovão e as pedreiras." },
      { pergunta: "Qual a saudação de Xangô?", resposta: "A saudação é 'Kaô Kabecilê!'." },
    ],
    categoriaSub: "xango",
  },
]

export function getOrixa(slug: string): OrixaArticle | null {
  return orixas.find((o) => o.slug === slug) || null
}
