import { useState } from 'react';
import { mutate } from 'swr';
import axios from 'axios';
import { formatMoney, formatDateDMY, formatDateYMD } from '../../utils/functions';

import { toast } from 'react-toastify';
import { FiCheck, FiEdit, FiTrash2, FiLoader, FiX } from 'react-icons/fi';

export default function DividendEdit({ dividend }) {
	const [stock, setStock] = useState(dividend.stock);
    const [dateWith, setDateWith] = useState(dividend.dateWith);
	const [datePay, setDatePay] = useState(dividend.datePay);
	const [qty, setQty] = useState(dividend.qty);
	const [price, setPrice] = useState(dividend.price);
	const [edit, setEdit] = useState(false);
	const [loading, setLoading] = useState(false);

	const url = '/api/dividends';

	async function handleEdit(dividend_id) {
		if (!stock || !dateWith || !datePay || !qty || !price) {
			toast.error('Preencha todos os campos.');
			return;
		}

		setLoading(true);

		await axios.put(`/api/dividends/${dividend_id}`, {
			stock,
			dateWith,
            datePay,
			qty,
			price,

		}).then(async () => {
			await mutate(url);
			setLoading(false);
			setEdit(false);
			toast.success('Dividendo salvo com sucesso.');
		});
	}

	async function handleDelete(dividend_id) {
		setLoading(true);

		await axios.delete(`/api/dividends/${dividend_id}`).then(async () => {
			await mutate(url);
			setLoading(false);
			toast.success('Dividendo removido com sucesso.');
		});
	}

	async function handleCancel(dividend) {
		setEdit(false);
		setStock(dividend.stock);
		setDateWith(dividend.dateWith);
        setDatePay(dividend.datePay);
		setQty(dividend.qty);
		setPrice(dividend.price);
	}

	return (
		<>
			{!edit && (
				<tr>
                    <td className="view" data-header="Ativo">{dividend.stock}</td>
					<td className="view" data-header="Data com">{formatDateDMY(dividend.dateWith)}</td>
                    <td className="view" data-header="Data pagamento">{formatDateDMY(dividend.datePay)}</td>
					<td className="view" data-header="Quantidade">{dividend.qty}</td>
					<td className="view" data-header="Valor">{formatMoney(dividend.price)}</td>
					<td className="view" data-header="Total">{formatMoney(dividend.price * dividend.qty)}</td>
					<td className="action">
						{!loading ? (
							<div>
								<button onClick={() => setEdit(true)}><FiEdit /></button>
								<button onClick={() => handleDelete(dividend._id)}><FiTrash2 /></button>
							</div>
						) : (
							<div>
								<button><FiLoader /></button>
							</div>							
						)}
					</td>
				</tr>
			)}

            {edit && (
				<tr>
                    <td data-header="Ativo"><input type="text" placeholder="Ativo" value={stock} onChange={e => setStock(e.target.value)} /></td>
					<td data-header="Data com"><input type="date" value={formatDateYMD(dateWith)} onChange={e => setDateWith(e.target.value)} /></td>
                    <td data-header="Data pagamento"><input type="date" value={formatDateYMD(datePay)} onChange={e => setDatePay(e.target.value)} /></td>
					<td data-header="Quantidade"><input type="number" min="0" placeholder="Quantidade" value={qty} onChange={e => setQty(e.target.value)} /></td>
					<td data-header="Valor"><input type="number" min="0" step="0.01" placeholder="Valor" value={price} onChange={e => setPrice(e.target.value)} /></td>
					<td data-header="Total">{formatMoney(price * qty)}</td>
					<td className="action">
						{!loading ? (
							<div>
								<button onClick={() => handleEdit(dividend._id)}><FiCheck /></button>
								<button onClick={() => handleCancel(dividend)}><FiX /></button>
							</div>
						) : (
							<div>
								<button><FiLoader /></button>
							</div>
						)}
					</td>
				</tr>
			)}
		</>
	);
}
