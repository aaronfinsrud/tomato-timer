module.exports = {
  minsToMs: (minutes) => minutes * 60000,
  secsToMS: (seconds) => seconds * 1000,
  MSToMins: (MS) => MS / 60000,
  MSToMinutesAndSeconds(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  },
};
