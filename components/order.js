import { useState } from 'react';
import { FiCheck, FiEdit, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';

export default function OrderEdit({ order }) {
	const [stock, setStock] = useState(order.stock);
	const [price, setPrice] = useState(order.price);
	const [qty, setQty] = useState(order.qty);
	const [edit, setEdit] = useState(false);

	function formatMoney(amount) {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		}).format(amount);
	}

	async function handleEdit(order_id) {
		if (!stock || !price || !qty)
			return;

		await axios.put(`/api/users/${order.user_id}/orders`, {
			order_id,
			stock,
			price,
			qty,
		}).then(response => {
			// mutate();
			setEdit(false);
		});
	}

	async function handleDelete(order_id) {
		await axios.delete(`/api/users/${order.user_id}/orders?order_id=${order_id}`, {
			
		}).then(response => {
			// mutate();
		});
	}

	return (
		<>
			{!edit && (
				<tr>
					<td data-header="Ativo">{order.stock}</td>
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
					<td><input type="text" placeholder="Ativo" value={stock} onChange={e => setStock(e.target.value)} /></td>
					<td><input type="number" min="0" step="0.01" placeholder="Preço" value={price} onChange={e => setPrice(e.target.value)} /></td>
					<td><input type="number" min="0" placeholder="Quantidade" value={qty} onChange={e => setQty(e.target.value)} /></td>
					<td data-header="Total">{formatMoney(price * qty)}</td>
					<td data-header="Editar" className="action"><button onClick={() => handleEdit(order._id)}><FiCheck /></button></td>
				</tr>
			)}
		</>
	);
}
