
export const v3Headers = {
    "access-control-allow-origin": "*",
    "accept": "application/vnd.github.v3+json"
}

export const template = {
    html: [
        {
            name: 'index.html',
            url: 'https://raw.githubusercontent.com/ashutosh1919/report-curator/main/template/index.html'
        }
    ],
    css: [
        {
            name: 'main.css',
            url: 'https://raw.githubusercontent.com/ashutosh1919/report-curator/main/template/main.css'
        },
        {
            name: 'fonts.css',
            url: 'https://raw.githubusercontent.com/ashutosh1919/report-curator/main/template/fonts.css'
        }
    ],
    js: [
        {
            name: 'plot.js',
            url: 'https://raw.githubusercontent.com/ashutosh1919/report-curator/main/template/plot.js'
        },
        {
            name: 'tailwind.config.js',
            url: 'https://raw.githubusercontent.com/ashutosh1919/report-curator/main/template/tailwind.config.js'
        }
    ]
}

export const templateUrl = "https://raw.githubusercontent.com/ashutosh1919/report-curator/main/templates/index.html";

export const dataFileName = 'data.js';
export const dataSchema = {
    views: {
        dates: [
          "11/18", "11/19", "11/20",
          "11/21", "11/22", "11/23",
          "11/24", "11/25", "11/26",
          "11/27", "11/28", "11/29",
          "11/30", "12/01", "12/02"
        ],
        count: [
            1, 189, 156, 186, 175,
          278, 182, 181, 128, 208,
          310, 331, 212, 282, 154
        ],
        uniques: [
           1, 63, 55, 76, 76,  77,
          75, 84, 68, 73, 82, 104,
          92, 83, 67
        ]
    },
    clones: {
        dates: [
          '11/19', '11/20',
          '11/21', '11/22',
          '11/23', '11/24',
          '11/25', '11/26',
          '11/27', '11/28',
          '11/29', '11/30',
          '12/01', '12/02'
        ],
        count: [
          12,  1,  9, 12, 15, 11,
           9, 11, 24,  7, 24, 13,
           7,  9
        ],
        uniques: [
          5, 1,  7, 12, 11,  8,
          8, 9, 11,  6, 15, 13,
          7, 7
        ]
    }
}
