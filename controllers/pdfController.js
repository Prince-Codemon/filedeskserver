const zlib = require("zlib");
const fs = require("fs");
const libre = require("libreoffice-convert");
const path = require("path");
const docxConvertor = require("docx-pdf");
const rimraf = require("rimraf");
// const PDFDocument = require("pdf-lib").PDFDocument;
const { PDFDocument, StandardFonts } = require("pdf-lib");
const lzma = require("lzma-native");
libre.convertAsync = require("util").promisify(libre.convert);

const compressFile = async(exsistingToBytes,originalName)=>{
  const pdfDoc = await PDFDocument.load(exsistingToBytes)
  const compressedPdfBytes = await pdfDoc.save();
  fs.writeFileSync(originalName, compressedPdfBytes)
  

}
const zipfile = async (req, res) => {
  try {
    if(!req?.file){
      return res.status(400).json({ msg: "Invalid file type" });
    }
    const gzip = zlib.createGzip();
    const input = fs.createReadStream(req.file.path);
    const out = fs.createWriteStream(req.file.path + ".gz");
    input.pipe(gzip).pipe(out);
    out.on("finish", () => {
      console.log("done");
      return res.status(201).json({ path: req.file.path + ".gz" });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error });
  }
};

const docToPdf = async (req, res) => {
  try {
    if(!req?.file){
      return res.status(400).json({ msg: "Invalid file type" });
    }
    const file = req.file.path;
    const extension = path.extname(file);
    const fileName = path.basename(file, extension);
    if (extension !== ".docx" && extension !== ".doc") {
      return res.status(400).json({ msg: "Invalid file type" });
    }
    const ext = ".pdf";
    await docxConvertor(
      file,
      `uploads//${fileName}` + ".pdf",
      (err, result) => {
        if (err) {
          console.log(err);
        }
      }
    );
    return res.status(201).json({ path: fileName + ext });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error });
  }
};

const pdfToDoc = async (req, res) => {
  try {
    const file = req.file.path;
    const extension = path.extname(file);
    const fileName = path.basename(file, extension);
    if (extension !== ".pdf") {
      return res.status(400).json({ msg: "Invalid file type" });
    }
    const ext = ".docx";
    const output = `uploads//${fileName}` + ".docx";
    const outputDir = output + "_dir";

    await libre.convert(file, ext, undefined, async (err, done) => {
      if (err) {
        console.log(`Error converting file: ${err}`);
      }
      await new Promise((resolve) => rimraf(outputDir, resolve));
      fs.writeFileSync(output, done);
    });

    return res.status(201).json({ path: fileName + ext });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error });
  }
};

const compressPdf = async (req, res) => {
  try {
    // const inputPath = req.file.path;
    // const ext = path.extname(inputPath);
    // const outputPath = `uploads/${Date.now()}${ext}`;
    // console.log("inputPath: " + inputPath + " outputPath: " + outputPath);

    // // Load the input PDF file
    // const pdfDoc = await PDFDocument.load(fs.readFileSync(inputPath));

    // // Compress the PDF file using a compression level between 0 and 9
    // const compressedPdfBytes = await pdfDoc.save({
    //   useObjectStreams: false,
    //   useCompression: true,
    //   compress: { level: 6 },
    // });

    // // Write the compressed PDF file to the output directory
    // fs.writeFileSync(outputPath, compressedPdfBytes);

    // console.log("File compressed successfully");
    // return res.status(201).json({ path: outputPath });

    // const inputPath = req.file.path;
    // const ext = path.extname(inputPath);
    // const outputPath = `uploads/${Date.now()}${ext}`;
    // const readStream = fs.createReadStream(inputPath);
    // const writeStream = fs.createWriteStream(outputPath);
    // readStream
    //   .pipe(lzma.createStream("easyEncoder", { preset: 9 }))
    //   .pipe(writeStream);
    // writeStream.on("finish", () => {
    //   console.log("File compressed successfully");
    //   return res.status(201).json({ path: outputPath });
    // });

    // const inputPath = req.file.path;
    // const ext = path.extname(inputPath);
    // const outputPath = `uploads/${Date.now()}${ext}`
    // console.log(
    //   "inputPath: " + inputPath + " outputPath: " + outputPath
    // )
    // const readStream = fs.createReadStream(inputPath);
    // const writeStream = fs.createWriteStream(outputPath);
    // const gzip = zlib.createGzip();
    // readStream.pipe(gzip).pipe(writeStream);
    // writeStream.on("finish", () => {
    //   console.log("File compressed successfully");
    //   writeStream.close();
    //   return res.status(201).json({ path: outputPath });
    // });

    // writeStream.on("close", () => {
    //   console.log("Write stream closed");
    // });
    // fs.copyFile(inputPath, outputPath, (err) => {
    //   if (err) {
    //     console.error(err);
    //     return res.status(500).json({ error: "Failed to compress file." });
    //   }
    //   console.log("File compressed successfully");
    //   return res.status(201).json({ path: outputPath });
    // });
    console.log(req.file)
    const inputPath = req.file.path;
    const ext = path.extname(inputPath);
    const outputPath = `uploads/compressed/${Date.now()}${ext}`;
    const exsistingToBytes = fs.readFileSync(inputPath)
    compressFile(exsistingToBytes, outputPath)


    // readStream.pipe(gzip).pipe(writeStream);
    // readStream.on("error", (err) => {
    //   console.error(`Error reading input file: ${err}`);
    // });
    // writeStream.on("error", (err) => {
    //   console.error(`Error writing output file: ${err}`);
    // });
    // gzip.on("error", (err) => {
    //   console.error(`Error compressing data: ${err}`);
    // });
    // gzip.on("data", (chunk) => {
    //   console.log(`Received ${chunk.length} bytes of compressed data`);
    // });
    // writeStream.on("finish", () => {
    //   console.log("File compressed successfully");
    //   writeStream.close();
    //   return res.status(201).json({ path: outputPath });
    // });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error });
  }
};

module.exports = {
  zipfile,
  docToPdf,
  pdfToDoc,
  compressPdf,
};
