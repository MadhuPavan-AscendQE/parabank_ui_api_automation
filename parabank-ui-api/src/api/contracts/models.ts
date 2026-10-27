export interface ApiCustomer {
    id: number;
    firstName: string;
    lastName: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    phoneNumber: string;
    ssn: string;
}
export interface ApiAccount {
    id: number;
    customerId: number;
    type: 'CHECKING' | 'SAVINGS' | 'LOAN';
    balance: number;
}
export interface ApiTransaction {
    id: number;
    accountId: number;
    type: 'Debit' | 'Credit';
    date: string;
    amount: number;
    description: string;
}
export interface ApiBill {
    accountId: number;
    amount: number;
    payeeName: string;
}
