const getCpp = (product) => {
  let totalUnidades = 0;
  let totalCostoPonderado = 0;
  let costoPromedioPonderado = 0;

  if (product.prices.length == 1) {
    const producto = product.prices[0];
    totalUnidades = Number(producto.qty);
    totalCostoPonderado = Number(producto.qty) * Number(producto.price);
    costoPromedioPonderado = totalCostoPonderado / totalUnidades;
  } else {
    let lastCpp = product.cpp2[product.cpp2.length - 1];
    let lastPrice = product.prices[product.prices.length - 1];
    if (product.stock == 0) {
      totalUnidades = Number(lastPrice.qty);
      totalCostoPonderado = Number(lastPrice.qty) * Number(lastPrice.price);
    } else {
      totalUnidades = product.stock + Number(lastPrice.qty);
      totalCostoPonderado =
        Number(lastPrice.qty) * Number(lastPrice.price) +
        Number(product.stock) * Number(lastCpp.price);
    }

    costoPromedioPonderado = totalCostoPonderado / totalUnidades;
  }
  return costoPromedioPonderado;
};

function changeObjectKeyLowerCase(object) {
  const newObject = {};
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      newObject[key.toLowerCase()] = object[key];
    }
  }
  return newObject;
}

function validarClaves(objeto, claves) {
  for (const clave of claves) {
    if (!objeto.hasOwnProperty(clave)) {
      return false;
    }
  }
  return true;
}

function createSlug(string) {
  const slug = string.replace(/\s+/g, "-").toLowerCase();
  return slug;
}

export { getCpp, changeObjectKeyLowerCase, validarClaves, createSlug };
