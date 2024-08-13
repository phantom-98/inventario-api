import Log from "../models/Log.js";
import {createJwt, createId} from "../helpers/auth.js";
import {response} from "../helpers/response.js"


const getData = async(req, res) => {
	const { uid } = req;
	
	const logs = await Log.find();
	res.json({ logs})
}




export {

	getData,
};
