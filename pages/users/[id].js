import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useFetch } from '../../hooks/useFetch';

export default function UserDetail() {
	const router = useRouter();
  	const { id } = router.query
	const { data, error } = useFetch(`/api/users/${id}/orders`);

	if (error) return <div className="main"><p className="title">failed to load</p></div>
	if (!data) return <div className="main"><p className="title">loading...</p></div>

	function formatMoney(amount) {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		}).format(amount);
	}

	return (
		<div className="content">
			<Head>
				<title>{data.user.name} | Ferbsystem</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<h1>{data.user.name}</h1>

			{data.user.orders.length == 0 && (
				<p>Nenhuma operação encontrada.</p>
			)}

			{data.user.orders.length > 0 && (
				<table>
					<thead>
						<tr>
							<th>Ativo</th>
							<th>Preço</th>
							<th>Quantidade</th>
							<th>Total</th>
						</tr>
					</thead>

					<tbody>
						{data.user.orders.map(order => (
							<tr key={order._id}>
								<td data-header="Ativo">{order.stock}</td>
								<td data-header="Preço">{formatMoney(order.price)}</td>
								<td data-header="Quantidade">{order.qty}</td>
								<td data-header="Total">{formatMoney(order.price * order.qty)}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}

			<Link href="/users">
				<a className="back-link">Voltar</a>
			</Link>
		</div>
	);
}
