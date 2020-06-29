require("dotenv").config();

export let token : string = process.env.TOKEN;
export let prefix : string = process.env.PREFIX;
export let owners : string[] = [];