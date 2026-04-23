const multer = require('multer')

// storage rule

const storage = multer.diskStorage({

    destination : function(req , file , CallBack){
        CallBack(null , "public/uploads") // folder assign
    },

    filename : function(req , file , CallBack){
        CallBack(null , Date.now() + "-" + file.originalname)
    }
})


const upload = multer({storage})


module.exports = upload;