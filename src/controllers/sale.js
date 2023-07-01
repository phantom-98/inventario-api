import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import {response} from"../helpers/response.js"
import {dteBoletaPosMapping} from "../helpers/mapping.js"
import Emisor from './../models/Emisor.js';
import {createDte} from "./factura.js"


const getOne = async (req, res)=>{
    const data = await Sale.findOne({ _id:req.params.id}).populate('items.product')
	res.json(data);
}

const getAll = async (req, res)=>{
    //TODO order and get data fromfactura
	const data = await Sale.find()
	res.json(data);
}

const register = async (req, res)=>{
	try {
		const sale = new Sale(req.body);
		if(sale.payType == "Efectivo" || sale.payType == "Cheque" || sale.payType == "Transferencia"){
			const emisor = await Emisor.findById(process.env.EMISOR_UID)
			let data = dteBoletaPosMapping(sale.items, sale.clientRut, true, emisor)
			let file = await createDte(data)
			sale.boletaUrl = "https://s3.amazonaws.com/oxfar.cl/" + file
		}
		await sale.save();
		sale.items.forEach( async element => {
			let product = await  Product.findById(element.product)
			product.stock = product.stock - element.qty
			product.save()
		});
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
