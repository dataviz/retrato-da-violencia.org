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
        _drawBars();
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
    var regiao = Estupros[codigo];
    if (!regiao) { return; }

    var day = Math.round(100 * regiao.pela_manha / regiao.ocorrencias),
        night = 100 - day,
        ranking = _keysSortedByOpacity().indexOf(codigo) + 1;

    $('#info h3').text(regiao.nome);
    $('.population em').text(_formatNumber(regiao.populacao));
    $('.victim em').text(regiao.media_idade_vitima);
    $('.author em').text(regiao.media_idade_autor);
    $('.night em').text(night+'%');
    $('.day em').text(day+'%');
    $('.ranking em').text(ranking+'ª');
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

  function _drawBars() {
    d3.select('.bar-graph').append('ul').selectAll('li')
      .data(_keysSortedByOpacity()).enter().append('li')
      .html(_barInfo)
      .on('mouseover', _mouseOverRegion)
      .on('click', _clickRegion);
  };

  function _keysSortedByOpacity() {
    var sortedKeys = Object.keys(Estupros);

    sortedKeys.sort(function (a, b) {
      return parseFloat(Estupros[b].opacity) - parseFloat(Estupros[a].opacity)
    });

    return sortedKeys;
  }

  function _barInfo(id) {
    var regiao = Estupros[id],
        nome = "<b>"+regiao.nome+"</b>",
        meter = "<span class='meter' style='width: "+regiao.opacity*100+"%'></span>";

    return nome+meter;
  }

  function _mouseOverRegion(id) {
    _sendEventToRegion(id, 'mouseover');
  }

  function _clickRegion(id) {
    _sendEventToRegion(id, 'click');
  }

  function _sendEventToRegion(id, eventName) {
    var region = document.getElementById('micro_'+id);
    d3.select(region).on(eventName).call(region);
  }

  return {
    'initialize': initialize
  };
})(Zepto);

$(document).ready(function () {
  Map.initialize($('#map'), 'data/RioGrandedoSul_MesoMicroMunicip.svg');
});
