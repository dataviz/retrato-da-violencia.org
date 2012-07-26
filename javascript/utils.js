$.slug = (function () {
  var in_chrs   = 'àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ _',
      out_chrs  = 'aaaaaceeeeiiiinooooouuuuyyaaaaaceeeeiiiinooooouuuuy--', 
      chars_rgx = new RegExp('[' + in_chrs + ']', 'gi'),
      transl    = {}, i,
      lookup    = function (m) { return transl[m] || m; };

  for (i=0; i<in_chrs.length; i++) {
      transl[ in_chrs[i] ] = out_chrs[i];
  }
  
  return function (s) { return s.replace(chars_rgx, lookup).toLowerCase(); }
})();
