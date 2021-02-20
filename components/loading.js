import Layout from './layout';

import { FiLoader } from 'react-icons/fi';

export default function Loading() {
	return (
		<Layout title="Carregando">
			<div className="content loading">
				<FiLoader />
				<h2>Carregando...</h2>
			</div>
		</Layout>
	);
}
