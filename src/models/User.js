const mongoose = require("mongoose");

const Map = require("./Map");

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			maxlength: 255,
		},
		username: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 32,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
			minlength: 6,
			maxlength: 1024,
		},
		avatarUrl: {
			type: String,
			required: true,
		},
		playCount: {
			type: Number,
			required: true,
		},
		maps: [{ type: mongoose.Schema.Types.ObjectId, ref: "Map" }],
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Map" }],
	},
	{
		timestamps: true,
	}
);

userSchema.pre("remove", function (next) {
	Map.find({ creator: this.id }, (err, maps) => {
		if (err) {
			next(err);
		} else if (maps.length > 0) {
			maps.forEach((map) => map.remove());
			next();
		} else {
			next();
		}
	});
});

function slugify(text) {
	return text
		.toString()
		.replace(/\s+/g, "-") // Replace spaces with —
		.replace(/[^\w\-]+/g, "") // Remove atl non-word chars
		.replace(/\-\-+/g, "-") // Replace multiple — with single —
		.replace(/^-+/, "") // Trim — from start of text
		.replace(/-+$/, ""); // Trim - from end of text
}

module.exports = mongoose.model("User", userSchema);
