var mongoose = require('mongoose');
var kittySchema = mongoose.Schema({
    title: String,
    meta: {
    	createTime: {
    		type: Date,
    		default: Date.now()
    	},
    	updateTime: {
    		type: Date,
    		default: Date.now()
    	}
    }
})

kittySchema.pre('save',function  (next) {
	if (this.isNew) {
		this.meta.createTime = this.meta.updateTime = Date.now()
	}else{
		this.meta.updateTime = Date.now()
	}
	next()
})
kittySchema.statics = {
  findById: function (id,cb) {
    return this
    .findOne({_id: id})
    .sort('meta.updateTime')
    exec(cb)
  },
  fetch: function (cb) {
    return this
    .find({})
    .sort('meta.updateTime')
    exec(cb)
  }
}
module.exports = kittySchema