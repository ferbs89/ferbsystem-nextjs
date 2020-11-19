import Link from 'next/link';
import Layout from '../components/login';
import { FiArrowLeft } from 'react-icons/fi';

export default function Register() {
	return (
		<Layout title="Criar uma conta">
			<h1>Criar uma conta</h1>
			<p>Faça seu cadastro para entrar na plataforma.</p>

			<form>
				<div className="field">
					<input type="text" placeholder="Nome" />
				</div>

				<div className="field">
					<input type="text" placeholder="E-mail" />
				</div>
				
				<div className="field">
					<input type="password" placeholder="Senha" />
				</div>

				<button className="button">Cadastrar</button>
			</form>

			<div className="center">
				<Link href="/login">
					<a className="back-link">
						<FiArrowLeft />
						Voltar para o login
					</a>
				</Link>
			</div>
		</Layout>
	);
}
