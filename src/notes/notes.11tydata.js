const {formatDate} = require('../../config/filters');
module.exports = {
  eleventyComputed: {
    title: (data) => {
      return `Short-form note: ${formatDate(data.date, 'MMMM D, YYYY @ h:mm a')}`;
    }
  }
};
