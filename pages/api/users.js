import connect from '../../lib/database';

export default async (req, res) => {
	const db = await connect();
	const collection = db.collection('users');

	let response = null;

	switch (req.method) {
		case 'GET':
			response = await collection.find().toArray();
			
			res.status(200).json(response);
			break;

		case 'POST':
			const { name, email } = req.body;

			response = await collection.insertOne({
				name,
				email,
			});

			res.status(200).json(response);
			break;		
	}
}