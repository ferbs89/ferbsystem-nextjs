import Link from 'next/link';
import styles from '../styles/components/menu.module.css';
import { FiHome, FiUsers } from 'react-icons/fi';

export default function Menu() {
	return (
		<div className={styles.menu}>
			<Link href="/">
				<a><FiHome />Home</a>
			</Link>

			<Link href="/users">
				<a><FiUsers />Usuários</a>
			</Link>
		</div>
	);
}
