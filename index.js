const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const domainRoute = require('./routes/domain')
const requestLoggerRoute = require('./routes/request_logger')
const authenticateJWT = require('./middleware/middleware')

dotenv.config();


// for parsing application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// for parsing multipart/form-data
app.use(upload.any());

const PORT = 3000 || process.env.PORT;





// localhost:3000/6560c52b16b42187a3ef072e?route=api/settings?type=7
// localhost:3000/{domain_id}?route=api/settings?type=7
app.use('', requestLoggerRoute);

// app.post('/client/domain', (req, res) => {
//     console.log("register domain");
//     const body = req.body;
//     const domain = req.body.domain;
//     console.log("domain ", domain);

//     try {
//         const collection = db.collection('org');


//         collection.insertOne({
//             domain: domain
//         }).then((response) => {
//             res.send(response);
//         });
//     }

//     catch (e) {
//         console.log("error ", e);
//     }

// })

app.use('/api/domain', authenticateJWT, domainRoute)

app.use('/api/client', authRoute)

app.get('/', (req, res) => {
    res.send(`
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <body>
    <header>
      <div class="logo">
       <h1>Interceptor</h1>
      </div>
    </header>
  
    <div class="container">
      <h1>Log, Analyze, Succeed. The Interceptor Way. 🚀</h1>
      <p>Welcome to Interceptor, the future of data management. Our platform is your all-in-one solution for tracking and comprehending your API requests. We empower you to effortlessly access and review your data interactions, paving the way for data-driven decisions like never before.</p>
      <form class="join-wrapper">
        <input type="email" id="email" placeholder="Enter your email">
        <button>Join waitlist</button>
      </form>
      <p class="result"></p>
      <div class="creators">
       
        <p>Crowds are gathering! Join our waitlist now.</p>
      </div>
    </div>
  </body>
        <style>
        *, *:before, *:after {
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Open Sans', sans-serif;
            background: #f5f5f5;
            color: #333;
            font-size: 14px;
            margin: 0;
            padding: 0;
        }
        
        * {
            margin: 0;
            padding: 0;
        }
        
        header {
            display: flex;
            align-items: center;
            max-width: 1100px;
            margin: 34px auto;
        }
        
        .right>span {
            font-weight: 600;
            font-size: 18px;
            line-height: 22px;
            text-align: center;
            color: #151284;
        }
        
        
        .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            padding: 70px 0;
        }
        
        .container>h1 {
            font-weight: 600;
            font-size: 48px;
            line-height: 120%;
            text-align: center;
        }
        
        .container>p {
            padding: 20px 0;
            font-weight: 400;
            font-size: 16px;
            line-height: 160.19%;
            text-align: center;
            color: #4E4E4E;
        }
        
        .join-wrapper {
            display: flex;
            justify-content: center;
            gap: 16px;
        }
        
        .join-wrapper>input {
            width: 100%;
            max-width: 400px;
            height: 64px;
            border: 1px solid #E5E5E5;
            box-sizing: border-box;
            border-radius: 4px;
            padding: 0 20px;
            font-size: 16px;
            line-height: 20px;
            color: #4E4E4E;
        }
        
        .join-wrapper>input:hover {
            border: 1px solid #151284;
        }
        
        .join-wrapper>button {
            height: 64px;
            width: 132px;
            background: #151284;
            border-radius: 4px;
            font-weight: 600;
            font-size: 16px;
            line-height: 20px;
            text-align: center;
            color: #FFFFFF;
            border: none;
            cursor: pointer;
        }
        
        .join-wrapper>button:hover {
            background: #0D0D5A;
        }
        
        .creators {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .creators>div:first-child {
            display: flex;
            justify-content: center;
            margin: 20px;
        }
        
        .creators>div:first-child>img {
            width: 44px;
            height: 44px;
            border: 2px solid #fff;
            border-radius: 50%;
            margin-left: -8px;
        }
        
        .creators>p {
            font-weight: 600;
            font-size: 14px;
            line-height: 128.9%;
            text-align: center;
            color: #4E4E4E;
        }
        .result{
            font-size: 22px;
        }
        
        @media screen and (max-width: 1120px) {
            header {
                padding: 0 20px;
            }
        
            .container {
                padding: 70px 20px;
            }
        }
        
        @media screen and (max-width: 768px) {
            .join-wrapper {
                flex-direction: column;
                align-items: center;
            }
        }
        </style>

        <script>
        const email = document.getElementById('email');
        const button = document.querySelector('button');
        const form = document.querySelector('form');
        const result = document.querySelector('.result');
      
        form.addEventListener('submit', (e) => {
        result.innerHTML = '';
          e.preventDefault();
          try {
            if (!email.value) {
              throw new Error('Please enter your email');
            }
            if(!email.value.trim()
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )){
                throw new Error('Please enter valid email');
            }
      
            button.innerHTML = 'Sending...';
              button.disabled = true;
      
              const formData = new FormData();
              formData.append('email', email.value);
      
              fetch('/api/client/waitlist', {
                method: 'POST',
                body: formData
              }).then(res => res.json())
                .then(data => {
                  console.log(data.email);
                  if (data.email) {
                    button.innerHTML = 'Success!';
                    button.disabled = true;
                  } else {
                    button.innerHTML = 'Try again';
                    button.disabled = false;
                    result.innerHTML = data.message;
                  }
                })
                .catch(err => {
                  console.log(err);
                  button.innerHTML = 'Try again';
                  button.disabled = false;
                  result.innerHTML = 'Something went wrong';
                });
          } catch (error) {
            button.innerHTML = 'Try again';
            button.disabled = false;
            result.innerHTML = error.message;
            console.log(error);
          }
        })
        </script>
    `);
});

(async () => {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
    console.log("DB connected");
    app.listen(PORT, async () => {
        console.log(`Server started at ${PORT}`);
    });
})();


