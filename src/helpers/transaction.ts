import { Transaction } from '../models';

export const validateTransaction = async (txId: string) => {
  const transaction = await Transaction.findById(txId);

  if (transaction && transaction.status.toLowerCase() !== 'failed') {
    return { status: true, transaction };
  }

  return { status: false, transaction };
};
