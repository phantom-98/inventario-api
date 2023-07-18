import Settings from "../models/Settings.js";
import {response} from"../helpers/response.js"

const getOne = async (req, res)=>{
    const data = await Settings.find({ _id:req.params.id})
	res.json(data);
}

const getAll = async (req, res)=>{
	const data = await Settings.find()
	res.json(data);
}

const register = async (req, res)=>{
	const { key } = req.body;
	const settings = await Settings.findOne({ key });
	
	if (settings) return response(res, 400, "Setting ya registrado");

	try {
		const settings = new Settings(req.body);
		await settings.save();
		res.json(settings);
	} catch (error) {
		console.log(error);
		return response(res, 500, error);
	}
}

const update = async(req,res) => {
	try {
		const {key} = req.params
		let setting = await Settings.findOne({ key })
		if(key == "POS_DISCOUNT"){
			setting.value = setting.value == "false" ? "true" : "false"
		}
		setting.save()
		res.json(setting)
	} catch (error) {
		res.status(500).json(error)
	}
	
}

const deleteData = async(req,res) => {
	const settings = await Settings.deleteOne({ _id:req.params.id });
	console.log(settings)
	return settings ? res.json(settings) : response(res, 404, "La setting no existe");
}

export {
    deleteData,
	register,
	update,
	getAll,
 	getOne,
    
};