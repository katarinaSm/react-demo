import { makeObservable, observable } from 'mobx';

class InvestorData {
  email: string | null;

  amount: number;

  constructor() {
    this.reset();
    makeObservable(this, {
      email: observable,
      amount: observable,
    });
  }

  reset() {
    this.email = null;
    this.amount = 0;
  }
}

export default InvestorData;
