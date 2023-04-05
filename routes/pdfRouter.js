const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const {
  zipfile,
  docToPdf,
  pdfToDoc,
  compressPdf,
} = require("../controllers/pdfController");
const { uploadFile } = require("../services/imageService");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File not found" });
    }
    const url = await uploadFile(req);
    return res.status(200).json({ url });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/zip", upload.single("file"), zipfile);
router.post("/doctopdf", upload.single("file"), docToPdf);
router.post("/pdftodoc", upload.single("file"), pdfToDoc);
router.post("/compresspdf", upload.single("file"), compressPdf);

module.exports = router;
