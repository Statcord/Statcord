import {createCanvas} from "canvas"
import {setPlatformAPI, init} from "echarts"

const defaultConfig = {
    width: 1024,
    height: 720
}

export default function (config) {
    setPlatformAPI({ createCanvas })

    const configReal = Object.assign({}, defaultConfig, config);

    configReal.option.animation = false;
    delete configReal.option.tooltip;
    delete configReal.option.toolbox;
    
    const canvas = createCanvas(
        parseInt(configReal.width, 10),
        parseInt(configReal.height, 10),
    );

    canvas.style = {};
    
    const chart = init(canvas);

    chart.setOption(configReal.option);

    try {
        return chart.getDom().toBuffer();
    } finally {
        chart.dispose();
    }
}