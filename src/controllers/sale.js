import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import {response} from"../helpers/response.js"
import {getCpp} from"../helpers/sale.js"
import {dteBoletaPosMapping} from "../helpers/mapping.js"
import Emisor from './../models/Emisor.js';
import {createDte} from "./factura.js"
import Factura from "../models/Factura.js";
import {crearArrayVentasPorMes} from "../helpers/sale.js"
import { writeFile, utils } from 'xlsx';
import XLSX from "xlsx"; 


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

const saveVoucher = async(req,res) =>{
    const sale = await Sale.updateOne({ _id:req.params.id }, req.body);
	return sale ? res.json(sale) : response(res, 404, "Sale no existe");
}

const update = async(req,res) => {
	
	const sale = await Sale.updateOne({ _id:req.params.id }, req.body);
	return sale ? res.json(sale) : response(res, 404, "Sale no existe");
}

const deleteData = async(req,res) => {
	const sale = await Sale.deleteOne({ _id:req.params.id });
	return sale ? res.json(sale) : response(res, 404, "Sale no existe");
}

const saleAfter = async(req,res)=>{
    const {after} = req.params

    const sale = await Sale.find({createdAt: {$gte : after}})

    return sale ? res.json(sale) : response(res, 404, "Sale no existe");
}

const salePerDay = async (req,res) => {
    const sales = Sale.find().sort({createdAt:-1}).limit(10)
    let web = crearArrayVentasPorMes(sales)
    web = web.map(p=>{
        p.ventas.forEach(v=>{
            total = total + v.totals.MntTotal
        })
    })
    res.json(sales);

}



const exportFromExcel = async(req,res)=>{
    const sale = await Sale.find({}).populate('items.product')
    
    let data = [{
        numero: "Numero",
        nombre_producto: "Nombre Producto",
        cantidad: "Cantidad",
        precio: "Precio",
        total: "Total",
        cpp: "CPP"
    }]
    sale.forEach((s, index) => {
        s.items.forEach(i=>{
            data.push({
                numero: index,
                nombre_producto: i.productName,
                cantidad: i.qty,
                precio: i.price,
                total:i.total,
                cpp: getCpp(i.product?.prices)
            })
        })
    });
    var workbook = XLSX.utils.book_new(),
    worksheet = XLSX.utils.aoa_to_sheet(data.map(el=>Object.values(el)));
    workbook.SheetNames.push("First");
    workbook.Sheets["First"] = worksheet;
    XLSX.writeFile(workbook, "excel/VentasPos.xlsx");

    res.download("excel/VentasPos.xlsx");
}

export {
    deleteData,
	register,
	update,
	getAll,
 	getOne,
    getAll2,
    saleAfter,
    salePerMonth,
    saveVoucher,
    exportFromExcel,
    salePerDay
};
