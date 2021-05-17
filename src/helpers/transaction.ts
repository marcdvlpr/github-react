import { Transaction } from '../models';
import { Constants } from '../constants';

export const validateTransaction = async (txId: string) => {
  const transaction = await Transaction.findById(txId);

  if (transaction && transaction.status.toLowerCase() !== Constants.FAILED) {
    return { status: true, transaction };
  }

  return { status: false, transaction };
};
