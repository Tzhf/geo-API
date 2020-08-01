const User = require("../models/User");
const {
	registerValidation,
	loginValidation,
	userDetailsValidation,
} = require("../util/validators");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
	const userReq = {
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		confirmPassword: req.body.confirmPassword,
	};

	const { valid, errors } = registerValidation(userReq);
	if (!valid) return res.status(400).json(errors);

	const hashedPassword = await bcrypt.hash(req.body.password, 10);

	const newUser = new User({
		username: req.body.username,
		email: req.body.email,
		password: hashedPassword,
		avatarUrl: "http://localhost:3000/images/no-img.png",
		playCount: 0,
	});

	newUser
		.save()
		.then(() =>
			res
				.status(201)
				// TODO implement return token for direct login
				.json({ message: `User ${newUser._id} successfully created` })
		)
		.catch((err) => {
			if (err.code === 11000) {
				return res.status(400).json({ email: "Email is already in use" });
			} else {
				return res.status(500).json({ error: err });
			}
		});
};

exports.login = async (req, res) => {
	const userReq = {
		email: req.body.email,
		password: req.body.password,
	};

	const { valid, errors } = loginValidation(userReq);
	if (!valid) return res.status(400).json(errors);

	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).json("Wrong credentials");

	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword) return res.status(400).json("Wrong credentials");

	const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET);
	res.header("Authorizaton", accessToken).json({ accessToken: accessToken });
};

exports.editUserDetails = (req, res) => {
	const { valid, errors } = userDetailsValidation(req.body);
	if (!valid) return res.status(400).json(errors);

	User.findOneAndUpdate(req.user.user._id, req.body)
		.then(() => {
			res.json({ message: "Details successfully edited" });
		})
		.catch(() => {
			return res.status(400).json({ message: "Something went wrong" });
		});
};

exports.getUserPofile = (req, res) => {
	User.findById(req.user.user._id)
		.then((user) =>
			res.json({
				username: user.username,
				email: user.email,
				// slug: user.slug,
				avatarUrl: user.avatarUrl,
				createdAt: user.createdAt,
				playCount: user.playCount,
				maps: user.maps,
				likes: user.maps,
			})
		)
		.catch(() => {
			return res.status(404).json({ message: "Something went wrong" });
		});
};

exports.deleteUser = (req, res) => {
	User.findById(req.user.user._id)
		.then((user) => {
			user
				.remove()
				.then(() => res.json({ message: "User successfully deleted" }));
		})
		.catch((err) => {
			return res.status(400).json({ message: "Something went wrong" });
		});
};
