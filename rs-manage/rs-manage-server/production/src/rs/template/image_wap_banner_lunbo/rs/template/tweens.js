oojs.define({
  name: 'tweens',
  namespace: 'rs.template',
  easeOut: function(t, b, c, d){
    return -c *(t/=d)*(t-2) + b;
  },
  backOut: function(t, b, c, d, s){
    if (typeof s == 'undefined') {
      s = 3.70158;  //回缩的距离
    }
    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
  }
})
