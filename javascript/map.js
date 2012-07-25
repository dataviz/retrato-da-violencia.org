Map = (function ($) {
  var Estupros = {};

  function initialize(element, svgPath) {
    d3.xml(svgPath, 'image/svg+xml', function (xml) {
      element.html(xml.documentElement);

      _setupCallbacks();
      _loadEstupros(function () {
        var focusedElementId = window.location.hash.replace('#', '');
        _focusInto(focusedElementId);
        _colorRegions();
      });
    });
  };

  function _setupCallbacks() {
    d3.selectAll('path.str3')
      .on('mouseover', _hover)
      .on('click', _selectRegion);
  };

  function _hover() {
    _classOnlyThisPathAs(this, 'hover');
  };

  function _classOnlyThisPathAs(path, className) {
    d3.select('path.'+className).classed(className, false);
    d3.select(path).classed(className, true);
  };

  function _selectRegion() {
    var id = d3.select(this).attr('id');

    _classOnlyThisPathAs(this, 'active');
    _showInfo(id.replace(/.*_/, ''));
    window.location.hash = id;
  };

  function _showInfo(codigo) {
    var regiao       = Estupros[codigo];
    if (!regiao) { return; }
    var nome_regiao     = "<h3>"+regiao.nome+"</h3>";
    var media_vitima    = "<p class='victim'>Média de idade das vítimas: <br><em>"+regiao.media_idade_vitima+"</em></p>";
    var media_autor     = "<p class='author'>Média de idade dos autores: <br><em>"+regiao.media_idade_autor+"</em></p>";
    var ocorrencias     = "<p>Número de ocorrências na região: <br><em>"+_formatNumber(regiao.ocorrencias)+"</em></p>";
    var populacao       = "<p>População na região: <br><em>"+_formatNumber(regiao.populacao)+"</em></p>";
    $('#info-s').html(nome_regiao + media_vitima + media_autor + ocorrencias + populacao);
  };

  function _formatNumber(number) {
      return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  };

  function _loadEstupros(callback) {
    $.getJSON('data/dados_estupros.json', function (data) {
      Estupros = data;
      callback();
    });
  };

  function _focusInto(id) {
    var element = document.getElementById(id);

    if (!element) { return; }

    d3.select(element).on('click').call(element);
  };

  function _colorRegions() {
    d3.selectAll('path.str3')
      .attr('style', function () {
          var id = d3.select(this).attr('id').replace(/.*_/, '');
          return 'fill-opacity: '+Estupros[id].opacity;
      });
  }

  return {
    'initialize': initialize
  };
})(Zepto);

$(document).ready(function () {
  Map.initialize($('#map'), 'data/RioGrandedoSul_MesoMicroMunicip.svg');
});
