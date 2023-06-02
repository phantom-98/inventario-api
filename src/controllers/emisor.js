import Emisor from "../models/Emisor.js";
import {response} from"../helpers/response.js"

const getOne = async (req, res)=>{
    const data = await Emisor.find({ _id:req.params.id})
	res.json(data);
}

const getAll = async (req, res)=>{
	const data = await Emisor.find()
	res.json(data);
}

const register = async (req, res)=>{
	const { email } = req.body;
	const emisor = await Emisor.findOne({ email });
	
	if (emisor) return response(res, 400, "Emisor ya registrado");

	try {
		const emisor = new Emisor(req.body);
		await emisor.save();
		res.json(emisor);
	} catch (error) {
		console.log(error);
		return response(res, 500, error);
	}
}

const update = async(req,res) => {
	
	const emisor = await Emisor.updateOne({ _id:req.params.id }, req.body);
	return emisor ? res.json(emisor) : response(res, 404, "Emisor no existe");
}

const deleteData = async(req,res) => {
	const emisor = await Emisor.deleteOne({ _id:req.params.id });
	return emisor ? res.json(emisor) : response(res, 404, "Emisor no existe");
}

export {
    deleteData,
	register,
	update,
	getAll,
 	getOne,
};