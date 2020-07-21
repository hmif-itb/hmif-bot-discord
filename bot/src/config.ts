require("dotenv").config();

export let token : string = process.env.TOKEN;
export let prefix : string = process.env.PREFIX;
export let owners : string[] = ["307478723563749376"];
export let secretkey : string = process.env.SECRETKEY;
export const webBaseUrl: string = process.env.WEB_BASE_URL;
export const assignedRole: string = process.env.ASSIGNED_ROLE;
export const googleClientId = process.env.CLIENT_ID;
export const hostedDomain = process.env.HOSTED_DOMAIN;
