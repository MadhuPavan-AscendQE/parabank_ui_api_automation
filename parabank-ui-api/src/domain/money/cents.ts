export type Cents = number & {
    readonly __cents: unique symbol;
};
export function cents(n: number): Cents {
    if (!Number.isSafeInteger(n))
        throw new Error('Money must be safe integer cents');
    return n as Cents;
}
export function parseMoney(value: string): Cents {
    const v = value.trim();
    const m = /^(-)?\$?(\d+|\d{1,3}(?:,\d{3})+)\.(\d{2})$/.exec(v);
    if (!m)
        throw new Error(`Invalid monetary display: ${value}`);
    const whole = Number(m[2].replace(/,/g, ''));
    return cents((m[1] ? -1 : 1) * (whole * 100 + Number(m[3])));
}
export function amountInput(value: Cents): string { const n = Math.abs(value); return `${value < 0 ? '-' : ''}${Math.floor(n / 100)}.${String(n % 100).padStart(2, '0')}`; }
