import withSession from '../../lib/session';
import connect from '../../lib/database';

export default withSession(async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password)
		return res.status(400).json('Preencha corretamente todos os campos.');

	const db = await connect();
	const collection = db.collection('users');
	const user = await collection.findOne({ email });

	if (user)
		return res.status(409).json('O e-mail informado já existe.');

	const response = await collection.insertOne({
		name,
		email,
		password,
	});

	req.session.set('user', {
		isLoggedIn: true,
		_id: response.insertedId,
	});

	await req.session.save();
	res.status(200).end();
});
