import { useState } from 'react';
import { mutate } from 'swr';
import axios from 'axios';

import { FiCheck, FiEdit, FiTrash2 } from 'react-icons/fi';

export default function OrderEdit({ order, query }) {
	const [stock, setStock] = useState(order.stock);
	const [date, setDate] = useState(order.date);
	const [qty, setQty] = useState(order.qty);
	const [price, setPrice] = useState(order.price);
	const [edit, setEdit] = useState(false);

	let url = '/api/orders';

	if (query)
		url += `?stock=${stock}`;

	function formatDate(value) {
		const date = value.split('-');
		return date[2] + '/' + date[1] + '/' + date[0];
	}
	
	function formatMoney(amount) {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		}).format(amount);
	}

	async function handleEdit(order_id) {
		if (!date || !stock || !price || !qty)
			return;

		await axios.put(`/api/orders/${order_id}`, {
			date,
			stock,
			qty,
			price,

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
					<td data-header="Data">{formatDate(order.date)}</td>
					{!query && (
						<td data-header="Ativo">{order.stock}</td>
					)}
					<td data-header="Quantidade">{order.qty}</td>
					<td data-header="Preço">{formatMoney(order.price)}</td>
					<td data-header="Total">{formatMoney(order.price * order.qty)}</td>
					<td data-header="Ação" className="action">
						<div>
							<button><FiEdit onClick={() => setEdit(true)} /></button>
							<button onClick={() => handleDelete(order._id)}><FiTrash2 /></button>
						</div>
					</td>
				</tr>
			)}

			{edit && (
				<tr>
					<td><input type="date" value={date} onChange={e => setDate(e.target.value)} /></td>
					{!query !== false && (
						<td><input type="text" placeholder="Ativo" value={stock} onChange={e => setStock(e.target.value)} /></td>
					)}
					<td><input type="number" min="0" placeholder="Quantidade" value={qty} onChange={e => setQty(e.target.value)} /></td>
					<td><input type="number" min="0" step="0.01" placeholder="Preço" value={price} onChange={e => setPrice(e.target.value)} /></td>
					<td data-header="Total">{formatMoney(price * qty)}</td>
					<td data-header="Editar" className="action">
						<div>
							<button onClick={() => handleEdit(order._id)}><FiCheck /></button>
						</div>
					</td>
				</tr>
			)}
		</>
	);
}
