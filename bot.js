const Discord = require('discord.js');
const bot = new Discord.Client();
// const trello_events = require('./lib/TrelloEvents');
const BotCache = new require('./lib/BotCache')(bot);
// const TrelloEvents = new trello_events({
//   pollFrequency: 1000 * 60,
//   minId: 0,
//   start: true,
//   trello: {
//     boards: ['YC5ZhyHZ'],
//     // boards: ['3AwqHhQy'],
//     key: '757b8b7388014629fc1e624bde8cc600',
//     token: process.env.TRELLO_TOKEN
//   }
// });
// const Trello = require('./lib/Cache');
const Log = require('./lib/Logger').Logger;
const ServerConf = require('./lib/ServerConf');

const token = process.env.DISCORD_TESTING_BOT_TOKEN || process.env.BOT_TOKEN;
const channel = '219479229979426816'; // los discordos channel
// const channel = '175021235384614912'; // testing channel
let Prefix = 'T! ';
let GithubPrefix = 'G! ';
let ClientReady = false;


const Commands = {
  Help: require('./commands/Help')(bot),
  Invite: require('./commands/Invite')(bot),
  Ping: require('./commands/Ping')(bot),
  Stats: require('./commands/Stats')(bot),
  Say: require('./commands/Say')(bot),
  Clean: require('./commands/Clean')(bot),
  Eval: require('./commands/Eval')(bot),
  Exec: require('./commands/Exec')(bot),

  Conf: require('./commands/Conf')(bot),

  // Trello: {
  //   Cards: require('./commands/trello/Cards')(bot),
  //   CardsSearch: require('./commands/trello/CardsSearch')(bot),
  //   Members: require('./commands/trello/Members')(bot),
  //   MembersSearch: require('./commands/trello/MembersSearch')(bot)
  // },

  Github: {
    LatestEvents: require('./commands/github/Events')(bot),
    IssuesSearch: require('./commands/github/IssuesSearch')(bot),
    IssueNumber: require('./commands/github/IssueNumber')(bot),
    PullRequestsSearch: require('./commands/github/PullRequestsSearch')(bot),
    PullRequestNumber: require('./commands/github/PullRequestNumber')(bot),
    ReleaseNumber: require('./commands/github/ReleaseNumber')(bot),
    Init: require('./commands/github/Init')(bot),
    Remove: require('./commands/github/Remove')(bot),

    Help: require('./commands/github/Help')(bot),
    Announce: require('./commands/github/Announce')(bot),
  }
};

// ===== TRELLO =====
//
// TrelloEvents.on('trelloError', Log.error);
//
// // Card events
//
// TrelloEvents.on('createCard', e => {
//   if (!ClientReady) return false;
//
//   let card = {
//     name: e.data.card.name,
//     id: e.data.card.id,
//     list: e.data.list,
//     author: e.memberCreator,
//     date: e.date
//   };
//
//   Trello.GetCard(card.id).then(el => {
//     if (el) {
//       card = null;
//       return;
//     }
//     return Trello.AddCard(card.id, {
//       name: card.name,
//       desc: card.desc,
//       idList: card.list.id
//     });
//   }).then(() => {
//     if (!card) return false;
//     return bot.channels.get(channel).sendMessage(`**${card.author.fullName}** created card __${card.name}__ in _${card.list.name}_`);
//   }).catch(Log.error);
//
// });
//
// TrelloEvents.on('deleteCard', e => {
//   if (!ClientReady) return false;
//
//   let card = {
//     name: e.data.card.name,
//     id: e.data.card.id,
//     list: e.data.list,
//     author: e.memberCreator,
//     date: e.date
//   };
//
//   Trello.GetCard(card.id).then(card => {
//     if (!card) return false;
//
//     bot.channels.get(channel).sendMessage(`**${e.memberCreator.fullName}** deleted card __${card.name}__`);
//     return Trello.DeleteCard(card.id);
//   }).catch(Log.error);
//
// });
//
// TrelloEvents.on('commentCard', e => {
//   if (!ClientReady) return false;
//
//   let card = {
//     name: e.data.card.name,
//     id: e.data.card.id,
//     board: e.data.board,
//     comment: e.data.text,
//     author: e.memberCreator,
//     date: e.date
//   };
//
//   return bot.channels.get(channel).sendMessage(`**${card.author.fullName}** commented on __${card.name}__: \n\n \`\`\`xl\n${card.comment}\n\`\`\``);
//
// });
//
// TrelloEvents.on('updateCard', e => {
//   if (!ClientReady) return false;
//
//   if (!e.data.card || !e.data.old) return false;
//
//   let card = {
//     name: e.data.card.name,
//     id: e.data.card.id,
//     board: e.data.board,
//     list: e.data.list,
//     new: e.data.card,
//     old: e.data.old,
//     author: e.memberCreator,
//     date: e.date,
//     data: e.data
//   };
//
//   Trello.UpdateCard(card.id, card.new).then(() => {
//     if (e.data.old.desc && e.data.old.desc !== e.data.new.desc) {
//       bot.channels.get(channel).sendMessage(`**${card.author.fullName}** changed the description of __${card.name}__ to \n\n \`\`\`xl\n${card.new.desc}\n\`\`\``);
//     } else if (e.data.old && e.data.new && e.data.old.name !== e.data.new.name) {
//       bot.channels.get(channel).sendMessage(`**${card.author.fullName}** renamed card _${card.old.name}_ to __${card.new.name}__`);
//     } else if (e.data.listBefore && e.data.listAfter) {
//       return bot.channels.get(channel).sendMessage(`**${card.author.fullName}** moved card __${card.name}__ to \`${card.data.listAfter.name}\` (from _${card.data.listBefore.name}_)`);
//     }
//   }).catch(Log.error);
//
// });
//
// // List events
//
// TrelloEvents.on('createList', e => {
//   if (!ClientReady) return false;
//
//   let list = {
//     name: e.data.list.name,
//     board: e.data.board,
//     id: e.data.list.id,
//     author: e.memberCreator,
//     date: e.date
//   };
//
//   bot.channels.get(channel).sendMessage(`**${list.author.fullName}** created list __${list.name}__ in _${list.board.name}_`).catch(Log.error);
// });
//
// TrelloEvents.on('updateList', e => {
//   if (!ClientReady) return false;
//   if (!e.data.list || !e.data.old) return false;
//
//   let list = {
//     name: e.data.list.name,
//     id: e.data.list.id,
//     board: e.data.board,
//     new: e.data.list,
//     old: e.data.old,
//     author: e.memberCreator,
//     date: e.date
//   };
//
//   if (e.data.old.name && e.data.old.name !== e.data.list.name) {
//     bot.channels.get(channel).sendMessage(`**${list.author.fullName}** renamed list _${list.old.name}_ to __${list.new.name}__`).catch(Log.error);
//   }
// });
//
// // Board  events
// TrelloEvents.on('addMemberToBoard', e => {
//   if (!ClientReady) return false;
//
//   let member = {
//     name: e.member.fullName,
//     username: e.member.username,
//     id: e.member.id,
//     board: e.data.board,
//     invitedByLink: e.data.method == 'invitationSecret',
//     date: e.date
//   };
//
//   let message;
//
//   if (member.invitedByLink) {
//     message = `**${member.name}** joined _${member.board.name}_ with an invitation link.`;
//   } else {
//     message = `**${member.name}** was invited to _${member.board.name}_`;
//   }
//
//   bot.channels.get(channel).sendMessage(message).catch(Log.error);
// });
//
// TrelloEvents.on('updateBoard', e => {
//   if (!ClientReady) return false;
//
//   if (e.data.board && e.data.board.prefs && e.data.board.prefs.background) {
//
//     let board = {
//       id: e.data.board.id,
//       name: e.data.board.name,
//       newBackground: e.data.board.prefs.background,
//       oldBackground: e.data.old.prefs.background,
//       date: e.date,
//       author: e.memberCreator
//     };
//
//     bot.channels.get(channel).sendMessage(`**${board.author.fullName}** changed the background to \`${board.newBackground}\` (from _${board.oldBackground}_)`).catch(Log.error);
//   }
//
// });

// ===== DISCORD =====

require('./lib/CommandLogger')(bot);
require('./lib/Github')(bot);

// bot.on('message', msg => {
//   if (!msg.content.startsWith(Prefix) && !msg.content.startsWith(`<@!${bot.user.id}> `) && !msg.content.startsWith(`<@${bot.user.id}> `)) return false;
//
//   let content = msg.content.replace(Prefix, '').replace(`<@${bot.user.id}> ` , '').replace(`<@!${bot.user.id}> `, '');
//   let command = content.toLowerCase();
//   let args = content.split(' ').slice(1);
//
//   // Trello Commands
//   if (command === 'cards') return Commands.Trello.Cards(msg, command, args);
//   if (command.startsWith('cards search ')) return Commands.Trello.CardsSearch(msg, command, args);
//   if (command === 'members') return Commands.Trello.Members(msg, command, args);
//   if (command.startsWith('members search ')) return Commands.Trello.MembersSearch(msg, command, args);
//
// });

bot.on('guildCreate', (guild) => {
  let message = [
    '```diff',
    `+ Guild: ${guild.name}`,
    `+ Owner: @${guild.owner.user.username}#${guild.owner.user.discriminator}`,
    '```'
  ];
  bot.channels.get('231911521557544960').sendMessage(message);
  guild.owner.user.sendMessage([
    `Hi! I'm Yappy, a bot that outputs github events from repos into the desired channel.`,
    `To set up a custom prefix and a global repo for commands such as \`G! issue 5\`, say \`G! conf view\` to see the current configuration, and use \`G! conf set <key> <value\` to set config keys.`,
    `If you need to know where to point the webhook, say \`G! invite\` to see the webhook endpoint, and the events you should use.`,
    `This bot was made by @datitisev#4934. If you need any help, join our official server at **https://discord.gg/HHqndMG** for support.`,
    `Thank you for choosing Yappy!`
  ]);
});
bot.on('guildDelete', (guild) => {
  let message = [
    '```diff',
    `- Guild: ${guild.name}`,
    `- Owner: @${guild.owner.user.username}#${guild.owner.user.discriminator}`,
    '```'
  ];
  bot.channels.get('231911521557544960').sendMessage(message);
});
bot.on('message', msg => {
  if (!msg.content.startsWith(GithubPrefix) && !msg.content.startsWith(ServerConf.grab(msg.guild).prefix) && !msg.content.startsWith(`<@!${bot.user.id}> `) && !msg.content.startsWith(`<@${bot.user.id}> `)) return false;

  let content = msg.content.replace(`<@${bot.user.id}> ` , '').replace(`<@!${bot.user.id}> `, '');
  let CustomPrefix = ServerConf.grab(msg.guild).prefix;

  if (content.startsWith(GithubPrefix)) {
    content = content.replace(GithubPrefix, '')
  } else if (content.startsWith(CustomPrefix)) {
    content = content.replace(CustomPrefix, '');
  }

  let command = content.toLowerCase();
  let args = content.split(' ').slice(1);

  // Github Commands
  if (command.startsWith('events')) return Commands.Github.LatestEvents(msg, command, args);
  if (command.startsWith('issues search ')) return Commands.Github.IssuesSearch(msg, command, args);
  if (command.startsWith('issue ')) return Commands.Github.IssueNumber(msg, command, args);
  if (command.startsWith('pr search ')) return Commands.Github.PullRequestsSearch(msg, command, args);
  if (command.startsWith('pr ')) return Commands.Github.PullRequestNumber(msg, command, args);
  if (command.startsWith('release ')) return Commands.Github.ReleaseNumber(msg, command, args);

  if (command.startsWith('init ')) return Commands.Github.Init(msg, command, args);
  if (command.startsWith('remove')) return Commands.Github.Remove(msg, command, args);
  if (command.startsWith('announce ')) return Commands.Github.Announce(msg, command, args);
  if (command.startsWith('help')) return Commands.Github.Help(msg, command, args);

  // Other Commands
  if (command.startsWith('conf')) return Commands.Conf(msg, command, args);
  if (command.startsWith('say')) return Commands.Say(msg, command, args);
  if (command === 'clean') return Commands.Clean(msg, command, args);
  if (command === 'stats') return Commands.Stats(msg, command, args);
  if (command === 'ping') return Commands.Ping(msg, command, args);
  if (command === 'invite') return Commands.Invite(msg, command, args);

  if (command.startsWith('eval')) {
    Commands.Eval(msg, args.join(' '));
  } else if (command.startsWith('exec')) {
    Commands.Exec(msg, args.join(' '));
  }

})

bot.on('ready', () => {
  Log.info('=> Logged in!');
  setTimeout(() => {
    ClientReady = true;
  }, 7000);
});

bot.on('error', err => {
  Log.error(err);
});
bot.on('disconnect', () => Log.info('Disconnected! Reconnecting...'));

process.on('uncaughtException', err => {
  if (typeof err == 'object' && !!err.stack) {
    err.stack = err.stack.replace(new RegExp(__dirname, 'g'), '.');
  }

  let message = [
    '**UNCAUGHT EXCEPTION**',
    '',
    '```xl',
    err.stack || err,
    '```'
  ].join('\n');

  Log.error(err.stack);

  if (ClientReady) bot.users.get('175008284263186437').sendMessage(message);
});

Log.info('=> Logging in...');

bot.login(token).then(token => {
  // Detect if login failed or didn't occur after 7.5s
  setTimeout(() => {
    if (ClientReady) return false;
    Log.error('=> Unable to log in; invalid credentials or Discord is down');
  }, 7500);
}).catch(err => {
  Log.error('=> Unable to log in!');
  Log.error(err);
});
