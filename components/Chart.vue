<script>
    import { Line, mixins } from 'vue-chartjs'
    const { reactiveProp } = mixins
    var zoom
    if (process.client) {
        zoom = require('chartjs-plugin-zoom')
    }

    export default {
        extends: Line,
        mixins: [reactiveProp],
        props: ['chartData', 'options'],
        mounted () {
            this.addPlugin(zoom)
            this.renderChart(this.chartData, this.options)
        }
    }
</script>

<style>
</style>
