import {token, owners} from './config';
import BotClient from './client/botclient';

export const client : BotClient = new BotClient({token, owners});
client.start();