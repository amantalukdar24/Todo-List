const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const app=express();
mongoose.connect("mongodb://127.0.0.1:27017/todo")
        .then(()=>{
            console.log("Mongo Connected");})
        .catch(err=>console.log(`Mongo error ${err}`));
const todoSchema=new mongoose.Schema({
    
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
});
const Todo=mongoose.model('todo',todoSchema);


app.use(cors());
app.use(express.urlencoded({extended:false}));

app.get('/',async (req,res)=>{
 const allTodo=await Todo.find({});
  const html=`
  <html>
  <h1><b>Todo List</b></h1>
  <ol>
       ${ 
        allTodo.map((ele)=>{
            if(ele.description!="")
            {
              return `<li><div><h3>${ele.title}--(Task_id:${ele._id})</h3></div><div>➡️${ele.description}</div></li></br>`
            }
            else{
                return `<li><div>${ele.title}</li></div></br>`
            }
        
        }).join('')
       }
  </ol>
  </html>

  `;
  return res.send(html);
});
app.post('/addTodo',async (req,res)=>{
    await Todo.create({
        title:req.body.title,
        description:req.body.description,
    });
    
        return res.status(201).json({newTodo:"Todo Added successfully"});
    
   
   
});
app.patch('/updateTodo/:id',async (req,res)=>{
    await Todo.findByIdAndUpdate(req.params.id,{
         title:req.body.title,
         description:req.body.description,
    });
    return res.send({updated:"updated succesfully"});
});
app.delete("/deleteTodo/:id",async (req,res)=>{
    await Todo.findByIdAndDelete(req.params.id);
    return res.send({delete:" Todo deleted sucessfully"});
});
app.get('/api/data',async (req,res)=>{
    const data=await Todo.find({});
    return res.json(data);
})
app.listen(3000,()=>{
    console.log(`Server is running on the port 3000`);
});