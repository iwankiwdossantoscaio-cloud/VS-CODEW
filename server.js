// Servidor local opcional: permite executar C, C++ e Java de verdade (precisa de gcc/g++/javac instalados).
const http=require('http'),fs=require('fs'),os=require('os'),path=require('path'),{spawn}=require('child_process');
const run=(cmd,args,cwd,input='')=>new Promise(r=>{let o='',er='';const p=spawn(cmd,args,{cwd,timeout:10000});
  p.stdout.on('data',x=>o+=x);p.stderr.on('data',x=>er+=x);p.stdin.on('error',()=>{});
  p.on('error',()=>r({o,er:`"${cmd}" não encontrado no PATH. Instale o compilador.`,code:127}));
  p.on('close',c=>r({o,er,code:c}));p.stdin.end(input)});
http.createServer((q,s)=>{
  if(q.method==='GET')return fs.readFile(path.join(__dirname,'index.html'),(e,d)=>{s.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});s.end(d)});
  // bloqueia outros sites de chamarem /run (CSRF / DNS rebinding)
  if(q.method!=='POST'||q.url!=='/run'||q.headers['content-type']!=='application/json'||!/^(localhost|127\.0\.0\.1):3000$/.test(q.headers.host||''))return s.writeHead(403).end();
  let b='';q.on('data',c=>b+=c);q.on('end',async()=>{
    const {e,code,stdin}=JSON.parse(b),d=fs.mkdtempSync(path.join(os.tmpdir(),'vs-'));let c1,c2;
    if(e==='java'){const cn=(code.match(/public\s+class\s+(\w+)/)||[0,'Main'])[1];fs.writeFileSync(path.join(d,cn+'.java'),code);c1=['javac',[cn+'.java']];c2=['java',[cn]]}
    else{fs.writeFileSync(path.join(d,'main.'+e),code);c1=[e==='c'?'gcc':'g++',['main.'+e,'-o','prog.exe','-lm']];c2=[path.join(d,'prog.exe'),[]]}
    let r=await run(...c1,d);
    if(r.code===0){const r2=await run(...c2,d,stdin);r={o:r2.o,er:r.er+r2.er,code:r2.code}}
    fs.rmSync(d,{recursive:true,force:true});
    s.writeHead(200,{'Content-Type':'application/json'});s.end(JSON.stringify({out:r.o,err:r.er,code:r.code}));
  });
}).listen(3000,'127.0.0.1',()=>console.log('Abra http://localhost:3000'));
