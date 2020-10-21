import Vue from 'vue'
import InfiniteLoading from '../vendor/vue-infinite-loading'
import DglLoader from '@/components/atoms/DglLoader'


Vue.use(InfiniteLoading, {
	props: {
		spinner: 'bubbles',
		/* other props need to configure */
	},
	system: {
		throttleLimit: 50,
		/* other settings need to configure */
	},
	slots: {
    spinner: DglLoader
		// error: InfiniteError, // you also can pass a Vue component as a slot
	},
});
