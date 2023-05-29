import Factura from "../models/Factura.js";
import {response} from"../helpers/response.js"

const getOne = async (req, res)=>{
    const data = await Factura.find({ _id:req.params.id})
	res.json(data);
}

const getAll = async (req, res)=>{
	const data = await Factura.find()
	res.json(data);
}

const register = async (req, res)=>{
	const { email } = req.body;
	const factura = await Factura.findOne({ email });
	
	if (factura) return response(res, 400, "Factura ya registrado");

	try {
		const factura = new Factura(req.body);
		await factura.save();
		res.json(factura);
	} catch (error) {
		console.log(error);
		return response(res, 500, error);
	}
}

const update = async(req,res) => {
	
	const factura = await Factura.updateOne({ _id:req.params.id }, req.body);
	return factura ? res.json(factura) : response(res, 404, "Factura no existe");
}

const deleteData = async(req,res) => {
	const factura = await Factura.deleteOne({ _id:req.params.id });
	return factura ? res.json(factura) : response(res, 404, "Factura no existe");
}

export {
    deleteData,
	register,
	update,
	getAll,
 	getOne,
};