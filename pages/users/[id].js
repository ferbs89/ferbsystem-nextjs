import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useFetch } from '../../hooks/useFetch';

import styles from '../../styles/Home.module.css';

export default function UserDetail() {
	const router = useRouter();
  	const { id } = router.query
	const { data, error } = useFetch(`/api/users/${id}/orders`);

	if (error) return <div>failed to load</div>
	if (!data) return <div>loading...</div>

	function formatMoney(amount) {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		}).format(amount);
	}

	return (
		<div className={styles.container}>
			<Head>
				<title>{data.user.name}</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<h1 className={styles.title}>
					{data.user.name}
				</h1>

				{data.user.orders.length == 0 && (
					<p>Nenhuma operação encontrada.</p>
				)}

				{data.user.orders.length > 0 && (
					<div className={styles.grid}>
						{data.user.orders.map(order => (
							<a key={order._id} className={styles.card}>
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

			<footer className={styles.footer}>
				<a
					href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					Powered by{' '}
					<img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
				</a>
			</footer>
		</div>
	);
}