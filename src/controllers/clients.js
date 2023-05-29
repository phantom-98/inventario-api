import Clients from "../models/Clients.js";
import {response} from"../helpers/response.js"

const getOne = async (req, res)=>{
    const data = await Clients.find({ _id:req.params.id})
	res.json(data);
}

const getAll = async (req, res)=>{
	const data = await Clients.find()
	res.json(data);
}

const register = async (req, res)=>{
	const { email } = req.body;
	const clients = await Clients.findOne({ email });
	
	if (clients) return response(res, 400, "Cliente ya registrado");

	try {
		const clients = new Clients(req.body);
		await clients.save();
		res.json(clients);
	} catch (error) {
		console.log(error);
		return response(res, 500, error);
	}
}

const update = async(req,res) => {
	
	const clients = await Clients.updateOne({ _id:req.params.id }, req.body);
	return clients ? res.json(clients) : response(res, 404, "Cliente no existe");
}

const deleteData = async(req,res) => {
	const clients = await Clients.deleteOne({ _id:req.params.id });
	return clients ? res.json(clients) : response(res, 404, "Cliente no existe");
}

export {
    deleteData,
	register,
	update,
	getAll,
 	getOne,
};