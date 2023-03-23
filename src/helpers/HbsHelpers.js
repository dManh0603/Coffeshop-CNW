const Handlebars = require('Handlebars');

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
  }
}