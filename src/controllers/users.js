const User = require("../models/User");

// ! get all users just for dev purposes
exports.getAllUsers = (req, res) => {
	User.find()
		.then((users) => {
			return res.json(users);
		})
		.catch((err) => {
			return res.status(400).json("Error: " + err);
		});
};

// Get One user
exports.getOneUser = (req, res) => {
	User.findById(req.params.id)
		.populate("maps")
		.populate("likes")
		.then((user) => {
			let maps = [];
			user.maps.forEach((map) => {
				if (map.published == true) {
					maps.push({
						_id: map._id,
						title: map.title,
						description: map.description,
						playCount: map.playCount,
						likeCount: map.likeCount,
						createdAt: map.createdAt,
						updatedAt: map.updatedAt,
					});
				}
			});
			let likes = [];
			user.likes.forEach((map) => {
				if (map.published == true) {
					likes.push({
						_id: map._id,
						title: map.title,
						description: map.description,
						playCount: map.playCount,
						likeCount: map.likeCount,
						createdAt: map.createdAt,
						updatedAt: map.updatedAt,
					});
				}
			});

			res.json({
				id: user.id,
				username: user.username,
				avatarUrl: user.avatarUrl,
				createdAt: user.createdAt,
				playCount: user.playCount,
				maps: maps,
				likes: likes,
			});
		})

		.catch(() => {
			return res.status(404).json({ message: "User not found" });
		});
};
