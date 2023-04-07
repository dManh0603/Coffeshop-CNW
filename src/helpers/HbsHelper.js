const Handlebars = require('handlebars');
const moment = require('moment-timezone');

module.exports = {
  sum: (a, b) => a + b,
  sortable: (field, sort) => {
    // return an icon inside an a-tag for sorting
    const sortType = field === sort.column ? sort.type : 'default';

    const icons = {
      default: 'fa-sort',
      asc: 'fa-arrow-down-short-wide',
      desc: 'fa-arrow-down-wide-short',
    };

    const types = {
      default: 'desc',
      asc: 'desc',
      desc: 'asc',
    }
    const type = types[sortType];
    const icon = icons[sortType];
    const addr = Handlebars.escapeExpression(`?_sort&column=${field}&type=${type}`);
    const output = `<a href="${addr}">
        <i class="fa-solid ${icon} ms-2"></i>
      </a>`
    return new Handlebars.SafeString(output);
  },

  getImage: (imageId) => {
    return `https://drive.google.com/uc?id=${imageId}`
  },

  convertDate: (dateString) => {
    // Use Moment.js library to parse and manipulate the date/time string
    const date = moment(dateString).tz('Asia/Bangkok').utcOffset('+0700');

    // Format the date/time string in the desired format (day-month-year-time)
    const formattedDate = date.format('DD MMM YYYY HH:mm:ss');

    // Return the formatted date/time string
    return formattedDate;
  },
  
  TitleCase:(str) => {
    // split the string into an array of words
    let words = str.split(' ');
  
    // loop through each word and capitalize the first letter
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
  
    // join the array back into a string and return it
    return words.join(' ');
  }

}
