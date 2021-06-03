import useUser from '../hooks/useUser';
import { useFetch } from '../hooks/useFetch';

import Layout from '../components/layout';
import Loading from '../components/loading';
import Error from '../components/error';
import DividendCreate from '../components/dividends/dividend-create';
import DividendEdit from '../components/dividends/dividend-edit';

export default function Dividends() {
	const { user } = useUser({ redirectTo: '/login' });
	const { data, error } = useFetch(user?.isLoggedIn ? '/api/dividends' : null);

	if (!user || user.isLoggedIn === false) return <Loading />

	if (error) return <Error />
	if (!data) return <Loading />

	return (
		<Layout title="Dividendos">
			<div className="content">
				<h1>Dividendos</h1>
                
				<table>
					<thead>
						<tr>
							<th width="13%">Ativo</th>
							<th width="20%">Data Com</th>
							<th width="20%">Data Pagamento</th>
							<th width="13%">Quantidade</th>
							<th width="13%">Valor</th>
							<th width="11%">Total</th>
							<th width="10%" className="action">Ação</th>
						</tr>
					</thead>

					<tbody>
						<DividendCreate />

						{data.map(dividend => (
							<DividendEdit key={dividend._id} dividend={dividend} />
						))}
					</tbody>
				</table>
			</div>
		</Layout>
	);
}
