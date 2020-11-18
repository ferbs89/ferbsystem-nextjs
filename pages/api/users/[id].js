import connect from '../../../lib/database';
import { ObjectID } from 'mongodb';

export default async (req, res) => {
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
}