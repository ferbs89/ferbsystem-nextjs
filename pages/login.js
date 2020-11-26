import { useState } from 'react';
import Link from 'next/link';
import useUser from '../hooks/useUser';
import axios from 'axios';

import Layout from '../components/login';

import { toast } from 'react-toastify';
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

		await axios.post('/api/login', { 
			email, 
			password,
		
		}).then(async response => {
			await mutateUser();
		
		}).catch(error => {
			if (error.response)
				toast.error(error.response.data);
			else
				toast.error('Ocorreu um erro ao efetuar o login.');
		});
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
