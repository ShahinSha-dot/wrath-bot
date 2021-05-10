const Discord = require('discord.js');
const client = new Discord.Client();
const ms = require('ms');
const PREFIX = "!";
require('dotenv').config();
require('events').EventEmitter.defaultMaxListeners = 30

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


function getUserFromMention(mention) {
	// The id is the first and only match found by the RegEx.
	const matches = mention.match(/^<@!?(\d+)>$/);

	// If supplied variable was not a mention, matches will be null instead of an array.
	if (!matches) return;

	// However, the first element in the matches array will be the entire mention, not just the ID,
	// so use index 1.
	const id = matches[1];

	return client.users.cache.get(id);
}

client.on('message',  (message) => {
  if (message.author.bot) return;
  if (message.content === '!ping') {
    message.channel.send(`🏓Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
  }
  if (message.content === 'fruits') {
    message.react('🍎')
			.then(() => message.react('🍊'))
			.then(() => message.react('🍇'))
			.catch(error => console.error('One of the emojis failed to react:', error));
	}
  if (message.content === "lol"){
    message.channel.send('lololol')
  }
  if (message.content.startsWith(PREFIX)){
    const [CMD, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);
    if (CMD === 'kick') {
      const { member, mentions } = message
      if (
        member.hasPermission('ADMINISTRATOR') ||
        member.hasPermission('KICK_MEMBERS')
      ) {
        const target = mentions.users.first()
        const tag = `<@${target.id}>`
        if (target) {
          const targetMember = message.guild.members.cache.get(target.id)
          targetMember.kick()
          message.channel.send(`${targetMember} has been kicked`)
        } else {
          message.channel.reply(`Please specify someone to kick.`)
        }
      } else {
        message.channel.send(
          `You do not have permission to use this command.`
        )
      }
    }
    if (CMD === 'ban') {
      const { member, mentions } = message
      if (
        member.hasPermission('ADMINISTRATOR') ||
        member.hasPermission('BAN_MEMBERS')
      ) {
        const target = mentions.users.first()
        const tag = `<@${target.id}>`
        if (target) {
          const targetMember = message.guild.members.cache.get(target.id)
          targetMember.ban()
          message.channel.send(`${targetMember} has been banned`)
        } else {
          message.channel.send(`Please specify someone to ban.`)
        }
      } else {
        message.channel.send(
          `You do not have permission to use this command.`
        )
      }
    }
    if (CMD === 'nuke') {
      const { member, mentions } = message
      if (
        member.hasPermission('ADMINISTRATOR') ||
        member.hasPermission('BAN_MEMBERS')
      ) {
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.send('Go die noob')
        }

        message.channel.clone().then(channel => {
            channel.setPosition(message.channel.position)
            channel.send('nuked')
        })
        const embed = new Discord.MessageEmbed()
              .setTitle("Nuked")
              .setColor("RANDOM")
              .setDescription(`This channel have been nuked`)
              .setTimestamp()

        message.channel.send({embed})
      }
      else {
        message.channel.send(
          `You do not have permission to use this command.`
        )
      }
    }
    if (CMD === 'help') {
      const embed = new Discord.MessageEmbed().setColor("RANDOM");
              embed
                  .setTitle("Basic Commands")
                  .setImage("https://media.discordapp.net/attachments/806833059348348928/806834446783217694/VID_20210204144110.gif?width=100&height=100")
                  .addFields(
                      { name: '**!help**', value: 'Shows a list of all the commands.' },
                      { name: '**!invite**', value: 'Get the Invite link of server.' },
                      { name: '**!ping**', value: 'Get the bot latency.' },
                      { name: '**!poll**', value: 'Create a simple poll' },
                      { name: '**!avatar**', value: 'Display the avatar of the person' },
                      { name: '**!report**', value: 'Report someone to the mods along with reason' },
                      { name: '**!suggest**', value: 'Give suggestions to server officials' },
                      { name: '**!info**', value: 'Get the server information.' },
                  )
                  .setFooter('!modHelp : for next page');
            message.channel.send(embed)
    }
    if (CMD === 'modHelp') {
      const embed = new Discord.MessageEmbed().setColor("RANDOM");
            embed
                .setTitle("Mod Commands")
                .setImage("https://media.discordapp.net/attachments/806833059348348928/806834446783217694/VID_20210204144110.gif?width=100&height=100")
                .addFields(
                  { name: '**!mute**', value: 'Mute the person.' },
                  { name: '**!unmute**', value: 'unmute the user.' },
                  { name: '**!kick**', value: 'Kick the user.' },
                  { name: '**!ban**', value: 'Ban the user' },
                  { name: '**!purge**', value: 'Delete the specified number of message from channel.' },
                  { name: '**!nuke**', value: 'Delete the channel and makes a new one.' },
                )
          message.channel.send(embed)}

    if (CMD === 'purge') {
      const { member, mentions } = message
      const args = message.content.slice(PREFIX.length).trim().split(' ');

      if (member.hasPermission('ADMINISTRATOR')) {
          if (!args[1]) return message.reply("Yo genius enter a number.");
          if (isNaN(args[1])) return message.reply("lol enter a real number");

          if (args[1] > 100) return message.reply("Bruh, i cant delete more than 100 messages at a time.");
          if (args[1] < 1) return message.reply("Not your marks, Messages?.");

          message.channel.messages.fetch({ limit: Number(args[1]) + 1}).then(messages => {
              message.channel.bulkDelete(messages)
          })
          const embed = new Discord.MessageEmbed()
                .setTitle("Purged")
                .setColor("RANDOM")
                .setDescription(`${args[1]} messages have been purged`)
                .setTimestamp()

    			message.channel.send({embed})
      } else {
          message.channel.send('you aint a mod.')
      }

    }
    if(CMD === 'invite'){
      const inv = "https://discord.gg/wtKB8BTA66"
        message.channel.send(inv);
      }
    if (CMD === 'mute') {
      const { member, mentions } = message
      const args = message.content.slice(PREFIX.length).trim().split(' ');
      const muteRole = message.guild.roles.cache.find(
        (role) => role.name === 'Muted'
       );
      if (!muteRole)
       return message.channel.send('There is no Muted role on this server');
      if (
        member.hasPermission('ADMINISTRATOR')
      ) {
        const memberTarget = message.mentions.members.first();
        const mainRole = message.guild.roles.cache.find(r => r.name === '「WRATH」・COMMUNITY')
        if (!args[1]) {
                    memberTarget.roles.remove(mainRole.id);
                    memberTarget.roles.add(muteRole.id);
                    const embed = new Discord.MessageEmbed()
                          .setTitle("Muted")
                          .setColor("RANDOM")
                          .setDescription(`has muted <@${memberTarget.user.id}> indefinitely.`)
                          .setTimestamp()
                    message.reply(embed);
                    return
                }

                memberTarget.roles.remove(mainRole.id);
                memberTarget.roles.add(muteRole.id);
                const embed = new Discord.MessageEmbed()
                      .setTitle("Muted")
                      .setColor("RANDOM")
                      .setDescription(`has muted <@${memberTarget.user.id}> for ${ms(ms(args[1]))}.`)
                      .setTimestamp()
                message.reply(embed);

                setTimeout(function () {
                    memberTarget.roles.add(mainRole.id);
                    memberTarget.roles.remove(muteRole.id);
                }, ms(args[1]));
      } else {
        message.channel.send(
          `You do not have permission to use this command.`
        )
      }
    }
    if (CMD === 'poll'){
      if (!args[0]) return message.reply("Please enter a messsage.");
        let messageArgs = args.slice(0).join(" ");

        let embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`Poll - Made By ${message.author.username}`)
            .setDescription(`**"` + `${messageArgs}` + `"**`);

        message.channel.send(embed).then(embedMessage => {
          embedMessage.react("👍");
          embedMessage.react("👎");
        });
        message.delete({ timeout: 1000 })
    }
    if (CMD === 'avatar') {
      if (args[0]) {
  			const user = getUserFromMention(args[0]);
  			if (!user) {
  				return message.reply('Please use a proper mention if you want to see someone elses avatar.');
  			}
        const embed = new Discord.MessageEmbed()
              .setTitle("Avatar")
              .setColor("#d41646")
              .setDescription(`${user.username}'s avatar:`)
              .setImage(`${user.displayAvatarURL({ dynamic: true })}`)
              .setTimestamp()

  			return message.channel.send({embed})
  		}
      const embed = new Discord.MessageEmbed()
            .setTitle("Avatar")
            .setColor("#d41646")
            .setDescription(`${message.author.username}'s avatar:`)
            .setImage(`${message.author.displayAvatarURL({ dynamic: true })}`)
            .setTimestamp()

  		return message.channel.send({embed})
    }
    if (CMD === 'report'){
      const abuser = getUserFromMention(args[0]);
      const user = message.author.username
      const role = "819204409942212630"
      const channel = client.channels.cache.find(channel => channel.name === "𒁷「report」")
      if (!abuser) {
        return message.reply('Mention the person');
      }
      if (!args[0]) return message.reply("Please provide a reason.");
      const embed = new Discord.MessageEmbed()
            .setTitle("New report")
            .setColor("RANDOM")
            .setDescription(args)
            .addFields([
              {
                name: 'Reported by: ',
                value: user,
              },
              {
                name: "Reported against:",
                value: abuser,
              }
            ])
      channel.send(embed)
      channel.send(`<@&${role}> Check this issue out!`);

    }
    if (CMD === 'suggest'){
      const user = message.author.username
      const role = "819204409942212630"
      const channel = client.channels.cache.find(channel => channel.name === "𒁷「suggestions」")
      if (!args[0]) return message.reply("Please provide he suggestion.");
      const embed = new Discord.MessageEmbed()
            .setTitle("New suggestion")
            .setColor("RANDOM")
            .setDescription(args.join(" "))
            .addFields([
              {
                name: 'Suggested by: ',
                value: user,
              },
            ])
      channel.send(embed).then(embedMessage => {
        embedMessage.react("👍");
        embedMessage.react("👎");
      });
      channel.send(`<@&${role}> Check this issue out!`);

    }
    if (CMD === 'info') {
      const embed = new Discord.MessageEmbed()
            .setTitle("Server Info")
            .setColor("RANDOM")
            .setDescription("We are a Call of Duty: Mobile-based server. We aim to be a top 10 codm clan without forgetting to enjoy the game. Currently, we only focus on Asian servers but all are welcome to join our small family")
            .setImage("https://media.discordapp.net/attachments/806833059348348928/806834446783217694/VID_20210204144110.gif?width=100&height=100")
            .setTimestamp()
            .addFields( [
                  		{
                  			name: 'Owner: ',
                  			value: 'Raven, Orbit',
                  		},
                      {
                  			name: 'Server Location: ',
                  			value: 'Asia',
                  		},
                      {
                  			name: 'Queries: ',
                  			value: 'DM Hyper(Director)',
                  		},
                  	])
            message.channel.send({embed})
    }
    if (CMD === 'unmute') {
      const { member, mentions } = message
      const mainRole = message.guild.roles.cache.find(r => r.name === '「WRATH」・COMMUNITY')
      const mutedRole = message.guild.roles.cache.find(
        (role) => role.name === 'Muted'
       );

      if (!mutedRole)
       return message.channel.send('There is no Muted role on this server');
      if (
        member.hasPermission('ADMINISTRATOR')
      ) {
        const target = message.mentions.members.first();
        if (target) {
          target.roles.remove(mutedRole);
          target.roles.add(mainRole);
          message.channel.send(`${target} has been unmuted`)
        } else {
          message.channel.reply(`Please specify someone to unmute.`)
        }
      } else {
        message.channel.reply(
          `You do not have permission to use this command.`
        )
      }
    }
  }
});



client.login(process.env.token);
