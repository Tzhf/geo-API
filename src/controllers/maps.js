const Map = require("../models/Map");
const User = require("../models/User");
const { mapValidation } = require("../util/validators");

exports.getOneMap = (req, res) => {
	Map.findOne({ _id: req.params.id, published: true })
		.then((map) => {
			res.json({
				_id: map._id,
				creator: map.creator,
				title: map.title,
				description: map.description,
				playCount: map.playCount,
				likeCount: map.likeCount,
				createdAt: map.createdAt,
				updatedAt: map.updatedAt,
			});
		})
		.catch(() => {
			return res.status(404).json({ message: "Map not found" });
		});
};

exports.getOneUserMaps = (req, res) => {
	User.findOne({ slug: req.params.slug })
		.populate("maps")
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
			if (maps.length == 0)
				return res
					.status(404)
					.json({ message: "This user hasn't published any map yet" });
			res.send(maps);
		})
		.catch((err) => {
			return res.status(400).json({ message: "User not found" });
		});
};

exports.getLastMaps = (req, res) => {
	Map.find({ published: true })
		.limit(50)
		.sort({ updatedAt: -1 })
		.then((data) => {
			let maps = [];
			data.forEach((map) => {
				maps.push({
					_id: map._id,
					title: map.title,
					creator: map.creator,
					description: map.description,
					playCount: map.playCount,
					likeCount: map.likeCount,
					createdAt: map.createdAt,
					updatedAt: map.updatedAt,
				});
			});
			res.json(maps);
		})
		.catch((err) => {
			return res.status(400).json({ message: "Something went wrong" });
		});
};

exports.postMap = (req, res) => {
	const newMap = new Map({
		creator: req.user.user,
		title: req.body.title,
		description: req.body.description,
		locations: req.body.locations,
		playCount: 0,
		likeCount: 0,
		published: false,
	});

	const { valid, errors } = mapValidation(newMap);
	if (!valid) return res.status(400).json(errors);

	newMap
		.save()
		.then(async () => {
			const userById = await User.findById(req.user.user._id);
			userById.maps.push(newMap);
			await userById.save();
			res.json({ newMap });
		})
		.catch((err) => {
			return res.status(500).json({ message: "Something went wrong" });
		});
};

exports.editMap = (req, res) => {
	const { valid, errors } = mapValidation(req.body);
	if (!valid) return res.status(400).json(errors);

	Map.findById(req.params.id)
		.where("creator")
		.equals(req.user.user._id)
		.then((map) => {
			map.title = req.body.title;
			map.description = req.body.description;
			map.locations = req.body.locations;
			map.published = req.body.published;
			map.updatedAt = Date.now();
			map.save().then(() => res.json({ message: "Map successfully edited" }));
		})
		.catch(() => {
			return res.status(400).json({ message: "Map not found" });
		});
};

exports.deleteMap = (req, res) => {
	Map.findById(req.params.id)
		.where("creator")
		.equals(req.user.user._id)
		.then((map) => {
			map
				.remove()
				.then(() => res.json({ message: "Map successfully deleted" }));
		})
		.catch(() => {
			return res.status(400).json({ message: "Map not found" });
		});
};

// ! some issues when liking/unliking too fast
exports.likeMap = (req, res) => {
	Map.findById(req.params.id)
		.then((map) => {
			User.findById(req.user.user._id)
				.then((user) => {
					if (user.likes.includes(map._id)) {
						Map.updateOne({ _id: map.id }, { $inc: { likeCount: -1 } }).exec();
						user.likes.remove(map._id);
						user.save();
						return res.json({ message: "Map unliked" });
					} else {
						Map.updateOne({ _id: map.id }, { $inc: { likeCount: 1 } }).exec();
						user.likes.push(map._id);
						user.save();
						return res.json({ message: "Map liked" });
					}
				})
				.catch(() => {
					return res.status(400).json({ message: "Something went wrong" });
				});
		})
		.catch(() => {
			return res.status(400).json({ message: "Map not found" });
		});
};
