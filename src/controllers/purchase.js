import Purchase from "../models/Purchase.js";
import {response} from"../helpers/response.js"

const getOne = async (req, res)=>{
    const data = await Purchase.find({ _id:req.params.id})
	res.json(data);
}

const getAll = async (req, res)=>{
	const data = await Purchase.find()
	res.json(data);
}

const register = async (req, res)=>{
	const { name } = req.body;
	const purchase = await Purchase.findOne({ name });
	
	if (purchase) return response(res, 400, "Tienda ya registrado");

	try {
		const purchase = new Purchase(req.body);
		await purchase.save();
		res.json(purchase);
	} catch (error) {
		console.log(error);
		return response(res, 500, error);
	}
}

const update = async(req,res) => {
	
	const purchase = await Purchase.updateOne({ _id:req.params.id }, req.body);
	return purchase ? res.json(purchase) : response(res, 404, "La tienda no existe");
}

const deleteData = async(req,res) => {
	const purchase = await Purchase.deleteOne({ _id:req.params.id });
	console.log(purchase)
	return purchase ? res.json(purchase) : response(res, 404, "La tienda no existe");
}

export {
    deleteData,
	register,
	update,
	getAll,
 	getOne,
    
};