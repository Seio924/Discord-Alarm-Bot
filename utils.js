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
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');

  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const day = days[now.getDay()];

  return template
    .replace('${날짜}', `${yyyy}-${mm}-${dd}`)
    .replace('${요일}', day)
    .replace('${시간}', `${hh}:${min}`);
}

module.exports = {
  parseInterval,
  formatTemplate,
};
