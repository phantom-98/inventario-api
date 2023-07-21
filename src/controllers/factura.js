import Factura from "../models/Factura.js";
import Clients from "../models/Clients.js";
import Provider from "../models/Provider.js";
import {response} from"../helpers/response.js"
import fetch from 'node-fetch';
import fs from 'fs'
import {dteBoletaMapping} from"../helpers/mapping.js"
import { writeFile, readFile } from "../helpers/fsWrapping.js"
import path from 'path';
import Emisor from "../models/Emisor.js";

import { PutObjectCommand, CreateBucketCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../helpers/s3Client.js";
import { dateFormat, dateFormat2, dateClose } from "../helpers/sale.js";
import Product from '../models/Product.js';
import XLSX from "xlsx"; 



const test = async(req, res) =>{
	const fileStream = await readFile(`./dte/boleta_1686870169828.pdf`)
	const fileContent = fs.readFileSync("./dte/boleta_1686870169828.pdf");
	console.log(fileStream)
	
	const command = new PutObjectCommand({
		Bucket: "oxfar.cl",
		Key: "t2.pdf",
		Body: fileContent,
	  });
	try {
	const response = await s3Client.send(command);
	console.log(response);
	} catch (err) {
	console.error(err);
	}
	
}

const getOne = async (req, res)=>{
    const data = await Factura.findOne({ _id:req.params.id})
	res.json(data);
}

const getAll = async (req, res)=>{
	const data = await Factura.find()
	res.json(data);
}

const createDte = async (data, document="boleta")=>{
	
	var requestOptions = {
		method: 'POST',
		headers: {"apikey": process.env.OPENFACTURA_KEY},
		body: JSON.stringify(data),
		redirect: 'follow'
	};

	try {
		let response = await fetch(process.env.OPENFACTURA_URL, requestOptions)
		let result = await response.text();
		let dataParse = JSON.parse(result)
		
		let name = `${document}_${Date.now()}.pdf`

		if(!dataParse.PDF){
			console.log(result)
		}
		
		await writeFile(`./dte/${name}`, dataParse.PDF, 'base64' )
		const fileContent = fs.readFileSync(`./dte/${name}`);

		//TODO better base64 send to s3
		
		const command = new PutObjectCommand({
			Bucket: "oxfar.cl",
			Key: name,
			Body: fileContent,
			ContentDisposition:"inline",
			ContentType:"application/pdf"
		  });
		try {
			const response = await s3Client.send(command);
			console.log(response);
		} catch (err) {
			console.error(err);
		}



		return name
	} catch (error) {
		console.log(JSON.stringify(error));
	}
	
}

const createforWeb = async (req, res) =>{
	let rData = req.body;
	//TODO change Emisor
	
	try {
		const emisor = await Emisor.findById(process.env.EMISOR_UID)
		console.log(emisor)
	
		let data = dteBoletaMapping(rData["items"], rData["client"]["rut"].replaceAll(".", ""), true, emisor)
	//	
		console.log(JSON.stringify(data))
		let file = await createDte(data)
		let facturaReq = {
			type: "Boleta",
			typeId: 39,
			client :{
				RUTRecep: rData["client"]["rut"] ? rData["client"]["rut"] : null,
				name: rData["client"]["fistName"] ? rData["client"]["fistName"] + " " + rData["client"]["lastName"] : null,
				phone:rData["client"]["phone"] ? rData["client"]["phone"] : null,
				address:rData["client"]["address"] ? rData["client"]["address"] : null

			},
			url: "https://s3.amazonaws.com/oxfar.cl/" +file,
			counter: await Factura.count(),
			items: data.dte.Detalle,
			totals:data.dte.Encabezado.Totales,
			emisor :"6478cf2019faa9ced45ca8f1",
		}
		
		const factura = new Factura(facturaReq);
		await factura.save();

		res.json({
			document:{
				...factura.toJSON(),
				"number": factura.counter,
				"saleType":"Internet",
				"createUser":"anticonceptivo",
    			"total":factura.totals.MntTotal
			}, 
			pdfUrl:"https://s3.amazonaws.com/oxfar.cl/" +file,
			"error":{
				code:0,
				description:"OK"
			}
		});
	} catch (error) {
		console.log(error);
		return response(res, 500, error);
	}
}

const createforPos = async (req,res) =>{
	
	try {
		let rData = req.body;	

		let facturaReq = {
			type: "VentaPos",
			items: rData.carrito,
			totals:rData.total,
		}

		facturaReq.items.forEach(async e => {
			const product = await Product.findById(e.articulo.uid);
			if(product.stock < e.cantidad){
				return response(res, 500, "No hay stock para el producto");
			}
			product.stock = product.stock - e.cantidad
			product.save()
			console.log("save product", e.articulo.sku)
		});

		const factura = new Factura(facturaReq);
		await factura.save();
		res.json(factura);
	} catch (error) {
		console.log(error);
		return response(res, 500, error);
	}
}

const register = async (req, res)=>{
	let rData = req.body;
	const client = await Clients.findById(rData.clientId)

	let data;
	switch (rData.dte) {
		case '39':
			data = dteBoletaMapping(req.body, client.rut, false)
			break;
	
		default:
			break;
	}
	
	
	let file = await createDte(data)

	try {
		/*const factura = new Factura(req.body);
		await factura.save();*/
		res.json(file);
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

const download = (req, res) => {
	const fileName = req.params.name;

	res.download('dte/' + fileName, fileName, (err) => {
	  if (err) {
		res.status(500).send({
		  message: "Could not download the file. " + err,
		});
	  }
	});
};

const createReceivedDte = async(data)=>{

	data.data.forEach(async d => {

		const facturaCreada = await Factura.findOne({folio:d.Folio})
		if(!facturaCreada){
			let factura = new Factura();
			factura.folio = d.Folio
			factura.typeId = d.TipoDTE
			factura.createdAt = d.FchEmis
			factura.formaPago = d.FmaPago
			factura.format = "Recibido"
			factura.emisorData ={
				RUTEmisor: `${d.RUTEmisor}-${d.DV}`,
				RznSoc: d.RznSoc,
				MntTotal: d.MntTotal
			}
            let provider = await Provider.findOne({"RUTRecep":`${d.RUTEmisor}-${d.DV}`})
            console.log(provider)
            if(provider){
                factura.provider = provider._id
            }

			factura.totals ={
				MntNeto: d.MntNeto,
				IVA: d.IVA,
				MntTotal: d.MntTotal
			}

			await factura.save()
		}

		
	});
}

const getReceivedDte = async(req, res) =>{
//    await Factura.deleteMany({format:"Recibido"})
	var requestOptions = {
		method: 'POST',
		headers: {"apikey": process.env.OPENFACTURA_KEY},
		redirect: 'follow'
	};
	//try {
		let response = await fetch(process.env.OPENFACTURA_URL + "/received", requestOptions)
        console.log(response)
		let result = await response.text();
		let dataParse = JSON.parse(result)
		await createReceivedDte(dataParse)
		for (let index = 2; index < dataParse.last_page; index++) {
			requestOptions.body = JSON.stringify({"Page":index})
			let response = await fetch(process.env.OPENFACTURA_URL + "/received", requestOptions)
			let result = await response.text();
			let dataParse = JSON.parse(result)
			createReceivedDte(dataParse)
		}
		res.json(dataParse)
	/*} catch (error) {
		console.log(JSON.stringify(error));
	}*/
}

const getReceivedDteforApi = async(req, res) =>{
	const facturas = await Factura.find({format:"Recibido"}).sort({createdAt: 'desc'})
	res.json(facturas)
}

const getReceivedDteforApi2 = async(req, res) =>{

	const facturas = await Factura.find({format:"Recibido",$or: [ { typeId: 33 }, { typeId: 34 } ]}).limit(10).sort({createdAt: 'desc'})

	res.json(facturas)
}
const getReceivedDteforApi3 = async(req, res) =>{
	const facturas = await Factura.find({format:"Recibido",$or: [ { typeId: 33 }, { typeId: 34 } ]}).sort({createdAt: 'desc'}).populate("provider")
    let data = []
    facturas.forEach(element => {
        if(element.provider?.name){
            data.push(element)
        }
    });
	res.json(data)
}

const receivedDetails = async(req, res)=>{
	
	const { id } = req.body
	const factura = await Factura.findOne({_id:id})

	if(!factura.url){
		var requestOptions = {
			method: 'GET',
			headers: {"apikey": process.env.OPENFACTURA_KEY},
			//body: JSON.stringify(data),
			redirect: 'follow'
		};
		try {
			let response = await fetch(process.env.OPENFACTURA_URL + `/${factura.emisorData.RUTEmisor}/${factura.typeId}/${factura.folio}/pdf`, requestOptions)

			let result = await response.text();
		
			let dataParse = JSON.parse(result)
	
			await writeFile(`./dte/received.pdf`, dataParse.pdf, 'base64' )
			const fileContent = fs.readFileSync(`./dte/received.pdf`);
			let name = `${Date.now()}.pdf`
			const command = new PutObjectCommand({
				Bucket: "oxfar.cl",
				Key: `received_${name}`,
				Body: fileContent,
				ContentDisposition:"inline",
				ContentType:"application/pdf"
			  });
			await s3Client.send(command);
	
			
			factura.url = `https://s3.amazonaws.com/oxfar.cl/received_${name}`
			factura.save()
			res.json({pdfUrl:`https://s3.amazonaws.com/oxfar.cl/received_${name}`})
		} catch (error) {
			res.status(500).json({error})
		}
	}else{
		res.json({pdfUrl:factura.url})
	}
	
	
}

const changeStatus = async (req,res)=>{
    try {
        const { id } = req.params
        
        const factura = await Factura.findOne({_id:id})
        factura.status = !factura.status || factura.status == "Pagada" ? "No Pagada" : "Pagada";
        factura.save()
        res.json(factura)
    } catch (error) {
        res.status(500).json(error)
    }
    
}

const exportFromExcel = async(req,res)=>{
    const {status} = req.params
    console.log(status)
    const facturas = await Factura.find({format:"Recibido",provider:{$ne:null},$or: [ { typeId: 33 }, { typeId: 34 } ]}).sort({createdAt: 'desc'}).populate("provider")
    const items = []
    if(status == "Pagada"){
        facturas.forEach(s => {
            if(s.status == "Pagada"){
                items.push(s)
            }
        });
    }else if(status=="No_Pagada"){
        facturas.forEach(s => {
          //  console.log(s.status)
            if( s.status != "Pagada"){
                console.log(s)
                items.push(s)
            }
        });
    }else if(status == "Todas"){
        facturas.forEach(s => {
            //  console.log(s.status)
             
                  items.push(s)
             
          });
    }
    let data = [{
        "Numero_Factura":"Numero_Factura", 
        "Proovedor":"Proovedor", 
        "Fecha_Emision":"Fecha_Emision", 
        "Fecha_Vencimiento":"Fecha_Vencimiento", 
        "Monto":"Monto", 
        "Mes_Vencimiento":"Mes_Vencimiento",
        "Estado":"Estado"
    }]

    items.forEach((r, index) => {
        data.push({
            "Numero_Factura":r.folio, 
            "Proovedor":r.provider?.name, 
            "Fecha_Emision":r.createdAt, 
            "Fecha_Vencimiento":dateFormat(dateClose(r.provider,r.createdAt)), 
            "Monto":r.totals.MntTotal, 
            "Mes_Vencimiento":dateFormat2(dateClose(r.provider,r.createdAt)),
            "Estado": r.status ? r.status : "No Pagada"
        })
    });
    var workbook = XLSX.utils.book_new(),
    worksheet = XLSX.utils.aoa_to_sheet(data.map(el=>Object.values(el)));
    workbook.SheetNames.push("First");
    workbook.Sheets["First"] = worksheet;
    XLSX.writeFile(workbook, "excel/FacturaRecibidias.xlsx");

    res.download("excel/FacturaRecibidias.xlsx");
}


export {
    deleteData,
	register,
	update,
	getAll,
 	getOne,
	download,
	createforWeb,
	test,
	createforPos,
	createDte,
	getReceivedDte,
	receivedDetails,
	getReceivedDteforApi,
	getReceivedDteforApi2,
    getReceivedDteforApi3,
changeStatus,
    exportFromExcel
};

