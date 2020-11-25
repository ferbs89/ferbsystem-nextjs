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
			const response = await collection.distinct('stock', { 
				user_id: new ObjectID(user._id),
			});
			
			res.status(200).json(response);
			break;
	}
});
