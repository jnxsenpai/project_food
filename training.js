'use strict';

// filter

const names = ['Ivan', 'Ann', 'Ksenia', 'Voldemar'];

const shortNames = names.filter(function(name){
    return name.length < 5;
});

console.log(shortNames);
console.log(names);

//map

const answers = ['IvAn', 'AnnA', 'Hello'];

const result = answers.map(item =>  item.toLowerCase());

// every/some

const some = [4, 'sef', 'gdrdht'];

console.log(some.some(item => typeof(item) === 'number'));

//reduce

const arr = [4,5,2,3,2,6];
                    

const res = arr.reduce((sum, current) => sum + current);

// practice

const funds = [
    {amount: -1400},
    {amount: 2400},
    {amount: -1000},
    {amount: 500},
    {amount: 10400},
    {amount: -11400}
];

const getPositiveIncomeAmount = (data) => {
    const sum = data.filter(i => i.amount > 0)
    .reduce((sum, cur) => sum + cur.amount, 0);
    return (sum);
};


const getTotalIncomeAmount = (data) => {
   let sum2 = 0;
   if (data.some(i => i.amount < 0 ) === false) {
    sum2 = data.reduce((sum, cur) => sum + cur.amount, 0);
   } else {
    sum2 = getPositiveIncomeAmount(funds);
   }
    console.log (sum2);
};
//getPositiveIncomeAmount(funds);
getTotalIncomeAmount(funds);
