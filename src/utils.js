module.exports = function makeCamel(target) {
  let words = target.split('-');
  console.log(words);
  let camel = '';

  for (let i = 0; i < words.length; i++) {
    if (i === 0) {
      camel += words[i];
    } else {
      camel += words[i][0].toUpperCase() + words[i].slice(1, words[i].length);
    }

    console.log(camel);
  }
  return camel;
};
