
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
      .on('mouseover', _hoverRegion)
      .on('click', _selectRegion);
  };

  function _hoverRegion() {
    _classOnlyThisAs(this.id, 'hover');
  };

  function _classOnlyThisAs(id, className) {
    d3.selectAll('.'+className).classed(className, false);
    d3.selectAll('.'+id).classed(className, true);
  };

  function _selectRegion() {
    var id = this.id;

    _classOnlyThisAs(id, 'active');
    _showInfo(id.replace(/.*_/, ''));
    _draw_timeline(id);
    window.location.hash = id;
  };

  function _showInfo(codigo) {
    var regiao = Estupros[codigo];
    if (!regiao) { return; }

    var day = Math.round(100 * regiao.pela_manha / regiao.ocorrencias),
        night = 100 - day,
        ranking = _keysSortedByOpacity().indexOf(codigo) + 1,
        proporcao = regiao.proporcao,
        residencia = Math.round((100 * regiao.local.residencia) / regiao.ocorrencias),
        via_publica = Math.round((100 * regiao.local.via_publica) / regiao.ocorrencias),
        outros = 100 - residencia - via_publica;

    $('#info h3').text(regiao.nome);
    $('.population em').text(_formatNumber(regiao.populacao));
    $('.victim em').text(regiao.media_idade_vitima);
    $('.author em').text(regiao.media_idade_autor);
    $('.night em').text(night+'%');
    $('.day em').text(day+'%');
    $('.ranking em').text(ranking+'ª');
    $('.proporcao em').text(proporcao);
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
          return 'fill-opacity: '+Estupros[id].range / 5  ;

      })
      .each(function () {
          var d3Element = d3.select(this);
          d3Element.classed(d3Element.attr('id'), true);
      });
  };

  function _drawBars() {
    d3.select('.bar-graph').append('ul').selectAll('li')
      .data(_keysSortedByOpacity()).enter().append('li')
      .attr('class', function (id) { return 'micro_'+id; })
      .html(_barInfo)
      .on('mouseover', _hoverBar)
      .on('click', _clickRegion);
  };

  function _keysSortedByOpacity() {
    var sortedKeys = Object.keys(Estupros);

    sortedKeys.sort(function (a, b) {
      return parseFloat(Estupros[b].opacity) - parseFloat(Estupros[a].opacity)
    });

    return sortedKeys;
  };

  function _barInfo(id) {
    var regiao = Estupros[id],
        meter = "<span class='meter' style='width: "+regiao.opacity*100+"%'>"+regiao.nome+"</span>";

    return meter;
  }

  function _hoverBar(id) {
    _classOnlyThisAs('micro_'+id, 'hover');
  };

  function _clickRegion(id) {
    _sendEventToRegion(id, 'click');
  };

  function _sendEventToRegion(id, eventName) {
    var region = document.getElementById('micro_'+id);
    d3.select(region).on(eventName).call(region);
  };

  function _draw_timeline(id) {
    var cod = id.replace(/.*_/, '');
    var regiao = Estupros[cod];
    var years = [];
    $.each(regiao.anos, function(i, v) {
      years.push(v);
    });
    
    $(".timeline").sparkline(years, {
      type: 'bar',
      height: '40',
      barWidth: 20,
      barColor: '#dc143c'});
    
    //$("#info .timeline span").text(regiao.anos);
  };

  return {
    'initialize': initialize
  };
})(jQuery);

$(document).ready(function () {
  Map.initialize($('#map'), 'data/RioGrandedoSul_MesoMicroMunicip.svg');
});
