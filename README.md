

This is a lab reservation project using the following technologies:
- [React](https://facebook.github.io/react/) and [React Router](https://reacttraining.com/react-router/) for the frontend
- [Express](http://expressjs.com/), [NodeJS] and [Mongoose](http://mongoosejs.com/) for the backend
- [Sass](http://sass-lang.com/) for styles (using the SCSS syntax)
- [Webpack](https://webpack.github.io/) for compilation


## Requirements

- [Node.js](https://nodejs.org/en/) 6+

```shell
npm install
```


## Running

Make sure to add a `config.js` file in the `config` folder. See the example there for more details.

Production mode:

```shell
npm start
```

Development (Webpack dev server) mode:

```shell
npm run start:dev
```

For getting access to the Admin dashboard, Change registered users ```userLevel``` to 'admin' manually from mongoDB database

Must resolve security Vulnerabilities 
Check libraries for updated versions
