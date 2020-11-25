import withSession from '../../lib/session';
import connect from '../../lib/database';
import { ObjectID } from 'mongodb';

export default withSession(async (req, res) => {
	const user = req.session.get('user');

	if (user) {
		const db = await connect();
		const collection = db.collection('users');

		const response = await collection.findOne({ 
			_id: new ObjectID(user._id),
		}, { 
			projection: {
				password: false,
			}
		});

		res.json({
			isLoggedIn: true,
			_id: response._id,
			name: response.name,
			email: response.email,
		});
		
	} else {
		res.json({
			isLoggedIn: false,
		});
	}
});
