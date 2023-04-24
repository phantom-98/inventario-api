import Product from "../models/Product.js";
import {response} from"../helpers/response.js"

const getOne = async (req, res)=>{
    const data = await Product.findOne({ _id:req.params.id})
	res.json(data);
}

const getAll = async (req, res)=>{
	const data = await Product.findAll()
	res.json({data});
}

const register = async (req, res)=>{
	const { name } = req.body;
	const product = await Product.findOne({ name });

	if (product) return response(res, 400, "Tienda ya registrado");

	try {
		const product = new Product(req.body);
		await product.save();
		res.json(product);
	} catch (error) {
		console.log(error);
		return response(res, 500, error);
	}
}

const update = async(req,res) => {
	
	const product = await Product.updateOne({ _id:req.params.id }, req.body);
	return product ? res.json(product) : response(res, 404, "La tienda no existe");
}

const deleteData = async(req,res) => {
	const product = await Product.deleteOne({ _id:req.params.id });
	return product ? res.json(product) : response(res, 404, "La tienda no existe");
}

export {
    deleteData,
	register,
	update,
	getAll,
 	getOne,
    
};