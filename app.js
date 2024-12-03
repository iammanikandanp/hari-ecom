const express = require('express')
const mongoose = require('mongoose')
require('ejs')
const Session = require('express-session')
const MongoDbSession = require('connect-mongodb-session')(Session)
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')


//port listens
const port = 5000
app.listen(port, () => {
    console.log('server runing on port: ', port)
})
//mongodb connection
mongoose.connect('mongodb+srv://akilanithila:akila2004@cluster0.ck0ia.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('server connected'))
    .catch((error) => console.log('server not connected', error))
//connect mongodb session
const Store = new MongoDbSession({
    uri: "mongodb+srv://akilanithila:akila2004@cluster0.ck0ia.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    collection: 'session'
})
app.use(Session({
    secret: 'maki-key',
    resave: false,
    saveUninitialized: false,
    store: Store
}))




//login page render
app.get('/login', (req, res) => {
    res.render('login')
})
//signup page render
app.get('/signup', (req, res) => {
    res.render('signup')
})
//addproduct page render
app.get('/addproduct', (req, res) => {
    res.render('addproduct')
})

//user register 
const userschema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    gender: { type: String, required: true },
    pincode: { type: Number, required: true }
})
const userModel = mongoose.model('hari userreg', userschema)

//register process
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password, phone, gender, pincode } = req.body
        if (name && email && password && phone && gender && pincode) {
            const fetchemail = await userModel.findOne({ email: email })
            if (fetchemail) {
                return res.render('fail', { message: 'Email is Already Exists' })
            }
            else {
                const tempuser = new userModel({
                    name: name,
                    email: email,
                    password: password,
                    phone: phone,
                    gender: gender,
                    pincode: pincode
                })
                const datasave = await tempuser.save()
                if (datasave) {
                    return res.render('success', { message: 'User Register Successfully!..' })
                } else {
                    return res.render('fail', { message: 'User Register Failed!..' })

                }

            }
        }
        else {
            return res.render('fail', { message: 'Please Provide All Details..' })

        }
    } catch (err) {
        return res.send({ success: false, message: "Trouble in Student Registration, please contact support team!" })
    }
})

//login process
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        if (email && password) {
            const fetchemail = await userModel.findOne({ email: email })
            if (fetchemail) {
                if (fetchemail.password === password) {
                    req.session.user = fetchemail.name
                    return res.render('success', { message: "login successfully" })
                }
                else {
                    return res.render('fail', { message: "Please provide correct password!" })
                }
            }
            else {
                return res.render('fail', { message: "Please provide correct email!" })
            }
        }
        else {
            return res.render('fail', { message: "Please provide all details!" })
        }
    } catch (err) {
        return res.send({ success: false, message: "Trouble in Student Registration, please contact support team!" })
    }
})

// product details
const productschema = mongoose.Schema({
    pctimg: { type: String, required: true },
    pctname: { type: String, required: true },
    pctdis: { type: String, required: true },
    pctprice: { type: String, required: true }
})
const pctModel = mongoose.model('hari pct', productschema)

//add product
app.post('/addpct', async (req, res) => {
    try {
        const { pctimg, pctdis, pctname, pctprice} = req.body
        if (pctimg && pctdis && pctprice && pctname) {
            const temppct = new pctModel({
                pctimg: pctimg,
                pctdis: pctdis,
                pctname: pctname,
                pctprice: pctprice
                
            })
            const datasave = await temppct.save()
            if (datasave) {
                return res.render('success', { message: 'Product Add Successfully!..' })
            } else {
                return res.render('fail', { message: 'Product Add Failed!..' })

            }
        }
        else {
            return res.render('fail', { message: 'Please Provide All Details..' })

        }
    } catch (err) {
        return res.send({ success: false, message: "Trouble in Student Registration, please contact support team!" })
    }
})

// home page

app.get('/', async(req, res) => {
    try{
      const pct=  await pctModel.find({})
      console.log(pct)
      return res.render('homes',{pct})
    }catch (err) {
        return res.send({ success: false, message: "Trouble in Student Registration, please contact support team!" })
    }
    
})

app.get('/a', async(req, res) => {
    try{
      const pct=  await pctModel.find({})
      console.log(pct)
      return res.render('adminhome',{pct})
    }catch (err) {
        return res.send({ success: false, message: "Trouble in Student Registration, please contact support team!" })
    }
    
})
app.get("/update/:id", async (req, res) => {
    try {
        const book = await bookmodel.findById(req.params.id); // Fetch book by ID
        res.render("bookupdate", { book }); // Pass the book to the update page
    } catch (err) {
        res.status(500).send("Error fetching book for update");
    }
});
//Admin update book using book id 
app.post("/update/:id", async (req, res) => {
    try {
        const { bookName, author, description, rating, price,story } = req.body;
        await bookmodel.findByIdAndUpdate(req.params.id, { bookName, author, description, rating, price,story });
        res.redirect("/adminhome"); // Redirect back to the home page
    } catch (err) {
        res.status(500).send("Error updating book");
    }
});

//Admin delete book using book id 
app.post("/delete/:id", async (req, res) => {
    try {
        await bookmodel.findByIdAndDelete(req.params.id); // Delete the book
        res.redirect("/adminhome"); // Redirect back to the home page
    } catch (err) {
        res.status(500).send("Error deleting book");
    }
});















