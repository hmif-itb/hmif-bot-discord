import Discord from 'discord.js';
import { assignedRole, token } from '../config';

const client = new Discord.Client();
client.login(token);

client.on('ready', () => {
    console.log("Web Discord Client is ready!");
});

export async function onboardUser(guildId: string, userId: string, assignedNickname: string) {
    const guild = client.guilds.resolve(guildId);
    const member = guild.members.resolve(userId);
    const role = guild.roles.cache.find(role => role.name === assignedRole);

    const trimmedFullName = trimFullName(assignedNickname, 32);

    await member.setNickname(trimmedFullName);
    await member.roles.add(role);
}

function trimFullName(name: string, length: number) {
    if (name.length <= length) {
        return name;
    } else {
        const trimmed = name.substring(0, length);
        const words = trimmed.split(' ');
        words[words.length - 1] = words[words.length - 1].charAt(0);
        return words.join(' ');
    }
}