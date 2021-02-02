import { useState } from 'react';
import { mutate } from 'swr';
import axios from 'axios';

import { FiPlusCircle } from 'react-icons/fi';

export default function OrderCreate({ query }) {
	const [stock, setStock] = useState(query ? query : '');
	const [date, setDate] = useState('');
	const [qty, setQty] = useState('');
	const [price, setPrice] = useState('');

	let url = '/api/orders';

	if (query)
		url += `?stock=${stock}`;

	function formatMoney(amount) {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		}).format(amount);
	}

	async function handleCreate() {
		if (!date || !stock || !price || !qty)
			return;

		await axios.post(url, {
			date,
			stock,
			qty,
			price,
			
		}).then(response => {
			mutate(url);

			if (!query)
				setStock('');

			setDate('');
			setQty('');
			setPrice('');
		});
	}

	return (
		<tr>
			<td data-header="Data"><input type="date" value={date} onChange={e => setDate(e.target.value)} /></td>
			{!query && (
				<td data-header="Ativo"><input type="text" placeholder="Ativo" value={stock} onChange={e => setStock(e.target.value)} /></td>
			)}
			<td data-header="Quantidade"><input type="number" min="0" placeholder="Quantidade" value={qty} onChange={e => setQty(e.target.value)} /></td>
			<td data-header="Preço"><input type="number" min="0" step="0.01" placeholder="Preço" value={price} onChange={e => setPrice(e.target.value)} /></td>
			<td data-header="Total">{formatMoney(price * qty)}</td>
			<td data-header="Adicionar" className="action">
				<div>
					<button onClick={handleCreate}><FiPlusCircle /></button>
				</div>
			</td>
		</tr>
	);
}
