import { BookInterface } from '../interfaces/book';

const books: BookInterface[] = [
  {
    id: '0001',
    name: 'Neuromancer',
    author: 'William Gibson',
    description: 'The sky over the harbor was the color of television tuned to an offline channel.',
    photo: '/assets/neuromancer.png',
    is_change: false,
    is_read: false,
    profile: {
      id: '0001',
      user_name: 'felipe.ogoms',
    },
  },
  {
    id: '0002',
    name: 'Jogador N1',
    author: 'Ernest Cline',
    description:
      'Eu tinha visto primeiro o filme e tinha gostado bastante. Não sabia que existia o livro, mas quando eu li. Me apaixonei na mesma hora, foi incrível. É como se eu estivesse sentindo as mesmas emoções do personagem. Nunca fiquei tão animado para ler um livro.',
    photo: '/assets/jogadorN1.jpg',
    is_change: false,
    is_read: false,
    profile: {
      id: '0001',
      user_name: 'felipe.ogoms',
    },
  },
  {
    id: '0003',
    name: 'Tartarugas até lá em baixo',
    author: 'John Green',
    description:
      'Um livro excelente para entender as nossas mentes e ações. E ter mais empatia sobre o que se pode passar na cabeça do coleguinha :)',
    photo: '/assets/turtles.jpg',
    is_change: true,
    is_read: false,
    profile: {
      id: '0001',
      user_name: 'felipe.ogoms',
    },
  },
  {
    id: '0004',
    name: 'Clean Code',
    author: 'Robert Martin',
    description:
      'O livro que me fez me sobre sair no estágio que trabalhei, era o único que tinha conhecimento sobre o clean code e padrões de projeto. Gostaria que outra pessoa também tivesse essa experiência.',
    photo: '/assets/cleancode.jpg',
    is_change: false,
    is_read: false,
    profile: {
      id: '0002',
      user_name: 'guaranolas',
    },
  },
  {
    id: '0005',
    name: 'As Extraordinárias Cores do Amanhã',
    author: 'Emily X.R. Pan',
    description:
      'Extremamente intrigante do começo ao fim. Com uma construção de personagem esplêndida, você fica frisado e quer terminar o mais breve possível. Sem dúvidas uma das melhores leituras de 2022.',
    photo: '/assets/asExtraodinariasCoresDoAmanha.png',
    is_change: false,
    is_read: false,
    profile: {
      id: '0004',
      user_name: 'paulacynthia',
    },
  },
  {
    id: '0006',
    name: 'Rainha Vermelha',
    author: 'Victoria Aveyard',
    description:
      'No início eu estava esperando um roteiro óbvio, mas depois que li o livro inteiro, me apaixonei! A história é muito boa, a escrita é melhor ainda, recomendo muito!!',
    photo: '/assets/rainhaVermelha.jpg',
    is_change: false,
    is_read: false,
    profile: {
      id: '0004',
      user_name: 'paulacynthia',
    },
  },
  {
    id: '0007',
    name: 'Harry Potter e a Pedra Filosofal',
    author: 'JK Rowling',
    description:
      'Harry Potter e a Pedra Filosofal foi um livro que me tirou da monotonia e me levou para um mundo esplêndido. Hoje, com cerca de 3 leituras acredito que ele mereça encontrar um novo potterhead!',
    photo: '/assets/harryPotter.png',
    is_change: false,
    is_read: false,
    profile: {
      id: '0004',
      user_name: 'paulacynthia',
    },
  },
];

export default books;
