import app from "./config/app";
import config from "./config";


const port = config.app.port;

app.listen(port, ()=>{
    console.log(`PORT IS ACTIVE AT ${port}`);
});