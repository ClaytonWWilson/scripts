export const sleepms = async (milliseconds: number) => {
  await new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
};
