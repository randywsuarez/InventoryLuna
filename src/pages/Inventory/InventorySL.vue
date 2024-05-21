<template>
	<q-page padding>
		<div class="row">
			<div class="col-9 q-pa-sm" scroll>
				<q-card class="card">
					<div class="col row">
						<q-input v-model="form.serial" type="text" label="Serial" />
						<q-input
							v-model="form.serial"
							type="text"
							label="Serial"
							@keydown.enter="addItems"
							@keydown.tab="addItems"
						/>
					</div>
				</q-card>
			</div>
		</div>
	</q-page>
</template>

<script>
	import env from '../utils/env'
	import moment from 'moment'
	export default {
		data(r) {
			return {}
		},
		computed: {},
		methods: {},
		async beforeCreate() {},
		async mounted() {},
	}
</script>
<style scoped>
	.main {
		display: flex;
		justify-content: center;
	}
	.card {
		border-radius: 15px;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}
	.q-card-section {
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
	}
	.glow:hover {
		animation-name: glowEffect;
		animation-duration: 0.5s;
		animation-timing-function: ease-in-out;
		animation-iteration-count: infinite;
	}
	.titlePallet {
		color: transparent;
		background: #666666;
		-webkit-background-clip: text;
		-moz-background-clip: text;
		background-clip: text;
		text-shadow: 0px 3px 3px rgba(255, 255, 255, 0.5);
	}

	@keyframes glowEffect {
		0% {
			box-shadow: 0 0 10px rgba(0, 102, 255, 0.8);
		}
		50% {
			box-shadow: 0 0 20px rgba(0, 102, 255, 0.6);
		}
		100% {
			box-shadow: 0 0 10px rgba(0, 102, 255, 0.8);
		}
	}
</style>
