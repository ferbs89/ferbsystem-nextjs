import withSession from '../../lib/session';

export default withSession(async (req, res) => {
	req.session.destroy();
	return res.status(200).json({ isLoggedIn: false });
});
