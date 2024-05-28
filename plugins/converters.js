/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const {
    Module 
} = require('../main');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const {
    skbuffer
} = require('raganork-bot');
const Config = require('../config');
const {
    MODE,
    STICKER_DATA
} = require('../config');
const {
    getString
} = require('./misc/lang');
const {
    bass,
    sticker,
    addExif
} = require('./misc/misc');
const Lang = getString('converters');
let w = MODE == 'public' ? false : true
Module({
    pattern: 'sticker ?(.*)',
    use: 'edit',
    fromMe: w,
    desc: Lang.STICKER_DESC
}, (async (message, match) => {
    if (message.reply_message === false) return await message.send(Lang.STICKER_NEED_REPLY)
    var savedFile = await message.reply_message.download();
    var exif = {
        author: STICKER_DATA.split(";")[1] || "",
        packname: message.senderName,
        categories: STICKER_DATA.split(";")[2] || "😂",
        android: "https://github.com/souravkl11/Raganork-md/",
        ios: "https://github.com/souravkl11/Raganork-md/"
    }
    if (message.reply_message.image === true) {
        return await message.client.sendMessage(message.jid,{sticker: fs.readFileSync(await addExif(await sticker(savedFile),exif))},{quoted: message.quoted})
     } else {
        return await message.client.sendMessage(message.jid,{sticker:fs.readFileSync(await addExif(await sticker(savedFile,'video'),exif))},{quoted: message.quoted})
    }
}));
Module({
    pattern: 'mp3 ?(.*)',
    fromMe: w,
    use: 'edit',
    desc: Lang.MP3_DESC
}, (async (message, match) => {
    if (!message.reply_message || (!message.reply_message.video && !message.reply_message.audio)) return await message.sendReply(Lang.MP3_NEED_REPLY)
    var {seconds} = message.quoted.message[Object.keys(message.quoted.message)[0]];
    if (seconds>120) await message.sendReply(`_Alert: Duration more than 2 mins. This process may fail or take much more time!_`)
    var savedFile = await message.reply_message.download();
    ffmpeg(savedFile)
        .save('./temp/tomp3.mp3')
        .on('end', async () => {
            await message.client.sendMessage(message.jid, {
                audio: fs.readFileSync('./temp/tomp3.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            }, {
                quoted: message.quoted
            })
        });
}));
Module({
    pattern: 'slow ?(.*)',
    fromMe: w,
    use: 'edit',
    desc: "Slows down music & decreases pitch. For making slowed+reverb audios"
}, (async (message, match) => {
    if (message.reply_message === false) return await message.sendReply(Lang.MP3_NEED_REPLY)
    var {seconds} = message.quoted.message[Object.keys(message.quoted.message)[0]];
    if (seconds>120) await message.sendReply(`_Alert: Duration more than 2 mins. This process may fail or take much more time!_`)
    var savedFile = await message.reply_message.download();
    ffmpeg(savedFile)
        .audioFilter("atempo=0.5")
        .outputOptions(["-y", "-af", "asetrate=44100*0.9"])
        .save("./temp/slow.mp3")
        .on('end', async () => {
            await message.client.sendMessage(message.jid, {
                audio: fs.readFileSync('./temp/slow.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            }, {
                quoted: message.quoted
            })
        });
}));
Module({
    pattern: 'speed ?(.*)',
    fromMe: w,
    use: 'edit',
    desc: "Speeds up music & increases pitch. For making sped-up+reverb audios"
}, (async (message, match) => {
    if (message.reply_message === false) return await message.sendReply(Lang.MP3_NEED_REPLY)
    var {seconds} = message.quoted.message[Object.keys(message.quoted.message)[0]];
    if (seconds>120) await message.sendReply(`_Alert: Duration more than 2 mins. This process may fail or take much more time!_`)
    var savedFile = await message.reply_message.download();
    ffmpeg(savedFile)
        .audioFilter("atempo=0.5")
        .outputOptions(["-y", "-af", "asetrate=44100*1.2"])
        .save("./temp/sped.mp3")
        .on('end', async () => {
            await message.client.sendMessage(message.jid, {
                audio: fs.readFileSync('./temp/sped.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            }, {
                quoted: message.quoted
            })
        });
}));
Module({
    pattern: 'bass ?(.*)',
    fromMe: w,
    use: 'edit',
    desc: Lang.BASS_DESC
}, (async (message, match) => {
    if (message.reply_message === false) return await message.sendReply(Lang.BASS_NEED_REPLY)
    var savedFile = await message.reply_message.download();
    bass(savedFile, match[1], async function(audio) {
        await message.client.sendMessage(message.jid, {
            audio: audio,
            mimetype: 'audio/mp4',
            ptt: false
        }, {
            quoted: message.data
        })
    });
}));
Module({
    pattern: 'photo ?(.*)',
    fromMe: w,
    use: 'edit',
    desc: Lang.PHOTO_DESC
}, (async (message, match) => {
    if (message.reply_message === false) return await message.send(Lang.PHOTO_NEED_REPLY)
        var savedFile = await message.reply_message.download();
        ffmpeg(savedFile)
            .fromFormat('webp_pipe')
            .save('output.png')
            .on('end', async () => {
                await message.sendReply(fs.readFileSync('output.png'), 'image');
            });

}));
Module({
    pattern: 'attp ?(.*)',
    fromMe: w,
    use: 'utility',
    desc: "Text to animated sticker"
}, (async (message, match) => {
    if (match[1] == '') return await message.send("*Need text*")
    var result = await skbuffer("https://raganork-api.onrender.com/api/attp?text="+encodeURI(match[1] +"&apikey=with_love_souravkl11")) 
    fs.writeFile("attp.mp4",result,async (e)=>{
        var exif = {
            author: STICKER_DATA.split(";")[1] || "",
            packname: message.senderName,
            categories: STICKER_DATA.split(";")[2] || "😂",
            android: "https://github.com/souravkl11/Raganork-md/",
            ios: "https://github.com/souravkl11/Raganork-md/"
        }
        await message.send(fs.readFileSync(await addExif(await sticker("attp.mp4",'video'),exif)),'sticker')
    
    })
}));
Module({
    pattern: "wawe",
    fromMe: isPrivate,
    desc: "audio into wave",
    type: "converter",
}, async (message) => {
    try {
        if (!message.reply_message?.audio) {
            return await message.reply("_Reply to an audio_");
        }

        let buff = await message.reply_message.download();
        let media = await toPTT(buff);

        return await message.send(media, { mimetype: 'audio/mpeg', ptt: true, quoted: message.data }, "audio");
    } catch (error) {
        console.error("An error occurred:", error);
        return await message.reply("_An error occurred while converting audio to wave._");
    }
});
Module({
	pattern: "exif",
	fromMe: isPrivate,
	desc: "get exif data",
	type: "tool",
}, async (message, match, m) => {
	await takeExif(message, match, m);
});
