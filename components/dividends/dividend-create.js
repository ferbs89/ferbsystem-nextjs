import { useState } from 'react';
import { mutate } from 'swr';
import axios from 'axios';
import { formatMoney } from '../../utils/functions';

import { toast } from 'react-toastify';
import { FiPlusCircle, FiLoader } from 'react-icons/fi';

export default function DividendCreate() {
	const [stock, setStock] = useState('');
	const [dateWith, setDateWith] = useState('');
	const [datePay, setDatePay] = useState('');
	const [qty, setQty] = useState('');
	const [price, setPrice] = useState('');
	const [loading, setLoading] = useState(false);

	const url = '/api/dividends';

	async function handleCreate() {
		if (!stock || !dateWith || !datePay || !qty || !price) {
			toast.error('Preencha todos os campos.');
			return;
		}

		setLoading(true);

		await axios.post(url, {
			stock,
			dateWith,
			datePay,
			qty,
			price,
			
		}).then(async response => {
			await mutate(url);

			setStock('');
			setDateWith('');
			setDatePay('');
			setQty('');
			setPrice('');
			setLoading(false);

			toast.success('Dividendo salvo com sucesso.');
		});
	}

	return (
		<tr>
			<td data-header="Ativo"><input type="text" placeholder="Ativo" value={stock} onChange={e => setStock(e.target.value)} /></td>
			<td data-header="Data com"><input type="date" value={dateWith} onChange={e => setDateWith(e.target.value)} /></td>
			<td data-header="Data pagamento"><input type="date" value={datePay} onChange={e => setDatePay(e.target.value)} /></td>
			<td data-header="Quantidade"><input type="number" min="0" placeholder="Quantidade" value={qty} onChange={e => setQty(e.target.value)} /></td>
			<td data-header="Valor"><input type="number" min="0" step="0.01" placeholder="Valor" value={price} onChange={e => setPrice(e.target.value)} /></td>
			<td data-header="Total">{formatMoney(price * qty)}</td>
			<td className="action">
				<div>
					{!loading ? (
						<button onClick={handleCreate}><FiPlusCircle /></button>
					) : (
						<button><FiLoader /></button>
					)}
				</div>
			</td>
		</tr>
	);
}
