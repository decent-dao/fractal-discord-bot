require('dotenv').config();
const { Client, Events, GatewayIntentBits } = require('discord.js');

// Both Github username and Discord userId are public
// information so hardcoding isn't a security concern.
// TODO we should use a Github environment variable here.
const githubToDiscordId = [
    ['@Da-Colon', '867776441777258547'],
    ['@tbwebb22', '682293031474298880'],
    ['@mudrila', '897909032080265268'],
    ['@sethhrbek', '792865263937650758'],
    ['@herbig', '424603890693177344'],
];

// the authorId for the Github webhook
// TODO also would be better off as env variable
const githubAuthorId = '1080116044884086866';

const client = new Client({
	intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessageReactions,
            ]
});

client.on(Events.MessageCreate, msg => {
    if (msg.authorId === githubAuthorId && msg.embeds.length > 0) {
        const description = msg.embeds[0].description;
        let reply = '';
        // iterate through our map of Github users
        githubToDiscordId.forEach(function(value, key) {
            if (description.includes(key)) {
                reply = reply.concat(`<@${value}> `)
            }
        });
        // check if the Github Fractal team was mentioned and tag @devs
        if (description.includes('@decent-dao/fractal')) {
            reply = reply.concat(`<@&1047935967836774460> `)
        }
        // if anyone was mentioned, reply with their Discord username
        if (reply.length != 0) {
            msg.reply(reply);
        }
    }
});

client.login(process.env.BOT_TOKEN);
  