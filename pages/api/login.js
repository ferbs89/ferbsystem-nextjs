import withSession from '../../lib/session';
import connect from '../../lib/database';

export default withSession(async (req, res) => {
	const { email, password } = await req.body;

	const db = await connect();
	const collection = db.collection('users');
	const user = await collection.findOne({ email });

	if (!user || user.password != password)
		return res.status(401).json({ error: "Authentication failed" });

	req.session.set('user', {
		isLoggedIn: true,
		_id: user._id,
	});

	await req.session.save();
	res.status(200).end();
});
