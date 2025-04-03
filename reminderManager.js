const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const dayjs = require('dayjs');
const tz = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
dayjs.extend(tz);

const { parseInterval, formatTemplate, convertMsToCron } = require('./utils');

const remindersPath = path.join(__dirname, 'reminders.json');
const activeReminders = new Map(); // key: userId_channelId → task

function loadReminders(client) {
  if (!fs.existsSync(remindersPath)) return;
  const list = JSON.parse(fs.readFileSync(remindersPath, 'utf-8'));

  for (const r of list) {
    const channel = client.channels.cache.get(r.channelId);
    if (channel) {
      scheduleReminder(r.userId, channel, r.startStr, r.intervalStr, r.rawMessage, false);
    }
  }
}

function saveReminder(reminder) {
  let list = [];
  if (fs.existsSync(remindersPath)) {
    list = JSON.parse(fs.readFileSync(remindersPath, 'utf-8'));
  }
  list.push(reminder);
  fs.writeFileSync(remindersPath, JSON.stringify(list, null, 2));
}

function removeReminder(userId, channelId) {
  if (!fs.existsSync(remindersPath)) return;
  const list = JSON.parse(fs.readFileSync(remindersPath, 'utf-8'));
  const updated = list.filter(r => !(r.userId === userId && r.channelId === channelId));
  fs.writeFileSync(remindersPath, JSON.stringify(updated, null, 2));
}

function scheduleReminder(userId, channel, startStr, intervalStr, rawMessage, fromCommand = true) {
  const start = dayjs.tz(startStr, 'Asia/Seoul').toDate();
  const intervalMs = parseInterval(intervalStr);
  const key = `${userId}_${channel.id}`;

  if (isNaN(start.getTime()) || !intervalMs) {
    if (fromCommand) channel.send('시작 시간 또는 반복 간격 형식이 잘못되었습니다.');
    return;
  }

  if (activeReminders.has(key)) {
    if (fromCommand) channel.send('이미 알림이 설정되어 있습니다. 먼저 `/알림끄기`로 끄세요.');
    return;
  }

  const sendMessage = () => {
    const finalMessage = formatTemplate(rawMessage);
    channel.send(finalMessage);
  };

  const scheduleTask = () => {
    const cronExpr = convertMsToCron(intervalMs);
    const task = cron.schedule(cronExpr, sendMessage, { timezone: 'Asia/Seoul' });
    activeReminders.set(key, task);
  };

  const delay = start.getTime() - Date.now();
  if (delay > 0) {
    setTimeout(() => {
      sendMessage();
      scheduleTask();
    }, delay);
  } else {
    sendMessage();
    scheduleTask();
  }

  if (fromCommand) {
    channel.send('🔁 반복 알림이 설정되었습니다!');
    saveReminder({ userId, channelId: channel.id, startStr, intervalStr, rawMessage });
  }
}

function stopReminder(userId, channel) {
  const key = `${userId}_${channel.id}`;
  const task = activeReminders.get(key);

  if (!task) {
    channel.send('현재 설정된 알림이 없습니다.');
    return;
  }

  task.stop();
  activeReminders.delete(key);
  removeReminder(userId, channel.id);
  channel.send('🛑 알림이 성공적으로 중지되었습니다.');
}

module.exports = {
  scheduleReminder,
  stopReminder,
  loadReminders,
};
