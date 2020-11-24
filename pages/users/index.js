import useUser from '../../hooks/useUser';
import { useFetch } from '../../hooks/useFetch';

import Layout from '../../components/layout';
import Loading from '../../components/loading';
import Error from '../../components/error';

export default function Users() {
	const { user } = useUser({ redirectTo: '/login' });
	const { data, error } = useFetch('/api/users');

	if (!user || user.isLoggedIn === false) return <Loading />
	
	if (error) return <Error />
	if (!data) return <Loading />

	return (
		<Layout title="Usuários">
			<div className="content">
				<h1>Usuários</h1>

				{data.length == 0 && (
					<p>Nenhum registro encontrado.</p>
				)}

				{data.length > 0 && (
					<table>
						<thead>
							<tr>
								<th>Nome</th>
								<th>E-mail</th>
							</tr>
						</thead>

						<tbody>
							{data.map(user => (
								<tr key={user._id}>
									<td data-header="Nome">{user.name}</td>
									<td data-header="E-mail">{user.email}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</Layout>
	);
}
