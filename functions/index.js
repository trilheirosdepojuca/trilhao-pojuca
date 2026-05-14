const functions = require("firebase-functions");

const { MercadoPagoConfig, Preference } = require("mercadopago");


const client = new MercadoPagoConfig({

  accessToken: "APP_USR-8741860237780270-051413-7c1cc91831bd8e11191a64d5313c3dbb-721433387"

});


exports.criarPagamento = functions.https.onRequest(async (req, res) => {

  res.set("Access-Control-Allow-Origin", "*");

  res.set("Access-Control-Allow-Methods", "GET, POST");

  res.set("Access-Control-Allow-Headers", "Content-Type");


  if (req.method === "OPTIONS") {

    return res.status(200).send({});

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

        payer: {

          name: nome

        },

        external_reference: telefone,

        back_urls: {

          success: "https://trilheirosdepojuca.github.io/trilhao-pojuca/",

          failure: "https://trilheirosdepojuca.github.io/trilhao-pojuca/",

          pending: "https://trilheirosdepojuca.github.io/trilhao-pojuca/"

        },

        auto_return: "approved"

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