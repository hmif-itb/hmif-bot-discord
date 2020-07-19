import { OAuth2Client } from 'google-auth-library';
import { googleClientId } from '../config';

const client = new OAuth2Client(googleClientId);

export async function verifyIdToken(idToken: string) {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: googleClientId
    });

    const payload = ticket.getPayload();
    const userId = payload.sub;
    const name = payload.name;
    const email = payload.email;

    return { userId, name, email };
}
