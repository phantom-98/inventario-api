import User from "../models/User.js";
import {response} from "../helpers/response.js"
import axios from 'axios';
import fetch from 'node-fetch';
let config = {
	method: 'post',
  	maxBodyLength: Infinity,
	headers: { 
	  'apikey': '928e15a2d14d4a6292345f04960f4bd3'
	}
};

const createDte = async(req,res) => {
	
	

	

var raw = { "response":[ "PDF"], "dte":{ "Encabezado":{ "IdDoc":{ "TipoDTE":52, "Folio":0, "FchEmis":"2018-08-16", "TipoDespacho":"2", "IndTraslado":"3", "TpoTranVenta":"1", "FmaPago":"1" }, "Emisor":{ "RUTEmisor":"76795561-8", "RznSoc":"HAULMERSPA", "GiroEmis":"VENTA AL POR MENOR EN EMPRESAS DE VENTA A DISTANCIA VÍA INTERNET; COMERCIO ELEC", "Acteco":479100, "GuiaExport":{ "CdgTraslado":"3" }, "DirOrigen":"ARTURO PRAT 527 CURICO", "CmnaOrigen":"Curicó", "CdgSIISucur":"81303347" }, "Receptor":{ "RUTRecep":"76430498-5", "RznSocRecep":"HOSTYSPA", "GiroRecep":"EMPRESAS DE SERVICIOS INTEGRALES DE INFO", "DirRecep":"ARTURO PRAT 5273 pis OF1", "CmnaRecep":"Curicó" }, "Transporte":{ "DirDest":"Arturo Prat 527", "CmnaDest":"Curicó", "CiudadDest":"Curicó" }, "Totales":{ "MntNeto":2000, "TasaIVA":"19", "IVA":380, "MntTotal":2380, "MontoPeriodo":2380, "VlrPagar":2380 } }, "Detalle":[ { "NroLinDet":1, "NmbItem":"item despacho", "QtyItem":1, "PrcItem":2000, "MontoItem":2000 } ] } };

var requestOptions = {
  method: 'POST',
  headers: {"apikey": "928e15a2d14d4a6292345f04960f4bd3"},
  body: JSON.stringify(raw),
  redirect: 'follow'
};

fetch("https://dev-api.haulmer.com/v2/dte/document", requestOptions)
  .then(response => response.text())
  .then(result => res.json(JSON.parse(result)))
  .catch(error => console.log('error', error));

}



export {
	createDte
};


