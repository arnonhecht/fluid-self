function getRandomTime(avg, dev) {
  var sign = (0.5<Math.random()) ? 1: (-1);
  var activityTime = parseInt((avg + (sign * dev * Math.random())) * 1000);
  return activityTime;
}