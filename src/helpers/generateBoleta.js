import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client.js";

const createDoc = (data, document = "boleta") => {
  const doc = new PDFDocument();
  const fileName = `${document}-${Date.now()}.pdf`;
  const filePath = `./${fileName}`;
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);
  stream.on("error", (err) => {
    console.error("Stream encountered an error:", err);
  });
  // Logo - ensure you have a logo.png file in your project root or adjust the path as needed
  const logoPath = path.join("./", "assets", "logo-full.png");

  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 200, 50, { width: 200 }).moveDown(0.5);
  }

  // Billing Information Header
  doc.fontSize(20).text("Detalle Productos", 50, 130).fontSize(10).moveDown();

  // Example Billing Details
  let startY = 170;
  /* const itemDescriptions = ["Product A", "Product B", "Service A"];
  const prices = [100, 200, 150]; */
  /* const items = {
    Encabezado: {
      Totales: {
        MntNeto: 12533,
        IVA: Math.round(45000 * 0.19),
        MntTotal: Math.round(45000 * 0.19) + 45000,
        TotalPeriodo: Math.round(45000 * 0.19) + 45000,
        VlrPagar: Math.round(45000 * 0.19) + 45000,
      },
    },
    Detalle: [
      {
        NroLinDet: 1,
        NmbItem: "test prod",
        QtyItem: 3,
        PrcItem: 12000,
        MontoItem: 36000,
      },
    ],
  }; */
  data.Detalle.forEach((item, i) => {
    doc
      .fontSize(12)
      .text(`${item.NmbItem}: $${item.PrcItem} x ${item.QtyItem}`, 50, startY);
    startY += 20;
  });

  // Subtotal
  startY += 20;
  doc.text(`Monto Neto: $${data.Encabezado.Totales.MntNeto}`, 50, startY);

  // Taxes (Assume a fixed rate for simplicity)

  startY += 20;
  doc.text(
    `IVA (19%): $${
      data.Encabezado.Totales.MntTotal - data.Encabezado.Totales.MntNeto
    }`,
    50,
    startY
  );

  // Total

  startY += 20;
  doc.text(`Valor a Pagar: $${data.Encabezado.Totales.MntTotal}`, 50, startY);

  startY += 40;
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // January is 0!
  const year = String(now.getFullYear()).slice(-2);

  doc.text(`Fecha: ${day}/${month}/${year}`, 450, startY);

  doc.end();

  stream.on("finish", async function () {
    const fileContent = fs.readFileSync(filePath);
    console.log(filePath);
    const command = new PutObjectCommand({
      Bucket: "oxfar.cl",
      Key: fileName,
      Body: fileContent,
      ContentDisposition: "inline",
      ContentType: "application/pdf",
    });
    try {
      await s3Client.send(command);
    } catch (err) {
      console.error(err);
    }
  });
  return fileName;
};

export default createDoc;
