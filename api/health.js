module.exports = (req, res) => {
	res.status(200).json({ status: 'ok', service: 'luxgrid-ui', uptime: process.uptime() });
};