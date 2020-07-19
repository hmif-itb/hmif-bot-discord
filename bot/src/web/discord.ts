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

    await member.setNickname(assignedNickname);
    await member.roles.add(role);
}