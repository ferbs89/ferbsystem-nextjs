export function formatMoney(amount) {
	if (isNaN(amount))
		amount = 0;

	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(amount);
}

export function formatDateDMY(value) {
	const datetime = value.split('T');
	const date = datetime[0].split('-');
	return date[2] + '/' + date[1] + '/' + date[0];
}

export function formatDateYMD(value) {
	const datetime = value.split('T');
	return datetime[0];
}