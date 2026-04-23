import { calculateSettlements } from './settlements';
import { roundToTwo } from './rounding';

export const computeGroupBalances = (participants, expenses) => {
  const netBalances = {};
  participants.forEach(p => netBalances[p.id] = 0);

  const owes = {};
  participants.forEach(p1 => {
    owes[p1.id] = {};
    participants.forEach(p2 => {
      if (p1.id !== p2.id) owes[p1.id][p2.id] = 0;
    });
  });

  expenses.forEach(exp => {
    const payerId = exp.payerId;
    if (!netBalances[payerId] && netBalances[payerId] !== 0) return; 

    netBalances[payerId] = roundToTwo(netBalances[payerId] + exp.amount);

    exp.splits.forEach(split => {
      if (netBalances[split.participantId] !== undefined) {
        netBalances[split.participantId] = roundToTwo(netBalances[split.participantId] - split.amount);
        
        if (split.participantId !== payerId) {
          owes[split.participantId][payerId] = roundToTwo(owes[split.participantId][payerId] + split.amount);
        }
      }
    });
  });

  participants.forEach(p1 => {
    participants.forEach(p2 => {
      if (p1.id !== p2.id) {
        const p1OwesP2 = owes[p1.id][p2.id];
        const p2OwesP1 = owes[p2.id][p1.id];
        
        if (p1OwesP2 > p2OwesP1) {
          owes[p1.id][p2.id] = roundToTwo(p1OwesP2 - p2OwesP1);
          owes[p2.id][p1.id] = 0;
        } else {
          owes[p2.id][p1.id] = roundToTwo(p2OwesP1 - p1OwesP2);
          owes[p1.id][p2.id] = 0;
        }
      }
    });
  });

  const settlements = calculateSettlements(netBalances);

  return { netBalances, owes, settlements };
};
