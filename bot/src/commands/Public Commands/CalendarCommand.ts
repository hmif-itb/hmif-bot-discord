import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import moment from 'moment';
import axios from 'axios';
import { EmbedFieldData } from 'discord.js';

const testData = [{ "name": "[Sidang] Muhammad Fadhriga Bestari", "desc": "Pengembangan Dynamic Resource Scheduler pada Kubernetes untuk Pelatihan Deep Learning Terdistribusi", "location": "", "allDay": false, "start": 1591669800, "end": 1591675200 }, { "name": "[Sidang] Muhammad Aufa Helfiandri", "desc": "Pembangkitan Scene Descriptor dari Paragraf Naratif Pada Naskah Film", "location": "", "allDay": false, "start": 1591675200, "end": 1591691400 }, { "name": "[Sidang] Ilham Firdausi Putra", "desc": "Klasifikasi Teks Berbahasa Indonesia Menggunakan Multilingual Language Model (Studi Kasus: Klasifikasi Ujaran Kebencian dan Analisis Sentimen)  ", "location": "", "allDay": false, "start": 1591693200, "end": 1591698600 }, { "name": "[Sidang] Gabriel Bentara Raphael", "desc": "Optimisasi Scheduler pada Platform Serverless Knative Secara Heuristik", "location": "", "allDay": false, "start": 1591748100, "end": 1591753500 }]

const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/a/std.stei.itb.ac.id/macros/s/AKfycbwH2AmIk3i4Z4n7nNNDxNZP6IeSioTp8B5LgrfU/exec";

interface Event {
    name: string;
    desc: string;
    location: string;
    allDay: boolean;
    start: number;
    end: number;
}

export default class CalendarCommand extends Command {
    public constructor() {
        super("calendar", {
            aliases: ["cal"],
            category: "Public Commands",
            description: {
                content: "Get calendar",
                usage: "calendar",
                example: [
                    "cal sidang minggu ini"
                ]
            },
            ratelimit: 5
        })
    }

    public async exec(message: Message): Promise<any> {
        const guildId = message.guild ? message.guild.id : '';
        const channelId = message.guild ? message.channel.id : '';
        const messageString = message.toString();

        const startDate = getStartDay(messageString)
        const duration = getDurationDays(messageString);
        const events = await this.retrieveEvents(guildId, channelId, messageString, startDate, duration);

        if (events.length > 0) {
            const replies = this.createCalendarEmbedMessages(events);
            return Promise.all(replies.map(reply => message.util.send(reply)));
        } else {
            return message.util.send("Wah tidak ada agenda nih!");
        }
    }

    private createCalendarEmbedMessages(events: Event[]): MessageEmbed[] {
        const chunkedEvents = chunkArray(events, 8);
        return chunkedEvents.map(events => this.createEmbedMessage(events));
    }

    private createEmbedMessage(events: Event[]): MessageEmbed {
        const groupedMessages: { [date: string]: Event[] } = events.reduce((acc, curr) => {
            const dateString = moment.unix(curr.start).format('ddd, D MMM');
            if (!acc[dateString]) {
                acc[dateString] = []
            }

            acc[dateString].push(curr);
            return acc;
        }, {});

        const fields: EmbedFieldData[] = Object.keys(groupedMessages).reduce((acc, curr) => {
            const groupEvents = groupedMessages[curr];
            const groupFields = groupEvents
                .map((event, i) => {
                    const name = event.name;
                    const timeRange = event.allDay ? 'All day' : getTimeRangeString(event.start, event.end);
                    const value = [timeRange, event.desc].filter(d => !!d && d !== '').join('\n');

                    return [
                        { name: i === 0 ? curr : '\u200b', value: '\u200b', inline: true },
                        { name, value, inline: true },
                        { name: '\u200b', value: '\u200b', inline: true },
                    ]
                })
                .reduce((acc, curr) => [...acc, ...curr], []);

            return [...acc, ...groupFields];
        }, []);

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Agenda HMIF')
            .addFields(fields)
            .setTimestamp()
            .setFooter('From HMIF Google Calendar');

        return embed;
    }

    private async retrieveEvents(guildId: string, channelId: string, textMessage: string, startDate: string, days: number): Promise<Event[]> {
        const params = { channelId, guildId, textMessage, startDate, days };
        return axios.get(GOOGLE_APPS_SCRIPT_URL, { params: { action: 'getEventsByDuration', param: params } }).then(response => response.data.result);
    }
}

const getStartDay = (text: string) => {
    text = text.toLowerCase();
    const currentDate = moment().format('YYYY-MM-DD');

    if (text.includes('besok')) return moment().add(1, 'days').format('YYYY-MM-DD');
    else if (text.includes('lusa')) return moment().add(2, 'days').format('YYYY-MM-DD');
    else return currentDate;
}

const getDurationDays = (text: string) => {
    text = text.toLowerCase();

    if (text.includes('hari ini')) return 1;
    else if (text.includes('minggu ini')) return 7;
    else if (text.includes('bulan ini')) return 30;
    else return 1;
}

const getTimeRangeString = (start: number, end: number) => {
    const from = moment.unix(start);
    const to = moment.unix(end);
    if (from.isSame(to, 'day')) {
        return from.format('HH:mm') + ' - ' + to.format('HH:mm')
    } else {
        return from.format('HH:mm') + ' - ' + to.format('D MMM, HH:mm')
    }
}

const chunkArray = <T>(array: T[], chunk: number) => {
    let outputArray = [];
    let i, j, temparray;
    for (i = 0, j = array.length; i < j; i += chunk) {
        temparray = array.slice(i, i + chunk);
        outputArray.push(temparray);
    }

    return outputArray;
}