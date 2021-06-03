import withSession from '../../lib/session';
import connect from '../../lib/database';
import { ObjectID, Int32, Double } from 'mongodb';

export default withSession(async (req, res) => {
	const user = req.session.get('user');

	if (!user || user.isLoggedIn === false)
		return res.status(401).end();

	const db = await connect();
	const dividends = db.collection('dividends');

	let user_id = null;

	try {
		user_id = new ObjectID(user._id);
	} catch(error) {
		return res.status(400).end();
	}

	switch (req.method) {
		case 'GET':
			const query = { user_id };

			const resultDividends = await dividends
				.find(query)
				.sort({ dateWith: 1, datePay: 1, stock: 1, _id: 1 })
				.toArray();

			return res.status(200).json(resultDividends);			
			break;

		case 'POST':
			const { stock, dateWith, datePay, qty, price } = req.body;
			
			await dividends.insertOne({
				user_id,
				stock: stock.toUpperCase(),
				dateWith: new Date(dateWith),
				datePay: new Date(datePay),
				qty: new Int32(qty),
				price: new Double(price),
			});

			return res.status(200).end();
			break;
	}
});
