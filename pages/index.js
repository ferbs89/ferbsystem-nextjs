import { useState } from 'react';
import Link from 'next/link';
import useUser from '../hooks/useUser';
import { useFetch } from '../hooks/useFetch';
import { formatMoney } from '../utils/functions';
import { setCookie, parseCookies } from 'nookies';

import Layout from '../components/layout';
import Loading from '../components/loading';
import Error from '../components/error';

import { FiSearch, FiAlignJustify, FiGrid } from 'react-icons/fi';
import card from '../styles/card.module.css';
import grid from '../styles/grid.module.css';

export default function Home(props) {
	const [view, setView] = useState(props.view);

	const { user } = useUser({ redirectTo: '/login' });
	const { data, error } = useFetch(user?.isLoggedIn ? '/api/stocks' : null);

	if (!user || user.isLoggedIn === false) return <Loading />

	if (error) return <Error />
	if (!data) return <Loading />

	return (
		<Layout title="Carteira">
			<div className="content">
				<div className="page-header">
					<span className="page-header-title">Carteira</span>

					<div className={card.card}>
						<div className={card.item}>
							<div className={card.title}>Patrimônio</div>
							<div className={card.data}>{formatMoney(data.totalWallet)}</div>
						</div>

						<div className={card.item}>
							<div className={card.title}>Lucro</div>
							<div className={(data.totalProfit) > 0 ? (card.dataPositive) : (card.dataNegative)}>
								{formatMoney(data.totalProfit)}
							</div>								
						</div>

						<div className={card.item}>
							<div className={card.title}>Lucro em operações</div>
							<div className={(data.totalSale) > 0 ? (card.dataPositive) : (card.dataNegative)}>
								{formatMoney(data.totalSale)}
							</div>	
						</div>	

						<div className={card.item}>
							<div className={card.title}>Dividendos</div>
							<div className={card.data}>{formatMoney(data.totalDividends)}</div>
						</div>											

						<div className={card.item}>
							<div className={card.title}>Total geral</div>
							<div className={(data.total) > 0 ? (card.dataPositive) : (card.dataNegative)}>
								{formatMoney(data.total)}
							</div>	
						</div>
					</div>
				</div>

				{data.stocks.length == 0 && (
					<h2>Cadastre suas operações para acompanhar sua carteira.</h2>
				)}

				{data.stocks.length > 0 && (
					<>
						<div className={grid.view}>
							<button onClick={() => {
								setView('table');
								setCookie(null, 'VIEW', 'table', {
									maxAge: 86400 * 31 * 12,
									path: '/',
								});
							}}>
								<FiAlignJustify />
							</button>

							<button onClick={() => {
								setView('grid');
								setCookie(null, 'VIEW', 'grid', {
									maxAge: 86400 * 31 * 12,
									path: '/',
								});
							}}>
								<FiGrid />
							</button>
						</div>

						{view == 'grid' ? (
							<div className={grid.container}>
								{data.stocks.map(stock => {
									const profit = (stock.qty * stock.marketPrice) - stock.total;
									const profit_percent = (stock.marketPrice - stock.avg_price) / stock.avg_price * 100;

									return (
										<div className={grid.content} key={stock._id}>
											<Link href={`/stocks/${stock._id}`}>
												<a>
													<div className={grid.header}>
														<span className={stock.marketChangePercent > 0 ? (grid.positive) : (grid.negative)}>
															{stock._id} ({stock.marketChangePercent.toFixed(2).toString().replace('.', ',') + '%'})
														</span>
														<span className={stock.marketChangePercent > 0 ? (grid.positive) : (grid.negative)}>
															{formatMoney(stock.marketPrice)}
														</span>
													</div>
												</a>
											</Link>

											<div className={grid.body}>
												<div className={grid.row}>
													<span className={grid.label}>Custo</span>
													<span>{formatMoney(stock.avg_price)}</span>
												</div>

												<div className={grid.row}>
													<span className={grid.label}>Quantidade</span>
													<span>{stock.qty}</span>
												</div>

												<div className={grid.row}>
													<span className={grid.label}>Total</span>
													<span>{formatMoney(stock.qty * stock.marketPrice)}</span>
												</div>

												<div className={grid.row}>
													<span className={grid.label}>Lucro</span>
													<span className={profit > 0 ? (grid.positive) : (grid.negative)}>
														{formatMoney(profit)}
													</span>
												</div>

												<div className={grid.row}>
													<span className={grid.label}>Rentabilidade</span>
													<span className={profit_percent > 0 ? (grid.positive) : (grid.negative)}>
														{profit_percent.toFixed(2).replace('.', ',')}%
													</span>
												</div>

												<div className={grid.row}>
													<span className={grid.label}>Dividendos</span>
													<span>{formatMoney(stock.dividend)}</span>
												</div>
											</div>
										</div>											
									)
								})}
							</div>
						) : (
							<table>
								<thead>
									<tr>
										<th>Código</th>
										<th className="price">Variação</th>
										<th className="price">Preço</th>
										<th className="price">Custo</th>
										<th className="price">Qtde</th>
										<th className="price">Total</th>
										<th className="price">Lucro</th>
										<th className="price">Rentabilidade</th>
										<th className="price">Dividendos</th>
										<th width="10%" className="action">Visualizar</th>
									</tr>
								</thead>

								<tbody>
									{data.stocks.map(stock => {
										const profit = (stock.qty * stock.marketPrice) - stock.total;
										const profit_percent = (stock.marketPrice - stock.avg_price) / stock.avg_price * 100;

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
												<td className="price view" data-header="Custo">{formatMoney(stock.avg_price)}</td>
												<td className="price view" data-header="Quantidade">{stock.qty}</td>
												<td className="price view" data-header="Total">{formatMoney(stock.qty * stock.marketPrice)}</td>
												<td className="price view" data-header="Lucro">
													<span className={profit > 0 ? ('positive') : ('negative')}>
														{formatMoney(profit)}
													</span>
												</td>
												<td className="price view" data-header="Rentabilidade">
													<span className={profit_percent > 0 ? ('positive') : ('negative')}>
														{profit_percent.toFixed(2).replace('.', ',')}%
													</span>
												</td>
												<td className="price view" data-header="Dividendos">{formatMoney(stock.dividend)}</td>
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
										<td className="price">
											<span className="total">
												{formatMoney(data.totalWallet)}
											</span>
										</td>
										<td className="price">
											<span className={data.totalProfit > 0 ? ('positive') : ('negative')}>
												{formatMoney(data.totalProfit)}
											</span>
										</td>
										<td className="price">
											<span className={((data.totalProfit / data.totalCost) * 100) > 0 ? ('positive') : ('negative')}>
												{((data.totalProfit / data.totalCost) * 100).toFixed(2).replace('.', ',')}%
											</span>
										</td>
										<td className="price">
											<span className="total">
												{formatMoney(data.totalDividends)}
											</span>
										</td>
										<td></td>
									</tr>
								</tbody>
							</table>
						)}
					</>
				)}
			</div>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	const cookies = parseCookies(context);

	return {
		props: {
			view: cookies.VIEW != undefined ? cookies.VIEW : null,
		}
	}
}
