import express  from 'express';


const app = express()
const Port = process.env.SERVER_PORT || 8080;


app.get('/', (req, res) => {
    res.send('Hello World!') 
})


app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});
