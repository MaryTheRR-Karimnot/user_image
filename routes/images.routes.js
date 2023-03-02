let express = require('express'),
    multer = require('multer'),
    mongoose = require('mongoose'),
    uuid = require('uuid'),
    router = express.Router();

const DIR = './public/';
const fs = require('fs');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuid.v4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if(file.mimetype ==  "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"){
            cb(null, true)
        }else{
            cb(null, false);
            return cb(new Error('Solo archivos .png, .jpg y .jpeg.'));
        }
    }
});

let Image = require('../models/Image');

router.post('/upload-image', upload.single('profileImg'), (req, res, next) => {
    Image.findOne({user_id: req.body.user_id}).then(data=>{
        if(data){
            const filename = data.profileImg
            fs.unlinkSync(DIR + filename);
            Image.findOneAndDelete({user_id: data.user_id}).then(data=>{
                if(data){
                    const image = new Image({
                        _id: new mongoose.Types.ObjectId(),
                        user_id: req.body.user_id,
                        profileImg: req.file.filename 
                    });
                    image.save().then(result => {
                        res.status(201).json({
                            message: "Imagen carga correctamente",
                            imageCreated: {
                                _id: result._id,
                                profileImg: result.profileImg
                            }
                        })
                    }).catch(err => {
                        console.log(err),
                        res.status(500).json({
                            error: err
                        })
                    })   
                }
            });
        }else{
            const image = new Image({
                _id: new mongoose.Types.ObjectId(),
                user_id: req.body.user_id,
                profileImg: req.file.filename 
            });
            image.save().then(result => {
                res.status(201).json({
                    message: "Imagen carga correctamente",
                    imageCreated: {
                        _id: result._id,
                        profileImg: result.profileImg
                    }
                })
            }).catch(err => {
                console.log(err),
                res.status(500).json({
                    error: err
                })
            })      
        }
    })
})

router.get("/", (req, res, next) => {
    Image.find().then(data => {
        res.status(200).json({
            message: "Lista de usuarios",
            images: data
        });
    });
});

router.get("/:id", (req, res, next) => {
    Image.findOne({user_id: req.params.id}).then(data=>{
        res.status(200).json({
            imageuser: data
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

module.exports = router;