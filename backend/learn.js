const fs = require('fs');
const ps = require('fs').promises;

//executes without blocking other task
setTimeout(() => {
    console.log("loading...");
},1000);

//callback
fs.readFile('example.txt','utf8', (err,data) => {
    if(err){
        console.log("Error :",err);
        return;
    }
    console.log("content: ",data);
});

//promises
ps.readFile('example.txt','utf8')
.then(data=> console.log("File content:", data))
.catch(err=> console.log("Error found :", err));

//async
async function readFile() {
    try{
        const data = await ps.readFile('example.txt', 'utf8');
        console.log("data :", data);
    } catch(err){
        console.log("error in reading :", err);
    }
}
readFile();