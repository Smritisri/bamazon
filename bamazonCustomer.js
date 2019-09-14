var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  showProduct();

});

function showProduct(){
connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    console.table(results);
    start(results);
})
};

// function which prompts the user for what action they should take
function start(results) {

  inquirer
    .prompt([{
      name: "productID",
      type: "input",
      message: "Enter the product ID you want you want to buy?",
    },
    {
        name: "noOfUnits",
        type: "input",
        message: "Enter the number of units?",
      }
    ]).then(function(answer) {
        // console.log(answer);
        // console.log(res)
        // console.log(res[0].item_id)

        for (var i = 0; i < results.length; i++) {
            if (results[i].item_id == answer.productID) {
            //   chosenItem = results[i];
            //console.log(results[i])
            


            if(answer.noOfUnits<=results[i].stock_quantity){
                console.log("Total Price: "
                +answer.noOfUnits*results[i].price);
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                      {
                        stock_quantity:results[i].stock_quantity-answer.noOfUnits
                      },
                      {
                        item_id: results[i].item_id
                      }
                    ],
                    function(error) {
                      if (error) throw err;
                      console.log("Order placed successfully!");
                    //   console.log(results[i]);
                      
                      showProduct();
                    }
                  );
            }else {
                // bid wasn't high enough, so apologize and start over
                console.log("Insufficient quantity!");
                showProduct();
              }
            }
          }
     }); 
}

// function to handle posting new items up for auction
function postAuction() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What is the item you would like to submit?"
      },
      {
        name: "category",
        type: "input",
        message: "What category would you like to place your auction in?"
      },
      {
        name: "startingBid",
        type: "input",
        message: "What would you like your starting bid to be?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO auctions SET ?",
        {
          item_name: answer.item,
          category: answer.category,
          starting_bid: answer.startingBid || 0,
          highest_bid: answer.startingBid || 0
        },
        function(err) {
          if (err) throw err;
          console.log("Your auction was created successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
}

function bidAuction() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM auctions", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].item_name);
            }
            return choiceArray;
          },
          message: "What auction would you like to place a bid in?"
        },
        {
          name: "bid",
          type: "input",
          message: "How much would you like to bid?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        // determine if bid was high enough
        if (chosenItem.highest_bid < parseInt(answer.bid)) {
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE auctions SET ? WHERE ?",
            [
              {
                highest_bid: answer.bid
              },
              {
                id: chosenItem.id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Bid placed successfully!");
              start();
            }
          );
        }
        else {
          // bid wasn't high enough, so apologize and start over
          console.log("Your bid was too low. Try again...");
          start();
        }
      });
  });
}


