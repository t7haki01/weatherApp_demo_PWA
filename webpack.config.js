const path = require('path');

module.exports = {
    entry: ['@babel/polyfill', './src/index.js'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/js')
    },
    mode: "development",
    watch: true,
    module:{
        rules: [
            { test: /\.scss/, exclude: /node_modules/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap&includePaths[]=node_modules/compass-mixins/lib'},
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            // {
            //     test: /\.css$/,
            //     use: [ "css-loader"],
            //     include: [
            //         path.join(__dirname, "/src/"),
            //         /node_modules\/bootstrap/
            //     ]
            // },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:{ loader: "babel-loader"}
            },
            // { 
            //     test: /\.scss/, 
            //     exclude: /node_modules/, 
            //     loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap&includePaths[]=node_modules/compass-mixins/lib'
            // },


        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    }
};