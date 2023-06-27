import {response} from"../helpers/response.js"
import Provider from './../models/Provider.js';

const getOne = async (req, res)=>{
    const data = await Provider.findOne({ _id:req.params.id})
	res.json(data);
}

const getAll = async (req, res)=>{
	const data = await Provider.find()
	res.json(data);
}

const register = async (req, res)=>{
	const { name } = req.body;
	const provider = await Provider.findOne({ name });
	
	if (provider) return response(res, 400, "Provider ya registrado");

	try {
		const provider = new Provider(req.body);
		await provider.save();
		res.json(provider);
	} catch (error) {
		console.log(error);
		return response(res, 500, error);
	}
}

const update = async(req,res) => {
	
	const provider = await Provider.updateOne({ _id:req.params.id }, req.body);
	return provider ? res.json(provider) : response(res, 404, "Provider no existe");
}

const deleteData = async(req,res) => {
	const provider = await Provider.deleteOne({ _id:req.params.id });
	return provider ? res.json(provider) : response(res, 404, "Provider no existe");
}

const movement = async(req, res) =>{
	const provider = await Provider.updateOne({ _id:req.params.id }, { $push: { "movements": req.body}}, {upsert: true});
	return provider ? res.json(provider) : response(res, 404, "Provider no existe");
}

export {
    deleteData,
	register,
	update,
	getAll,
 	getOne,
	movement
};