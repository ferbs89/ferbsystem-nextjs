import Link from 'next/link';
import useUser from '../hooks/useUser';
import { useFetch } from '../hooks/useFetch';
import { formatMoney } from '../utils/functions';

import Layout from '../components/layout';
import Loading from '../components/loading';
import Error from '../components/error';

import { FiSearch } from 'react-icons/fi';

export default function Home() {
	const { user } = useUser({ redirectTo: '/login' });
	const { data, error } = useFetch(user?.isLoggedIn ? '/api/stocks' : null);

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
								<th>Código</th>
								<th className="price">Variação</th>
								<th className="price">Preço</th>
								<th className="price">Custo</th>
								<th className="price">Quantidade</th>
								<th className="price">Total</th>
								<th className="price">L/P</th>
								<th width="10%" className="action">Visualizar</th>
							</tr>
						</thead>

						<tbody>
							{data.map(stock => (
								<tr key={stock._id}>
									<td data-header="Código">{stock._id}</td>
									<td data-header="Variação" className="price">
										{stock.marketChangePercent.toFixed(2).toString().replace('.', ',') + '%'}
									</td>
									<td data-header="Preço" className="price">{formatMoney(stock.marketPrice)}</td>
									<td data-header="Custo" className="price">{formatMoney(stock.total / stock.qty)}</td>
									<td data-header="Quantidade" className="price">{stock.qty}</td>
									<td data-header="Total" className="price">{formatMoney(stock.qty * stock.marketPrice)}</td>
									<td data-header="L/P" className="price">{formatMoney(stock.qty * stock.marketPrice - stock.total)}</td>
									<td className="action">
										<div>
											<Link href={`/stocks/${stock._id}`}>
												<a><FiSearch /></a>
											</Link>
										</div>
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
