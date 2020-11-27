import { useState } from 'react';
import { mutate } from 'swr';
import axios from 'axios';

import { FiCheck, FiEdit, FiTrash2 } from 'react-icons/fi';

export default function OrderEdit({ order, query }) {
	const [stock, setStock] = useState(order.stock);
	const [price, setPrice] = useState(order.price);
	const [qty, setQty] = useState(order.qty);
	const [edit, setEdit] = useState(false);

	let url = '/api/orders';

	if (query)
		url += `?stock=${stock}`;

	function formatMoney(amount) {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		}).format(amount);
	}

	async function handleEdit(order_id) {
		if (!stock || !price || !qty)
			return;

		await axios.put(`/api/orders/${order_id}`, {
			stock,
			price,
			qty,

		}).then(() => {
			mutate(url);
			setEdit(false);
		});
	}

	async function handleDelete(order_id) {
		await axios.delete(`/api/orders/${order_id}`).then(() => {
			mutate(url);
		});
	}

	return (
		<>
			{!edit && (
				<tr>
					{!query && (
						<td data-header="Ativo">{order.stock}</td>
					)}
					<td data-header="Preço">{formatMoney(order.price)}</td>
					<td data-header="Quantidade">{order.qty}</td>
					<td data-header="Total">{formatMoney(order.price * order.qty)}</td>
					<td data-header="Ação" className="action">
						<button><FiEdit onClick={() => setEdit(true)} /></button>
						<button onClick={() => handleDelete(order._id)}><FiTrash2 /></button>
					</td>
				</tr>
			)}

			{edit && (
				<tr>
					{!query !== false && (
						<td><input type="text" placeholder="Ativo" value={stock} onChange={e => setStock(e.target.value)} /></td>
					)}
					<td><input type="number" min="0" step="0.01" placeholder="Preço" value={price} onChange={e => setPrice(e.target.value)} /></td>
					<td><input type="number" min="0" placeholder="Quantidade" value={qty} onChange={e => setQty(e.target.value)} /></td>
					<td data-header="Total">{formatMoney(price * qty)}</td>
					<td data-header="Editar" className="action">
						<button onClick={() => handleEdit(order._id)}><FiCheck /></button>
					</td>
				</tr>
			)}
		</>
	);
}
