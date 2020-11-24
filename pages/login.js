import { useState } from 'react';
import Link from 'next/link';
import useUser from '../hooks/useUser';
import axios from 'axios';

import Layout from '../components/login';
import { FiLogIn } from 'react-icons/fi';

export default function Login() {
	const { mutateUser } = useUser({
		redirectTo: '/',
		redirectIfFound: true,
	});

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	async function handleLogin(e) {
		e.preventDefault();

		try {
			await mutateUser(await axios.post('/api/login', { email, password }));

		} catch (error) {
			console.error('An unexpected error happened:', error);
		}
	}

	return (
		<Layout title="Login">
			<form onSubmit={handleLogin}>
				<div className="field">
					<input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
				</div>
				
				<div className="field">
					<input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />
				</div>

				<button type="submit" className="button">Entrar</button>
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
