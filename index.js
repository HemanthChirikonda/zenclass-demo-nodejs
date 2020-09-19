const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const mongodb= require('mongodb');
const mongodbClint= mongodb.MongoClient;
const cors= require('cors');
const url = 'mongodb+srv://hemanth:OHoCYn9ztyvAKrdH@cluster0.v7ugo.mongodb.net?retryWrites=true&w=majority';
app.use(cors({
    origin:'https://relaxed-swanson-d0f3d4.netlify.app'
}))
app.use(bodyParser.json());
const port= 3030;





class student{
    constructor(name,age){
this.name=name;
this.age=age;
    }
}

class mentor{
    constructor(name,number,specialization,email){
       this.name=name;
       this.contact_number= number;
       this.specialization= specialization;
       this.email= email;
       this.assienedStudents=[];

    }

}
app.get('/', (req, res) => {
   // res.send('Hello World!')
    res.json({
        "message":"hello"
    })
  })

app.post('/student', async(req,res)=>{
       try {
        let client = await mongodbClint.connect(url);
        let db= client.db('zenclassDemo');
       //let data= await req.body.json();
       let student= await db.collection('students').insertOne({name: req.body.name});
        client.close();
        //console.log(student)
        res.json({
            "message":"student created",
            "id":student.insertedId
           })
       } catch (error) {
          // console.log(error);
         res.json({
             "message":error
         })  
       }
})
app.post('/mentor', async(req,res)=>{
    try {
     let client = await mongodbClint.connect(url);
     let db= client.db('zenclassDemo');
    let mentor= await db.collection('mentors').insertOne(req.body);
     client.close();
     //console.log(mentor)
     res.json({
      "message":"mentor created",
      "id":mentor.insertedId
     })
    } catch (error) {
        //console.log(error);
      res.json({
          "message":error
      })  
    }
})
app.get("/students", async (req,res)=>{
try {
    let client = await mongodbClint.connect(url);
    let db= client.db('zenclassDemo');
   let students= await db.collection('students').find().toArray();
    client.close();
   // console.log(student)
    res.json(students)
} catch (error) {
  res.json({
      "message":error
  })
}
})
app.get("/mentors", async (req,res)=>{
    try {
        let client = await mongodbClint.connect(url);
        let db= client.db('zenclassDemo');
       let mentors= await db.collection('mentors').find().toArray();
        client.close();
        //console.log(mentors)
        res.json(mentors)
    } catch (error) {
      res.json({
          "message":error
      })
    }
    })

    app.post('/updatementor', async(req,res)=>{
        try {
         let client = await mongodbClint.connect(url);
         let db= client.db('zenclassDemo');
         console.log(req.body.student._id);
         console.log(req.body.mentor._id)
        let student= await db.collection('students').updateOne({_id:req.body.student._id},{$set:{"mentorId":mongodb.ObjectId(req.body.mentor._id)}})
         client.close();
         //console.log(student)
         res.json({
             "message":"Mentor assigned",
             "id":student.insertedId
            })
        } catch (error) {
          //  console.log(error);
          res.json({
              "message":error
          })  
        }
 })

 app.post('/assignmentor', async(req,res)=>{
    try {
     let client = await mongodbClint.connect(url);
     let db= client.db('zenclassDemo');
     console.log(req.body.student._id);
     console.log(req.body.mentor._id)
    let student= await db.collection('students').findOneAndUpdate({_id:mongodb.ObjectId(req.body.student._id)},{$set:{"mentorId":mongodb.ObjectId(req.body.mentor._id)}});
    let mentor= await db.collection('mentors').findOneAndUpdate({_id:mongodb.ObjectId(req.body.mentor._id)},{$push:{"students":mongodb.ObjectId(req.body.student._id)}})
     client.close();
    
     //console.log(student)
     res.json({
         "message":"Mentor assigned",
         "id":student._Id
        })
    } catch (error) {
       // console.log(error);
      res.json({
          "message":error
      })  
    }
})
app.listen(process.env.PORT||port, () => {
    console.log('server started')
  })




