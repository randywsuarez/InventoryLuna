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

						<template v-slot:body="props">
							<q-tr :props="props" @dblclick="openEditDialog(props.row)">
								<q-td v-for="col in props.cols" :key="col.name" :props="props">
									{{
										col.name === 'ProductTypesID'
											? getProductTypeName(props.row[col.name])
											: props.row[col.name]
									}}
								</q-td>
								<q-menu ref="editMenu" context-menu>
									<q-list>
										<q-item clickable @click="openEditDialog(props.row)">
											<q-item-section>Edit</q-item-section>
										</q-item>
									</q-list>
								</q-menu>
							</q-tr>
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
						<q-input
							class="col-12"
							standout="bg-teal text-white"
							v-model="form.Description"
							label="Description"
						/>

						<q-select
							class="col-12"
							standout="bg-teal text-white"
							v-model="form.ProductTypesID"
							:options="ProductTypes"
							label="Product Types"
							emit-value
							map-options
						/>
						<q-checkbox v-model="form.Status" label="Active" :true-value="1" :false-value="0" />
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
				Title: 'Other Products',
				table: 'conf_OtherProducts',
				id: 'OtherProductsID',
				ProductTypes: [],
				form: {
					Status: 0,
				},
				columns: [
					{
						name: 'Description',
						label: 'Description',
						field: 'Description',
						sortable: true,
						align: 'left',
					},
					{
						name: 'ProductTypesID',
						label: 'Product Types',
						field: 'ProductTypesID',
						sortable: true,
						align: 'left',
						/* format: (val) => {
							return this.ProductTypes.find((v) => v.value == val).Description
						}, */
					},
					{
						name: 'Status',
						label: 'Status',
						field: 'Status',
						sortable: true,
						align: 'left',
					},
				],
				data: [],
				loading: false,
				filter: '',
				rowCount: 10,
				dialog: false,
				newr: false,
			}
		},
		methods: {
			getProductTypeName(ProductTypesID) {
				return this.ProductTypes.find((type) => type.value === ProductTypesID).label
			},
			newType() {
				this.form = {
					Status: 0,
				}
				this.newr = true
				this.dialog = true
			},
			async save() {
				if (!this.form.hasOwnProperty(`${this.id}`)) {
					this.form[this.id] = 'NEWID()'
					let result = await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
						.insert(this.table)
						.fields(this.form)
						.execute()
					console.log(result)
				} else {
					await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
						.update(this.table)
						.set(this.form)
						.where(`${this.id}='${this.form[this.id]}'`)
						.execute()
				}
				this.infoGet()
				this.dialog = false
			},
			async infoGet() {
				this.loading = true
				let res = await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
					.select('*')
					.from(this.table)
					.execute()
				console.log(res)
				this.data = res
				this.loading = false
			},

			openEditDialog(row) {
				console.log(row)
				this.form = { ...row } // Copiar los valores del row a this.form
				this.form.Status = this.form.Status ? 1 : 0
				this.newr = false // Cambiar this.newr a falso para indicar que no es un nuevo registro
				this.dialog = true // Abrir el diálogo
			},
			// Función para editar el row desde el menú contextual
			editRow(row) {
				this.openEditDialog(row)
			},
		},
		async beforeCreate() {},
		async mounted() {
			let r = await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
				.select('*')
				.from('conf_ProductTypes')
				.execute()
			console.log(r)
			for (let x of r) {
				this.ProductTypes.push({
					label: x.Description,
					value: x.ProductTypesID,
				})
			}
			console.log(this.ProductTypes)
			await this.infoGet()
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
