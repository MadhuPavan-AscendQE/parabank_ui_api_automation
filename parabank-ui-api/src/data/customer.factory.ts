import { randomUUID } from 'node:crypto';
export function customerData() { return { firstName: 'MySDET', lastName: 'Synthetic', street: '100 Test Avenue', city: 'Testville', state: 'CA', zipCode: '90210', phoneNumber: '2025550147', ssn: '000-00-0000', username: 'qe13_' + randomUUID().replace(/-/g, '').slice(0, 14), password: 'Demo!' + randomUUID().replace(/-/g, '').slice(0, 14) }; }
export type Customer = ReturnType<typeof customerData>;
