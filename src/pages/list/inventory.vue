<template>
	<q-page padding>
		<div class="row">
			<div class="col-12 q-pa-sm" scroll>
				<q-card class="card">
					<div>
						<q-table
							style="height: calc(80.3vh - 56.57px)"
							title="Inventory List"
							:data="data"
							:columns="columns"
							row-key="index"
							:filter="filter"
							:rows-per-page-options="[0]"
						>
							<template v-slot:top-right>
								<q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
									<q-icon slot="append" name="search" />
								</q-input>
								<q-btn color="primary" icon-right="archive" label="Report" no-caps @click="exportTable" />
							</template>

							<template v-slot:no-data="{ icon, message, filter }">
								<div class="full-width row flex-center text-accent q-gutter-sm">
									<q-icon size="2em" name="sentiment_dissatisfied" />
									<span> Well this is sad... {{ message }} </span>
									<q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
								</div>
							</template>
						</q-table>
					</div>
				</q-card>
			</div>
		</div>
	</q-page>
</template>

<script>
	import env from '../../utils/env'
	import moment from 'moment'
	import { exportFile } from 'quasar'
	function wrapCsvValue(val, formatFn) {
		let formatted = formatFn !== void 0 ? formatFn(val) : val

		formatted = formatted === void 0 || formatted === null ? '' : String(formatted)

		formatted = formatted.split('"').join('""')

		return `"${formatted}"`
	}
	export default {
		data(r) {
			return {
				data: [],
				filter: '',
				columns: [
					{ name: 'Product', label: 'Product', field: 'Product', sortable: true, align: 'left' },
					{ name: 'Serial', label: 'Serial', field: 'Serial', sortable: true, align: 'left' },
					{ name: 'Qty', label: 'Qty', field: 'Qty', sortable: true, align: 'left' },
					{ name: 'PalletID', label: 'Pallet', field: 'Name', sortable: true, align: 'left' },
					{
						name: 'Description',
						label: 'Description',
						field: 'Description',
						sortable: true,
						align: 'left',
					},
					/* {
						name: 'LastScan',
						label: 'Date',
						field: 'LastScan',
						sortable: true,
						format: (v) => moment(v),
					}, */
					/* {
						name: 'Actions',
						label: 'Actions',
						align: 'center',
						field: 'InventoryID',
					}, */
				],
			}
		},
		computed: {},
		methods: {
			exportTable() {
				// naive encoding to csv format
				const content = [this.columns.map((col) => wrapCsvValue(col.label))]
					.concat(
						this.data.map((row) =>
							this.columns
								.map((col) =>
									wrapCsvValue(
										typeof col.field === 'function'
											? col.field(row)
											: row[col.field === void 0 ? col.name : col.field],
										col.format
									)
								)
								.join(',')
						)
					)
					.join('\r\n')

				const status = exportFile(`inventory-${moment()}.csv`, content, 'text/csv')

				if (status !== true) {
					this.$q.notify({
						message: 'Browser denied file download...',
						color: 'negative',
						icon: 'warning',
					})
				}
			},
			async rsLoad() {
				this.data = await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
					.myQuery(
						`SELECT
              LN_Inventory.InventoryID,
              LN_Inventory.Product,
              LN_Inventory.Serial,
              LN_Inventory.Qty,
              LN_InternalPallet.Name,
              conf_ProductTypes.Description,
              LN_Inventory.LastScan
            FROM
              dbo.LN_Inventory
              INNER JOIN
              dbo.LN_InternalPallet
              ON
                LN_Inventory.PalletID = LN_InternalPallet.PalletID
              INNER JOIN
              dbo.conf_ProductTypes
              ON
                LN_InternalPallet.ProductTypesID = conf_ProductTypes.ProductTypesID`
					)
					.execute()
			},
		},
		async beforeCreate() {},
		async mounted() {
			await this.rsLoad()

			this.$q.loading.hide()
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
