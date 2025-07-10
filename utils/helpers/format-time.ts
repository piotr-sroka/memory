export const formatTime = (time: number) => {
  const h = Math.floor(time / 3600)
    .toString()
    .padStart(2, '0');
  const m = Math.floor((time % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const s = (time % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};
