const http=require("http");
const fs=require("fs");
const requests=require("requests");

const homefile=fs.readFileSync("first.html","utf-8");
// console.log(html);
const replaceVal=(html,values)=>{
    let x=(values.main.temp-273.15).toFixed(2);
    let y=(values.main.temp_min-273.15).toFixed(2);
    let z=(values.main.temp_max-273.15).toFixed(2);
    let temprature=html.replace("{%tempval%}",x);
    temprature=temprature.replace("{%tempmin%}",y);
    temprature=temprature.replace("{%tempmax%}",z);
    temprature=temprature.replace("{%location%}",values.name);
    temprature=temprature.replace("{%country%}",values.sys.country);
    temprature=temprature.replace("{%status%}",values.weather[0].main);
    // console.log(temprature)
    return temprature;
}
var fillData;
const server=http.createServer((req,res)=>{
    // if(req.url=="/")
    // {
        // res.end("hello i am home");
    // }
    if(req.url=="/")
    {
        requests("http://api.openweathermap.org/data/2.5/weather?q=Surat&appid=e866fd44bcf3f84b2dc4f86c22388bbe")
            .on("data",(chunk)=>{
                // chank is jason form
                const objdata=JSON.parse(chunk);   //object not easily used by index so conver in array
                const arrData=[objdata];

                const realtimeData=arrData.map((val)=>replaceVal(homefile,val)).join("");
                // console.log(arrData[0].main.temp);

                // use map method in the array
                // console.log(fillData);
                res.write(realtimeData);
            }).on("end",()=>{
                res.end();
            });
    }
});
server.listen(8000,"127.0.0.1",()=>{
    console.log("server open 8000");
})
