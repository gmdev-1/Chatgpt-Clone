const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require("axios").default;

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 7000
const URL = process.env.MONGO_URL;

mongoose.connect(URL).then(() => {
    console.log("Connected to MongoDB");
}).catch(error => console.log(error));

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
})


app.post('/generate-text', async (req, res) => {
    const prompt = req.body.text;
    try {
        const options = {
            method: "POST",
            url: "https://api.edenai.run/v2/text/chat",
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: `Bearer ${process.env.EDEN_API_KEY}`
            },
            data: {
                providers: process.env.PROVIDER,
                text: prompt,
                temperature: process.env.TEMPERATURE,
                max_tokens: process.env.MAX_TOKENS,
                fallback_providers: "openai, cohere, google",
                show_original_response: true,
                response_as_dict: true,
                attributes_as_list: true,
                settings: {"google" : "google_model"},
                previous_history: [
                    {
                        "role": "user",
                        "message": "Hello"
                    },
                    {
                        "role": "assistant",
                        "message": "Hi, how can I help you?"
                    }
                ]
            },
        };
        const response = await axios.request(options);
        res.json(response.data['openai'].message);
    }
    catch (error) {
        console.log(error.message);
        res.status(400).json({ error: 'Request Failed with Error' })
    }
})

// axios.request(options)
        //     .then((response) => {
        //         res.json(response.data['openai'].message);
        //         console.log(response.data['openai'].message);
        //     })

// axios.request(options)
//   .then((response) => {
//     console.log(response.data);
//   })
//   .catch((error) => {
//     console.error(error);
//   });



// if (response.data['cohere']) {
//     res.json(response.data['cohere'].generated_text);
// } else {
//     // Handle the case where 'cohere' is missing
//     res.status(500).json({ error: "Generated text not found" });
// }

