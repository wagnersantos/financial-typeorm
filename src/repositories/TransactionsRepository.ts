import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  private async sumValueType(type: string): Promise<number> {
    const transactions = await this.find();

    if (!transactions.length) return 0;
    return transactions
      .map(e => {
        if (e.type === type) return e.value;
        return 0;
      })
      .reduce(
        (accumulator: number, currentValue: number) =>
          accumulator + currentValue,
      );
  }

  public async getBalance(): Promise<Balance> {
    const income = (await this.sumValueType('income')) || 0;
    const outcome = (await this.sumValueType('outcome')) || 0;
    const total = income - outcome || 0;

    const balance = {
      income,
      outcome,
      total,
    };
    return balance;
  }

  public async findAll(): Promise<Transaction[]> {
    const transactions = await this.createQueryBuilder('t')
      .innerJoinAndSelect('t.category', 'c', 'c.id = t.category_id')
      // .select(['t.id', 't.title', 't.value', 't.type', 'c.id', 'c.title'])
      .getMany();

    return transactions;
  }
}

export default TransactionsRepository;
