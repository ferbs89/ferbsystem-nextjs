import Link from 'next/link';
import { useRouter } from 'next/router';
import useUser from '../../hooks/useUser';
import { useFetch } from '../../hooks/useFetch';
import { formatMoney } from '../../utils/functions';

import Layout from '../../components/layout';
import Loading from '../../components/loading';
import Error from '../../components/error';
import OrderCreate from '../../components/orders/order-create';
import OrderEdit from '../../components/orders/order-edit';

import { FiArrowLeft } from 'react-icons/fi';

export default function Stock() {
	const router = useRouter();
	const { stock } = router.query;
	const { user } = useUser({ redirectTo: '/login' });
	const { data, error } = useFetch(user?.isLoggedIn ? `/api/orders?stock=${stock}` : null);

	if (!user || user.isLoggedIn === false) return <Loading />

	if (error) return <Error />
	if (!data) return <Loading />

	const profit = data.stock.qty * data.stock.marketPrice - data.stock.total;

	return (
		<Layout title={stock}>
			<div className="content">
				<h1>Ativo</h1>

				<table className="stock-info">
					<thead>
						<tr>
							<th >Código</th>
							<th className="price">Variação</th>
							<th className="price">Mín</th>
							<th className="price">Máx</th>
							<th className="price">Preço</th>
							<th className="price">Custo</th>
							<th className="price">Quantidade</th>
							<th className="price">Total</th>
							<th className="price">L/P</th>
						</tr>
					</thead>

					<tbody>
						<tr>
							<td className="stock-symbol" data-header="Código">{data.stock._id}</td>
							<td className="price" data-header="Variação">
								<span className={data.stock.marketChangePercent > 0 ? ('positive') : ('negative')}>
									{data.stock.marketChangePercent.toFixed(2).toString().replace('.', ',') + '%'}
								</span>
							</td>
							<td className="price" data-header="Mín">{formatMoney(data.stock.marketDayLow)}</td>
							<td className="price" data-header="Máx">{formatMoney(data.stock.marketDayHigh)}</td>
							<td className="price" data-header="Preço">{formatMoney(data.stock.marketPrice)}</td>
							<td className="price" data-header="Custo">{formatMoney((data.stock.qty == 0) ? (0) : (data.stock.total / data.stock.qty))}</td>
							<td className="price" data-header="Quantidade">{data.stock.qty}</td>
							<td className="price" data-header="Total">{formatMoney(data.stock.qty * data.stock.marketPrice)}</td>
							<td className="price" data-header="L/P">
								<span className={profit > 0 ? ('positive') : ('negative')}>
									{formatMoney(profit)}
								</span>
							</td>
						</tr>
					</tbody>
				</table>

				<h1>Operações</h1>

				<table>
					<thead>
						<tr>
							<th width="22%">Data</th>
							<th width="22%">Quantidade</th>
							<th width="22%">Preço</th>
							<th width="22%">Total</th>
							<th width="10%" className="action">Ação</th>
						</tr>
					</thead>

					<tbody>
						<OrderCreate query={stock} />

						{data.orders.map(order => (
							<OrderEdit key={order._id} order={order} query={stock} />
						))}
					</tbody>
				</table>

				<Link href="/">
					<a className="back-link"><FiArrowLeft />Voltar</a>
				</Link>
			</div>
		</Layout>
	);
}
