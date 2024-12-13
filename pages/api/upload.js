import formidable from 'formidable';

var mv = require('mv');


export const config = {
    api: {
       bodyParser: false,
    }
};
 
export default async function handler (req, res)  {
    
    const form = formidable({})
    form.parse(req,(err,fields,files) => {
      const oldFilePath = files.file[0].filepath;
      const newFilePath = `${process.cwd()}/public/uploads/${files.file[0].originalFilename}` 
      mv(oldFilePath,newFilePath,{mkdirp: true}, error => console.log(error))
      res.status('200').json({msg : newFilePath})
    })
   
    
}
