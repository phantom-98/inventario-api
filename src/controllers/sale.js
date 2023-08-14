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
import moment from "moment";


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
    const now =  moment.now()
    
	const sales = await Sale.find().sort({createdAt: 'desc'}).limit(10)
    const boletas = await Factura.find({typeId:39}).sort({createdAt: 'desc'}).limit(10)

	res.json({sales, boletas});
}
const getAll3 = async (req, res)=>{
    const now =  moment.now()
    
	const sales = await Sale.find().sort({createdAt: 'desc'})
    const boletas = await Factura.find({typeId:39}).sort({createdAt: 'desc'})

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
        sale.counter =  await Sale.count()
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
    const {startAt, endAt} = req.params
    
    const startDate = new Date(startAt);
    const endDate = new Date(endAt);
    
    const sale = await Sale.find({ createdAt: { $gte: startDate, $lte: endDate }}).populate('items.product')
    
    let data = [{
        fecha:"Fecha",
        numero: "Numero",
        codigo_producto: "Codigo Producto",
        nombre_producto: "Nombre Producto",
        cantidad: "Cantidad",
        precio: "Precio",
        total: "Total",
        cpp: "CPP",
        impuesto: "Impuesto",
        margen: "Margen de Contribucion"
    }]

    sale.forEach((s, index) => {
        s.items.forEach(i=>{
            //console.log(i)
            let impuesto = i.product?.impuestoExtra ?  19 + parseInt(product.impuestoExtra) : 19
            data.push({
                fecha: moment(s.createdAt).format("DD-MM-YYYY H:mm"),
                numero: index,
                codigo_producto:i.product?.sku ? i.product.sku : "" ,
                nombre_producto: i.productName,
                cantidad: i.qty,
                precio: i.price,
                total:i.total,
                cpp:i.product?.prices ? getCpp(i.product.prices) : "",
                impuesto:impuesto,
                margen: i.product?.prices.length > 0 ? (i.PrcItem / getCpp(i.product.prices)) * impuesto -1  : "",
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

const exportFromExcel2 = async(req,res)=>{
    const {startAt, endAt} = req.params
    
    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    const sale = await Factura.find({createdAt: { $gte: startDate, $lte: endDate },typeId:39})
    
    let data = [{
        fecha:"Fecha",
        numero: "Numero",
        codigo_producto: "Codigo Producto",
        nombre_producto: "Nombre Producto",
        cantidad: "Cantidad",
        precio: "Precio",
        total: "Total",
        cpp: "CPP",
        impuesto: "Impuesto",
        margen: "Margen de Contribucion"
    }]



    for (let s of sale) {
    
        for (let i of s.items) {
            if(i.NmbItem !== "Despacho"){
                let product = await Product.findOne({ nombre: i.NmbItem }); // Busca el producto por su nombre
            // console.log(product)
                let impuesto = product?.impuestoExtra ? 19 + parseInt(product.impuestoExtra) : 19
                data.push({
                    fecha: moment(s.createdAt).format("DD-MM-YYYY H:mm"),
                    numero: s.counter,
                    codigo_producto:product?.sku ? product.sku : "" ,
                    nombre_producto: i.NmbItem,
                    cantidad: i.QtyItem,
                    precio: i.PrcItem,
                    total:i.MontoItem,
                    cpp:product?.prices ? getCpp(product.prices) : "",
                    impuesto:impuesto,
                    margen: product?.prices ? (i.PrcItem / getCpp(product.prices)) * impuesto -1  : "",
                    
                })
            }
            
        }
    
    }


    var workbook = XLSX.utils.book_new(),
    worksheet = XLSX.utils.aoa_to_sheet(data.map(el=>Object.values(el)));
    workbook.SheetNames.push("First");
    workbook.Sheets["First"] = worksheet;
    XLSX.writeFile(workbook, "excel/VentasWeb.xlsx");

    res.download("excel/VentasWeb.xlsx");
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
    salePerDay,
    getAll3,
    exportFromExcel2
};
