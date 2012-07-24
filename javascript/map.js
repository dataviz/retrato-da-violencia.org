Map = (function ($) {
  var Estupros = {};
  var zoomScale = 2;
  var zoomedInto = undefined;

  function initialize(element, svgPath) {
    d3.xml(svgPath, 'image/svg+xml', function (xml) {
      element.html(xml.documentElement);

      _setupMunicipios();
      _loadEstupros();
    });
  };

  function _setupMunicipios() {
    d3.selectAll('path.str4')
      .on('mouseover', _toggleActive)
      .on('click', _zoom);
  };

  function _loadEstupros() {
    $.getJSON('data/dados_estupros.json', function (data) {
      Estupros = data;
    });
  };

  function _toggleActive() {
    var d3Element = d3.select(this);

    d3.select('path.active').classed('active', false);
    d3Element.classed('active', true);

    _showInfo(d3Element.attr('id').replace(/.*_/, ''));
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
    } else {
      if (zoomedInto) {
        viewBox = _centeredViewBox(element, svg, zoomScale);
      } else {
        viewBox = _centeredViewBoxWithZoom(element, svg, zoomScale);
      }
      zoomedInto = this;
    }

    d3.select(svg).transition().attr('viewBox', viewBox);
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
    var municipio       = Estupros[codigo];
    if (!municipio) { return; }
    var nome_municipio  = "<h3>"+municipio.nome+"</h3>";
    var media_vitima    = "<p class='victim'>Média de idade das vítimas: <br><em>"+municipio.media_idade_vitima+"</em></p>";
    var media_autor     = "<p class='author'>Média de idade dos autores: <br><em>"+municipio.media_idade_autor+"</em></p>";
    var ocorrencias     = "<p>Número de ocorrências na região: <br><em>"+municipio.ocorrencias+"</em></p>";
    var populacao       = "<p>População na região: <br><em>"+_formatNumber(municipio.populacao)+"</em></p>";
    $('#info').html(nome_municipio + media_vitima + media_autor + ocorrencias + populacao);
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
