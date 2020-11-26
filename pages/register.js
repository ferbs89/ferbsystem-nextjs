import { useState } from 'react';
import Link from 'next/link';
import useUser from '../hooks/useUser';
import axios from 'axios';

import Layout from '../components/login';

import { toast } from 'react-toastify';
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

		await axios.post('/api/register', {
			name,
			email,
			password,
		
		}).then(async response => {
			toast.success('Conta criada com sucesso.');
			await mutateUser();

		}).catch(error => {
			if (error.response)
				toast.error(error.response.data);
			else
				toast.error('Ocorreu um erro ao criar uma conta.');
		});
	}
	
	return (
		<Layout title="Criar uma conta">
			<h1>Criar uma conta</h1>
			<p>Faça seu cadastro para entrar na plataforma.</p>

			<form onSubmit={handleRegister}>
				<div className="field">
					<input type="text" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} required />
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
