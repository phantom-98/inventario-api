import moment from "moment";

function crearArrayVentasPorMes(ventas) {
  const arrayVentasPorMes = [];

  const ventasPorMes = {};

  ventas.forEach((venta) => {
    const fecha = moment(venta.createdAt);
    const mes = fecha.month();
    const year = fecha.year();
    const clave = `${mes}-${year}`;

    if (ventasPorMes[clave]) {
      ventasPorMes[clave].push(venta);
    } else {
      ventasPorMes[clave] = [venta];
    }
  });

  for (const clave in ventasPorMes) {
    arrayVentasPorMes.push({
      mes: clave.split("-")[0],
      year: clave.split("-")[1],
      ventas: ventasPorMes[clave],
    });
  }

  return arrayVentasPorMes;
}

function getCpp(inventario, stock) {
  if (!inventario) {
    return 0;
  }
  let totalUnidades = 0;
  let totalCostoPonderado = 0;

  for (let i = 0; i < inventario.length; i++) {
    const producto = inventario[i];
    if (isNaN(Number(producto.qty)) || isNaN(Number(producto.price))) continue;
    totalUnidades += Number(producto.qty);
    totalCostoPonderado += Number(producto.qty) * Number(producto.price);
  }

  const costoPromedioPonderado = totalCostoPonderado / totalUnidades;

  return costoPromedioPonderado ? Math.round(costoPromedioPonderado) : 0;
}
function dateFormat(dateInformat) {
  if (dateInformat == 0) {
    return 0;
  }

  return moment(dateInformat).utcOffset(-240).format("DD-MM-YYYY H:mm");
}
function dateFormat2(dateInformat) {
  let mm = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  if (dateInformat == 0) {
    return 0;
  }

  let month = moment(dateInformat).format("M");
  return mm[month - 1];
}
function dateClose(provider, facturaDate) {
  if (!provider || !provider.creditCondition) {
    return 0;
  } else {
    return moment(facturaDate).add(provider.creditCondition, "days");
  }
}

function getMonthFromDate(dateString) {
  let mm = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const date = new Date(dateString);
  return mm[date.getMonth()];
}
function getTotalFacturasPorMes(providers, facturas) {
  const totalFacturasPorMes = {};
  let data = [];

  facturas.forEach((factura) => {
    const { provider, expired_at, totals, typeId } = factura;
    const mes = getMonthFromDate(expired_at);

    if (!totalFacturasPorMes[provider.name]) {
      totalFacturasPorMes[provider.name] = {};
    }

    if (!totalFacturasPorMes[provider.name][mes]) {
      totalFacturasPorMes[provider.name][mes] = 0;
    }

    if (typeId == 61) {
      data.push((totalFacturasPorMes[provider.name][mes] -= totals.MntTotal));
    } else {
      data.push((totalFacturasPorMes[provider.name][mes] += totals.MntTotal));
    }
  });

  return totalFacturasPorMes;
}

function getFechaMes() {
  const fechaInicio = new Date();
  fechaInicio.setDate(1);
  fechaInicio.setUTCHours(0, 0, 0, 0);
  fechaInicio.setHours(fechaInicio.getHours() - 4);

  const fechaFin = new Date();
  fechaFin.setMonth(fechaFin.getMonth() + 1, 0);
  fechaFin.setUTCHours(23, 59, 59, 999);
  fechaFin.setHours(fechaFin.getHours() - 4);

  return {
    fechaInicio,
    fechaFin,
  };
}

export {
  crearArrayVentasPorMes,
  getCpp,
  dateClose,
  dateFormat2,
  dateFormat,
  getTotalFacturasPorMes,
  getFechaMes,
};
