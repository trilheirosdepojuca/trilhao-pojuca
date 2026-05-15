const functions = require("firebase-functions");

const admin = require("firebase-admin");

const {
  MercadoPagoConfig,
  Preference,
  Payment
} = require("mercadopago");


admin.initializeApp();

const db = admin.firestore();


// ==========================================
// MERCADO PAGO
// ==========================================

const client = new MercadoPagoConfig({

  accessToken: "APP_USR-8741860237780270-051413-7c1cc91831bd8e11191a64d5313c3dbb-721433387"

});


// ==========================================
// CRIAR PAGAMENTO
// ==========================================

exports.criarPagamento = functions.https.onRequest(async (req, res) => {

  res.set("Access-Control-Allow-Origin", "*");

  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  res.set("Access-Control-Allow-Headers", "Content-Type");


  if (req.method === "OPTIONS") {

    return res.status(204).send("");

  }


  try {

    const {
      nome,
      telefone,
      cidade,
      moto,
      observacoes
    } = req.body;


    const preference = new Preference(client);


    const response = await preference.create({

      body: {

        items: [

          {
            title: `Inscrição Trilhão - ${nome}`,
            quantity: 1,
            currency_id: "BRL",
            unit_price: 60
          }

        ],

        external_reference: telefone,

        metadata: {

          nome,
          telefone,
          cidade,
          moto,
          observacoes

        },

        payer: {

          name: nome

        },

        notification_url:
          "https://us-central1-trilhao-pojuca.cloudfunctions.net/webhookMercadoPago",

        back_urls: {

          success:
            "https://trilheirosdepojuca.github.io/trilhao-pojuca/",

          failure:
            "https://trilheirosdepojuca.github.io/trilhao-pojuca/",

          pending:
            "https://trilheirosdepojuca.github.io/trilhao-pojuca/"

        },

        auto_return: "all"

      }

    });


    res.status(200).json({

      url: response.init_point

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      error: error.message

    });

  }

});


// ==========================================
// WEBHOOK MERCADO PAGO
// ==========================================

exports.webhookMercadoPago = functions.https.onRequest(async (req, res) => {

  try {

    const paymentId = req.query["data.id"];


    if (!paymentId) {

      return res.status(200).send("ok");

    }


    const payment = new Payment(client);

    const paymentData = await payment.get({

      id: paymentId

    });


    const data = paymentData;


    if (data.status === "approved") {

      const meta = data.metadata;


      const inscritoRef = db
        .collection("inscritos")
        .doc(meta.telefone);


      await inscritoRef.set({

        nome: meta.nome,
        telefone: meta.telefone,
        cidade: meta.cidade,
        moto: meta.moto,
        observacoes: meta.observacoes,

        pagamento: "PIX",

        status: "Pago",

        createdAt:
          admin.firestore.FieldValue.serverTimestamp()

      });


      console.log("Pagamento aprovado e salvo!");

    }


    res.status(200).send("ok");

  } catch (error) {

    console.error(error);

    res.status(500).send(error.message);

  }

});