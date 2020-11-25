import useUser from '../../hooks/useUser';
import { useFetch } from '../../hooks/useFetch';

import Layout from '../../components/layout';
import Loading from '../../components/loading';
import Error from '../../components/error';
import OrderCreate from '../../components/orders/create';
import OrderEdit from '../../components/orders/edit';

export default function Orders() {
	const { user } = useUser({ redirectTo: '/login' });
	const { data, error } = useFetch(user?._id ? `/api/users/${user._id}/orders` : null);

	if (!user || user.isLoggedIn === false) return <Loading />

	if (error) return <Error />
	if (!data) return <Loading />

	return (
		<Layout title="Operações">
			<div className="content">
				<h1>Operações</h1>

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
						{data.map(order => (
							<OrderEdit key={order._id} order={order} />
						))}
						
						<OrderCreate user_id={user._id} />
					</tbody>
				</table>
			</div>
		</Layout>
	);
}
