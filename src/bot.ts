import {token, owners} from './config.js';
import BotClient from './client/botclient';

const client : BotClient = new BotClient({token, owners});
client.start();