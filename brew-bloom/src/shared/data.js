export const FLOWERS = ["🌸","🌺","🌼","💐","🌷","🪷"];

export const INVENTORY_ITEMS = [
  { id:"milk",  name:"Milk",  emoji:"🥛", price: 3.25 },
  { id:"beans", name:"Coffee Beans", emoji:"🫘", price: 6.50 },
  { id:"sugar", name:"Sugar", emoji:"🍬", price: 2.10 },
  { id:"croissant", name:"Croissant (pre-made)", emoji:"🥐", price: 4.75 },
  { id:"muffin", name:"Muffin (pre-made)", emoji:"🧁", price: 4.25 },
  { id:"cookie", name:"Cookie (pre-made)", emoji:"🍪", price: 2.95 },
];

export const CUSTOMER_NAMES = ["Emma","Alex","Sofia","James","Mia","Noah","Ava","Liam","Nina","Zoe","Kai","Leo"];

export const MENU_PRODUCTS = [
  { id:"caramel_latte", name:"Caramel Latte", price: 7.95, requires:["milk","beans","sugar"], emoji:"☕" },
  { id:"americano", name:"Americano", price: 5.50, requires:["beans"], emoji:"☕" },
  { id:"mocha", name:"Mocha", price: 8.25, requires:["milk","beans","sugar"], emoji:"🍫" },
  { id:"croissant", name:"Croissant", price: 6.50, requires:["croissant"], emoji:"🥐" },
  { id:"muffin", name:"Muffin", price: 6.25, requires:["muffin"], emoji:"🧁" },
  { id:"cookie", name:"Cookie", price: 4.75, requires:["cookie"], emoji:"🍪" },
];
