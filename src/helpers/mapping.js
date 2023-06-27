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

const dteBoletaMapping = (items, clientRut, isWeb, emisor)=>{

    let subtotal;
    let totales;
    let detalle;
    console.log(items)
    if(isWeb){
        detalle = items.map((v, index) => ({
                    NroLinDet: index+1 ,
                    NmbItem : v.productItemName,
                    QtyItem: v.quantity,
                    PrcItem: v.price,
                    MontoItem: v.price * v.quantity
                }));
    }else{
        detalle = data.items.map((value, index)=>({ NroLinDet:index+1, ...value }))
    }

    subtotal = detalle.map(({ MontoItem }) => MontoItem).reduce((sum, i) => sum + i, 0)
        subtotal = Math.round(subtotal / 1.19)
        totales = {
            MntNeto: subtotal,
            IVA: Math.round(subtotal * 0.19 ),
            MntTotal: Math.round((subtotal * 0.19)) + subtotal,
            TotalPeriodo: Math.round((subtotal * 0.19)) + subtotal,
            VlrPagar: Math.round((subtotal * 0.19)) + subtotal
    
        }
    //TODO change EMisor
    
    
    return {
        "response": [ "PDF", "80MM"],
        "dte": {
            "Encabezado": {
                "IdDoc": {
                    "TipoDTE": 39,
                    "Folio": 0,
                    "FchEmis": moment().format('YYYY-MM-DD'),
                    "IndServicio": "3"
                },
                "Emisor": {
                    "RUTEmisor": emisor.RUTEmisor,
                    "RznSocEmisor": emisor.RznSocEmisor,
                    "GiroEmisor": emisor.GiroEmisor,
                    "CdgSIISucur": emisor.CdgSIISucur,
                    "DirOrigen": emisor.DirOrigen,
                    "CmnaOrigen": emisor.CmnaOrigen
                },
                "Receptor": {
                    "RUTRecep": clientRut
                   
                },
                "Totales": totales
            },
            "Detalle": detalle
        }
    }
}

const dteBoletaPosMapping = (items, clientRut, isWeb, emisor)=>{

    let subtotal;
    let totales;
    let detalle = items.map((v, index) => ({
        
        NroLinDet: index+1 ,
        NmbItem : v.productName,
        QtyItem: v.qty,
        PrcItem: v.price,
        MontoItem: v.price * v.qty
    }));

    subtotal = detalle.map(({ MontoItem }) => MontoItem).reduce((sum, i) => sum + i, 0)
        subtotal = Math.round(subtotal / 1.19)
        totales = {
            MntNeto: subtotal,
            IVA: Math.round(subtotal * 0.19 ),
            MntTotal: Math.round((subtotal * 0.19)) + subtotal,
            TotalPeriodo: Math.round((subtotal * 0.19)) + subtotal,
            VlrPagar: Math.round((subtotal * 0.19)) + subtotal
    
        }
    //TODO change EMisor
    
    
    return {
        "response": [ "PDF", "80MM"],
        "dte": {
            "Encabezado": {
                "IdDoc": {
                    "TipoDTE": 39,
                    "Folio": 0,
                    "FchEmis": moment().format('YYYY-MM-DD'),
                    "IndServicio": "3"
                },
                "Emisor": {
                    "RUTEmisor": emisor.RUTEmisor,
                    "RznSocEmisor": emisor.RznSocEmisor,
                    "GiroEmisor": emisor.GiroEmisor,
                    "CdgSIISucur": emisor.CdgSIISucur,
                    "DirOrigen": emisor.DirOrigen,
                    "CmnaOrigen": emisor.CmnaOrigen
                },
                "Receptor": {
                    "RUTRecep": clientRut
                   
                },
                "Totales": totales
            },
            "Detalle": detalle
        }
    }
}

export { productMapping, dteBoletaMapping, dteBoletaPosMapping };