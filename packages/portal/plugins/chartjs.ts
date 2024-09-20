import {
    ArcElement,
    BarController,
    BarElement,

    CategoryScale,
    Chart,
    DoughnutController,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin({
    async setup() {
        Chart.register(
            BarController,
            DoughnutController,

            ArcElement,
            PointElement,
            LineElement,
            Title,
            Tooltip,
            Legend,
            BarElement,
            CategoryScale,
            LinearScale,
        );
    },
});
