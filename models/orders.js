import connect from '../lib/database';

export async function getOrders(query) {
	const db = await connect();
	const orders = db.collection('orders');

	let resultStock = null;

	const resultOrders = await orders
		.find(query)
		.sort({ date: -1, _id: -1, stock: -1 })
		.toArray();

	if (query.stock !== undefined) {
		resultStock = {
			_id: query.stock,
			qty: 0,
			total: 0,
			avg_price: 0,
			profit: 0,
		}

		resultOrders.forEach(item => {
			resultStock.qty += item.qty;
			
			if (item.qty > 0) {
				resultStock.total += (item.qty * item.price);

			} else {
				resultStock.total += (item.qty * item.avg_price);
				resultStock.profit += (Math.abs(item.qty) * item.price) - (Math.abs(item.qty) * item.avg_price);
			}
		});

		if (resultStock.qty > 0) {
			resultStock.avg_price = resultStock.total / resultStock.qty;
			
		} else {
			resultStock.total = 0;
			resultStock.avg_price = 0;
		}
	}

	return { 
		stock: resultStock,
		orders: resultOrders,
	};
}