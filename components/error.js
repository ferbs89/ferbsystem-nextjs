import Layout from './layout';

import { FiAlertCircle } from 'react-icons/fi';

export default function Error() {
	return (
		<Layout title="Erro">
			<div className="content loading">
				<FiAlertCircle />
				<h2>Ocorreu um erro ao carregar os dados.</h2>
			</div>
		</Layout>
	);
}
