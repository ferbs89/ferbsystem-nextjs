import Link from 'next/link';
import styles from '../styles/components/menu.module.css';
import { FiTrendingUp, FiLayers, FiZap } from 'react-icons/fi';

export default function Menu() {
	return (
		<div className={styles.menu}>
			<Link href="/">
				<a>
					<FiTrendingUp />
					Ativos
				</a>
			</Link>

			<Link href="/orders">
				<a>
					<FiLayers />
					Operações
				</a>
			</Link>

			<Link href="/dividends">
				<a>
					<FiZap />
					Dividendos
				</a>
			</Link>
		</div>
	);
}
