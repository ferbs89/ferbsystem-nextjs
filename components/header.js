import Link from 'next/link';

export default function Header() {
	return (
		<header>
			<div className="brand">
				<img src="/logo.png" alt="Ferbsystem" />
			</div>

			<div className="profile">
				<div className="user">
					<span className="name"></span>
					<span className="email"></span>
				</div>

				<Link href="">
					<a></a>
				</Link>
			</div>
		</header>
	);
}
