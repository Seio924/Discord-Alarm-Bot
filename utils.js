const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const tz = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(tz);

function parseInterval(str) {
  const match = str.match(/^(\d+)([smhd])$/); // s초, m분, h시간, d일
  if (!match) return null;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const unitToMs = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * unitToMs[unit];
}

function formatTemplate(template) {
  const now = dayjs().tz('Asia/Seoul');

  const yyyy = now.year();
  const mm = String(now.month() + 1).padStart(2, '0');
  const dd = String(now.date()).padStart(2, '0');
  const hh = String(now.hour()).padStart(2, '0');
  const min = String(now.minute()).padStart(2, '0');
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const day = days[now.day()];

  return template
    .replace('${날짜}', `${yyyy}-${mm}-${dd}`)
    .replace('${요일}', day)
    .replace('${시간}', `${hh}:${min}`);
}

function convertMsToCron(ms) {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return '* * * * *';
  if (minutes < 60) return `*/${minutes} * * * *`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `0 */${hours} * * *`;
  const days = Math.floor(hours / 24);
  return `0 0 */${days} * *`;
}

module.exports = {
  parseInterval,
  formatTemplate,
  convertMsToCron,
};
