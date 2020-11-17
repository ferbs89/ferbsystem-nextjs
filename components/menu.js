import Link from 'next/link';

export default function Menu() {
	return (
		<div className="menu">
			<Link href="/">
				<a>Home</a>
			</Link>

			<Link href="/users">
				<a>Usuários</a>
			</Link>
		</div>
	);
}
