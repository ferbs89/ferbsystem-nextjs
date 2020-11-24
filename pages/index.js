import useUser from '../hooks/useUser';

import Layout from '../components/layout';
import Loading from '../components/loading';

export default function Home() {
	const { user } = useUser({ redirectTo: '/login' });

	if (!user || user.isLoggedIn === false) return <Loading />

	return (
		<Layout title="Home">
			<div className="content">
				<h1>Home</h1>
			</div>
		</Layout>
	);
}
