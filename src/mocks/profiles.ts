import { UserType } from '../interfaces/user.js';

const profiles: UserType[] = [
  {
    id: 'ba7943b6-c15f-43c6-b4fa-9600fbc50e40',
    user_name: 'felipe.ogoms',
    name: 'Felipe Gomes',
    description: 'The sky over the harbor was the color of television tuned to an offline channel.',
    likes: ['LoL', 'Ficção', 'Romance', 'Cyberpunk', 'Cyber', 'Tecnologia', 'Fanfic'],
    latest_readings: [
      'Jogador N1',
      'Tartarugas até lá em baixo',
      'Alice no pais das maravilhas',
      'Até a próxima estrela',
    ],
    photo:
      'https://instagram.ffor29-1.fna.fbcdn.net/v/t51.2885-19/151841773_141305464507911_2460237208396643498_n.jpg?stp=dst-jpg_s150x150',
    password: 'senha',
    email: 'felipe@bookadinho.com',
    is_activated: true,
  },
  {
    id: 'ff8977a1-990f-49de-88cf-f7f6953ff262',
    name: 'Cynthia',
    user_name: 'paulacynthia',
    description: 'Desenvolvedora front-end e leitora nas horas vagas',
    likes: ['Animes', 'Livros', 'Música', 'Tecnologia'],
    latest_readings: ['As extraordinárias cores do amanhã', 'Rainha Vermelha', 'Até a próxima estrela'],
    photo: null,
    password: 'pc',
    email: 'pc@bookadinho.com',
    is_activated: true,
  },
];

export default profiles;
