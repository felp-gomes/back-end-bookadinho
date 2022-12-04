const express = require("express");
const app = express();
const cors = require("cors");
const {books} = require('./mocks/books');
const {profiles} = require('./mocks/profiles');
const {chats} = require('./mocks/chats');
const {notifications} = require('./mocks/notifications')
const time = new Date().toISOString()

app.use(cors());
app.use(express.json())

// all books -> http://localhost:3333/home
app.get("/home", (req, res) => {
  return res.json({ "status": "200", "result": books });
});

app.post("/login", (req, res) => {
  const {userName, password} = req.body
  if(!userName || !password) {
    return res.json({"status": "403", "message": "Nome de usuário e senha obrigatórios"});
  }

  const profile = profiles.find((profile) => profile.userName == userName && profile.password === password)

  if(!profile) {
    return res.json({"status": "403", "message": "Nome de usuário ou senha incorreta"});
  }

  return res.json({"status": "200", "result": profile});
});

//all profiles -> http://localhost:3333/profiles
app.get("/profiles", (req, res) => {
  return res.json({"status": "200", "result": profiles});
});

// profile for ID -> http://localhost:3333/profiles/0003
app.get("/profiles/:profileid", (req, res) => {
  const { profileid } = req.params;
  const profile = profiles.filter((profile) => profileid === profile.id)
  return res.json(profile.length > 0 ? {"status": "200", "result": profile} : {"status": "204", "message": "Perfil não encontrado!"});
});

// create_profile -> http://localhost:3333/create_profile
app.post("/create_profile", (req, res) => {
  const { name, userName, description = "", likes = [], changeBooks = [], latestReadings = [], photo = "", password = ""} = req.body;
  if(!name || !userName || !password) {
    return res.json({"status": "203", "message": "Nome de usuário e senha são obrigatórios!"});
  }

  if(profiles.some((profile) => userName === profile.userName)){
    return res.json({"status": "203", "message": "Nome de usuário já existente!"})
  }

  const indexPerfilCreated = profiles.push({ 
    id: `000${profiles.length + 1}`,
    name,
    userName,
    description,
    likes,
    changeBooks,
    latestReadings,
    photo,
    password
  });
  const perfilCreated = [profiles[indexPerfilCreated - 1]]
  return res.json({"status": "200", "result": perfilCreated})
});

// register_book -> http://localhost:3333/register_book
app.post('/register_book', (req, res) => {
    const { name, author, description, photo, profileid } = req.body;
    const bookOwner = profiles.find((profile) => profileid === profile.id);
    if(!name || !author || !description || !photo || !profileid || !bookOwner) {
      return res.json({"status": "203", "message": "Nome do livro, o autor, a descrição, a imagem do livro e usuário são obrigatórios!"});
    }
    const indexBookCreated = books.push({
      id: `000${books.length + 1}`,
      name,
      author,
      description,
      photo,
      profileid: {
        id: bookOwner.id,
        userName: bookOwner.userName
      }
    });
    const bookCreated = [books[indexBookCreated - 1]];
    return res.json({"status": "200", "result": bookCreated});
  }
)

// change_book -> http://localhost:3333/change_book/:bookid
app.get("/change_book/:bookid", (req, res) => {
  const { bookid } = req.params;
  const book = books.filter((book) => bookid === book.id);
  return res.json(book.length > 0 ? {"status": "200", "result": book} : {"status": "204", "message": "Livro não encontrado!"});
});

// chat_preview for id -> http://localhost:3333/chats/preview/:profileid
app.get("/chats/preview/:profileid", (req, res) => {
  const {profileid } = req.params;
  if(!profiles.some((profile) => profile.id === profileid)) {
    return res.json({"status": "203", "message": "O identificador do perfil é obrigatório"});
  }
  const talks = chats.filter((chat) => chat.recipient === profileid || chat.sender === profileid);
  if(talks.length === 0) {
    return res.json({"status": "200", "result": talks});
  };
  const preview = talks.map((talk, index) => {
    const {id, message, origin, time} = talk.messages[talk.messages.length - 1];
    const idContact = talk.recipient === profileid ? talk.sender : talk.recipient
    const {photo} = profiles.find((profile) => profile.id === idContact)
    return {
      "id": `000${index +1}`,
      "idChat": talk.id,
      "lastMessage": {
        id,
        message,
        origin,
        photo,
        time
      }
    };
  });
  return res.json({"status": "200", "result": preview});
});

// chat for id -> http://localhost:3333/chats/:idChat
app.get("/chats/:idChat", (req, res) => {
  const { idChat } = req.params;
  const chat = chats.filter((chat) => chat.id === idChat);
  return res.json(chat.length > 0 ? {"status": "200", "result": chat} : {"status": "204", "message": "Chat não encontrado!"});
});

app.get("/map", (req, res) => {
  res.send("Rota de maps");
});

app.get("/notifications/:profileid", (req, res) => {
  const {profileid } = req.params;
  if(!profiles.some((profile) => profile.id === profileid)) {
    return res.json({"status": "203", "message": "O identificador do perfil é obrigatório!"});
  }
  const notices = notifications.filter((notification) => notification.recipient.id === profileid)
  return res.json({"status": "200", "result": notices})
});

app.post("/notifications/create_notification", (req, res) => {
  const {sender = {}, recipient = {}, type} = req.body;
  if(!profiles.some((profile) => profile.id === recipient.id) || !profiles.some((profile) => profile.id === sender.id)) {
    return res.json({"status": "203", "message": "O identificador do perfil é obrigatório!"});
  }
  if(type !== 'follow' && type !== 'message') {
    return res.json({"status": "203", "message": "Tipo de notificação obrigatório!"});
  }

  const indexNotificationCreated = notifications.push({
    id: `000${books.length + 1}`,
    sender,
    recipient,
    type,
    time
  });
  const notificationCreated = [notifications[indexNotificationCreated - 1]];
  return res.json({"status": "200", "result": notificationCreated});
});


app.put("/profiles/edit_profile", (req, res) => {
  const { profileid, userName, description, photo, likes, latestReadings } = req.body;
  if(!profiles.some((profile) => profile.id === profileid) || !description || !userName || !photo || !likes || !latestReadings) {
    return res.json({"status": "203", "message": "O identificador, a descrição, o nome de usuário, a foto e os gostos são obrigatórios!"});
  }
  let indexProfile = 0
  const profile = profiles.find((profile, index) => {
    if(profile.id === profileid) {
      indexProfile = index
      return profile.id === profileid
    }
  })
  profile.userName = userName
  profile.description = description
  profile.photo = photo
  profile.likes = likes
  profile.latestReadings = latestReadings
  profiles[indexProfile] = profile
  return res.json({"status": "200", "result": [profile]})
});


app.get("/salvos/:perfilid", (req, res) => {
  res.send("Rota de salvos");
});

// app.post("/cadastrar_livro/:nomedolivro/:autor/:descricao", (req, res) => {
//   // res.send("Rota de cadastrarlivro");
//   const { nomedolivro, autor, descricao } = req.body;
//   livros.push({ nomedolivro, autor, descricao });

//   return res.json(livros);
// });

// app.post("/livros", (req, res) => {
//   const {nome} = req.body;
//   livros.push({nome});
//   return res.json(livros);
// });



app.get("/books/registered_books/:profileid", (req, res) => {
  const { profileid } = req.params;
  if(!profiles.some((profile) => profile.id === profileid)) {
    return res.json({"status": "203", "message": "O identificador do perfil é obrigatório"});
  }
  const booksUser = books.filter((book) => book.profile.id === profileid)
  return res.json({"status": "200", "result": booksUser})
});


app.listen(4000, () => {
  console.log("Servidor on :)");
});


