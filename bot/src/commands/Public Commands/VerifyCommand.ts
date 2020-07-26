import { Command } from 'discord-akairo';
import { Message, GuildMember, MessageEmbed } from 'discord.js';
import { secretkey, webBaseUrl } from '../../config';
const jwt = require('jsonwebtoken');

export default class VerifyCommand extends Command {
    public constructor() {
        super("verify", {
            aliases: ["verify"],
            category: "Public Commands",
            description: {
                content: "Verify your account to std email",
                usage: "verify",
                example: [
                    "verify"
                ]
            },
            ratelimit: 3
        })
    }

    public exec(message: Message): Promise<Message> {
        let userId: string = message.member.id;
        let guildId: string = message.guild.id;
        let user: GuildMember = message.member;

        let token: string = null;

        jwt.sign({ userId, guildId }, secretkey, { expiresIn: '1h' }, (err, generatedToken) => {
            token = generatedToken;

            let link: string = `${webBaseUrl}/discord/verify?token=${token}`;

            let messageEmbed: MessageEmbed = new MessageEmbed()
                .setColor('#f8c414')
                .setTitle('HMIF Discord Member Verificator')
                .setURL(link)
                .setThumbnail('https://pbs.twimg.com/profile_images/1145303785452916737/qYmxvFvR_400x400.jpg')
                .setDescription(`Hello ${user}! Log in with student email and verify your membership in HMIF ITB Discord Server by using the link above.`)

            user.send(messageEmbed);
        });

        return (message.channel.send("A message has been sent to your DM. Check it out!"));
    }
}