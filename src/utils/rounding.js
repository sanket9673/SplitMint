export const roundToTwo = (num) => Math.round(num * 100) / 100;

export const distributeRemainder = (amount, participantsCount) => {
  const baseAmount = Math.floor((amount / participantsCount) * 100) / 100;
  const remainder = Math.round((amount - baseAmount * participantsCount) * 100);
  return { baseAmount, remainder }; 
};
