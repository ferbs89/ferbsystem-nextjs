import { useState } from 'react';
import Link from 'next/link';
import useUser from '../hooks/useUser';
import axios from 'axios';

import Layout from '../components/login';
import { FiArrowLeft } from 'react-icons/fi';

export default function Register() {
	const { mutateUser } = useUser({
		redirectTo: '/',
		redirectIfFound: true,
	});

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	async function handleRegister(e) {
		e.preventDefault();
	}
	
	return (
		<Layout title="Criar uma conta">
			<h1>Criar uma conta</h1>
			<p>Faça seu cadastro para entrar na plataforma.</p>

			<form onSubmit={handleRegister}>
				<div className="field">
					<input type="email" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} required />
				</div>

				<div className="field">
					<input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
				</div>
				
				<div className="field">
					<input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />
				</div>

				<button type="submit" className="button">Cadastrar</button>
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
