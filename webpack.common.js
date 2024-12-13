const path = require('path');

const ifdefOptions = {
    DEBUG_UI: false,
    UNIT_TEST: true,
}

module.exports = {
    entry: './src/klee-blender.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    { loader: 'ts-loader' }, 
                    { loader: 'ifdef-loader', options: ifdefOptions }, 
                ],
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
};
