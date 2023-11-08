import {
    ArcElement, BarElement, CategoryScale, Chart, Legend, LinearScale, Title, Tooltip,
} from 'chart.js';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin({
    async setup() {
        Chart.register(ArcElement, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
    },
});
