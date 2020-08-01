exports.registerValidation = (data) => {
	let errors = {};

	if (isUsername(data.username)) errors.username = isUsername(data.username);
	if (isEmail(data.email)) errors.email = isEmail(data.email);

	if (data.password.length < 6)
		errors.password = "Must contain at least 6 characters";
	if (isEmpty(data.password)) errors.password = "Must not be empty";
	if (data.password !== data.confirmPassword)
		errors.confirmPassword = "Passwords must match";

	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false,
	};
};

exports.loginValidation = (data) => {
	let errors = {};
	if (isEmpty(data.email)) errors.email = "Must not be empty";
	if (isEmpty(data.password)) errors.password = "Must not be empty";

	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false,
	};
};

exports.userDetailsValidation = (data) => {
	let errors = {};
	if (data.username && isUsername(data.username))
		errors.username = isUsername(data.username);
	if (data.email && isEmail(data.email)) errors.email = isEmail(data.email);

	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false,
	};
};

exports.mapValidation = (data) => {
	let errors = {};
	if (data.title.length < 3) errors.title = "Must contain at least 3 caracters";
	if (data.title.length > 64) errors.title = "title too long";
	if (isEmpty(data.title)) errors.title = "Must not be empty";
	if (data.description && data.description.length > 1024)
		errors.description = "Description too long";

	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false,
	};
};

const isEmail = (email) => {
	let error;
	const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (email.length > 64) error = "Email too long";
	if (!email.match(regEx)) error = "Must be a valid email adress";
	if (isEmpty(email)) {
		error = "Must not be empty";
	}
	return error;
};

const isUsername = (username) => {
	let error;
	if (isEmpty(username)) error = "Must not be empty";
	if (username.length < 3) error = "Must contain at least 3 caracters";
	if (username.length > 64) error = "Username too long";
	return error;
};

const isEmpty = (string) => {
	if (string.trim() === "") return true;
	else return false;
};
