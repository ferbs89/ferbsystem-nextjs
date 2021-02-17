import withSession from '../../lib/session';
import connect from '../../lib/database';

export default withSession(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password)
		return res.status(400).json('Preencha os campos e-mail e senha.');

	const db = await connect();
	const collection = db.collection('users');
	const user = await collection.findOne({ email });

	if (!user || user.password != password)
		return res.status(401).json('Login e/ou senha inválidos.');

	req.session.set('user', {
		isLoggedIn: true,
		_id: user._id,
	});

	await req.session.save();
	return res.status(200).end();
});
