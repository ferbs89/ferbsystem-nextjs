import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import axios from 'axios';
import { FiPlusCircle, FiTrash2, FiArrowLeft } from 'react-icons/fi';

export default function UserDetail() {
	const router = useRouter();
	const { id } = router.query;
	const { data, error, mutate } = useFetch(id ? `/api/users/${id}/orders` : null);

	const [stock, setStock] = useState('');
	const [price, setPrice] = useState('');
	const [qty, setQty] = useState('');

	if (error) return <div className="content"><p>Ocorreu um erro ao carregar os dados.</p></div>
	if (!data) return <div className="content"><p>Carregando...</p></div>

	function formatMoney(amount) {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		}).format(amount);
	}

	async function handleSubmit() {
		await axios.post(`/api/users/${id}/orders`, {
			stock,
			price,
			qty,
		}).then(response => {
			mutate();

			setStock('');
			setPrice('');
			setQty('');
		});
	}

	async function handleDelete(order_id) {
		await axios.put(`/api/users/${id}/orders`, {
			order_id,
		}).then(response => {
			mutate();
		});
	}

	return (
		<div className="content">
			<Head>
				<title>{data.user.name} | Ferbsystem</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<h1>{data.user.name}</h1>

			{data.user.orders.length == 0 && (
				<p>Nenhum registro encontrado.</p>
			)}

			{data.user.orders.length > 0 && (
				<table>
					<thead>
						<tr>
							<th>Ativo</th>
							<th>Preço</th>
							<th>Quantidade</th>
							<th>Total</th>
							<th className="action">Ação</th>
						</tr>
					</thead>

					<tbody>
						{data.user.orders.map(order => (
							<tr key={order._id}>
								<td data-header="Ativo">{order.stock}</td>
								<td data-header="Preço">{formatMoney(order.price)}</td>
								<td data-header="Quantidade">{order.qty}</td>
								<td data-header="Total">{formatMoney(order.price * order.qty)}</td>
								<td data-header="Excluir" className="action"><button onClick={() => handleDelete(order._id)}><FiTrash2 /></button></td>
							</tr>
						))}
						
						<tr>
							<td><input type="text" placeholder="Ativo" value={stock} onChange={e => setStock(e.target.value)}/></td>
							<td><input type="text" placeholder="Preço" value={price} onChange={e => setPrice(e.target.value)}/></td>
							<td><input type="text" placeholder="Quantidade" value={qty} onChange={e => setQty(e.target.value)}/></td>
							<td>{price > 0 && qty > 0 && formatMoney(price * qty)}</td>
							<td data-header="Adicionar" className="action"><button onClick={handleSubmit}><FiPlusCircle /></button></td>
						</tr>
					</tbody>
				</table>
			)}

			<Link href="/users">
				<a className="back-link"><FiArrowLeft />Voltar</a>
			</Link>
		</div>
	);
}
