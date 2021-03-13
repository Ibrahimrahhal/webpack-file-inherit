
<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" vspace="" hspace="25" src="https://webpack.js.org/assets/icon-square-big.svg" alt="webpack">
  </a>
</div>

# Webpack File Inherit Loader
Enables you to add Pug like extending/ inheritance cabilites to any file type

#### Note: this loader is still under development & not ready to be used in production 

## Getting Started

To begin, you'll need to install `webpack-file-inherit`:

```console
npm install --save-dev webpack-file-inherit
```

Then add the loader to your `webpack` config for a specific file type. For example:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js/i,
        loader: 'webpack-file-inherit',
      },
    ],
  },
};
```
## Inheritance 
This loader enables you to exends files is a simlier way that pug templting engine do you have to define blocks first 

**Parent.js**
```js
var x = 16;
/* @block secondValue */
var y = 15;
/* @terminate block */
console.log(x*y);
```
**Child.js**
```js
/* @extends "./Parent.js" */
/* @block secondValue */
var y = 0;
/* @terminate block */
```
bunding the Child.js will result this file
```js
var x = 16;
var y = 0;
console.log(x*y);
```
## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)
