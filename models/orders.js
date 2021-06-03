import connect from '../lib/database';
import axios from 'axios';

export async function getStockOrders(query) {
	const db = await connect();
	const orders = db.collection('orders');
	const dividends = db.collection('dividends');

	const listOrders = [];

	let resultStock = null;
	let resultDividends = null;

	const resultOrders = await orders
		.find(query)
		.sort({ date: 1, _id: 1, stock: 1 })
		.toArray();

	resultStock = {
		_id: query.stock,
		qty: 0,
		total: 0,
		avg_price: 0,
		profit: 0,
		dividend: 0,
	}

	for (const item of resultOrders) {
		if (item.qty > 0) {
			resultStock.qty += item.qty;
			resultStock.total += (item.qty * item.price);

		} else {
			item.avg_price = resultStock.total / resultStock.qty;
			item.profit = (Math.abs(item.qty) * item.price) - (Math.abs(item.qty) * item.avg_price);

			resultStock.qty += item.qty;
			resultStock.total += (item.qty * item.avg_price);
			resultStock.profit += item.profit;
		}

		resultDividends = await dividends.find(query).toArray();

		resultDividends.map(dividend => {
			resultStock.dividend += (dividend.qty * dividend.price);
		});

		listOrders.push(item);
	}

	if (resultStock.qty == 0) {
		resultStock.avg_price = 0;
		resultStock.total = 0;

	} else {
		resultStock.avg_price = resultStock.total / resultStock.qty;

		const marketResponse = await axios.get(`https://query2.finance.yahoo.com/v7/finance/quote?symbols=${resultStock._id}.SA`);
		const marketData = marketResponse.data.quoteResponse.result[0];

		resultStock.marketChangePercent = marketData.regularMarketChangePercent;
		resultStock.marketPrice = marketData.regularMarketPrice;
		resultStock.marketDayHigh = marketData.regularMarketDayHigh;
		resultStock.marketDayLow = marketData.regularMarketDayLow;
	}

	return { 
		stock: resultStock,
		orders: listOrders.reverse(),
	};
}

export async function getOrders(query) {
	const db = await connect();
	const orders = db.collection('orders');

	let resultStock = null;
	let resultQuery = null;
	const listOrders = [];

	const resultOrders = await orders
		.find(query)
		.sort({ date: 1, _id: 1, stock: 1 })
		.toArray();

	for (const item of resultOrders) {
		if (item.qty < 0) {
			resultStock = {
				_id: item.stock,
				qty: 0,
				total: 0,
				profit: 0,
			}

			resultQuery = await orders
				.find({
					user_id: query.user_id,
					stock: item.stock,
					date: { $lte: new Date(item.date) },
				})
				.sort({ date: 1, _id: 1, stock: 1 })
				.toArray();

			for (const order of resultQuery) {
				if (order.qty > 0) {
					resultStock.qty += order.qty;
					resultStock.total += (order.qty * order.price);
		
				} else {
					order.avg_price = resultStock.total / resultStock.qty;
		
					resultStock.qty += order.qty;
					resultStock.total += (order.qty * order.avg_price);
				}

				if (resultStock.qty > 0) {
					item.avg_price = resultStock.total / resultStock.qty;
				}
			}

			item.profit = (Math.abs(item.qty) * item.price) - (Math.abs(item.qty) * item.avg_price);
		}
		
		listOrders.push(item);
	}

	return listOrders.reverse();
}
