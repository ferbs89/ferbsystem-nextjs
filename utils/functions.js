export function formatMoney(amount) {
	if (isNaN(amount))
		amount = 0;

	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(amount);
}

export function formatDate(value) {
	const date = value.split('-');
	return date[2] + '/' + date[1] + '/' + date[0];
}