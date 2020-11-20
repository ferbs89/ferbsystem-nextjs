import Link from 'next/link';
import { useRouter } from 'next/router';
import { useFetch } from '../../hooks/useFetch';

import Layout from '../../components/layout';
import Loading from '../../components/loading';
import Error from '../../components/error';
import OrderCreate from '../../components/orders/create';
import OrderEdit from '../../components/orders/edit';

import { FiArrowLeft } from 'react-icons/fi';

export default function UserDetail() {
	const router = useRouter();
	const { id } = router.query;
	const { data, error, mutate } = useFetch(id ? `/api/users/${id}/orders` : null);

	if (error) return <Error />
	if (!data) return <Loading />

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
								<OrderEdit key={order._id} order={order} />
							))}
							
							<OrderCreate user_id={id} />
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
