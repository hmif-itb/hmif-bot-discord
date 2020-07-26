import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class GuildIdCommand extends Command {
    public constructor() {
        super("gid", {
            aliases: ["gid"],
            category: "Public Commands",
            description: {
                content: "Get channel and guild ID",
                usage: "gid",
                example: [
                    "gid"
                ]
            },
            ratelimit: 3
        })
    }

    public exec(message: Message): Promise<Message> {
        const guildId = message.guild.id;
        const channelId = message.channel.id;
        return message.util.send(`Guild: \`${guildId}\`\nChannel: \`${channelId}\``);
    }
}