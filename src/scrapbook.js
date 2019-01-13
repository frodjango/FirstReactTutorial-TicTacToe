// Guide de l'usager sur MacBook
//
// Francoiss-MacBook-Pro-2:src frodjango$ pwd
// /Users/frodjango/code/React/my-app/src
// Francoiss-MacBook-Pro-2:src frodjango$ node scrapbook.js 
// 0 1
// 1 2
// 2 0
// 3 3

let history = [1, 2, 0, 3];

moves = history.map((_element, _index) => {
    console.log(_index, _element);
});