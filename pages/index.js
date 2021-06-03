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

	let total = 0;
	let totalDividends = 0;
	let totalProfit = 0;

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
								<th className="price">Qtde</th>
								<th className="price">Total</th>
								<th className="price">Dividendos</th>
								<th className="price">L/P</th>
								<th width="10%" className="action">Visualizar</th>
							</tr>
						</thead>

						<tbody>
							{data.map(stock => {
								const profit = (stock.qty * stock.marketPrice) - stock.total + stock.dividend;

								total += (stock.qty * stock.marketPrice);
								totalDividends += stock.dividend;
								totalProfit += profit;

								return (
									<tr key={stock._id}>
										<td data-header="Código">{stock._id}</td>
										<td className="price" data-header="Variação">
											<span className={stock.marketChangePercent > 0 ? ('positive') : ('negative')}>
												{stock.marketChangePercent.toFixed(2).toString().replace('.', ',') + '%'}
											</span>
										</td>
										<td className="price" data-header="Preço">{formatMoney(stock.marketPrice)}</td>
										<td className="price" data-header="Custo">{formatMoney(stock.total / stock.qty)}</td>
										<td className="price" data-header="Quantidade">{stock.qty}</td>
										<td className="price" data-header="Total">{formatMoney(stock.qty * stock.marketPrice)}</td>
										<td className="price" data-header="Dividendos">{formatMoney(stock.dividend)}</td>
										<td className="price" data-header="L/P">
											<span className={profit > 0 ? ('positive') : ('negative')}>
												{formatMoney(profit)}
											</span>
										</td>
										<td className="action">
											<div>
												<Link href={`/stocks/${stock._id}`}>
													<a><FiSearch /></a>
												</Link>
											</div>
										</td>
									</tr>
								)
							})}

							<tr>
								<td colspan="5"></td>
								<td className="price" data-header="Total">
									<span className="total">
										{formatMoney(total)}
									</span>
								</td>
								<td className="price" data-header="Dividendos">
									<span className="total">
										{formatMoney(totalDividends)}
									</span>
								</td>
								<td className="price" data-header="L/P">
									<span className={totalProfit > 0 ? ('positive') : ('negative')}>
										{formatMoney(totalProfit)}
									</span>
								</td>
								<td></td>
							</tr>
						</tbody>
					</table>
				)}
			</div>
		</Layout>
	);
}
