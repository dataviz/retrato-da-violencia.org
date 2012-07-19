Map = (function ($) {
    var Estupros = {};

    function initialize(element, svgPath) {
        d3.xml(svgPath, 'image/svg+xml', function (xml) {
            element.html(xml.documentElement);

            _setupMunicipios();
            _loadEstupros();
        });
    }

    function _setupMunicipios() {
        d3.selectAll('path.str0').on('mouseover', _toggleActive)
                                 .on('mouseout', _toggleActive);
    };

    function _loadEstupros() {
        $.getJSON('data/dados_estupros.json', function (data) {
            Estupros = data;
        });
    }

    function _toggleActive() {
        var d3Element = d3.select(this),
            currentState = d3Element.classed('active');

        d3Element.classed('active', !currentState);
        _showInfo(d3Element.attr('id'));
    };

    function _showInfo(codigo_municipio) {
        var municipio = Estupros[codigo_municipio];
        if (!municipio) { return; }

        $('#info').html("<h3>"+municipio.nome+"</h3>"+"<p><em>Vitima</em>: "+municipio.media_idade_vitima+" <em>Autor</em>: "+municipio.media_idade_autor+" ("+municipio.ocorrencias+")");
    }

    return {
        'initialize': initialize
    };
})(Zepto);

$(document).ready(function () {
    Map.initialize($('#map'), 'data/RioGrandedoSul_MesoMicroMunicip.svg');
});
