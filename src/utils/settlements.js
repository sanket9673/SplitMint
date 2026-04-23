import { roundToTwo } from './rounding';

export const calculateSettlements = (netBalances) => {
  const debtors = [];
  const creditors = [];

  Object.entries(netBalances).forEach(([id, amt]) => {
    if (amt < -0.01) debtors.push({ id, amount: Math.abs(amt) });
    else if (amt > 0.01) creditors.push({ id, amount: amt });
  });

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let i = 0; 
  let j = 0; 

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    
    const amount = Math.min(debtor.amount, creditor.amount);
    
    if (amount > 0.01) {
      transactions.push({
        from: debtor.id,
        to: creditor.id,
        amount: roundToTwo(amount)
      });
    }

    debtor.amount = roundToTwo(debtor.amount - amount);
    creditor.amount = roundToTwo(creditor.amount - amount);

    if (debtor.amount <= 0.01) i++;
    if (creditor.amount <= 0.01) j++;
  }

  return transactions;
};
