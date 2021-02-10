import Link from 'next/link';
import { useRouter } from 'next/router';
import useUser from '../../hooks/useUser';
import { useFetch } from '../../hooks/useFetch';

import Layout from '../../components/layout';
import Loading from '../../components/loading';
import Error from '../../components/error';
import OrderCreate from '../../components/orders/create';
import OrderEdit from '../../components/orders/edit';

import { FiArrowLeft } from 'react-icons/fi';

export default function Stock() {
	const router = useRouter();
	const { stock } = router.query;
	const { user } = useUser({ redirectTo: '/login' });
	const { data, error } = useFetch(user?.isLoggedIn ? `/api/orders?stock=${stock}` : null);

	if (!user || user.isLoggedIn === false) return <Loading />

	if (error) return <Error />
	if (!data) return <Loading />

	function formatMoney(amount) {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		}).format(amount);
	}

	return (
		<Layout title={stock}>
			<div className="content">
				<table className="stock-info">
					<thead>
						<tr>
							<th width="40%">Ativo</th>
							<th width="20%">Preço</th>
							<th width="20%">Quantidade</th>
							<th width="20%">Total</th>
						</tr>
					</thead>

					<tbody>
						<tr>
							<td className="stock-symbol">{data.stock.stock}</td>
							<td data-header="Preço">{formatMoney(data.stock.price)}</td>
							<td data-header="Quantidade">{data.stock.qty}</td>
							<td data-header="Total">{formatMoney(data.stock.total)}</td>
						</tr>
					</tbody>
				</table>

				<h1>Operações</h1>

				<table>
					<thead>
						<tr>
							<th width="25%">Data</th>
							<th width="25%">Quantidade</th>
							<th width="25%">Preço</th>
							<th width="25%">Total</th>
							<th className="action">Ação</th>
						</tr>
					</thead>

					<tbody>
						<OrderCreate query={stock} />

						{data.orders.map(order => (
							<OrderEdit key={order._id} order={order} query={stock} />
						))}
					</tbody>
				</table>

				<Link href="/">
					<a className="back-link"><FiArrowLeft />Voltar</a>
				</Link>
			</div>
		</Layout>
	);
}
