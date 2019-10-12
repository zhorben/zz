const mongoose = require('mongoose');

const designerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "Title отсутствует."
  },

  fullTitle: {
    type: String,
    required: "FullTitle отсутствует."
  },

  description: {
    type: String,
    required: "Description отсутствует."
  }
});

designerSchema.methods.getPublicFields = function() {
  return {
    id: this._id,
    title: this.title,
    fullTitle: this.fullTitle,
    description: this.description
  }
};

designerSchema.statics.publicFields = ['title', 'fullTitle', 'description'];

designerSchema.index(
  { title: 'text', description: 'text' },
  {
    weights: { title: 10, description: 5 },
    default_language: 'english'
  }
);

module.exports = mongoose.model('Designer', designerSchema);
