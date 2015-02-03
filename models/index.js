'use strict';


module.exports = function IndexModel() {
    return {
        name: 'BrownConnect',
        min: process.env.NODE_ENV === 'development' ? '' : '.min'
    };
};
