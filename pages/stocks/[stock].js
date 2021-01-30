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
	const { data, error } = useFetch(`/api/orders?stock=${stock}`);

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
				<table>
					<thead>
						<tr>
							<th>Código</th>
							<th width="20%">Preço</th>
							<th width="20%">Quantidade</th>
							<th width="20%">Total</th>
						</tr>
					</thead>

					<tbody>
						<tr>
							<td>{data.stock.stock}</td>
							<td>{formatMoney(data.stock.price)}</td>
							<td>{data.stock.qty}</td>
							<td>{formatMoney(data.stock.total)}</td>
						</tr>
					</tbody>
				</table>

				<br/><br/>

				<table>
					<thead>
						<tr>
							<th>Data</th>
							<th>Quantidade</th>
							<th>Preço</th>
							<th>Total</th>
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
