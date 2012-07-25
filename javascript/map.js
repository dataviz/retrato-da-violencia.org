Map = (function ($) {
  var Estupros = {};
  var zoomScale = 2;
  var zoomedInto = undefined;

  function initialize(element, svgPath) {
    d3.xml(svgPath, 'image/svg+xml', function (xml) {
      element.html(xml.documentElement);

      _setupCallbacks();
      _loadEstupros(function () {
        var focusedElementId = window.location.hash.replace('#', '');
        _focusInto(focusedElementId);
      });
    });
  };

  function _setupCallbacks() {
    d3.selectAll('path.str4')
      .on('mouseover', function () { if (!zoomedInto) { _toggleActive.call(this); }})
      .on('click', _zoom);

    d3.selectAll('path.str3')
      .on('mouseover', function () { if (zoomedInto) { _toggleActive.call(this); }})
      .on('click', _zoom);
  };

  function _loadEstupros(callback) {
    $.getJSON('data/dados_estupros.json', function (data) {
      Estupros = data;
      callback();
    });
  };

  function _focusInto(id) {
    var element = document.getElementById(id),
        d3Element = d3.select(element);

    if (!element) { return; }

    d3Element.on('click').call(element);
    d3Element.on('mouseover').call(element);
  }

  function _toggleActive() {
    var d3Element = d3.select(this),
        id = d3Element.attr('id');

    d3.select('path.active').classed('active', false);
    d3Element.classed('active', true);

    _showInfo(id.replace(/.*_/, ''));
    window.location.hash = id;
  };

  function _zoom() {
    var id = d3.select(this).attr('id'),
        element = document.getElementById(id),
        svgId = d3.select('svg').attr('id'),
        svg = document.getElementById(svgId),
        viewBox;

    if (zoomedInto === this) {
      viewBox = _noZoomViewBox(svg, zoomScale);
      zoomedInto = undefined;
      d3.selectAll('path.inactive').classed('inactive', false);
    } else {
      if (zoomedInto) {
        viewBox = _centeredViewBox(element, svg);
      } else {
        viewBox = _centeredViewBoxWithZoom(element, svg);
      }
      d3.selectAll('path.str4').classed('inactive', true);
      zoomedInto = this;
    }

    d3.select(svg).transition().attr('viewBox', viewBox);
    d3.select('path.active').classed('active', false);
  }

  function _noZoomViewBox(svg) {
    var viewBox = d3.select(svg).attr('viewBox').split(' ');

    viewBox[0] = viewBox[1] = 0;
    viewBox[2] *= zoomScale;
    viewBox[3] *= zoomScale;

    return viewBox.join(' ');
  }

  function _centeredViewBoxWithZoom(element, svg) {
    var viewBox = _centeredViewBox(element, svg).split(' ');

    viewBox[2] /= zoomScale;
    viewBox[3] /= zoomScale;

    return viewBox.join(' ');
  }

  function _centeredViewBox(element, svg) {
    var elementMiddle = _getMiddlePoint(element),
        svgMiddle = _getMiddlePoint(svg),
        viewBox = d3.select(svg).attr('viewBox').split(' ');

    viewBox[0] = (elementMiddle.x - svgMiddle.x/zoomScale);
    viewBox[1] = (elementMiddle.y - svgMiddle.y/zoomScale);

    return viewBox.join(' ');
  }

  function _getMiddlePoint(element) {
    var bbox = element.getBBox();

    return { x: bbox.x + bbox.width/2,
             y: bbox.y + bbox.height/2 };
  };

  function _showInfo(codigo) {
    var regiao       = Estupros[codigo];
    if (!regiao) { return; }
    var nome_regiao     = "<h3>"+regiao.nome+"</h3>";
    var media_vitima    = "<p class='victim'>Média de idade das vítimas: <br><em>"+regiao.media_idade_vitima+"</em></p>";
    var media_autor     = "<p class='author'>Média de idade dos autores: <br><em>"+regiao.media_idade_autor+"</em></p>";
    var ocorrencias     = "<p>Número de ocorrências na região: <br><em>"+_formatNumber(regiao.ocorrencias)+"</em></p>";
    var populacao       = "<p>População na região: <br><em>"+_formatNumber(regiao.populacao)+"</em></p>";
    $('#info').html(nome_regiao + media_vitima + media_autor + ocorrencias + populacao);
  };

  function _formatNumber(number) {
      return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  };

  return {
    'initialize': initialize
  };
})(Zepto);

$(document).ready(function () {
  Map.initialize($('#map'), 'data/RioGrandedoSul_MesoMicroMunicip.svg');
});
