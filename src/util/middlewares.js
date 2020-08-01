const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
	const token = req.header("Authorization");
	if (!token) return res.status(401).json("Access Denied");

	try {
		const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		req.user = verified;
		next();
	} catch (err) {
		res.status(400).json({ message: "Invalid Token" });
	}
};

exports.notFound = (req, res, next) => {
	const error = new Error(`Not found = ${req.originalUrl}`);
	res.status(404);
	next(error);
};

exports.errorHandler = (error, req, res, next) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(statusCode);
	res.json({
		status: statusCode,
		message: error.message,
		stack: process.env.NODE_ENV === "production" ? "🌴" : error.stack,
	});
};
