import withSession from '../../../lib/session';
import connect from '../../../lib/database';
import { ObjectID } from 'mongodb';

export default withSession(async (req, res) => {
	const user = req.session.get('user');

	if (!user)
		return res.status(401).json({ error: "Authentication failed" });

	const db = await connect();
	const collection = db.collection('users');
	const { id } = req.query;

	let _id = null;
	let response = null;

	try {
		_id = new ObjectID(id);
	} catch(error) {
		res.status(400).end();
		return;
	}

	switch (req.method) {
		case 'GET':
			response = await collection.findOne({ _id });
			
			res.status(200).json(response);
			break;

		case 'PUT':
			const { name, email } = req.body;

			response = await collection.updateOne({	_id	}, { 
				$set: { 
					name,
					email,
				}
			});

			res.status(200).json(response);
			break;
	}
});
