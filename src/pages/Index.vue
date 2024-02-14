<template>
	<q-page :style-fn="myTweak" padding>
		<div class="row">
			<div class="col-9 q-pa-sm" scroll>
				<q-card class="card" style="height: 90vh">
					<div class="row col">
						<q-input
							class="col-3"
							standout="bg-teal text-white"
							v-model="form.oldPallet"
							label="Old Pallet"
							focus
						/>
						<q-select
							class="col-3"
							standout="bg-teal text-white"
							v-model="form.typePallet"
							:options="options"
							label="Type Pallet"
						/>
					</div>
					<div>
						<!-- <q-table
      style="height: 400px"
      title="Treats"
      :data="data"
      :columns="columns"
      row-key="index"
      virtual-scroll
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
    /> -->
					</div>
				</q-card>
			</div>
			<div class="col-3 q-pa-sm">
				<q-card class="card" style="height: 90vh">
					<q-card-section>
						<q-list bordered separator>
							<q-item clickable v-ripple>
								<q-item-section>Single line item</q-item-section>
							</q-item>

							<q-item clickable v-ripple>
								<q-item-section>
									<q-item-label>Item with caption</q-item-label>
									<q-item-label caption>Caption</q-item-label>
								</q-item-section>
							</q-item>

							<q-item clickable v-ripple>
								<q-item-section>
									<q-item-label overline>OVERLINE</q-item-label>
									<q-item-label>Item with caption</q-item-label>
								</q-item-section>
							</q-item>
						</q-list>
					</q-card-section>
				</q-card>
			</div>
		</div>
	</q-page>
</template>

<script>
	export default {
		data(r) {
			return {
				form: {},
				options: ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'],
			}
		},
		methods: {},
		async beforeCreate() {},
		async mounted() {
			const electron = require('electron')
			const remote = electron.remote
			const ventanaActual = remote.getCurrentWindow()
			ventanaActual.maximize()
		},
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
