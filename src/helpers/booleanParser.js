function parseStringToBoolean(str) {
  return str.toLowerCase() === "true" || str === "1";
}

export default parseStringToBoolean;
