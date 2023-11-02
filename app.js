const express = require('express');
const bodyParser = require('body-parser');
const request = require("request");
const dot = require('dotenv')

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
dot.config();

app.get("/",(req,res)=>{
    // res.render("index",{ weather: null, error: null });
    res.render("form",{weather:null,disp:false,greet:""});
})


app.post("/", async (req,res)=>{
    let city = req.body.city;
    console.log(process.env.api)
    const response =  await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.api}`);    
    const data =  await response.json();
    console.log(data)
    if(data.main == undefined){
        res.send("Error Please try again");
    }else if(data.cod ==401){
            console.log("Erroe in Fetching data Enter a valid API key");
    }else{
        let weather ={};
        weather.cityName= data.name + ","+ data.sys.country;
        weather.temperature = data.main.temp;
        weather.description = data.weather[0].description;
        weather.windspeed =  data.wind.speed;
        weather.humidity = data.main.humidity;
        weather.min = data.main.temp_min;
        weather.max = data.main.temp_max;
        weather.feels = data.main.feels_like;

        
         const date = new Date();  
         const time = date.getHours(); 
         let greet;

        if(time > 0 && time < 12)
        {greet = "Good Morning";}  
        else if(time >= 12 && time < 16 )
        {greet = "Good Afternoon";} 
         else if(time >= 16 && time < 21 )
         {greet = "Good Evening";} 
        else if(time >= 21 && time <= 24)
        {greet= "Good Night";} 
        weather.hours = time;
        weather.minutes = date.getMinutes();
        
        res.render("form",{weather:weather,disp:true,greet:greet});
    }

})
            
            
app.listen(3000,()=>{
    console.log("App started on port 3000");
})