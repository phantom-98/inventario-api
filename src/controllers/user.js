import User from "../models/User.js";
import {createJwt, createId} from "../helpers/auth.js";
import {response} from "../helpers/response.js"

const register = async (req, res) => {

	const { email } = req.body;
	const user = await User.findOne({ email });

	if (user) return response(res, 400, "Usuario ya registrado");

	try {
		const user = new User(req.body);
		const token = createJwt(user.id);
		await user.save();
		res.json({ user, token });
	} catch (error) {
		console.log(error);
		return response(res, 500, error);
	}
};

const auth = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	if (!user) return response(res, 404, "El Usuario no existe");

	if (await user.checkPassword(password)) {
		const token = createJwt(user.id);
		res.json({ user, token });
	} else {
		return response(res, 403, "El Password es Incorrecto")
	}
};


const checkToken = async (req, res) => {
	const { token } = req.params;

	const user = await User.findOne({ token });

	if (user) {
		res.json({ user });
	} else {
		return response(res, 404, "Token no válido");
	}
};

const newPassword = async (req, res) => {
	const { token } = req.params;
	const { password } = req.body;

	const user = await User.findOne({ token });

	if (user) {
		user.password = password;
		user.token = "";
		try {
			await user.save();
			res.json({ msg: "Password Modificado Correctamente" });
		} catch (error) {
			return response(res, 500, error);
		}
	} else {
		return response(res, 404, "Token no válido");
	}
};

const getData = async(req, res) => {
	const { uid } = req;
	
	const users = await User.find();
	res.json({ users})
}

const update = async(req,res) => {
	const { uid } = req;
	
	//TODO refactor
	const user = await User.updateOne({ _id:uid }, req.body);
	return user ? res.json({ user}) : response(res, 404, "El Usuario no existe");
}



export {
	register,
	auth,
	checkToken,
	newPassword,
	getData,
	update
};
