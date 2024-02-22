<template>
	<q-page padding>
		<div class="row">
			<div class="col-9 q-pa-sm" scroll>
				<q-card class="card" style="height: 90vh">
					<div class="row col">
						<div class="row col-12">
							<q-select
								class="col-3"
								focus
								standout="bg-teal text-white"
								v-model="pid.PalletTypeID"
								:options="PalletTypes"
								label="Pallet Type"
								emit-value
								map-options
							/>
							<q-select
								class="col-3"
								standout="bg-teal text-white"
								v-model="pid.ProductTypesID"
								:options="ProductTypes"
								label="Product Types"
								@change="filterOther"
								emit-value
								map-options
							/>
							<q-select
								class="col-3"
								standout="bg-teal text-white"
								v-model="pid.OtherProductsID"
								:options="OtherProducts"
								label="Other Product"
								:disable="!pid.ProductTypesID"
								emit-value
								map-options
							/>
							<q-btn
								size="22px"
								color="green"
								class="col-3"
								label="CREATE PALLET"
								@click="createPallet()"
							/>
						</div>
						<q-separator spaced inset />
						<div class="row col-12">
							<q-input
								class="col-3"
								standout="bg-teal text-white"
								v-model="form.OldPallet"
								label="Old Pallet"
							/>
							<q-toggle class="col-3" size="xl" v-model="cases" :val="true" label="Case" />
							<q-input
								class="col-3"
								standout="bg-teal text-white"
								v-model="form.Product"
								label="SKU/UPC"
							/>
							<q-input
								v-if="!cases"
								class="col-3"
								standout="bg-teal text-white"
								v-model="form.Serial"
								label="Serial"
							/>
							<q-input
								v-if="cases"
								class="col-3"
								type="number"
								standout="bg-teal text-white"
								v-model="form.Qty"
								label="QTY"
							/>
						</div>
					</div>
					<div class="col-12">
						<q-btn size="22px" color="green" class="full-width" label="ADD" />
					</div>
					<div>
						<q-table
							style="height: 70vh"
							title="Scanned Units"
							:data="palletData"
							:columns="columns"
							row-key="index"
							:rows-per-page-options="[0]"
						/>
					</div>
					<div class="col-12">
						<q-btn
							size="22px"
							color="red"
							class="full-width"
							label="Close Pallet"
							:disable="!palletData.length"
						/>
					</div>
				</q-card>
			</div>
			<div class="col-3 q-pa-sm">
				<q-card class="card" style="height: 90vh">
					<q-card-section>
						<div class="text-h6">Pallet List</div>
					</q-card-section>
					<q-separator />
					<q-card-section>
						<q-input standout="bg-teal text-white" bottom-slots v-model="search" label="Search" dense>
							<template v-slot:append>
								<q-icon v-if="search !== ''" name="close" @click="search = ''" class="cursor-pointer" />
								<q-icon name="search" />
							</template>
						</q-input>
					</q-card-section>
					<q-separator />
					<q-card-section scroll>
						<q-list bordered separator v-for="(pallet, key) in pallets" :key="key">
							<q-item clickable v-ripple @click="actionPallet(pallet.PalletID)">
								<q-item-section>{{ pallet.Name }}</q-item-section>
								<q-item-section side>{{ pallet.Status == 1 ? 'Open' : 'Closed' }}</q-item-section>
								<q-item-section side top>
									<q-badge color="teal" :label="pallet.Total" />
								</q-item-section>
								<q-menu touch-position context-menu>
									<q-list dense style="min-width: 100px">
										<q-item clickable v-close-popup>
											<q-item-section avatar>
												<q-icon color="primary" name="fa-solid fa-file-pdf" />
											</q-item-section>
											<q-item-section>Report Pallet</q-item-section>
										</q-item>
										<q-item clickable v-close-popup>
											<q-item-section avatar>
												<q-icon color="primary" name="fa-solid fa-file-excel" />
											</q-item-section>
											<q-item-section>Report Sales</q-item-section>
										</q-item>
										<q-item clickable v-close-popup>
											<q-item-section avatar>
												<q-icon color="primary" name="fa-solid fa-envelope" />
											</q-item-section>
											<q-item-section>Send by Email</q-item-section>
										</q-item>
									</q-list>
								</q-menu>
							</q-item>
						</q-list>
					</q-card-section>
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
			return {
				PalletTypes: [],
				ProductTypes: [],
				OtherProducts: [],
				pallets: [],
				setting: [],
				pid: {
					PalletID: '',
				},
				form: {
					Qty: 1,
				},
				options: [
					{ label: 'BMW', value: 'car' },
					{ label: 'Samsung Phone', value: 'phone' },
				],
				search: '',
				cases: false,
				columns: [
					{ name: 'Serial', label: 'Serial', field: 'Serial', sortable: true },
					{ name: 'Product', label: 'Product', field: 'Product', sortable: true },
					{ name: 'OldPallet', label: 'Old Pallet', field: 'OldPallet', sortable: true },
					{ name: 'Qty', label: 'Qty', field: 'Qty', sortable: true },
					{ name: 'Case', label: 'Case', field: 'Case', sortable: true },
					{ name: 'Operator', label: 'Operator', field: 'Operator', sortable: true },
					{ name: 'Date', label: 'Date', field: 'Date', sortable: true },
				],
				palletData: [],
			}
		},
		methods: {
			filterOther() {
				this.OtherProducts = this.OtherProducts.filter((v) => v.parent == this.pid.ProductTypesID)
			},
			async createPallet() {
				if (!this.pid.hasOwnProperty('PalletID')) {
					this.pid['PalletID'] = 'NEWID()'
					this.pid['Date'] = 'GETDATE()'
					this.pid['Operator'] = 'test'
					this.pid['Status'] = 1
					this.pid['Name'] = `${this.setting.PalletPrefix}-${
						this.PalletTypes.find((v) => v.value == this.pid.PalletTypeID).Code
					}${await this.formatID(this.setting.PalletNumber)}`
					console.log(this.pid.Name)
					this.pid = await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
						.insert('LN_InternalPallet')
						.fields(this.pid)
						.execute()
					this.setting.PalletNumber++
					await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
						.update('conf_Setting')
						.set(this.setting)
						.where(`SettingID='${this.setting.SettingID}'`)
						.execute()
				}
			},
			async enviarCorreo() {
				try {
					await this.$sendEmail({
						to: ['destinatario1@gmail.com', 'destinatario2@gmail.com'],
						cc: ['copia1@gmail.com', 'copia2@gmail.com'],
						subject: 'Asunto del correo',
						text: 'Cuerpo del correo',
						attachmentName: 'nombre_del_archivo.txt',
					})

					console.log('Correo enviado con éxito')
				} catch (error) {
					console.error('Error al enviar el correo:', error.message)
				}
			},
			async formatID(number) {
				const lengthOfID = 6 // La longitud total del ID, ajusta según tus necesidades
				const formattedID = number.toString().padStart(lengthOfID, '0')
				return formattedID
			},
			async actionPallet(id) {
				let pallet = this.pallets.find((v) => v.PalletID == id)
				if (pallet.Status == 0) {
					this.$q
						.dialog({
							title: 'Confirm',
							message: `Do you want to open the palette again: ${pallet.Name}?`,
							cancel: true,
							persistent: true,
						})
						.onOk(async () => {
							this.$q.loading.show()
							pallet.Status = 1
							await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
								.update('LN_InternalPallet')
								.set({ Status: 1 })
								.where(`PalletID='${pallet.PalletID}'`)
								.execute()
							this.pid = pallet
							this.$q.loading.hide()
						})
						.onOk(() => {
							// console.log('>>>> second OK catcher')
						})
						.onCancel(() => {
							// console.log('>>>> Cancel')
						})
						.onDismiss(() => {
							// console.log('I am triggered on both OK and Cancel')
						})
				}
			},
			async closePallet() {
				if (this.palletData.length) {
					await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
						.update('LN_InternalPallet')
						.set({ Status: 0 })
						.where(`PalletID='${pallet.PalletID}'`)
						.execute()
				} else {
					this.$q.notify({
						type: 'negative',
						message: `This palette is empty.`,
					})
				}
			},
		},
		async beforeCreate() {},
		async mounted() {
			const electron = require('electron')
			const remote = electron.remote
			const ventanaActual = remote.getCurrentWindow()
			ventanaActual.maximize()
			this.$q.loading.show()
			let pt = await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
				.select('*')
				.from('conf_PalletTypes')
				.execute()
			for (let x of pt) {
				this.PalletTypes.push({
					label: x.Description,
					value: x.PalletTypesID,
					Code: x.Code,
				})
			}
			let prt = await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
				.select('*')
				.from('conf_ProductTypes')
				.execute()
			for (let x of prt) {
				this.ProductTypes.push({
					label: x.Description,
					value: x.ProductTypesID,
				})
			}
			let op = await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
				.select('*')
				.from('conf_OtherProducts')
				.execute()
			for (let x of op) {
				this.OtherProducts.push({
					label: x.Description,
					value: x.OtherProductsID,
					parent: x.ProductTypesID,
				})
			}
			this.setting = (
				await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY).select('*').from('conf_Setting').execute()
			)[0]
			console.log(this.setting)
			this.pallets = await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
				.myQuery(
					`SELECT
	LN_InternalPallet.PalletID,
	LN_InternalPallet.Name,
	LN_InternalPallet.Status,
	LN_InternalPallet.Operator,
	LN_InternalPallet.[Date],
	LN_InternalPallet.PalletTypeID,
	LN_InternalPallet.ProductTypesID,
	LN_InternalPallet.OtherProductsID,
	COUNT(LN_Inventory.PalletID) AS Total
FROM
	dbo.LN_InternalPallet
	LEFT JOIN
	dbo.LN_Inventory
	ON
		LN_InternalPallet.PalletID = LN_Inventory.PalletID
GROUP BY
	LN_InternalPallet.PalletID,
	LN_InternalPallet.Name,
	LN_InternalPallet.Status,
	LN_InternalPallet.Operator,
	LN_InternalPallet.[Date],
	LN_InternalPallet.PalletTypeID,
	LN_InternalPallet.ProductTypesID,
	LN_InternalPallet.OtherProductsID`
				)
				.execute()
			console.log(this.setting)

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
