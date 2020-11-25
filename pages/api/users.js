import withSession from '../../lib/session';
import connect from '../../lib/database';

export default withSession(async (req, res) => {
	const user = req.session.get('user');

	if (!user || user.isLoggedIn === false)
		return res.status(401).end();

	const db = await connect();
	const collection = db.collection('users');

	switch (req.method) {
		case 'GET':
			const response = await collection.find().toArray();
			
			res.status(200).json(response);
			break;

		case 'POST':
			const { name, email } = req.body;

			await collection.insertOne({
				name,
				email,
			});

			res.status(200).end();
			break;
	}
});
