import useUser from '../hooks/useUser';
import { useFetch } from '../hooks/useFetch';

import Layout from '../components/layout';
import Loading from '../components/loading';
import Error from '../components/error';
import OrderCreate from '../components/orders/order-create';
import OrderEdit from '../components/orders/order-edit';

export default function Orders() {
	const { user } = useUser({ redirectTo: '/login' });
	const { data, error } = useFetch(user?.isLoggedIn ? '/api/orders' : null);

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
							<th width="18%">Data</th>
							<th width="18%">Ativo</th>
							<th width="18%">Quantidade</th>
							<th width="18%">Preço</th>
							<th width="18%">Total</th>
							<th className="action">Ação</th>
						</tr>
					</thead>

					<tbody>
						<OrderCreate />

						{data.orders.map(order => (
							<OrderEdit key={order._id} order={order} />
						))}
					</tbody>
				</table>
			</div>
		</Layout>
	);
}
