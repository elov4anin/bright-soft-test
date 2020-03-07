const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const fs = require('fs');


const parseHtml = (req, res, next) => {
  fs.readFile('./resources/db.html', function (err, html) {
    if (err) {
      throw err;
    }
    const $ = cheerio.load(html);
    const count = $('tr').length;
    const arr = [];
    for (let i =1; i < count; i += 1) {
      arr.push($(`tr:nth-child(${i}) td:not(:nth-child(1))`).contents().map(function() {

        return $(this).text();
      }).get().join('|'));
    }
    res.render('index', { title:  arr});
  });
};
const parseFromTxt = (req, res, next)  => {
  fs.readFile('./resources/cities', function (err, db) {
    if (err) {
      throw err;
    }
    const cities = db
        .toString()
        .split(',')
        .map(item => item.split('|'))
        .map(item => {
          if (item[2] === 'Оспаривается') {
            return {
              o1: item[0],
              city: item[1],
              region: item[3],
              district: item[4],
              population: item[5],
              base: item[6],
              cityStatus: item[7] ? item[7] : null,
            }
          }
          if (item[2] !== ' ') {
            return {
              o1: item[0],
              city: item[1],
              region: item[2],
              district: item[3],
              population: item[4],
              base: item[5],
              cityStatus: item[6] ? item[6] : null,
            }
          }



         if (item[0]) {
           return {
             o3: item[0],
             city: item[0],
             region: item[1],
             district: item[3],
             population: item[4],
             base: item[5],
             cityStatus: item[6] ? item[6] : null,
           }
         }
          return {
            o: item[0],
            city: item[1],
            region: item[3],
            district: item[4],
            population: item[5],
            base: item[6],
            cityStatus: item[7] ? item[7] : null,
          }

        });

    if (req.method === 'POST') {
      res.status(200).json({cities});
    } else {
      res.render('index', {cities});
    }

  });

};

// GET table cities in browser http://localhost:3000/
router.get('/', function (req, res, next) {
  parseFromTxt(req, res, next);
});

// POST for API
router.post('/', function (req, res, next) {
  parseFromTxt(req, res, next);
});

module.exports = router;
