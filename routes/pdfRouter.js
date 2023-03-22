const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const {
  zipfile,
  docToPdf,
  pdfToDoc,
  compressPdf,
} = require("../controllers/pdfController");

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
router.post("/upload", upload.single("file"), (req, res) => {
  res.send(`/${req.file.path}`);
});

router.post("/zip", upload.single("file"), zipfile);
router.post("/doctopdf", upload.single("file"), docToPdf);
router.post("/pdftodoc", upload.single("file"), pdfToDoc);
router.post("/compresspdf", upload.single("file"), compressPdf);

module.exports = router;
