const {
    Module
} = require('../main');
const { getJson } = require("./misc/misc");
const {MODE} = require('../config');
let fromMe = MODE == 'public' ? false : true
Module({
    pattern: 'lyrics ?(.*)',
    fromMe: fromMe,
    desc: 'Lyrics search & find',
    use: 'download'
}, (async (message, match) => {
    if (!match[1]) return await message.sendReply("_Need query!_");
    let result = await getJson(`https://api.raganork.online/api/lyrics?query=${encodeURIComponent(match[1])}`)
    if (!result.status) return await message.sendReply('_No results found!_')
    let ch = '```'
    return await message.sendReply(`${ch}Title: "${result.title}"\n\n${result.result}${ch}`);
}));
