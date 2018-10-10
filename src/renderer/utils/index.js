function getFormatDate(dateType, time) {
  const type = dateType || 'YYYY-MM-DD HH:MM:SS';
  const val = time || new Date();
  const date = new Date(val);
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = `0${month}`;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = `0${strDate}`;
  }
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const timeStr = type
    .replace(/YYYY/, year)
    .replace(/-MM-/, `-${month}-`)
    .replace(/DD/, strDate)
    .replace(/HH/, hours)
    .replace(/:MM/, `:${minutes}`)
    .replace(/:SS/, `:${seconds}`);

  return timeStr;
}

module.exports = {
  getFormatDate,
};
