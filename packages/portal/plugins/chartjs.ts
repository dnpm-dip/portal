import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart,
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
        Chart.register(ArcElement, PointElement, LineElement, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
    },
});
