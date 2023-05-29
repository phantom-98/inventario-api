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


export { productMapping };