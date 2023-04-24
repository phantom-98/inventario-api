import mongoose from "mongoose";

const productSchema = mongoose.Schema(
	{
		sku:Number,
		nombre: {
			type: String,
			required: true,
			trim: true,
		},
		tipologia_consumo:String,
		laboratorio:String,
		precio:Number,
		precioOferta:Number,
		stock:Number,
		subcategory:String,
		formato:Number,
		ancho:Number,
		largo:Number,
		alto:Number,
		peso:Number,
		bioequivalente:Number,
		codigoBarra:String,
		formatoUnidad:String,
		tipoReceta:String,
		estado:String,
		fichaTecnica:Number,
		beneficios:Number,
		descripcion:Number,
		composicion:String,
		precio4ciclos:Number,
		precio6ciclos:Number,
		precio13ciclos:Number,
		suscripcionesActivas:Number,
		productosSuscripcion:Number,
		posicion:Number,
		medicamento:Number,
		indexable:Number,
		diasProteccion:Number,
 	},
	{
		timestamps: true
	}
);


productSchema.method('toJSON', function(){
    const {__v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})


const Product = mongoose.model("Product", productSchema);
export default Product;
