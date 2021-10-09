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
                
				<table className="responsive">
					<thead>
						<tr>
							<th>Ativo</th>
							<th>Data com</th>
							<th>Data pagamento</th>
							<th>Quantidade</th>
							<th>Valor</th>
							<th>Total</th>
							<th className="action">Ação</th>
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
