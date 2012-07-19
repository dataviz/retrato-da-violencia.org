Map = (function ($) {
    function initialize(element, svgPath) {
        d3.xml(svgPath, 'image/svg+xml', function (xml) {
            element.html(xml.documentElement);

            _setupMunicipios();
        });
    }

    function _setupMunicipios() {
        d3.selectAll('path.str0').on('mouseover', _toggleActive)
                                 .on('mouseout', _toggleActive);
    };

    function _toggleActive() {
        var d3Element = d3.select(this),
            currentState = d3Element.classed('active');

        d3Element.classed('active', !currentState);
    };

    return {
        'initialize': initialize
    };
})(Zepto);

$(document).ready(function () {
    Map.initialize($('#map'), 'data/RioGrandedoSul_MesoMicroMunicip.svg');
});
