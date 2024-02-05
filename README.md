# CRUD Server

A simple CRUD (Create, Read, Update, Delete) server for managing products and variants.

## Overview

This server provides endpoints to perform CRUD operations on products and their variants. It includes functionalities such as creating new products, updating existing ones, fetching products by ID, title, or all products, and deleting products.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/crud-server.git
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Database Configuration:**

   - Create a `.env` file in the root of the project.
   - Add the following configurations to the `.env` file, replacing the placeholders with your MySQL credentials:

     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=your_database
     ```

   - Save the `.env` file.

## Usage

### Migrate Data

1. **Copy JSONL File:**

   Copy the JSON Lines (jsonl) file that contains the data you want to migrate to the root folder of the project.

2. **Run Migration Script:**

   Execute the migration script to insert the data into the database. The script reads the jsonl file, processes the data, and inserts it into the corresponding tables in the database.

   ```bash
    node src/helpers/migrateProducts.js
   ```

   Make sure to adjust any configuration or parameters in the script based on your specific requirements.

### Start the Server

Run the CRUD server:

```bash
npm start
```

The server will be accessible at `http://localhost:3000` by default.

### Endpoints

1. Products
- **GET /api/products:** Get a list of all products.
<!-- - **GET /api/products/:id:** Get a product by ID. -->
- **GET /api/products/:title:** Get a product by title.
- **POST /api/products:** Create a new product.
- **PUT /api/products/:id:** Update a product by ID.
- **DELETE /api/products/:id:** Delete a product by ID.


2. Variants
- **GET /api/variants:** Get a list of all variants.
- **GET /api/variants/:id:** Get a variant by ID.
<!-- - **GET /api/variants/:title:** Get a variant by title. -->
- **POST /api/variants:** Create a new variant.
- **PUT /api/variants/:id:** Update a variant by ID.
- **DELETE /api/variants/:id:** Delete a variant by ID.