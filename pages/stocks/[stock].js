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
import styles from '../../styles/card.module.css';

export default function Stock() {
	const router = useRouter();
	const { stock } = router.query;
	const { user } = useUser({ redirectTo: '/login' });
	const { data, error } = useFetch(user?.isLoggedIn ? `/api/orders?stock=${stock}` : null);

	if (!user || user.isLoggedIn === false) return <Loading />

	if (error) return <Error />
	if (!data) return <Loading />

	const profit = (data.stock.qty * data.stock.marketPrice) - data.stock.total + data.stock.dividend;

	return (
		<Layout title={data.stock._id}>
			<div className="content">
				<div className="page-header">
					<div className="stock-header-right">
						<div className="stock-header">
							<span className="page-header-title">{data.stock._id}</span>

							<div className="stock-header-price">
								<span className={(data.stock.marketChangePercent) > 0 ? ('stock-price-positive') : ('stock-price-negative')}>
									{formatMoney(data.stock.marketPrice)} ({data.stock.marketChangePercent.toFixed(2).toString().replace('.', ',') + '%'})
								</span>

								<div className="stock-min-max">
									{formatMoney(data.stock.marketDayLow)} - {formatMoney(data.stock.marketDayHigh)}
								</div>
							</div>
						</div>
					</div>

					<div className={styles.card}>
						<div className={styles.item}>
							<div className={styles.title}>Custo</div>
							<div className={styles.data}>{formatMoney((data.stock.qty == 0) ? (0) : (data.stock.total / data.stock.qty))}</div>
						</div>

						<div className={styles.item}>
							<div className={styles.title}>Quantidade</div>
							<div className={styles.data}>{data.stock.qty}</div>
						</div>

						<div className={styles.item}>
							<div className={styles.title}>Total</div>
							<div className={styles.data}>{formatMoney(data.stock.qty * data.stock.marketPrice)}</div>
						</div>

						<div className={styles.item}>
							<div className={styles.title}>Dividendos</div>
							<div className={styles.data}>{formatMoney(data.stock.dividend)}</div>
						</div>

						<div className={styles.item}>
							<div className={styles.title}>Lucro</div>
							<div className={(profit) > 0 ? (styles.dataPositive) : (styles.dataNegative)}>
								{formatMoney(profit)}
							</div>
						</div>
					</div>
				</div>

				<table className="responsive">
					<thead>
						<tr>
							<th>Data</th>
							<th>Quantidade</th>
							<th>Preço</th>
							<th>Total</th>
							<th className="action">Ação</th>
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
