
module.exports = { 

singleUpload: async (req, res, next) => {



res.status(200).json("Upload single")

},

multipleUpload: async (req, res, next) => {



res.status(200).json("Upload Multiple")


},

}