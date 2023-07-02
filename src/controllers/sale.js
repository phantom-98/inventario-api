import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import {response} from"../helpers/response.js"
import {dteBoletaPosMapping} from "../helpers/mapping.js"
import Emisor from './../models/Emisor.js';
import {createDte} from "./factura.js"
import Factura from "../models/Factura.js";
import {crearArrayVentasPorMes} from "../helpers/sale.js"

const getOne = async (req, res)=>{
    const data = await Sale.findOne({ _id:req.params.id}).populate('items.product')
	res.json(data);
}

const getAll = async (req, res)=>{
    //TODO order and get data fromfactura
	const data = await Sale.find().sort({createdAt: 'desc'})
	res.json(data);
}

const getAll2 = async (req, res)=>{
    //TODO order and get data fromfactura
	const sales = await Sale.find().sort({createdAt: 'desc'})
    const boletas = await Factura.find({typeId:39}).sort({createdAt: 'desc'})

    /*let data = [...sales, ...boletas];

    data.sort((a,b)=>(b.createdAt) - (a.createdAt));*/

    
	res.json({sales, boletas});
}

const salePerMonth = async (req, res)=>{
    
	const sales = await Sale.find()
    const boletas = await Factura.find({typeId:39})

    let pos = crearArrayVentasPorMes(sales)
    pos = pos.map(p=>{
        let total = 0;
        p.ventas.forEach(v=>{
            total = total + v.total
        })
        return {
            mes:p.mes,
            year:p.year,
            total
        }
    })
    let web = crearArrayVentasPorMes(boletas)

    web = web.map(p=>{
        let total = 0;
        p.ventas.forEach(v=>{
            total = total + v.totals.MntTotal
        })
        return {
            mes:p.mes,
            year:p.year,
            total
        }
    })
	res.json({pos, web});
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
    getAll2,
    salePerMonth
};
