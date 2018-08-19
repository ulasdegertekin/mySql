var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "995302202",
    database: "bamazon",
    insecureAuth: true
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
});
const cTable = require('console.table');



function afterConnection() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            var table = cTable.getTable([
                {
                    id: res[i].item_id,
                    name: res[i].product_name,
                    price: res[i].price
                }
            ]);
            console.log(table);
        };

        inquirer
            .prompt([
                {
                    type: "input",
                    message: "Write down the product ID that you would like to buy.",
                    name: "productId"
                },
                {
                    type: "input",
                    message: "How many would you like to buy?",
                    name: "inventory"
                },
            ])
            .then(function (inquirerResponse) {
                if ((inquirerResponse.inventory) < (res[(inquirerResponse.productId) - 1].stock_quantity)) {
                    var userIdProduct = parseInt(inquirerResponse.productId) - 1;
                    var userStockProduct = (res[userIdProduct].stock_quantity);
                    var userNum = parseInt(inquirerResponse.inventory);
                    var math = parseInt(userStockProduct) - parseInt(userNum);

                    console.log("Your total is: " + "$" + inquirerResponse.inventory * res[(inquirerResponse.productId) - 1].price);
                    var sqlUpdate = "UPDATE products SET stock_quantity = " + math + " WHERE item_id = " + inquirerResponse.productId;
                    // console.log(sqlUpdate);
                    connection.query(sqlUpdate, function (err, result) {
                        if (err) throw err;
                        // console.log(result.affectedRows + " record(s) updated");
                        connection.end();
                    })
                }
                else {
                    console.log("Insufficient quantity!");
                }
            });
    });
}

