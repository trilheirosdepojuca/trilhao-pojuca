const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

const { MercadoPagoConfig, Preference } = require("mercadopago");

admin.initializeApp();

const client = new MercadoPagoConfig({
  accessToken: "APP_USR-8741860237780270-051413-7c1cc91831bd8e11191a64d5313c3dbb-721433387"
});

exports.criarPagamento = functions.https.onRequest((req, res) => {

  cors(req, res, async () => {

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
              title: "Inscrição Trilhão de Pojuca",
              quantity: 1,
              currency_id: "BRL",
              unit_price: 60
            }
          ],

          payer: {
            name: nome
          },

          metadata: {
            nome,
            telefone,
            cidade,
            moto,
            observacoes
          },

          back_urls: {
            success: "https://trilheirosdepojuca.github.io/trilhao-pojuca/",
            failure: "https://trilheirosdepojuca.github.io/trilhao-pojuca/"
          },

          auto_return: "approved"

        }

      });

      res.status(200).send({
        url: response.init_point
      });

    } catch (error) {

      console.error(error);

      res.status(500).send(error);

    }

  });

});