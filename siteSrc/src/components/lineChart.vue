<template>
    <div>
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
    name: 'lineChart',
    data() {
        return {
        }
    },
    methods: {
        chartConstructor(chartType, chartData, chartOptions) {
            new Chart(this.$refs.canvas, {
                type: chartType,
                data: chartData,
                options: chartOptions
            });
        }
    },
    props: {
        chartType: String,
        chartData: Object,
        chartOptions: Object
    },
    mounted() {
        let { chartType, chartData, chartOptions } = this;
        this.chartConstructor(chartType, chartData, chartOptions);
    },
};
</script>