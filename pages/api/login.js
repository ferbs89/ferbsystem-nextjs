import connect from '../../lib/database';

export default async (req, res) => {
	const db = await connect();
	const collection = db.collection('users');

	switch (req.method) {
		case 'POST':
			const { email, password } = req.body;

			const user = await collection.findOne({
				email,
			});

			if (!user || user.password != password)
				return res.status(401).json({ error: "Authentication failed" });	

			res.status(200).json({ 
				id: user._id,
				name: user.name,
				email: user.email,
				token: 't0k3n',
			});

			break;		
	}
}