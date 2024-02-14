<template>
	<q-page padding>
		<div class="row">
			<div class="col-9 q-pa-sm" scroll>
				<q-card class="card" style="height: 90vh">
					<div class="row col">
						<div class="row col-12">
							<q-input
								class="col-3"
								standout="bg-teal text-white"
								v-model="form.OldPallet"
								label="Old Pallet"
								focus
							/>
							<q-select
								class="col-3"
								standout="bg-teal text-white"
								v-model="form.PalletTypeID"
								:options="options"
								label="Pallet Type"
							/>
							<q-select
								class="col-3"
								standout="bg-teal text-white"
								v-model="form.ProductTypesID"
								:options="options"
								label="Product Types"
							/>
							<q-select
								class="col-3"
								standout="bg-teal text-white"
								v-model="form.OtherProductsID"
								:options="options"
								label="Other Product"
							/>
						</div>
						<div class="row col-12">
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
							virtual-scroll
							:pagination.sync="pagination"
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
					<q-card-section>
						<q-list bordered separator>
							<q-item clickable v-ripple>
								<q-item-section>DAL-ACA000001</q-item-section>
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
	export default {
		data(r) {
			return {
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
					{ name: 'PalletTypeID', label: 'Pallet Type', field: 'PalletTypeID', sortable: true },
					{ name: 'ProductTypesID', label: 'Product Types', field: 'ProductTypesID', sortable: true },
					{ name: 'OtherProductsID', label: 'Other Products', field: 'OtherProductsID', sortable: true },
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
		},
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
