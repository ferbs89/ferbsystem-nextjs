import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios';
import { useFetch } from '../../hooks/useFetch';

import Layout from '../../components/layout';
import Loading from '../../components/loading';
import Error from '../../components/error';
import Order from '../../components/order';

import { FiPlusCircle, FiArrowLeft } from 'react-icons/fi';

export default function UserDetail() {
	const router = useRouter();
	const { id } = router.query;
	const { data, error, mutate } = useFetch(id ? `/api/users/${id}/orders` : null);

	const [stock, setStock] = useState('');
	const [price, setPrice] = useState('');
	const [qty, setQty] = useState('');

	if (error) return <Error />
	if (!data) return <Loading />

	function formatMoney(amount) {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		}).format(amount);
	}

	async function handleCreate() {
		if (!stock || !price || !qty)
			return;

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

	return (
		<Layout title={data.user.name}>
			<div className="content">
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
								<Order key={order._id} order={order} />
							))}
							
							<tr>
								<td><input type="text" placeholder="Ativo" value={stock} onChange={e => setStock(e.target.value)} /></td>
								<td><input type="number" min="0" step="0.01" placeholder="Preço" value={price} onChange={e => setPrice(e.target.value)} /></td>
								<td><input type="number" min="0" placeholder="Quantidade" value={qty} onChange={e => setQty(e.target.value)} /></td>
								<td>{price > 0 && qty > 0 && formatMoney(price * qty)}</td>
								<td data-header="Adicionar" className="action"><button onClick={handleCreate}><FiPlusCircle /></button></td>
							</tr>
						</tbody>
					</table>
				)}

				<Link href="/users">
					<a className="back-link"><FiArrowLeft />Voltar</a>
				</Link>
			</div>
		</Layout>
	);
}
