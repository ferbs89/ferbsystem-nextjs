import withSession from '../../lib/session';
import connect from '../../lib/database';

export default withSession(async (req, res) => {
	const user = req.session.get('user');

	if (!user)
		return res.status(401).json({ error: "Authentication failed" });

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
});
