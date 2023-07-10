function crearArrayVentasPorMes(ventas) {
    const arrayVentasPorMes = [];
  
    // Crear un objeto para almacenar las ventas por mes
    const ventasPorMes = {};
  
    // Iterar sobre cada venta
    ventas.forEach((venta) => {
      // Obtener el mes y el año de la venta
      const fecha = new Date(venta.createdAt);
      const mes = fecha.getMonth();
      const year = fecha.getFullYear();
  
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

  export { crearArrayVentasPorMes, getCpp };