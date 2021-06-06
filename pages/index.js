import Link from 'next/link';
import useUser from '../hooks/useUser';
import { useFetch } from '../hooks/useFetch';
import { formatMoney } from '../utils/functions';

import Layout from '../components/layout';
import Loading from '../components/loading';
import Error from '../components/error';

import { FiSearch } from 'react-icons/fi';
import styles from '../styles/card.module.css';

export default function Home() {
	const { user } = useUser({ redirectTo: '/login' });
	const { data, error } = useFetch(user?.isLoggedIn ? '/api/stocks' : null);

	if (!user || user.isLoggedIn === false) return <Loading />

	if (error) return <Error />
	if (!data) return <Loading />

	return (
		<Layout title="Carteira">
			<div className="content">
				<div className={styles.card}>
					<div className={styles.item}>
						<div className={styles.title}>Carteira</div>
						<div className={styles.data}>{formatMoney(data.totalWallet)}</div>
					</div>

					<div className={styles.item}>
						<div className={styles.title}>Lucro</div>
						<div className={(data.totalProfit) > 0 ? (styles.dataPositive) : (styles.dataNegative)}>
							{formatMoney(data.totalProfit)}
						</div>								
					</div>

					<div className={styles.item}>
						<div className={styles.title}>Lucro em operações</div>
						<div className={(data.totalSale) > 0 ? (styles.dataPositive) : (styles.dataNegative)}>
							{formatMoney(data.totalSale)}
						</div>	
					</div>	

					<div className={styles.item}>
						<div className={styles.title}>Dividendos</div>
						<div className={styles.data}>{formatMoney(data.totalDividends)}</div>
					</div>											

					<div className={styles.item}>
						<div className={styles.title}>Total geral</div>
						<div className={(data.total) > 0 ? (styles.dataPositive) : (styles.dataNegative)}>
							{formatMoney(data.total)}
						</div>	
					</div>
				</div>

				{data.stocks.length == 0 && (
					<h2>Cadastre suas operações para acompanhar sua carteira.</h2>
				)}

				{data.stocks.length > 0 && (
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
								<th className="price">Lucro</th>
								<th width="10%" className="action">Visualizar</th>
							</tr>
						</thead>

						<tbody>
							{data.stocks.map(stock => {
								const profit = (stock.qty * stock.marketPrice) - stock.total + stock.dividend;

								return (
									<tr key={stock._id}>
										<td className="strong view" data-header="Código">{stock._id}</td>
										<td className="price view" data-header="Variação">
											<span className={stock.marketChangePercent > 0 ? ('positive') : ('negative')}>
												{stock.marketChangePercent.toFixed(2).toString().replace('.', ',') + '%'}
											</span>
										</td>
										<td className="price view" data-header="Preço">
											<span className={stock.marketChangePercent > 0 ? ('positive') : ('negative')}>
												{formatMoney(stock.marketPrice)}
											</span>
										</td>
										<td className="price view" data-header="Custo">{formatMoney(stock.total / stock.qty)}</td>
										<td className="price view" data-header="Quantidade">{stock.qty}</td>
										<td className="price view" data-header="Total">{formatMoney(stock.qty * stock.marketPrice)}</td>
										<td className="price view" data-header="Dividendos">{formatMoney(stock.dividend)}</td>
										<td className="price view" data-header="Lucro">
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

							<tr className="empty">
								<td colSpan="5"></td>
								<td className="price" data-header="Total">
									<span className="total">
										{formatMoney(data.totalWallet)}
									</span>
								</td>
								<td className="price" data-header="Dividendos">
									<span className="total">
										{formatMoney(data.totalDividends)}
									</span>
								</td>
								<td className="price" data-header="Lucro">
									<span className={data.totalProfit + data.totalDividends > 0 ? ('positive') : ('negative')}>
										{formatMoney(data.totalProfit + data.totalDividends)}
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
