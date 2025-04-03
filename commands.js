const { SlashCommandBuilder } = require('discord.js');

module.exports = [
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
].map(cmd => cmd.toJSON());
