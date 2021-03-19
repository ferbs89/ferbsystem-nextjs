import { useState } from 'react';
import { mutate } from 'swr';
import axios from 'axios';
import { formatMoney, formatDateDMY, formatDateYMD } from '../../utils/functions';

import { toast } from 'react-toastify';
import { FiCheck, FiEdit, FiTrash2, FiLoader, FiX } from 'react-icons/fi';

export default function OrderEdit({ order, query }) {
	const [stock, setStock] = useState(order.stock);
	const [date, setDate] = useState(order.date);
	const [qty, setQty] = useState(order.qty);
	const [price, setPrice] = useState(order.price);
	const [edit, setEdit] = useState(false);
	const [loading, setLoading] = useState(false);

	let url = '/api/orders';

	if (query)
		url += `?stock=${stock}`;

	async function handleEdit(order_id) {
		if (!date || !stock || !price || !qty) {
			toast.error('Preencha todos os campos.');
			return;
		}

		setLoading(true);

		await axios.put(`/api/orders/${order_id}`, {
			date,
			stock,
			qty,
			price,

		}).then(async () => {
			await mutate(url);
			setLoading(false);
			setEdit(false);
			toast.success('Operação salva com sucesso.');
		});
	}

	async function handleDelete(order_id) {
		setLoading(true);

		await axios.delete(`/api/orders/${order_id}`).then(async () => {
			await mutate(url);
			setLoading(false);
			toast.success('Operação removida com sucesso.');
		});
	}

	async function handleCancel(order) {
		setEdit(false);
		setDate(order.date);
		setStock(order.stock);
		setQty(order.qty);
		setPrice(order.price);
	}

	return (
		<>
			{!edit && (
				<tr>
					<td data-header="Data">{formatDateDMY(order.date)}</td>
					{!query && (
						<td data-header="Ativo">{order.stock}</td>
					)}
					<td data-header="Quantidade">{order.qty}</td>
					<td data-header="Preço">{formatMoney(order.price)}</td>
					<td data-header="Total">
						{formatMoney(order.price * order.qty)}
						
						{order.profit > 0 && (
							<span className="profit positive">Lucro: {formatMoney(order.profit)}</span>
						)}

						{order.profit < 0 && (
							<span className="profit negative">Prejuízo: {formatMoney(order.profit)}</span>
						)}
					</td>
					<td className="action">
						{!loading ? (
							<div>
								<button onClick={() => setEdit(true)}><FiEdit /></button>
								<button onClick={() => handleDelete(order._id)}><FiTrash2 /></button>
							</div>
						) : (
							<div>
								<button><FiLoader /></button>
							</div>							
						)}
					</td>
				</tr>
			)}

			{edit && (
				<tr>
					<td data-header="Data"><input type="date" value={formatDateYMD(date)} onChange={e => setDate(e.target.value)} /></td>
					{!query !== false && (
						<td data-header="Ativo"><input type="text" placeholder="Ativo" value={stock} onChange={e => setStock(e.target.value)} /></td>
					)}
					<td data-header="Quantidade"><input type="number" min="0" placeholder="Quantidade" value={qty} onChange={e => setQty(e.target.value)} /></td>
					<td data-header="Preço"><input type="number" min="0" step="0.01" placeholder="Preço" value={price} onChange={e => setPrice(e.target.value)} /></td>
					<td data-header="Total">{formatMoney(price * qty)}</td>
					<td className="action">
						{!loading ? (
							<div>
								<button onClick={() => handleEdit(order._id)}><FiCheck /></button>
								<button onClick={() => handleCancel(order)}><FiX /></button>
							</div>
						) : (
							<div>
								<button><FiLoader /></button>
							</div>
						)}
					</td>
				</tr>
			)}
		</>
	);
}
