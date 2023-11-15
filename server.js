const app = require('./app');
const mongoose = require('mongoose');
const userModel = require('./model/user_model');

app.get('/', (req, res) =>{
    res.send("Hello world!");
})

const port = 7000;
mongoose.connect('mongodb+srv://tanbir:tanbir114@cluster0.bb4slcn.mongodb.net/?retryWrites=true&w=majority')
.then(client => {
    app.listen(port, ()=>{
        console.log(`Server listening on port http://localhost: ${port}`)
    });
    console.log('Connected!');
})
.catch(err =>{
    console.log('Error connecting');
    console.log(err);
    throw err;
});