import { MongoClient } from 'mongodb';
import url from 'url';

const client = new MongoClient(process.env.DATABASE_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

export default async function connect() {
	if (!client.isConnected())
		await client.connect();

	const dbName = url.parse(process.env.DATABASE_URI).pathname.substr(1);
	const db = client.db(dbName);

	return db;
}