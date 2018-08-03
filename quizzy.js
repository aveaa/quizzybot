const Discord = require('discord.js');
const cheerio = require('cheerio'),
      snekfetch = require('snekfetch'),
      querystring = require('querystring');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', () => {
  console.log('[SYSTEM] Успешная авторизация');
});

client.on("guildMemberAdd", (member) => {
  console.log(`"${member.user.username}" зашёл на сервер`);
  client.channels.get("456110637051936809").send(`"${member.user.username}" зашёл на сервер. Пожалуйста, понефрите.`);
});

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

client.on("message", async message => {
  console.log(`[SPY] | #` + message.channel.name + ` | ` + message.author.tag + `: ` + message.content);
  
  const prefixes = ['!', '?', '/', '$', '#', '@', '!!', '!!!', '^', '&', '-', '--', '=', '==', 'q!', '.'];
  let prefix = false;
  for(const thisPrefix of prefixes) {
    if(message.content.startsWith(thisPrefix)) prefix = thisPrefix;
  }
  if(!prefix) return;
  
  if(message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
	
	const swearWords = ['anal',
'anus',
'arse',
'ass',
'ballsack',
'balls',
'bastard',
'bitch',
'biatch',
'bloody',
'blowjob',
'blow job',
'bollock',
'bollok',
'boner',
'boob',
'bugger',
'bum',
'butt',
'buttplug',
'clitoris',
'cock',
'coon',
'crap',
'cunt',
'damn',
'dick',
'dildo',
'dyke',
'fag',
'feck',
'fellate',
'fellatio',
'felching',
'fuck',
'f u c k',
'fudgepacker',
'fudge packer',
'flange',
'Goddamn',
'God damn',
'hell',
'homo',
'jerk',
'jizz',
'knobend',
'knob end',
'labia',
'lmao',
'lmfao',
'muff',
'nigger',
'nigga',
'omg',
'penis',
'piss',
'poop',
'prick',
'pube',
'pussy',
'queer',
'scrotum',
'sex',
'shit',
's hit',
'sh1t',
'slut',
'smegma',
'spunk',
'tit',
'tosser',
'turd',
'twat',
'vagina',
'wank',
'whore',
'wtf'];
if( swearWords.some(word => message.content.includes(word)) ) {
	message.delete();
  message.reply("следите за своими словами");
}

if (message.content === prefix + "google") {
	let searchMessage = await message.reply('Searching... Sec.');
   let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(message.content)}`;

   return snekfetch.get(searchUrl).then((result) => {

      let $ = cheerio.load(result.text);

      let googleData = $('.r').first().find('a').first().attr('href');

      googleData = querystring.parse(googleData.replace('/url?', ''));
      searchMessage.edit(`Result found!\n${googleData.q}`);

  }).catch((err) => {
     searchMessage.edit('No results found!');
  });
}
	
	if (message.content === prefix + "msgpurge") {
		let err = false;
['MANAGE_MESSAGES'].forEach(function (item) {
            if (!message.member.hasPermission(item, false, true, true)) {
                err = true;
            }
        });
if (err) return message.reply("у Вас нету доступа для совершения этого действия");
	const user = message.mentions.users.first();
const amount = !!parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2])
if (!amount) return message.reply('необходимо указать число для удаления');
if (!amount && !user) return message.reply('необходимо указать пользователя и число или просто количество сообщений для очистки');
message.channel.fetchMessages({
 limit: amount,
}).then((messages) => {
 if (user) {
 const filterBy = user ? user.id : Client.user.id;
 messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
 }
 message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
});
	}

  if (message.content === prefix + "eval") {
    if(message.author.id !== config.developerID) return message.reply("у Вас нету доступа для совершения этого действия");
    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
	
	if(message.content === prefix + "silentkick") {
		let err = false;
['KICK_MEMBERS'].forEach(function (item) {
            if (!message.member.hasPermission(item, false, true, true)) {
                err = true;
            }
        });
if (err) return message.reply("у Вас нету доступа для совершения этого действия");
  let member = message.mentions.members.first();
  member.kick();
  message.delete();
}
	
	if(message.content === prefix + "kick") {
		let err = false;
['KICK_MEMBERS'].forEach(function (item) {
            if (!message.member.hasPermission(item, false, true, true)) {
                err = true;
            }
        });
if (err) return message.reply("у Вас нету доступа для совершения этого действия");
  let member = message.mentions.members.first();
let reason = args.slice(1).join(" ");
  member.kick(reason);
  message.channel.send(`Успешно выгнан пользователь ${member.tag} модератором ${message.author} | Причина: ${reason}`);
}
	if(message.content === prefix + "silentban") {
		let err = false;
['BAN_MEMBERS'].forEach(function (item) {
            if (!message.member.hasPermission(item, false, true, true)) {
                err = true;
            }
        });
if (err) return message.reply("у Вас нету доступа для совершения этого действия");
  let member = message.mentions.members.first();
  member.ban();
  message.delete();
}
	
	if(message.content === prefix + "ban") {
		let err = false;
['BAN_MEMBERS'].forEach(function (item) {
            if (!message.member.hasPermission(item, false, true, true)) {
                err = true;
            }
        });
if (err) return message.reply("у Вас нету доступа для совершения этого действия");
  let member = message.mentions.members.first();
let reason = args.slice(1).join(" ");
  member.ban(reason);
  message.channel.send(`Успешно заблокирован пользователь ${member.tag} модератором ${message.author} | Причина: ${reason}`);
}
	
	if(message.content === prefix + "say"){
		let err = false;
['ADMINISTRATOR'].forEach(function (item) {
            if (!message.member.hasPermission(item, false, true, true)) {
                err = true;
            }
        });
if (err) return message.reply("у Вас нету доступа для совершения этого действия");
  let text = args.slice(1).join(" ");
  message.delete();
  message.channel.send(text);
}
	
	if(message.content === prefix + "help") {
    message.channel.send({embed: {
	    title: `QuizzyBOT`,
	    description: `Есть три вида команды о помощи:\n\n${prefix}userhelp > Помощь по командам для обычного пользователя\n${prefix}modhelp > Помощь по командам для модератора\n${prefix}adminhelp > Помощь по командам для разработчика`
}
});
	}
	
	if(message.content === prefix + "userhelp") {
    message.author.send({embed: {
	    title: `QuizzyBOT > Помощь по командам для обычного пользователя`,
	    description: `Сорри, для вас нету команд.`
}
});
	}
	
	if(message.content === prefix + "modhelp") {
		let err = false;
['MANAGE_MESSAGES'].forEach(function (item) {
            if (!message.member.hasPermission(item, false, true, true)) {
                err = true;
            }
        });
if (err) return message.reply("у Вас нету доступа для совершения этого действия");
    message.author.send({embed: {
	    title: `QuizzyBOT > Помощь по командам для модератора`,
	    description: `${prefix}kick [@упоминание] [причина] > Выгнать пользователя с сервера\n${prefix}silentkick [@упоминание] > Скрытно выгнать пользователя с сервера\n${prefix}ban [@упоминание] [причина] > Заблокировать пользователя на сервере\n${prefix}silentban [@упоминание] > Скрытно заблокировать пользователя на сервере\n${prefix}say [текст] > Сказать что-то от имени бота`
}
});
	}
	
	if(message.content === prefix + "adminhelp") {
		if(message.author.id !== config.developerID) return message.reply("у Вас нету доступа для совершения этого действия");
    message.author.send({embed: {
	    title: `QuizzyBOT > Помощь по командам для разработчика`,
	    description: `${prefix}eval [текст] > Эмулирование кода`
}
});
	}
	
});

client.login(process.env.BOT_TOKEN);