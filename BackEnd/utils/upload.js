import multer from 'multer';

const storageProfile = multer.diskStorage({
    destination : function(req, file, cb){
        const uploadDir = 'uploads/Profiles'
        cb(null,uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
export const Image = multer({storage : storageProfile}).single('photo');

const storageHostelImg = multer.diskStorage({
    destination : function(req, file, cb){
        const uploadDir = 'uploads/HostelImages'
        cb(null,uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
export const HostelImage = multer({storage : storageHostelImg}).array('photo', 10);

const storageRoomImg = multer.diskStorage({
    destination : function(req, file, cb){
        const uploadDir = 'uploads/RoomImages'
        cb(null,uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
export const RoomImage = multer({storage : storageRoomImg}).array('photo', 10);







