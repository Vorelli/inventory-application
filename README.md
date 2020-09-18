# Simple Inventory Application

This is a simple inventory application for a pretend electronics store.
Anyone can create, update, and delete the products as well as add tags.

- [The app](https://aqueous-brushlands-38489.herokuapp.com/inventory) was created using Node.JS, Express, and MongoDB.
- The template rendering engine used is Pug.JS.
- Uses Helmet for protection and compression to lower server bandwidth.

## Installation

Use [node and node package manager](https://nodejs.org/en/) in order to install prerequisites and run the server.

```bash
npm install
npm run serverstart
```

## Usage

To run this server with a database server other than the provided example, add a process environment variable with the name of 'MONGODB_URI'.