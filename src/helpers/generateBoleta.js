import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client.js";
import moment from "moment/moment.js";

const createDoc = (data, document = "boleta") => {
  const doc = new PDFDocument();
  const fileName = `${document}-${Date.now()}.pdf`;
  const filePath = `./dte/${fileName}`;
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);
  stream.on("error", (err) => {
    console.error("Stream encountered an error:", err);
  });
  // Logo - ensure you have a logo.png file in your project root or adjust the path as needed
  const logoPath = path.join("./", "assets", "logo-full.png");
  let borderX = 50; // X coordinate of the border's starting point
  let borderY = 50; // Y coordinate of the border's starting point

  // Draw the square border

  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, borderX, borderY, { width: 200 }).moveDown(0.5);
  }
  borderY += 70;

  doc.fontSize(12).text("Nombre:", borderX, borderY);
  doc.fontSize(12).text("Farmacias Oxfar", borderX + 300, borderY);
  borderY += 30;
  doc.fontSize(12).text("Direccion:", borderX, borderY);
  doc
    .fontSize(12)
    .text("Antonio Bellet 147, Providencia", borderX + 300, borderY);
  borderY += 30;
  doc.fontSize(12).text("Fono:", borderX, borderY);
  doc.fontSize(12).text("+56 2 2437 0237", borderX + 300, borderY);
  borderY += 30;
  doc.fontSize(12).text("Rut emisor:", borderX, borderY);
  doc.fontSize(12).text("77.278.722-7", borderX + 300, borderY);
  borderY += 30;
  doc.fontSize(12).text("Fecha:", borderX, borderY);
  doc
    .fontSize(12)
    .text(
      moment().tz("America/Santiago").format("MM-YY-DD HH:mm:ss"),
      borderX + 300,
      borderY
    );
  borderY += 30;
  doc.fontSize(12).text("Forma de pago:", borderX, borderY);
  doc.fontSize(12).text("WebPay", borderX + 300, borderY);
  borderY += 30;
  doc.fontSize(12).text("Rut Cliente:", borderX, borderY);
  doc
    .fontSize(12)
    .text(data.Encabezado.Receptor.RUTRecep, borderX + 300, borderY);
  borderY += 70;
  // Billing Information Header
  doc
    .fontSize(20)
    .text("Detalle Productos", borderX, borderY)
    .fontSize(10)
    .moveDown();

  // Example Billing Details
  borderY += 30;
  const saveBorderX = borderX;
  const saveBorderY = borderY;
  let borderHeight = 0;

  borderY += 10;
  borderHeight += 10;

  doc.fontSize(12).text("Cant.", borderX + 30, borderY);
  doc.fontSize(12).text("Item", borderX + 150, borderY);
  doc.fontSize(12).text("Total", borderX + 300, borderY);
  borderY += 30;
  borderHeight += 30;
  data.Detalle.forEach((item, i) => {
    doc.fontSize(12).text(item.QtyItem, borderX + 30, borderY);
    doc.fontSize(12).text(item.NmbItem, borderX + 150, borderY);
    doc.fontSize(12).text(item.MontoItem, borderX + 300, borderY);
    borderY += 20;
    borderHeight += 20;
  });

  // Subtotal
  borderY += 50;
  borderHeight += 50;
  doc.text(
    `Monto Neto: $${data.Encabezado.Totales.MntNeto}`,
    borderX + 300,
    borderY
  );

  // Taxes (Assume a fixed rate for simplicity)

  borderY += 20;
  borderHeight += 20;
  doc.text(
    `IVA (19%): $${
      data.Encabezado.Totales.MntTotal - data.Encabezado.Totales.MntNeto
    }`,
    borderX + 300,
    borderY
  );

  // Total

  borderY += 20;
  borderHeight += 20;
  doc.text(
    `Valor a Pagar: $${data.Encabezado.Totales.MntTotal}`,
    borderX + 300,
    borderY
  );

  borderY += 30;

  doc.rect(saveBorderX, saveBorderY, 500, borderY - saveBorderY).stroke();

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
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully:", filePath);
        }
      });
    } catch (err) {
      console.error(err);
    }
  });
  return fileName;
};

export default createDoc;
