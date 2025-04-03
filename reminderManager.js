const { parseInterval, formatTemplate } = require('./utils');

const activeReminders = new Map(); // key: userId_channelId, value: intervalId

function startReminder(userId, channel, startStr, intervalStr, rawMessage) {
  const startDate = new Date(startStr);
  const intervalMs = parseInterval(intervalStr);

  if (isNaN(startDate.getTime()) || !intervalMs) {
    channel.send('시작 시간 또는 반복 간격 형식이 잘못되었습니다.');
    return;
  }

  const key = `${userId}_${channel.id}`;
  if (activeReminders.has(key)) {
    channel.send('이미 알림이 설정되어 있습니다. 먼저 `/알림끄기`로 끄세요.');
    return;
  }

  const delay = startDate.getTime() - Date.now();

  const sendMessage = () => {
    const finalMessage = formatTemplate(rawMessage);
    channel.send(finalMessage);
  };

  const setupInterval = () => {
    sendMessage();
    const intervalId = setInterval(sendMessage, intervalMs);
    activeReminders.set(key, intervalId);
  };

  if (delay > 0) {
    channel.send(`알림이 ${delay / 1000}초 후에 시작됩니다.`);
    setTimeout(setupInterval, delay);
  } else {
    setupInterval();
  }

  channel.send('반복 알림이 설정되었습니다!');
}

function stopReminder(userId, channel) {
  const key = `${userId}_${channel.id}`;
  const intervalId = activeReminders.get(key);

  if (!intervalId) {
    channel.send('현재 설정된 알림이 없습니다.');
    return;
  }

  clearInterval(intervalId);
  activeReminders.delete(key);
  channel.send('알림이 성공적으로 중지되었습니다.');
}

module.exports = {
  startReminder,
  stopReminder,
};
