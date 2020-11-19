import Link from 'next/link';
import Layout from '../components/login';
import { FiLogIn } from 'react-icons/fi';

export default function Login() {
	return (
		<Layout title="Login">
			<form>
				<div className="field">
					<input type="email" placeholder="E-mail" />
				</div>
				
				<div className="field">
					<input type="password" placeholder="Senha" />
				</div>

				<button className="button">Entrar</button>
			</form>

			<div className="center">
				<Link href="/register">
					<a className="back-link">
						<FiLogIn />
						Não tenho cadastro
					</a>
				</Link>
			</div>
		</Layout>
	);
}
