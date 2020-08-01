const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const compression = require("compression");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
require("./util/db");

// MIDDLEWARES
app.use(express.json());
app.use(compression());
app.use(cors());
app.use(morgan("tiny"));

// ROUTER
const router = express.Router();

const { auth, notFound, errorHandler } = require("./util/middlewares");
const {
	register,
	login,
	getUserPofile,
	editUserDetails,
	deleteUser,
} = require("./controllers/auth");
const { getOneUser, getAllUsers } = require("./controllers/users");
const {
	postMap,
	editMap,
	deleteMap,
	likeMap,
	getOneMap,
	getLastMaps,
	getOneUserMaps,
} = require("./controllers/maps");

// -- Auth routes
router.post("/register", register);
router.post("/login", login);
router
	.route("/profile")
	.get(auth, getUserPofile)
	.patch(auth, editUserDetails)
	.delete(auth, deleteUser);

router.get("/user/:id", getOneUser);
router.get("/user/:id/maps", getOneUserMaps);
router.get("/users", getAllUsers); // ! dev purposes only

// -- Maps Routes
router.post("/map", auth, postMap);
router.route("/map/:id").patch(auth, editMap).delete(auth, deleteMap);
router.post("/map/:id/like", auth, likeMap);
router.get("/map/:id", getOneMap);
router.get("/maps/new", getLastMaps);

app.use("/api", router);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
