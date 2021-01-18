import withSession from '../../lib/session';
import connect from '../../lib/database';
import { ObjectID } from 'mongodb';

export default withSession(async (req, res) => {
	const user = req.session.get('user');

	if (!user || user.isLoggedIn === false)
		return res.status(401).end();

	const db = await connect();
	const collection = db.collection('stocks');

	let user_id = null;

	try {
		user_id = new ObjectID(user._id);		
	} catch(error) {
		res.status(400).end();
		return;
	}

	switch (req.method) {
		case 'GET':
			const response = await collection
				.find({ user_id })
				.sort({ stock: 1 })
				.toArray();

			res.status(200).json(response);
			break;
	}
});
