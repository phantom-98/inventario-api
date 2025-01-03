import Sale from "../models/Sale.js";
import {response} from"../helpers/response.js"

const getOne = async (req, res)=>{
    const data = await Sale.findOne({ _id:req.params.id}).populate('items.product')
	res.json(data);
}

const getAll = async (req, res)=>{
	const data = await Sale.find()
	res.json(data);
}

const register = async (req, res)=>{
	try {
		const sale = new Sale(req.body);
		await sale.save();
		let saleResp = await sale.populate('items.product')
		res.json(saleResp);
	} catch (error) {
		console.log(error);
		return response(res, 500, error);
	}
}

const update = async(req,res) => {
	
	const sale = await Sale.updateOne({ _id:req.params.id }, req.body);
	return sale ? res.json(sale) : response(res, 404, "Sale no existe");
}

const deleteData = async(req,res) => {
	const sale = await Sale.deleteOne({ _id:req.params.id });
	return sale ? res.json(sale) : response(res, 404, "Sale no existe");
}

export {
    deleteData,
	register,
	update,
	getAll,
 	getOne,
};
