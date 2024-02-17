<template>
	<q-page padding>
		<div class="row">
			<div class="col-12 q-pa-sm" scroll>
				<q-card class="card" style="height: 90vh">
					<q-table
						style="height: 90vh"
						:title="Title"
						:data="data"
						:columns="columns"
						row-key="PalletTypesID"
						:filter="filter"
						:loading="loading"
					>
						<template v-slot:top-right>
							<q-btn
								class="q-ml-sm q-mr-lg"
								color="primary"
								:disable="loading"
								label="New Record"
								@click="newType()"
							/>
							<q-space />
							<q-input borderless dense debounce="300" color="primary" v-model="filter" label="Search">
								<template v-slot:append>
									<q-icon name="search" />
								</template>
							</q-input>
						</template>
					</q-table>
				</q-card>
			</div>
		</div>
		<q-dialog v-model="dialog" persistent>
			<q-card>
				<q-card-section>
					<div class="text-h6">{{ newr ? 'New Type' : 'Edit Type' }}</div>
				</q-card-section>

				<q-separator />

				<q-card-section style="max-height: 50vh" class="scroll">
					<div class="row">
						<q-input class="col-12" standout="bg-teal text-white" v-model="form.Code" label="Code" />
						<q-input
							class="col-12"
							standout="bg-teal text-white"
							v-model="form.Description"
							label="Description"
						/>
						<q-checkbox v-model="form.Status" label="Active" true-value="1" false-value="0" />
					</div>
				</q-card-section>

				<q-separator />

				<q-card-actions align="right">
					<q-btn flat label="Close" color="negative" v-close-popup />
					<q-btn flat label="Save" color="primary" @click="save()" />
				</q-card-actions>
			</q-card>
		</q-dialog>
	</q-page>
</template>

<script>
	import env from '../../utils/env'
	export default {
		data() {
			return {
				Title: 'Pallet Types',
				table: 'conf_PalletTypes',
				id: 'PalletTypesID',
				form: {
					Status: 0,
				},
				columns: [
					{ name: 'Code', label: 'Code', field: 'Code', sortable: true },
					{ name: 'Description', label: 'Description', field: 'Description', sortable: true },
					{ name: 'Status', label: 'Status', field: 'Status', sortable: true },
				],
				//vcolumns: ['Code', 'Description', 'Status'],
				data: [],
				loading: false,
				filter: '',
				rowCount: 10,
				dialog: false,
				newr: false,
			}
		},
		methods: {
			newType() {
				this.form = {
					Status: 0,
				}
				this.newr = true
				this.dialog = true
			},
			async save() {
				this.form[this.id] = 'NEWID()'
				let result = await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
					.insert(this.table)
					.fields(this.form)
					.execute()
				console.log(result)
				this.dialog = false
			},
		},
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
