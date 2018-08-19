var mysql = require("mysql");
var inquirer = require("inquirer");
var nodeArgs = process.argv;

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

});
const cTable = require('console.table');




connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    for (var i = 0; i < res.length; i++) {
        var stockLevel = res[i].stock_quantity;
        var prId = res[i].item_id;
        var prName = res[i].product_name;

        if (process.argv[2] === "product") {

            var table = cTable.getTable([
                {
                    id: prId,
                    name: prName,
                    price: res[i].price,
                    stock: stockLevel
                }

            ]);
            console.log(table);

        }
        else if (process.argv[2] === "inventory" && stockLevel < 5) {
            console.log("Low On Stock ID: " + prId + "---" + prName + "-----REMAINING STOCK-----" + stockLevel);
        }



    };
    if (process.argv[2] === "add") {
        inquirer
            .prompt([
                {
                    type: "input",
                    message: "Write down the product ID that you would like to ADD.",
                    name: "productId"
                },
                {
                    type: "input",
                    message: "How many would you like to ADD?",
                    name: "inventory"
                },
            ])
            .then(function (inquirerResponse) {
                if ( 5 > (res[(inquirerResponse.productId) - 1].stock_quantity)) {
                    var userIdProduct = parseInt(inquirerResponse.productId) - 1;
                    var userStockProduct = (res[userIdProduct].stock_quantity);
                    var userNum = parseInt(inquirerResponse.inventory);
                    var math = parseInt(userStockProduct) + parseInt(userNum);

                    var sqlUpdate = "UPDATE products SET stock_quantity = " + math + " WHERE item_id = " + inquirerResponse.productId;
                    // console.log(sqlUpdate);
                    connection.query(sqlUpdate, function (err, result) {
                        if (err) throw err;
                        console.log(result.affectedRows + " record(s) updated");
                        connection.end();
                    })
                }
            });

    };
    if (process.argv[2] === "new") {
        inquirer
            .prompt([
                {
                    type: "input",
                    message: "Name of the Product you would like to ADD.",
                    name: "productN"
                },
                {
                    type: "input",
                    message: "How many would you like to ADD?",
                    name: "inventory"
                },
                {
                    type: "input",
                    message: "What is the price?",
                    name: "produtctPrice"
                },
            ])
            .then(function (inquirerResponse) {
                if ( 5 > (res[(inquirerResponse.productN) - 1].stock_quantity)) {
                    var userProduct = inquirerResponse.productN;
                    var userStockProduct = (res[userProduct].stock_quantity);
                    var userNum = parseInt(inquirerResponse.inventory);
                   

                    var sqlUpdate = "INSERT INTO products () = " + math + " WHERE item_id = " + inquirerResponse.productN;
                    // console.log(sqlUpdate);
                    connection.query(sqlUpdate, function (err, result) {
                        if (err) throw err;
                        console.log(result.affectedRows + " record(s) updated");
                        connection.end();
                    })
                }
            });

    };

});







        // 
