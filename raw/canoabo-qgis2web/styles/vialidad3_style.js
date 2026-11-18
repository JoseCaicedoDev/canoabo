var size = 0;

var styleCache_vialidad3={}
var style_vialidad3 = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };
    var value = ""
    var size = 0;
    var style = [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(14,18,22,0.694117647059)', lineDash: null, lineCap: 'square', lineJoin: 'round', width: 4}),
    }),new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(255,255,255,0.694117647059)', lineDash: [10,5,1,5,1,5], lineCap: 'square', lineJoin: 'bevel', width: 1}),
    })];
    if ("" !== null) {
        var labelText = String("");
    } else {
        var labelText = ""
    }
    var key = value + "_" + labelText

    if (!styleCache_vialidad3[key]){
        var text = new ol.style.Text({
              font: '9.75px \'MS Shell Dlg 2\', sans-serif',
              text: labelText,
              textBaseline: "center",
              textAlign: "left",
              offsetX: 5,
              offsetY: 3,
              fill: new ol.style.Fill({
                color: 'rgba(0, 0, 0, 255)'
              }),
            });
        styleCache_vialidad3[key] = new ol.style.Style({"text": text})
    }
    var allStyles = [styleCache_vialidad3[key]];
    allStyles.push.apply(allStyles, style);
    return allStyles;
};