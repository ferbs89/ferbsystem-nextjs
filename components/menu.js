import Link from 'next/link';
import { FiHome, FiUsers } from 'react-icons/fi';

export default function Menu() {
	return (
		<div className="menu">
			<Link href="/">
				<a><FiHome />Home</a>
			</Link>

			<Link href="/users">
				<a><FiUsers />Usuários</a>
			</Link>
		</div>
	);
}
