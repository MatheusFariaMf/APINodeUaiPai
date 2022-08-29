const express = require('express')
const routes = express.Router()
var mercadopago = require('mercadopago');
mercadopago.configurations.setAccessToken('TEST-3887890302189225-071722-fdf1b0d18876c22526968209482ecc48-436213787');






/*let db = [
    {'1': {Nome: 'Cliente 1', Idade: '20' } },
    {'2': {Nome: 'Cliente 2', Idade: '30' } },
    {'3': {Nome: 'Cliente 3', Idade: '40' } }
]*/
let db = 
{
    "codigoEstabelecimento": 1000,
    "tipoEstabelecimento": "Hamburgueria",
    "descricaoTipo": "Descrição do tipo de estabelecimento",
    "nomeEstabelecimento": "Bar Budo - Horrível",
    "rua":"Rua do Bar",
    "numero": 1234,
    "complemento": "Complemento do Endereço",
    "bairro": "Bairro do Bar",
    "cidade": "Cidade do Bar",
    "estado": "Estado do Bar",
    "cep": "123456-789",
    "menu" : 
    [
         { 
            "codigoCategoria": 1,
            "nomeCategoria":"Bebidas", 
            "itens":
            [
                { 
                    "codigoProduto": 10,
                    "nomeItem":"Coca Cola Lata 375 ml",
                    "preco":3.80,
                    "linkImagem":"/imagens/bebidas/cocacola375ml.png",
                    "observacao": "Qualquer observação do produto",
                    "quantidade":400,
                    "unidade":"ml"
                },
                {
                    "codigoProduto": 20,
                    "nomeItem":"Tulipa Chop Kaiser",
                    "preco":8.50,
                    "linkImagem":"/imagens/bebidas/Tulipa300ml.png",
                    "observacao": "Qualquer observação do produto",
                    "quantidade":25,
                    "unidade":"ml"
                },
                { 
                    "codigoProduto": 30,
                    "nomeItem":"Suco de Laranja",
                    "preco":5.50,
                    "linkImagem":"/imagens/bebidas/sucolaranja.png",
                    "observacao": "Qualquer observação do produto",
                    "quantidade":10,
                    "unidade":"ml"
                }
            ]
        },
        { 
            "codigoCategoria": 2,
            "nomeCategoria":"Petiscos", 
            "itens":
            [
                { 
                    "codigoProduto": 40,
                    "nomeItem":"Porção de Fritas",
                    "preco":19.80,
                    "linkImagem":"/imagens/bebidas/porcaofritas.png",
                    "observacao": "Qualquer observação do produto",
                    "quantidade":30,
                    "unidade":"kg"
                },
                { 
                    "codigoProduto": 50,
                    "nomeItem":"Táboa de Frios",
                    "preco":58.50,
                    "linkImagem":"/imagens/bebidas/taboafrios.png",
                    "observacao": "Componentes: mussarela, azeitona, presunto picado, queijo parmesão",
                    "quantidade":20,
                    "unidade":"kg"
                }
            ]
        }
    ]
} 

// Buscar Dados
routes.get('/', (req, res) => {
    return res.json(db)
})


// Buscar Dados
routes.get('/teste', async (req, res) => {
    var response = await mercadopago.payment_methods.listAll();
    var payment_methods = response.body;
    return res.json(payment_methods)
})


routes.post('/preferencias', async (req, res) => {
    // Define o corpo da requisição
    const requisitionBody = JSON.parse(JSON.stringify(req.body));
    // Recebe os valores enviados pelo app em forma de uma superstring
    var titulosEmString = requisitionBody.title;
    var descricoesEmString = requisitionBody.description;
    var precosEmString = requisitionBody.unit_price;
    var quantidadesEmString = requisitionBody.quantity;
    var items = [];
    // Converte a superstring em vetores
    let titulosEmVetor = titulosEmString.split(',');
    let descricoesEmVetor = descricoesEmString.split(',');
    let precosEmVetor = precosEmString.split(',');
    let quantidadesEmVetor = quantidadesEmString.split(',');

    for (let i = 0; i < titulosEmVetor.length; i++) {
        items.push({
            title: titulosEmVetor[i],
            description: descricoesEmVetor[i],
            unit_price: parseFloat(precosEmVetor[i]),
            quantity: parseInt(quantidadesEmVetor[i])
        });
    }
    
    items.forEach(element => {
        console.log(element);
    });
    
    if(!requisitionBody)
        return res.status(400).end();

    // Cria um objeto de preferência
    let preference = {
        items: items,
        payer: {email: 'emailteste@email.com'}
    };
  
    //return res.json(requisitionBody);
    
  mercadopago.preferences.create(preference)
  .then(function(response){
  // Este valor substituirá a string "<%= global.id %>" no seu HTML
    global.id = response.body.id;
    console.log(global.id);
    return res.json(response.body);
  }).catch(function(error){
    console.log(error);
    return res.json(error);
  });
    
})


// Inserir Dados
routes.post('/add', (req, res) => {
    const body = req.body
    console.log(body)

    if(!body)
        return res.status(400).end()

    //db.push(body)
    return res.json(body)
})

routes.delete('/:id', (req, res) => {
    const id =  req.params.id

    let newDB = db.filter(item => {
        if(!item[id])
            return item
    })

    db = newDB

    return res.send(newDB)
})


module.exports = routes