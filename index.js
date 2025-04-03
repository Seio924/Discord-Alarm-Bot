if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { Client, GatewayIntentBits, Events } = require('discord.js');
const { scheduleReminder, stopReminder, loadReminders } = require('./reminderManager');
const registerCommandsToGuild = require('./registerCommands');

const token = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  loadReminders(client);
});

client.on(Events.GuildCreate, async guild => {
  console.log(`🆕 ${guild.name} 서버에 초대됨`);
  await registerCommandsToGuild(client.user.id, guild.id, token);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options, user, channel } = interaction;

  if (commandName === '반복알림') {
    const startStr = options.getString('시작시간');
    const intervalStr = options.getString('반복간격');
    const rawMessage = options.getString('메시지');

    await interaction.reply('⏱️ 알림을 설정 중입니다...');
    scheduleReminder(user.id, channel, startStr, intervalStr, rawMessage);
  }

  if (commandName === '알림끄기') {
    await interaction.reply('🛑 알림을 끄는 중입니다...');
    stopReminder(user.id, channel);
  }
});

client.login(token);
