import moment from 'moment';

const productMapping = (data) => {
    return data.map(d=>{
        return {
            sku:d.SKU,
            nombre:d.Nombre,
            tipologia_consumo:d?.["Tipología Consumo"],
            laboratorio:d?.Laboratorio,
            precio:d.Precio,
            precioOferta:d?.['Precio Oferta'],
            stock:d.Stock,
            category:"",
            subcategory:d?.["Subcategoría"],
            formato:d?.Formato,
            ancho:0,
            largo:0,
            alto:0,
            peso:0,
            bioequivalente:d?.["¿Bioequivalente?"],
            codigoBarra:d?.["Código de Barras"],
            formatoUnidad:d?.["Formato Unidad"],
            tipoReceta:d?.["Tipo de Receta"],
            estado:d?.Estado,
            fichaTecnica:d?.["Ficha Técnica"],
            beneficios:d?.Beneficios,
            descripcion:d?.["Descripción"],
            composicion:d?.["Composición"],
            precio4ciclos:d?.["Precio 4 ciclos"],
            precio6ciclos:d?.["Precio 6 ciclos"],
            precio13ciclos:d?.["Precio 6 ciclos"],
            suscripcionesActivas:d?.["Cantidad de Suscripciones Activas"],
            productosSuscripcion:d?.["Cantidad productos por suscripciones"],
            posicion:d?.["Posición"],
            medicamento:d?.Medicamento,
            indexable:d?.Indexable,
            diasProteccion:d?.['Dias Proteccion'],
            puntoreorden:0,
            nivelLlenado:0,
            
        }
    })
}

const dteBoletaMapping = (data, client)=>{
    //TODO change EMisor
    let subtotal = data.items.map(({ MontoItem }) => MontoItem).reduce((sum, i) => sum + i, 0)
    subtotal = Math.round(subtotal / 1.19)
    const totales = {
        MntNeto: subtotal,
        IVA: Math.round(subtotal * 0.19 ),
        MntTotal: Math.round((subtotal * 0.19)) + subtotal,
        TotalPeriodo: Math.round((subtotal * 0.19)) + subtotal,
        VlrPagar: Math.round((subtotal * 0.19)) + subtotal

    }
   
    const detalle = data.items.map((value, index)=>{
        return {
            "NroLinDet":index+1,
            ...value
        }
    })
    
    return {
        "response": [ "PDF"],
        "dte": {
            "Encabezado": {
                "IdDoc": {
                    "TipoDTE": data.dte,
                    "Folio": 0,
                    "FchEmis": moment().format('YYYY-MM-DD'),
                    "IndServicio": "3"
                },
                "Emisor": {
                    "RUTEmisor": "76795561-8",
                    "RznSocEmisor": "HAULMERSPA",
                    "GiroEmisor": "VENTA AL POR MENOR EN EMPRESAS DE VENTA A DISTANCIA VÍA INTERNET",
                    "CdgSIISucur": "81303347",
                    "DirOrigen": "ARTURO PRAT 527 CURICO",
                    "CmnaOrigen": "Curicó"
                },
                "Receptor": {
                    "RUTRecep": client.rut
                   
                },
                "Totales": totales
            },
            "Detalle": detalle
        }
    }
}


export { productMapping, dteBoletaMapping };