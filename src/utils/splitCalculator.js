import { distributeRemainder, roundToTwo } from './rounding';

export const calculateSplits = (amount, splitMode, participants, inputData = {}) => {
  if (splitMode === 'equal') {
    const count = participants.length;
    const { baseAmount, remainder } = distributeRemainder(amount, count);
    
    return participants.map((p, index) => ({
      participantId: p.id,
      amount: roundToTwo(baseAmount + (index < remainder ? 0.01 : 0))
    }));
  }
  
  if (splitMode === 'custom') {
    return participants.map(p => ({
      participantId: p.id,
      amount: inputData[p.id] ? roundToTwo(parseFloat(inputData[p.id])) : 0
    }));
  }

  if (splitMode === 'percentage') {
    return participants.map(p => {
      const pct = inputData[p.id] ? parseFloat(inputData[p.id]) : 0;
      return {
        participantId: p.id,
        amount: roundToTwo((amount * pct) / 100),
        percentage: pct
      };
    });
  }

  return [];
};
