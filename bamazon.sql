DROP DATABASE IF EXISTS bamazon;

-- Create the database movie_planner_db and specified it for use.
CREATE DATABASE bamazon;

USE bamazon;

-- Create the table plans.
CREATE TABLE products (
  item_id int NOT NULL AUTO_INCREMENT,
  product_name varchar(255) NOT NULL,
  department_name varchar(255) NOT NULL,
  price  INT (10) NOT NULL,
  stock_quantity  INT (10) NOT NULL,
  PRIMARY KEY (item_id)
);

-- Insert a set of records.
INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ('Lipstic','Cosmetic',50,12),('Shirt','Clothes',50,12),
('Jeans','Clothes',50,12),('Lipgloss','Cosmetic',20,120),('TV','electronic',250,120),('Toaster','electronic',150,20),
('eyeliner','Cosmetic',50,12),('Books','Stationary',50,12),('Pen','Cosmetic',15,12),('Pencil','Stationary',10,120);


select * from products;