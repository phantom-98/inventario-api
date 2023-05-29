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
		category:String,
		subcategory:String,
		formato:Number,
		ancho:Number,
		largo:Number,
		alto:Number,
		peso:Number,
		bioequivalente:String,
		codigoBarra:String,
		formatoUnidad:String,
		tipoReceta:String,
		estado:String,
		//Revisar db para relacion
		fichaTecnica:String,
		beneficios:String,
		descripcion:String,
		
		composicion:String,
		precio4ciclos:Number,
		precio6ciclos:Number,
		precio13ciclos:Number,
		suscripcionesActivas:Number,
		productosSuscripcion:Number,
		posicion:Number,
		medicamento:String,
		indexable:String,
		diasProteccion:Number,
		puntoreorden:Number, // puntoreorden min de stock -> alerta
		nivelLlenado:Number, // nivel--llenado hasta cuanto quiero comprar
		store :{
			type:mongoose.Schema.Types.ObjectId,
			ref:'Store'
		}
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
