const express = require("express");

const ffmpeg = require("fluent-ffmpeg");

const fileUpload = require("express-fileupload");

const app = express();


app.get('/' , (req , res)=>{
    res.sendFile(__dirname + '/index.html')
})

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}))

ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe");

app.post("/anyToMp3" , (req, res)=>{
    res.contentType('audio/mp3');
    res.attachment("output.mp3");

    //uploaded file by the user 
    req.files.mp4.mv("tmp/" + req.files.mp4.name , function(err){
        if(err) return res.sendStatus(500).send(err);
        console.log("file uploaded successfully "); 
    });

    //converting any to mp3 

    ffmpeg("tmp/" + req.files.mp4.name)
    .toFormat("mp3")
    .on("end" , function() {
        console.log("done")
    })
    .on("error" , function (error) {
        console.log("an unknown error occured" + error.message)
    })
    .pipe(res , {end:true})
})



app.listen(5000 , ()=>{
    console.log("server is listening on port 5000")
})