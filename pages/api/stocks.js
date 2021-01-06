import withSession from '../../lib/session';
import connect from '../../lib/database';
import { ObjectID } from 'mongodb';

export default withSession(async (req, res) => {
	const user = req.session.get('user');

	if (!user || user.isLoggedIn === false)
		return res.status(401).end();

	const db = await connect();
	const collection = db.collection('orders');

	switch (req.method) {
		case 'GET':
			const stocks = collection.aggregate([
				{
					$match: {
						user_id: new ObjectID(user._id)
					}
				}, {
					$group: {
						_id: "$stock",
						qty: {
							$sum: "$qty",
						},
						total: {
							$sum: {
								$multiply: [ "$qty", "$price" ]
							}
						},
					}
				}
			]);

			const listStock = [];

			await stocks.forEach(stock => {
				listStock.push({
					...stock,
					pm: stock.total / stock.qty,
				});
			});

			res.status(200).json(listStock);
			break;
	}
});
