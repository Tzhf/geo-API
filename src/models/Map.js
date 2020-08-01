const mongoose = require("mongoose");

const mapSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			minlength: 3,
			maxlength: 64,
		},
		description: {
			type: String,
			maxlength: 1024,
		},
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		locations: [
			{
				lat: Number,
				lng: Number,
				heading: Number,
				pitch: Number,
				zoom: Number,
			},
		],
		playCount: {
			type: Number,
			required: true,
		},
		likeCount: {
			type: Number,
			required: true,
		},
		published: {
			type: Boolean,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Map", mapSchema);
