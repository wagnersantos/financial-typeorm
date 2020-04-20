import path from 'path';
import fs from 'fs';
import csv from 'csvtojson';

import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute({ filename }: { filename: string }): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();

    const csvFilePath = path.join(uploadConfig.directory, filename);
    const csvFileExists = await fs.promises.stat(csvFilePath);

    if (!csvFileExists) {
      throw new AppError('File not found');
    }

    const parsedTransactions = await csv({
      checkType: true,
    }).fromFile(csvFilePath);

    // console.log(parsedTransactions);
    const transactions: Transaction[] = await Promise.all(
      parsedTransactions.map(async transaction => {
        const response = await createTransaction.execute({
          title: transaction.title,
          type: transaction.type,
          value: transaction.value,
          category: transaction.category.toString(),
        });

        return response;
      }),
    );

    await fs.promises.unlink(csvFilePath);

    return transactions;
  }
}

export default ImportTransactionsService;
