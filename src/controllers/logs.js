import Log from "../models/Log.js";
import {createJwt, createId} from "../helpers/auth.js";
import {response} from "../helpers/response.js"


const getData = async(req, res) => {
	const { uid } = req;
	
	const logs = await Log.find().sort({timestamp:-1});
	res.json({ logs})
}




export {

	getData,
};
