const numberFormatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

export const formatCurrency = (amount: number) => numberFormatter.format(amount);
