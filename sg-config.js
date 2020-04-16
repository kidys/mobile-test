const path = require('path'),
    smartgrid = require('smart-grid'),
    settings = {
        outputStyle: 'scss',
        columns: 12,
        offset: '0px',
        mobileFirst: true,
        container: {
            maxWidth: '1137px',
            fields: '0px'
        },
        breakPoints: {
            desktop: {
                width: '1280px',
                offset: '7.5px'
            },
            tablet: {
                width: '768px',
                fields: '24px',
                offset: '5px'
            },
            mobile: {
                width: '360px',
                offset: '0px'
            }
        }
    };

smartgrid(path.dirname('.') + '/src/sass', settings);