const { json } = require('body-parser');
const { Console } = require('console');
const express = require('express');
const multer = require('multer');
const app = express();
const ApplicationError = require('./Exceptions/applicationError');


app.use(express.json())
const uploadConfig = require('./upload/uploadconfig');
const { request } = require('http');
const { sign } = require('jsonwebtoken');
const { verify } = require('jsonwebtoken');

const uploadMiddleware = multer(uploadConfig);
app.use('/imagens',express.static(uploadConfig.directory));


function monitorarRequisicoes(request,response,next){
    const {method , url, params, body, query} = request;

    const texto = `[${method} - ${url}] - params: ${JSON.stringify(params)}
       - body: ${JSON.stringify(body)}  - query ${JSON.stringify(query)}`;

       console.log(texto);

       return next();
}

function validaToken(request,response,next){
    const authorizationHeader = request.headers.authorization;
    if(!authorizationHeader){
        throw new ApplicationError('Nenhun token enviado')
    }

    const [,token] = authorizationHeader.split(' ');
    try {
        const tokenCodificado  = verify(token, 'minha_chave_secreta');
        const {sub} = tokenCodificado;
        return next();

    } catch  {
        throw new ApplicationError('Erro ao verificar token')

    }
}

app.use(monitorarRequisicoes);
app.use(validaToken);


app.post('/autenticacao', (request, response) =>{
    const {email, senha} = request.body;

    const idUsuario = 'XPTO';
    const token = sign({

    }, 'minha_chave_secreta',{
        subject: idUsuario,
        expiresIn: '1d'
    });
    return response.json({token});
});


app.get('/disciplinas', (request, response)=>{
    return response.json({
        message: "Nessa rota devo consultar uma disciplina!"
    });
});

app.post('/disciplinas',uploadMiddleware.single('avatar'), (request, response)=>{
    const body = request.body;
    return response.json(body)
});


app.put('/disciplinas/:id',monitorarRequisicoes,(request, response)=>{
   const {id} = request.params;
   if(id != "tecnologia"){
    return response.status(400).json({
        message:"Disciplina não encontrada"
    })
   }

   return response.json({id})
});


app.delete('/disciplinas',(request, response)=>{
    return response.json({
        message: "Nessa rota devo deletar uma disciplina!"
    });
});




app.post('/perfil', uploadMiddleware.single('avatar'), function(request,response,next){

})

app.post('/fotos/upload', uploadMiddleware.array('images', 12), function(request,response,next){
    
})

let cpUpload = uploadMiddleware.fields([{name:'avatar', maxCount: 1}, {name:'galeria', maxCount: 8}])
app.post('/imagem-perfil', cpUpload,function(request,response,next){

})

app.listen(3000);