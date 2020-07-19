import { client } from '../bot';
import { assignedRole } from '../config';

export async function onboardUser(guildId: string, userId: string, assignedNickname: string) {
    const guild = client.guilds.resolve(guildId);
    const member = guild.members.resolve(userId);

    await member.setNickname(assignedNickname);
    await member.roles.add(assignedRole);
}