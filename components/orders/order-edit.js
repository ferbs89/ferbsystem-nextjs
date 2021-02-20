import { useState } from 'react';
import { mutate } from 'swr';
import axios from 'axios';
import { formatMoney, formatDate } from '../../utils/functions';

import { toast } from 'react-toastify';
import { FiCheck, FiEdit, FiTrash2, FiLoader } from 'react-icons/fi';

export default function OrderEdit({ order, query }) {
	const [stock, setStock] = useState(order.stock);
	const [date, setDate] = useState(order.date);
	const [qty, setQty] = useState(order.qty);
	const [price, setPrice] = useState(order.price);
	const [sell, setSell] = useState(order.sell);
	const [profit, setProfit] = useState((sell > 0) ? ((Math.abs(qty) * sell) + (qty * price)) : (0));
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
			sell,

		}).then(async () => {
			await mutate(url);
			toast.success('Operação salva com sucesso.');

			if (sell > 0)
				setProfit((Math.abs(qty) * sell) + (qty * price));

			setLoading(false);
			setEdit(false);
		});
	}

	async function handleDelete(order_id) {
		setLoading(true);

		await axios.delete(`/api/orders/${order_id}`).then(async () => {
			await mutate(url);
			toast.success('Operação removida com sucesso.');
			setLoading(false);
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
					<td data-header="Preço">{formatMoney((order.qty > 0) ? (order.price) : (order.sell))}</td>
					<td data-header="Total">
						{formatMoney((order.qty > 0) ? (order.price * order.qty) : (order.sell * order.qty))}
						
						{profit > 0 && (
							<span className="profit positive">Lucro: {formatMoney(profit)}</span>
						)}

						{profit < 0 && (
							<span className="profit negative">Lucro: {formatMoney(profit)}</span>
						)}
					</td>
					<td className="action">
						{!loading && (
							<div>
								<button onClick={() => setEdit(true)}><FiEdit /></button>
								<button onClick={() => handleDelete(order._id)}><FiTrash2 /></button>
							</div>
						)}

						{loading && (
							<div>
								<button><FiLoader /></button>
							</div>							
						)}
					</td>
				</tr>
			)}

			{edit && (
				<tr>
					<td data-header="Data"><input type="date" value={date} onChange={e => setDate(e.target.value)} /></td>
					{!query !== false && (
						<td data-header="Ativo"><input type="text" placeholder="Ativo" value={stock} onChange={e => setStock(e.target.value)} /></td>
					)}
					<td data-header="Quantidade"><input type="number" min="0" placeholder="Quantidade" value={qty} onChange={e => setQty(e.target.value)} /></td>
					<td data-header="Preço">
						{qty > 0 && (
							<input type="number" min="0" step="0.01" placeholder="Preço" value={price} onChange={e => setPrice(e.target.value)} />
						)}

						{qty < 0 && (
							<input type="number" min="0" step="0.01" placeholder="Preço" value={sell} onChange={e => setSell(e.target.value)} />
						)}
					</td>
					<td data-header="Total">{formatMoney((qty > 0) ? (price * qty) : (sell * qty))}</td>
					<td className="action">
						<div>
							{!loading && (
								<button onClick={() => handleEdit(order._id)}><FiCheck /></button>
							)}

							{loading && (
								<button><FiLoader /></button>
							)}
						</div>
					</td>
				</tr>
			)}
		</>
	);
}
