import Link from 'next/link';
import styles from '../styles/components/header.module.css';

export default function Header() {
	return (
		<div className={styles.header}>
			<div className={styles.brand}>
				<img src="/logo.png" alt="Ferbsystem" />
			</div>

			<div className={styles.profile}>
				<div className={styles.user}>
					<span className={styles.name}></span>
					<span className={styles.email}></span>
				</div>

				<Link href="">
					<a></a>
				</Link>
			</div>
		</div>
	);
}
