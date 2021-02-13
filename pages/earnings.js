import useUser from '../hooks/useUser';

import Layout from '../components/layout';
import Loading from '../components/loading';

export default function Earnings() {
	const { user } = useUser({ redirectTo: '/login' });

	if (!user || user.isLoggedIn === false) return <Loading />

	return (
		<Layout title="Proventos">
			<div className="content">
				<h1>Proventos</h1>
                <p>Em breve.</p>
			</div>
		</Layout>
	);
}
