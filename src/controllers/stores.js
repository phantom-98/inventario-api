import Store from "../models/Stores.js";
import {response} from"../helpers/response.js"

const getOne = async (req, res)=>{
    const data = await Store.findOne({ _id:req.params.id})
	res.json(data);
}

const getAll = async (req, res)=>{
	const data = await Store.findAll()
	res.json({data});
}

const register = async (req, res)=>{
	const { name } = req.body;
	const store = await Store.findOne({ name });

	if (store) return response(res, 400, "Tienda ya registrado");

	try {
		const store = new Store(req.body);
		await store.save();
		res.json(store);
	} catch (error) {
		console.log(error);
		return response(res, 500, error);
	}
}

const update = async(req,res) => {
	
	const store = await Store.updateOne({ _id:req.params.id }, req.body);
	return store ? res.json(store) : response(res, 404, "La tienda no existe");
}

const deleteData = async(req,res) => {
	const store = await Store.deleteOne({ _id:req.params.id });
	return store ? res.json(store) : response(res, 404, "La tienda no existe");
}

export {
    deleteData,
	register,
	update,
	getAll,
 	getOne,
    
};