
const http=require('http');
const hostname='127.0.0.1';
const port=1337;
http.createServer((req,res)=>{
    res.writeHead(200,{'Content-Type':'text/plain'});
    res.end('我的第一个node.js\n');
}).listen(port,hostname,()=>{
    console.log(`Server runing at http://${hostname}:${port}/`);
})