const express = require('express')
const app = express()
const port = 3000;
const path = require('path');
const multer  = require('multer');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// configuring of file destination and name
let storagePath = "./uploads/";
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, storagePath));
  },
  filename: (req, file, cb) => {
    let date = new Date().toISOString().replaceAll(":", "-");
    cb(null, date + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use("/uploadImages",multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"), (req, res) => {
  res.json({
    location:
      "/uploads/" + req.file.filename,
  });
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
app.get('/', (req, res) => {
  res.render('./index.ejs')
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})