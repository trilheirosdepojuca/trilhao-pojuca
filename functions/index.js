const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const admin = require("firebase-admin");

const {
  MercadoPagoConfig,
  Preference,
  Payment
} = require("mercadopago");

admin.initializeApp();

const db = admin.firestore();

const mpToken = defineSecret("MP_ACCESS_TOKEN");


// ==========================================
// CRIAR PAGAMENTO
// ==========================================

exports.criarPagamento = onRequest(
{
   secrets:[mpToken]
},

async(req,res)=>{

const client =
new MercadoPagoConfig({

accessToken:
mpToken.value()

});

res.set("Access-Control-Allow-Origin","*");
res.set("Access-Control-Allow-Methods","GET, POST, OPTIONS");
res.set("Access-Control-Allow-Headers","Content-Type");

if(req.method==="OPTIONS"){
   return res.status(204).send("");
}

try{

const {
nome,
telefone,
cidade,
moto,
observacoes
}=req.body;


const preference =
new Preference(client);

const response =
await preference.create({

body:{

items:[{
title:`Inscrição Trilhão - ${nome}`,
quantity:1,
currency_id:"BRL",
unit_price:60
}],

external_reference:telefone,

metadata:{
nome,
telefone,
cidade,
moto,
observacoes
},

payer:{
name:nome,
email:"comprador@email.com"
},

notification_url:
"https://us-central1-trilhao-pojuca.cloudfunctions.net/webhookMercadoPago",

back_urls:{
success:"https://trilheirosdepojuca.github.io/trilhao-pojuca/",
failure:"https://trilheirosdepojuca.github.io/trilhao-pojuca/",
pending:"https://trilheirosdepojuca.github.io/trilhao-pojuca/"
}

}

});

res.status(200).json({
url:response.init_point
});

}catch(error){

console.error(error);

res.status(500).json({
error:error.message
});

}

});



// ==========================================
// WEBHOOK
// ==========================================

exports.webhookMercadoPago = onRequest(
{
  secrets:[mpToken]
},

async(req,res)=>{

const client =
new MercadoPagoConfig({

accessToken:
mpToken.value()

});

try{

const paymentId =
req.query["data.id"];

if(!paymentId){
return res.status(200).send("ok");
}

const payment =
new Payment(client);

const data =
await payment.get({

id:paymentId

});

if(data.status==="approved"){

const meta =
data.metadata;

await db
.collection("inscritos")
.doc(meta.telefone)
.set({

nome:meta.nome,
telefone:meta.telefone,
cidade:meta.cidade,
moto:meta.moto,
observacoes:meta.observacoes,

pagamento:"PIX",

status:"Pago",

createdAt:
admin.firestore.FieldValue.serverTimestamp()

});

}

res.status(200).send("ok");

}catch(error){

console.error(error);

res.status(500).send(error.message);

}

});