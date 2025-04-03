if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const commands = [
  new SlashCommandBuilder()
    .setName('반복알림')
    .setDescription('반복 알림을 설정합니다')
    .addStringOption(opt =>
      opt.setName('시작시간').setDescription('시작 시간 (예: 2025-04-04T10:00)').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('반복간격').setDescription('간격 (예: 10m, 2h, 1d)').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('메시지').setDescription('알림 메시지 (예: ${날짜} 스크럼)').setRequired(true)
    ),

  new SlashCommandBuilder().setName('알림끄기').setDescription('설정된 알림을 끕니다'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('⏳ 슬래시 커맨드 등록 중...');
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });
    console.log('✅ 슬래시 커맨드 등록 완료!');
  } catch (error) {
    console.error(error);
  }
})();
