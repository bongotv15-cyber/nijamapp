export type PersonType = 'customer' | 'supplier';

export interface Customer {
  name: string;
  phone: string;
  address: string;
  type: PersonType;
  amount: number;
  time: number;
}

export interface Transaction {
  desc: string;
  date: string;
  time: string;
  gave: number;
  got: number;
  balance: number;
  type: PersonType;
}

export interface AppData {
  customers: Record<string, Customer>;
  transactions: Record<string, Transaction[]>;
}
