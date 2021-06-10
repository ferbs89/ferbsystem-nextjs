import { useRouter } from 'next/router';
import { mutate } from "swr";
import useUser from '../hooks/useUser';
import axios from 'axios';
import { destroyCookie } from 'nookies';

import { FiLogOut } from 'react-icons/fi';
import styles from '../styles/components/header.module.css';

export default function Header() {
	const router = useRouter();
	const { user, mutateUser } = useUser();

	return (
		<div className={styles.header}>
			<div className={styles.brand}>
				<img src="/lunaris.png" alt="Lunaris" />
				<span>Lunaris</span>
			</div>

			{user?.isLoggedIn && (
				<div className={styles.profile}>
					<div className={styles.user}>
						<span className={styles.name}>{user?.name}</span>
					</div>

					<button onClick={async (e) => {
						e.preventDefault();

						await mutateUser(await axios.get('/api/logout'));
						
						mutate('/api/stocks', null);
						mutate('/api/orders', null);
						mutate('/api/dividends', null);

						destroyCookie(null, 'VIEW');

						router.push('/login');
					}}>
						<a>
							Sair
							<FiLogOut />
						</a>
					</button>
				</div>
			)}
		</div>
	);
}
