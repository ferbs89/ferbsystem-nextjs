import Link from 'next/link';
import { useFetch } from '../../hooks/useFetch';

import Layout from '../../components/layout';
import Loading from '../../components/loading';
import Error from '../../components/error';

import { FiSearch } from 'react-icons/fi';

export default function Users() {
	const { data, error } = useFetch('/api/users');

	if (error) return <Error />
	if (!data) return <Loading />

	return (
		<Layout title="Usuários">
			<div className="content">
				<h1>Usuários</h1>

				{data.length > 0 && (
					<table>
						<thead>
							<tr>
								<th>Nome</th>
								<th>E-mail</th>
								<th className="action">Ação</th>
							</tr>
						</thead>

						<tbody>
							{data.map(user => (
								<tr key={user._id}>
									<td data-header="Nome">{user.name}</td>
									<td data-header="E-mail">{user.email}</td>
									<td data-header="Visualizar" className="action">
										<Link href={`/users/${user._id}`}>
											<button><FiSearch /></button>
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</Layout>
	);
}
