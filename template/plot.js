const elementsTobeColored = [
    // [ id, class1, class2,... ]
    ['report-body', 'bg-COLOR-50'],
    ['report-title', 'text-COLOR-600', 'hover:text-COLOR-800'],
    ['github-svg', 'fill-COLOR-600', 'hover:fill-COLOR-800']
];

function colorElements(theme) {
    for(elm of elementsTobeColored) {
        let elmId = elm[0];
        for(let cl=1; cl<elm.length; cl++) {
            document.getElementById(elmId).classList.add(elm[cl].replace('COLOR', theme.name));
        }
        // let elmColor = elm[1].replace('COLOR', theme.name);
        // document.getElementById(elmId).classList.add(elmColor);
    }
}

function createTrafficPlot(divClass,
                           plotTitle,
                           xlabel,
                           xDates,
                           yLabel,
                           yCount,
                           yUniques,
                           legendCount,
                           legendUniques,
                           theme){

    var icon = {
        name: 'Download',
        svg: `<svg class="w-4 h-4 stroke-${theme.name}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path></svg>`
    }

    var trace1 = {
        x: xDates,
        y: yCount,
        hovertemplate: '<b>%{text}</b>',
        text: yCount,
        hoverlabel: {
            font: {
                family: "Atkinson Hyperlegible Regular"
            }
        },
        mode: 'lines+markers',
        type: 'scatter',
        name: legendCount,
        marker: {
            color: theme.primary
        }
    };

    var trace2 = {
        x: xDates,
        y: yUniques,
        hovertemplate: '<b>%{text}</b>',
        text: yUniques,
        mode: 'lines+markers',
        type: 'scatter',
        name: legendUniques,
        marker: {
            color: theme.secondary
        }
    };

    var data = [trace1, trace2];
  var layout = {
      title: {
          text: plotTitle,
          font: {
            size: 20,
            color: theme.primary,
            family: "Atkinson Hyperlegible Bold"
          }
      },
      font: {
        size: 12,
        color: theme.primary,
        family: "Atkinson Hyperlegible Regular"
      },
      autosize: true,
      margin: { l: 50, r:50 },
      plot_bgcolor: theme.background,
      paper_bgcolor: theme.background,
      showlegend: false,
      xaxis: {
        title: xlabel
      },
      yaxis: {
          title: yLabel
      }
    };
    var config = {
        responsive: true,
        displayModeBar: true,
        scrollZoom: true,
        modeBarButtonsToAdd: [
            {
              name: 'Download Plot',
              icon: icon,
              direction: 'up',
              click: function(gd) {
                Plotly.downloadImage(gd, {
                    filename: 'report-curator',
                    format: 'png', //also can use 'jpeg', 'webp', 'svg'
                    height: 600,
                    width: 600
                });                
            }}
        ],
        modeBarButtonsToRemove: ['toImage','pan2d','select2d','lasso2d','resetScale2d','zoomOut2d','zoom','zoomIn2d','autoscale'],
        displaylogo: false 
    }
    Plotly.newPlot(divClass, data, layout, config);
}

function onLoad() {
    console.log(data);
    createTrafficPlot(
        'traffic-views',
        'Views',
        'Date',
        data.views.dates,
        'Views',
        data.views.count,
        data.views.uniques,
        'Views',
        'Unique Visitors',
        data.theme
    );
    createTrafficPlot(
        'traffic-clones',
        'Clones',
        'Date',
        data.clones.dates,
        'Clones',
        data.clones.count,
        data.clones.uniques,
        'Clones',
        'Unique Cloners',
        data.theme
    );
    colorElements(data.theme);
}