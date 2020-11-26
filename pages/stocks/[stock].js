import Link from 'next/link';
import { useRouter } from 'next/router';
import useUser from '../../hooks/useUser';

import Layout from '../../components/layout';
import Loading from '../../components/loading';

import { FiArrowLeft } from 'react-icons/fi';

export default function Stock() {
	const router = useRouter();
	const { stock } = router.query;
	const { user } = useUser({ redirectTo: '/login' });

	if (!user || user.isLoggedIn === false) return <Loading />

	return (
		<Layout title={stock}>
			<div className="content">
				<h1>{stock}</h1>

				<Link href="/">
					<a className="back-link"><FiArrowLeft />Voltar</a>
				</Link>
			</div>
		</Layout>
	);
}
