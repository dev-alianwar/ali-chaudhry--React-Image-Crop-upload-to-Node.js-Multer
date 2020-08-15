import React, { useState,  useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {useDropzone} from 'react-dropzone';
import 'react-image-crop/dist/ReactCrop.css';
import ReactCrop from 'react-image-crop';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Paper, CircularProgress, Backdrop, Typography, FormControl, TextField, Modal, Fade, Card, FormLabel } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import CancelIcon from '@material-ui/icons/Cancel';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { extractImageFileExtensionFromBase64, getCroppedImg, base64StringtoFile } from './../helpers';


const useStyles = makeStyles(theme => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    breadCrumbsContainer:{
      backgroundColor:'#707070',  
      padding:'30px 10%',
      [theme.breakpoints.down('sm')]: {
        padding:'5px  2%'

      }
    },
    icon: {
      marginRight: theme.spacing(0.5),
      width: 20,
      height: 20,
    },
    formControl: {
      display:"block",
      marginTop:theme.spacing(2),
      marginBottom:theme.spacing(2)
    },
    label:{
      display:'block'
    },
    inputImages: {
      display: 'none',
    },
    textField: {
      display:"block",
      marginTop:theme.spacing(2),
      marginBottom:theme.spacing(2)
    },
    radioGroup: {
      display: 'flex',
    },
      paper:{
        padding:theme.spacing(3),
        marginTop:theme.spacing(2),
        marginBottom:theme.spacing(10),
        maxWidth:'800px',
        marginRight:'auto',
        marginLeft:'auto',
        boxShadow: theme.shadows[5],
      },
      paperBlack:{
        backgroundColor:"#000",
        padding:theme.spacing(3),
        marginTop:theme.spacing(2),
        marginBottom:theme.spacing(2),
        maxWidth:'800px',
        marginRight:'auto',
        marginLeft:'auto',
        boxShadow: theme.shadows[5],
      },
      button:{
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: 0,
        marginTop:theme.spacing(2),
        color: 'white',
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      },
      thumbsContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16
      },
      thumb: {
        position: 'relative',
        maxWidth: 345,
        marginBottom: 8,
        marginRight: 8,
        width: 100,
        height: 100,
        padding: 4,
      },
      thumbAddMore: {
        position: 'relative',
        justifyContent:'center',
        textAlign:'center',
        alignItems:'center',
        maxWidth: 100,
        marginBottom: 8,
        marginRight: 8,
        width: 100,
        height: 100,
        padding: 4,
      },
      addMore:{
        position: 'absolute',
        top:'25%',
        left:'25%',
        height:'50%',
        width:'50%',
        color:'#ccc',
        backgroundColor:"#fff",
        boxShadow:'none',
        '&:hover':{
          backgroundColor:"#fff",
        }
      },
      removeBtn:{
        position: 'absolute',
        top:5,
        right:5,
        zIndex:100,
        '&:hover':{
          backgroundColor:'#fff',
          opacity:1,
        },
        backgroundColor:'#ccc',
        opacity:1,
        padding:2
      },
      deleteIcon:{
          opacity:1,
          fontSize:16,
      },
      img: {
      height: '100px',
    },
    croppingCard:{
      maxHeight:'100vh'
    },
    cropper:{
      position:'relative',
      maxHeight:'90vh'
    }, 
    canvas:{
      display:'none'
    },
    duration:{
      display:'inline',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    durationField:{
      width:'50px',
    }, 
    policyLinks:{
      textDecoration:'none',
      display:'block'
    }
}));


 


function MulipleUploads(){
    const classes = useStyles();
    const [open, setOpen] = useState(false);  
    const [errors, setErrors] = useState({});  
    const [processing, setProcessing] = useState(false);  

    const [values, setValues] =  useState({
      title:'',
    });
    
    const [myFiles, setMyFiles] = useState([]);
    // Files uploaded for validation and before crop
    const [files, setFiles] = useState([]);
    // Set File Name, Source and Extension before converting to imageBase64Data 
    const [src, setSrc] = useState({
      fileName:null,
      imgSrc:null,
      imgSrcExt: null
    });

    const [name, setname] = useState('');

    // Setting default crop area
    const [crop, setCrop] = useState({ 
        unit: 'px',
        aspect: 1/1,
        width: 400,
        height:400
    });

    const [ cropped, setCropped] = useState({});

    // Images after getting crop
    const [croppedImages, setCroppedImages] = useState([]);

    const [imageForCanvas, setImageForCanvas] = useState({});


   // Set canvas for cropped Image
    const imagePreviewCanvasRef = useRef();
      
    const handleOpen = () => {
          setOpen(true);
        };

    const handleClose = () => {
          setOpen(false);
        };


    const { getRootProps, getInputProps} = useDropzone({
        onDrop: acceptedFiles => {
        handleOpen();
        setFiles(acceptedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        })));

        // imageBase64Data 
        const currentFile = acceptedFiles[0]
        const myFileItemReader = new FileReader()
      
       

         myFileItemReader.addEventListener("load", ()=>{
           //  console.log('Result',myFileItemReader.result)
        const myResult = myFileItemReader.result;
        const fileNameWithoutExt = currentFile.name.split('.').slice(0, -1).join('.');
        
      
        setSrc({
                name:fileNameWithoutExt,
                imgSrc: myResult,
                imgSrcExt: extractImageFileExtensionFromBase64(myResult)
             })
         }, false);
  
      }
    });
    

 
const handleOnCropChange = (crop) => {  
    setCrop(crop);   
    setCropped(crop);

  }


const handleImageLoaded = (image) => {
  const id = uuidv4();
  setname(id);  
  setImageForCanvas(image);
};
const getCanvasImage = () => {
  const image = imageForCanvas;
  const crop = cropped;

  const canvasRef = imagePreviewCanvasRef.current;


  getCroppedImg(image, crop, canvasRef);

}

const onDoneCropping = imageFile => {
    myFiles.push(imageFile);
}

const croppedImageToDisplay = src => {
  const fileToPush = {
    'fieldname': 'solImage',
    'name':name,
    "type":"image/jpeg",
    "href":src
  }
  console.log(fileToPush);
  setCroppedImages([...croppedImages, fileToPush]);
}

  const handleDone = (event) => {
    event.preventDefault();
    handleClose();
    getCanvasImage();
    const imgSrc  = src.imgSrc;
    const imgSrcExt =  src.imgSrcExt;
    const canvasRef = imagePreviewCanvasRef.current;
    if (imgSrc) {
       
        const imageData64 = canvasRef.toDataURL('image/' + imgSrcExt)
        const myFileName = name +'.'+ imgSrcExt;
 
        // file to be uploaded
        const myNewCroppedFile = base64StringtoFile(imageData64, myFileName)
    
        // Adding Images into the State Array of Images

        myNewCroppedFile.fieldname = "postImage";
       
        console.log('postImage :', myNewCroppedFile)
        
         onDoneCropping(myNewCroppedFile);
     

        let reader = new FileReader();
           reader.onload = (myNewCroppedFile) => {
            console.log('Cropped file result',myNewCroppedFile.target.result); 
              croppedImageToDisplay(myNewCroppedFile.target.result);
               
            };
          
          reader.readAsDataURL(myNewCroppedFile);
      
       //console.log('All cropped Images', croppedImages);
       // clear all files
        setFiles([]);
    }
}

  const uploadedImageForCrop = files.map(file => (
      <div className={classes.croppingCard} key={file.name}>
       
        <ReactCrop className={classes.cropper} src={file.preview} crop={crop}
        onChange={handleOnCropChange}
        onImageLoaded ={handleImageLoaded}
         /> 
  <div className="row px-5">
  <Button variant="contained" color="secondary" className="btn btn-danger mx-1" type="button" onClick={ () =>
          { handleClose();
            setFiles([]);
          }}> Cancel </Button> 
  <Button variant="contained" color="default" type="button" onClick={handleDone}> Done </Button>
  </div>
    
      </div>
    ));
  

  
   const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value });
   }


   const handleRemoveImage = (name) => {
     console.log('remove this image', name)
    const newArray = croppedImages.filter(item => item.name !== name)
    setCroppedImages(newArray);
     const newFiles = myFiles.filter(item => item.name !== name+'.jpeg')
    setMyFiles(newFiles);

    console.log('my files:', newFiles);
  }

  const handleSubmit = (e) => {
        e.preventDefault();
        const {title } = values;
        const data = new FormData();
        myFiles.map(file => {data.append('productImage', file)});
        
        data.append('title', title);
    
       console.log(croppedImages, myFiles);
      }


      const thumbs = croppedImages.map(file => (
        <Card className={classes.thumb} key={file.name}>
        <IconButton onClick={() => handleRemoveImage(file.name)} aria-label="delete" className={classes.removeBtn}>
          <CancelIcon className={classes.deleteIcon}/>
        </IconButton>  
         <img
            name={file.name}
            src={file.href}
            className={classes.img}
            alt="logo"
          />
       </Card>
      ));
  

    return (
        <div> 
        <Backdrop  className={classes.backdrop} open={processing}>
          {processing? <CircularProgress/> : null }
        </Backdrop>
        

        <Paper className={classes.paper}>
           <form onSubmit={handleSubmit}>
           <FormControl className={classes.formControl}> 
           <TextField
                  label="Title"
                  placeholder="Write title here..."
                  name="title"
                  type="text"
                  value={values.title}
                  fullWidth
                  className={classes.textField}
                  error={errors.title? true: false}
                  InputLabelProps={{
                      shrink: true,
                    }}
                  onChange={handleChange('title')}
                  helperText={errors.title? errors.title: "Title is rquired**"}
            />
          </FormControl>

      
      
    
<section className="container">
  <InputLabel className={classes.label}>Upload Images</InputLabel>
        {croppedImages.length === 0 ?
      <div {...getRootProps({className: 'dropzone'})}>
        <input type="file" name="images" {...getInputProps()} />   
        <IconButton color="primary" aria-label="upload picture" component="span">
          <PhotoCamera />
        </IconButton>
      </div>
      : null }

      <aside className={classes.thumbsContainer}>
      {thumbs}      
        {croppedImages.length > 0 && croppedImages.length < 6 ? 
        <div {...getRootProps({className: 'dropzone'})}>
          <input type="file" name="images" {...getInputProps()} />
        <Card className={classes.thumbAddMore}>
        <Fab className={classes.addMore} aria-label="add" ><AddIcon /></Fab>
        </Card>
        </div>
          : null
      }

      </aside>

    {errors.images ? 
    <Typography color="secondary">{errors.images}</Typography>
    : null}
    </section>
   

    <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
      >
        <Fade in={open}>
          <Paper className={classes.paperBlack}>
          <aside className={classes.thumbsContainer}> 
            {uploadedImageForCrop}
            </aside>
          </Paper>
        </Fade>
      </Modal>
    
    <canvas className={classes.canvas} ref={imagePreviewCanvasRef}></canvas>
    
   
     


            <Button className={classes.button} variant="contained" color="secondary" type="submit">Save</Button>
                  
          </form>
        </Paper>
        </div>
        );



}

export default MulipleUploads;


