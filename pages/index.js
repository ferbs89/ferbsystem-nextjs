import useUser from '../hooks/useUser';
import { useFetch } from '../hooks/useFetch';

import Layout from '../components/layout';
import Loading from '../components/loading';
import Error from '../components/error';

export default function Home() {
	const { user } = useUser({ redirectTo: '/login' });
	const { data, error } = useFetch('/api/stocks');

	if (!user || user.isLoggedIn === false) return <Loading />

	if (error) return <Error />
	if (!data) return <Loading />

	return (
		<Layout title="Ativos">
			<div className="content">
				<h1>Ativos</h1>

				{data.length == 0 && (
					<p>Nenhum registro encontrado.</p>
				)}

				{data.length > 0 && (
					<table>
						<thead>
							<tr>
								<th></th>
							</tr>
						</thead>

						<tbody>
							{data.map(stock => (
								<tr key={stock}>
									<td>{stock}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</Layout>
	);
}
