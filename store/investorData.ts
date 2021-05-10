import { makeObservable, observable } from 'mobx';

class InvestorData {
  email: string;

  amount: number;

  constructor() {
    makeObservable(this, {
      email: observable,
      amount: observable,
    });

    this.reset();
  }

  reset() {
    this.email = '';
    this.amount = 0;
  }
}

export default InvestorData;
