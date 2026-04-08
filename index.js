const { execSync } = require('child_process');
const fs = require('fs');
const express = require('express');

// Auto-Installer
try { 
    require.resolve("fca-smart-shankar"); 
    require.resolve("axios"); 
} catch (e) { 
    console.log("📦 Installing modules...");
    execSync('npm install fca-smart-shankar axios', { stdio: 'inherit' }); 
}

const login = require("fca-smart-shankar");
const axios = require('axios');

// ==================== EXPRESS SERVER (Keep Alive) ====================
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>TECH TRICK INDIA BOT</title>
            <style>
                body {
                    background: linear-gradient(135deg, #0a001f, #1a0a3a);
                    color: #ffd700;
                    font-family: monospace;
                    text-align: center;
                    padding: 50px;
                }
                h1 { font-size: 3em; text-shadow: 0 0 10px gold; }
                .status { color: #00ff00; font-size: 1.5em; }
                .info { margin-top: 30px; font-size: 1.2em; }
            </style>
        </head>
        <body>
            <h1>🤖 TECH TRICK INDIA BOT</h1>
            <p class="status">✅ BOT IS RUNNING 24/7</p>
            <div class="info">
                <p>📌 Prefix: +</p>
                <p>👑 Owner: TECH TRICK INDIA</p>
                <p>📊 Total Commands: 20+</p>
                <p>💚 Powered by Render.com</p>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`🌐 Web server running on port ${PORT}`);
});

// ==================== BOT CONFIG ====================
const OWNER_ID = "61579578069493";
const BOT_NAME = "TECH TRICK INDIA";
const PREFIX = "+";

// Latest Cookies (Update karte rehna)
let appstate = [
    {"key": "datr", "value": "WtzVaZnE3weec2kBid1DmC11", "domain": "facebook.com", "path": "/", "hostOnly": false, "creation": "2026-04-08T05:50:49.195Z", "lastAccessed": "2026-04-08T05:50:49.202Z"},
    {"key": "sb", "value": "W9zVaef6HCXrHfGB0r7TbFhn", "domain": "facebook.com", "path": "/", "hostOnly": false, "creation": "2026-04-08T05:50:49.202Z", "lastAccessed": "2026-04-08T05:50:49.202Z"},
    {"key": "dpr", "value": "2.1988937854766846", "domain": "facebook.com", "path": "/", "hostOnly": false, "creation": "2026-04-08T05:50:49.202Z", "lastAccessed": "2026-04-08T05:50:49.202Z"},
    {"key": "c_user", "value": "61573634584123", "domain": "facebook.com", "path": "/", "hostOnly": false, "creation": "2026-04-08T05:50:49.202Z", "lastAccessed": "2026-04-08T05:50:49.202Z"},
    {"key": "xs", "value": "14%3AvPzwAnEz-zUgiA%3A2%3A1775623333%3A-1%3A-1%3A%3AAcwVPkTXjiazU3VtDsBoTOipTzRIyXf3P4NyLUkbWg", "domain": "facebook.com", "path": "/", "hostOnly": false, "creation": "2026-04-08T05:50:49.203Z", "lastAccessed": "2026-04-08T05:50:49.203Z"},
    {"key": "locale", "value": "en_US", "domain": "facebook.com", "path": "/", "hostOnly": false, "creation": "2026-04-08T05:50:49.203Z", "lastAccessed": "2026-04-08T05:50:49.203Z"},
    {"key": "pas", "value": "61573634584123%3AMZICSxZM6L", "domain": "facebook.com", "path": "/", "hostOnly": false, "creation": "2026-04-08T05:50:49.203Z", "lastAccessed": "2026-04-08T05:50:49.203Z"},
    {"key": "fr", "value": "1U4i1FI45sVq2mWT6.AWcw4h6k8pv45GHuNQR4ex2GzYyNsVEgypE-t5SJjt7qgq3kpCE.Bp1dyq..AAA.0.0.Bp1d0B.AWee1xpgTwTWlrzho4XxGzr4flw", "domain": "facebook.com", "path": "/", "hostOnly": false, "creation": "2026-04-08T05:50:49.203Z", "lastAccessed": "2026-04-08T05:50:49.203Z"},
    {"key": "wd", "value": "891x1746", "domain": "facebook.com", "path": "/", "hostOnly": false, "creation": "2026-04-08T05:50:49.203Z", "lastAccessed": "2026-04-08T05:50:49.203Z"}
];

let autoSendIntervals = {};
let lockedGroups = new Set();

// ==================== NICKNAME ALL ====================
const nicknameAll = async (api, event, args) => {
    if (event.senderID !== OWNER_ID) return api.sendMessage("❌ Sirf owner!", event.threadID);
    if (lockedGroups.has(event.threadID)) return api.sendMessage("🔒 Group locked!", event.threadID);
    
    const newName = args.join(" ");
    if (!newName) return api.sendMessage("📌 +nicknameall <name>", event.threadID);
    
    try {
        const threadInfo = await api.getThreadInfo(event.threadID);
        const participants = threadInfo.participantIDs;
        
        api.sendMessage(`⚡ ${participants.length} members ke nickname change ho rahe...\n📛 "${newName}"`, event.threadID);
        
        let success = 0, fail = 0;
        for (const uid of participants) {
            try {
                await api.changeNickname(newName, event.threadID, uid);
                success++;
            } catch (e) {
                try {
                    await api.changeNickname(event.threadID, uid, newName);
                    success++;
                } catch (e2) { fail++; }
            }
            await new Promise(r => setTimeout(r, 400));
        }
        
        api.sendMessage(`✅ Nickname Complete!\n✅ Success: ${success}\n❌ Failed: ${fail}\n📛 "${newName}"`, event.threadID);
    } catch (error) {
        api.sendMessage("❌ Error!", event.threadID);
    }
};

// ==================== OWNER INFO ====================
const ownerCmd = async (api, event) => {
    try {
        const userInfo = await api.getUserInfo(OWNER_ID);
        const info = userInfo[OWNER_ID];
        
        let attachment = null;
        try {
            const picRes = await axios.get(`https://graph.facebook.com/${OWNER_ID}/picture?width=500&height=500`, { responseType: 'stream' });
            attachment = picRes.data;
        } catch(e) {}
        
        const msg = `👑 OWNER PROFILE\n━━━━━━━━━━━━━━━━━━━━\n📛 Name: ${info.name}\n🆔 UID: ${OWNER_ID}\n🔗 Profile: https://facebook.com/${OWNER_ID}\n━━━━━━━━━━━━━━━━━━━━\n✅ Owner of ${BOT_NAME}`;
        
        if (attachment) {
            await api.sendMessage({ body: msg, attachment: attachment }, event.threadID);
        } else {
            await api.sendMessage(msg, event.threadID);
        }
    } catch(e) {
        api.sendMessage(`👑 OWNER: TECH TRICK INDIA\n🆔 ${OWNER_ID}`, event.threadID);
    }
};

// ==================== INFO ====================
const infoCmd = async (api, event) => {
    let targetID = Object.keys(event.mentions)[0] || event.messageReply?.senderID || event.senderID;
    
    try {
        const userInfo = await api.getUserInfo(targetID);
        const info = userInfo[targetID];
        
        let attachment = null;
        try {
            const picRes = await axios.get(`https://graph.facebook.com/${targetID}/picture?width=500&height=500`, { responseType: 'stream' });
            attachment = picRes.data;
        } catch(e) {}
        
        const msg = `🌟 USER INFORMATION\n━━━━━━━━━━━━━━━━━━━━\n📛 Name: ${info.name}\n🆔 UID: ${targetID}\n🔗 Profile: https://facebook.com/${targetID}\n━━━━━━━━━━━━━━━━━━━━\n✅ Info fetched!`;
        
        if (attachment) {
            await api.sendMessage({ body: msg, attachment: attachment }, event.threadID);
        } else {
            await api.sendMessage(msg, event.threadID);
        }
    } catch(e) {
        api.sendMessage("❌ Invalid UID!", event.threadID);
    }
};

// ==================== AI ====================
const aiCmd = async (api, event, args) => {
    const question = args.join(" ");
    if (!question) return api.sendMessage("📌 +ai <question>", event.threadID);
    
    api.sendMessage("🤔 Thinking...", event.threadID);
    
    try {
        const res = await axios.get(`https://api.simsimi.vn/v1/simtalk?text=${encodeURIComponent(question)}&lc=vn`, { timeout: 8000 });
        api.sendMessage(`🤖 ${res.data.message || "No reply"}`, event.threadID);
    } catch(e) {
        api.sendMessage("🤖 AI: I'm here! (API busy, try again)", event.threadID);
    }
};

// ==================== SEARCH ====================
const searchCmd = async (api, event, args) => {
    const query = args.join(" ");
    if (!query) return api.sendMessage("📌 +search <query>", event.threadID);
    
    api.sendMessage(`🔍 Search Results for "${query}":\n\n📺 YouTube: https://youtube.com/results?search_query=${encodeURIComponent(query)}\n🌐 Google: https://google.com/search?q=${encodeURIComponent(query)}`, event.threadID);
};

// ==================== GROUP LOCKER ====================
const lockGroupCmd = async (api, event) => {
    if (event.senderID !== OWNER_ID) return api.sendMessage("❌ Owner only!", event.threadID);
    lockedGroups.add(event.threadID);
    api.sendMessage("🔒 GROUP LOCKED!\nUnlock: +unlockgroup", event.threadID);
};

const unlockGroupCmd = async (api, event) => {
    if (event.senderID !== OWNER_ID) return api.sendMessage("❌ Owner only!", event.threadID);
    lockedGroups.delete(event.threadID);
    api.sendMessage("🔓 GROUP UNLOCKED!", event.threadID);
};

// ==================== GROUPNAME ====================
const groupNameCmd = async (api, event, args) => {
    if (event.senderID !== OWNER_ID) return;
    if (lockedGroups.has(event.threadID)) return api.sendMessage("🔒 Locked!", event.threadID);
    
    const newName = args.join(" ");
    if (!newName) return api.sendMessage("📌 +groupname <name>", event.threadID);
    
    try {
        await api.setTitle(newName, event.threadID);
        api.sendMessage(`✅ Group name: "${newName}"`, event.threadID);
    } catch { api.sendMessage("❌ Failed!", event.threadID); }
};

// ==================== HELP ====================
const helpCmd = async (api, event) => {
    api.sendMessage(`╔══════════════════════════════════╗
║  📖 ${BOT_NAME} - COMMANDS  📖
╠══════════════════════════════════╣
║ 👑 OWNER:
║ • +nicknameall <name>
║ • +groupname <name>
║ • +send <sec> <msg>
║ • +stop
║ • +out
║ • +restart
║
║ 🔒 GROUP LOCKER:
║ • +lockgroup
║ • +unlockgroup
║
║ 📸 INFO:
║ • +info (@tag)
║ • +owner
║ • +uid
║ • +ping
║
║ 🎭 FUN:
║ • +bf / +bestu
║ • +love <name>
║ • +kiss @tag
║ • +hug @tag
║
║ 🤖 AI:
║ • +ai <question>
║ • +search <query>
║
╚══════════════════════════════════╝
✅ ALL WORKING!`, event.threadID);
};

// ==================== OTHER COMMANDS ====================
const outCmd = async (api, event) => {
    if (event.senderID !== OWNER_ID) return;
    await api.sendMessage("👋 Leaving...", event.threadID);
    setTimeout(() => api.removeUserFromGroup(api.getCurrentUserID(), event.threadID), 2000);
};

const restartCmd = async (api, event) => {
    if (event.senderID !== OWNER_ID) return;
    await api.sendMessage("🔄 Restarting...", event.threadID);
    process.exit(0);
};

const pingCmd = async (api, event) => {
    await api.sendMessage("🏓 Pong!", event.threadID);
};

const uidCmd = async (api, event) => {
    let targetID = Object.keys(event.mentions)[0] || event.senderID;
    api.sendMessage(`🆔 ${targetID}`, event.threadID);
};

const sendCmd = async (api, event, args) => {
    if (event.senderID !== OWNER_ID) return;
    const seconds = parseInt(args[0]);
    const msg = args.slice(1).join(" ");
    if (isNaN(seconds) || !msg) return api.sendMessage("📌 +send <sec> <msg>", event.threadID);
    
    if (autoSendIntervals[event.threadID]) clearInterval(autoSendIntervals[event.threadID]);
    api.sendMessage(`⏰ Auto-post every ${seconds}s`, event.threadID);
    autoSendIntervals[event.threadID] = setInterval(() => {
        api.sendMessage(msg, event.threadID).catch(() => {});
    }, seconds * 1000);
};

const stopCmd = async (api, event) => {
    if (event.senderID !== OWNER_ID) return;
    if (autoSendIntervals[event.threadID]) {
        clearInterval(autoSendIntervals[event.threadID]);
        delete autoSendIntervals[event.threadID];
        api.sendMessage("🛑 Stopped!", event.threadID);
    } else api.sendMessage("❌ No active!", event.threadID);
};

const bfCmd = async (api, event) => {
    const couples = ["💑 Romeo+Juliet", "💕 Raj+Simran", "💖 Heer+Ranjha", "💗 Laila+Majnu"];
    api.sendMessage(`💘 ${couples[Math.floor(Math.random() * couples.length)]}`, event.threadID);
};

const loveCmd = async (api, event, args) => {
    const name = args.join(" ") || "You";
    const percent = Math.floor(Math.random() * 100) + 1;
    api.sendMessage(`💘 Love: ${name} = ${percent}% ❤️`, event.threadID);
};

const kissCmd = async (api, event) => {
    let target = Object.keys(event.mentions)[0];
    if (!target) return api.sendMessage("📌 +kiss @user", event.threadID);
    api.sendMessage(`😘 Kiss to ${target}! 💋`, event.threadID);
};

const hugCmd = async (api, event) => {
    let target = Object.keys(event.mentions)[0];
    if (!target) return api.sendMessage("📌 +hug @user", event.threadID);
    api.sendMessage(`🤗 Hug to ${target}!`, event.threadID);
};

// ==================== COMMANDS ====================
const commands = {
    nicknameall: nicknameAll,
    lockgroup: lockGroupCmd,
    unlockgroup: unlockGroupCmd,
    groupname: groupNameCmd,
    info: infoCmd,
    help: helpCmd,
    owner: ownerCmd,
    out: outCmd,
    restart: restartCmd,
    ping: pingCmd,
    uid: uidCmd,
    send: sendCmd,
    stop: stopCmd,
    bf: bfCmd,
    bestu: bfCmd,
    love: loveCmd,
    kiss: kissCmd,
    hug: hugCmd,
    ai: aiCmd,
    search: searchCmd
};

// ==================== KEEP ALIVE ====================
setInterval(() => {
    console.log("💖 Bot is alive! " + new Date().toLocaleString());
}, 300000);

// ==================== CRASH HANDLER ====================
process.on('uncaughtException', (err) => {
    console.log('❌ Crash:', err.message);
    setTimeout(() => process.exit(1), 5000);
});

process.on('unhandledRejection', (err) => {
    console.log('❌ Rejection:', err);
});

// ==================== MAIN ====================
login({ appState: appstate }, (err, api) => {
    if (err) {
        console.error("❌ Login failed!", err);
        return;
    }
    
    api.setOptions({ listenEvents: true, selfListen: false });
    
    api.listenMqtt(async (err, event) => {
        if (err) return;
        
        if (event.type === "event" && event.logMessageType === "log:subscribe") {
            const addedUsers = event.logMessageData?.addedParticipants || [];
            for (const user of addedUsers) {
                if (user.userFbId !== api.getCurrentUserID()) {
                    try {
                        const userInfo = await api.getUserInfo(user.userFbId);
                        const name = userInfo[user.userFbId].name;
                        await api.sendMessage(`🎉 Welcome ${name} (@${user.userFbId}) to the group! 🎉\n\nType +help for commands.`, event.threadID);
                    } catch(e) {}
                }
            }
        }
        
        if (event.type === "message" && event.body?.startsWith(PREFIX)) {
            const args = event.body.slice(PREFIX.length).trim().split(/ +/);
            const cmd = args.shift().toLowerCase();
            if (commands[cmd]) {
                try {
                    await commands[cmd](api, event, args);
                } catch (e) {
                    console.log("Error:", e.message);
                }
            }
        }
    });
    
    console.log(`✅ ${BOT_NAME} Started on Render!`);
    console.log(`👑 Owner: ${OWNER_ID}`);
    console.log(`📌 Total Commands: ${Object.keys(commands).length}`);
    console.log(`🌐 Web: https://your-render-url.onrender.com`);
});
