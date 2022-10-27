const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

//Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Signup route
app.post("/signup", (req, res) => {
  const { firstName, lastName, email } = req.body;

  //make sure field are filled
  if (!firstName || !lastName || !email) {
    res.redirect("/fail.html");
    return;
  }

  //construct req data
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const postData = JSON.stringify(data);

  const options = {
    url: "https://us12.api.mailchimp.com/3.0/lists/c46cc58086",
    method: "POST",
    headers: {
      Authorization: "auth 2f14972bdbbe19076ee1b61a1923e7ee-us12",
    },
    body: postData,
  };

  request(options, (err, response, body) => {
    if (err) {
      res.redirect("/fail.html");
      console.log(err);
    } else {
      if (response.statusCode === 200) {
        res.redirect("/success.html");
      } else {
        res.redirect("/fail.html");
        console.log(err);
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log("Server started on: " + PORT));
