import moment from "moment-timezone";


function crearArrayVentasPorMes(ventas) {
    const arrayVentasPorMes = [];
  
    // Crear un objeto para almacenar las ventas por mes
    const ventasPorMes = {};
  
    // Iterar sobre cada venta
    ventas.forEach((venta) => {
      // Obtener el mes y el año de la venta
      const fecha = moment(venta.createdAt).tz('America/Santiago');
      
      const mes = fecha.month();

      const year = fecha.year();
  
      // Crear una clave única para el mes y el año
      const clave = `${mes}-${year}`;
  
      // Verificar si la clave ya existe en el objeto ventasPorMes
      if (ventasPorMes[clave]) {
        // Si la clave ya existe, agregar la venta al mes existente
        ventasPorMes[clave].push(venta);
      } else {
        // Si la clave no existe, crear un nuevo mes y agregar la venta
        ventasPorMes[clave] = [venta];
      }
    });
  
    // Convertir el objeto ventasPorMes a un array
    for (const clave in ventasPorMes) {
      arrayVentasPorMes.push({
        mes: clave.split('-')[0],
        year: clave.split('-')[1],
        ventas: ventasPorMes[clave]
      });
    }
  
    return arrayVentasPorMes;
  }

    function getCpp(inventario, stock){
        if(!inventario){
            return 0
        }
        let totalUnidades = 0;
        let totalCostoPonderado = 0;

        // Calcular el total de unidades y el costo ponderado
        for (let i = 0; i < inventario.length; i++) {
            const producto = inventario[i];
            totalUnidades += Number(producto.qty);
            totalCostoPonderado += Number(producto.qty) * Number(producto.price);
        }

        const costoPromedioPonderado = totalCostoPonderado / (totalUnidades);

        return costoPromedioPonderado ? Math.round(costoPromedioPonderado) : 0;

    }
    function dateFormat(dateInformat) {
        if(dateInformat == 0 ){
            return 0
        }
    
        return moment(dateInformat).format("DD-MM-YYYY H:mm")
    }
    function dateFormat2(dateInformat) {
        let mm = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        if(dateInformat == 0 ){
            return 0
        }
    
        let month =  moment(dateInformat).format("M")
        return mm[month-1]
    }
    function dateClose(provider, facturaDate){
        if(!provider || !provider.creditCondition){
            return 0
        }else{
            return moment(facturaDate).add(provider.creditCondition, "days")
        }
    }

    function getMonthFromDate(dateString) {
        let mm = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

        const date = new Date(dateString);
        return mm[date.getMonth()] ; // Se suma 1 ya que los meses en JavaScript son indexados desde 0 (enero es 0).
    }
    function getTotalFacturasPorMes(providers, facturas) {
        const totalFacturasPorMes = {};
        let data = []
      
        // Iterar sobre las facturas y agruparlas por mes para cada proveedor.
        facturas.forEach((factura) => {
          const { provider, expired_at, totals, typeId } = factura;
          const mes = getMonthFromDate(expired_at);
      
          if (!totalFacturasPorMes[provider.name]) {
            totalFacturasPorMes[provider.name] = {};
          }
      
          if (!totalFacturasPorMes[provider.name][mes]) {
            totalFacturasPorMes[provider.name][mes] = 0;
          }
          
          if(typeId == 61){
                data.push(totalFacturasPorMes[provider.name][mes] -= totals.MntTotal);
          }else{

                data.push(totalFacturasPorMes[provider.name][mes] += totals.MntTotal);
          }
        });
      
        return totalFacturasPorMes;
      }

  export { crearArrayVentasPorMes, getCpp, dateClose,dateFormat2,  dateFormat, getTotalFacturasPorMes };