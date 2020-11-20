import { useState } from 'react';
import { mutate } from 'swr';
import axios from 'axios';

import { FiPlusCircle } from 'react-icons/fi';

export default function OrderCreate({ user_id }) {
	const [stock, setStock] = useState('');
	const [price, setPrice] = useState('');
	const [qty, setQty] = useState('');

	function formatMoney(amount) {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		}).format(amount);
	}

	async function handleCreate() {
		if (!stock || !price || !qty)
			return;

		await axios.post(`/api/users/${user_id}/orders`, {
			stock,
			price,
			qty,
		}).then(response => {
			mutate(`/api/users/${user_id}/orders`);

			setStock('');
			setPrice('');
			setQty('');
		});
	}

	return (
		<tr>
			<td><input type="text" placeholder="Ativo" value={stock} onChange={e => setStock(e.target.value)} /></td>
			<td><input type="number" min="0" step="0.01" placeholder="Preço" value={price} onChange={e => setPrice(e.target.value)} /></td>
			<td><input type="number" min="0" placeholder="Quantidade" value={qty} onChange={e => setQty(e.target.value)} /></td>
			<td>{price > 0 && qty > 0 && formatMoney(price * qty)}</td>
			<td data-header="Adicionar" className="action">
				<button onClick={handleCreate}><FiPlusCircle /></button>
			</td>
		</tr>
	);
}
