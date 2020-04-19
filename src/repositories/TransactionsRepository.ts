import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO
  }

  public async findAll(): Promise<Transaction[]> {
    const transactions = await this.createQueryBuilder('t')
      .innerJoinAndSelect('t.category', 'c', 'c.id = t.category_id')
      .select(['t.id', 't.title', 't.value', 't.type', 'c.id', 'c.title'])
      .getMany();

    return transactions;
  }
}

export default TransactionsRepository;
