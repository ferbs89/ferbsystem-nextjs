import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useFetch } from '../../hooks/useFetch';

export default function UserDetail() {
	const router = useRouter();
  	const { id } = router.query
	const { data, error } = useFetch(`/api/users/${id}/orders`);

	if (error) return <div className="main"><p className="title">failed to load</p></div>
	if (!data) return <div className="main"><p className="title">loading...</p></div>

	function formatMoney(amount) {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		}).format(amount);
	}

	return (
		<>
			<Head>
				<title>{data.user.name}</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="main">
				<h1 className="title">
					{data.user.name}
				</h1>

				{data.user.orders.length == 0 && (
					<p>Nenhuma operação encontrada.</p>
				)}

				{data.user.orders.length > 0 && (
					<div className="grid">
						{data.user.orders.map(order => (
							<a key={order._id} className="card">
								<h3>{order.stock}</h3>
								<p>Preço: {formatMoney(order.price)}</p>
								<p>Quantidade: {order.qty}</p>
								<p>Total: {formatMoney(order.price * order.qty)}</p>
							</a>
						))}
					</div>
				)}

				<Link href="/users">
					<a><h3>&larr; Voltar</h3></a>
				</Link>
			</main>
		</>
	);
}
