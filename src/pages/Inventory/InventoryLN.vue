<template>
	<q-page padding>
		<div class="row">
			<div class="col-9 q-pa-sm" scroll>
				<q-card class="card" style="height: 90vh">
					<div class="row col">
						<div class="row col-12" v-if="!pid.PalletID">
							<q-select
								ref="ProductTypes"
								class="col-3"
								standout="bg-teal text-white"
								v-model="pid.ProductTypesID"
								:options="ProductTypes"
								label="Product Types"
								emit-value
								map-options
								@input="filterOther(pid.ProductTypesID)"
							/>
							<q-select
								ref="PalletTypesID"
								class="col-3"
								focus
								standout="bg-teal text-white"
								v-model="pid.PalletTypesID"
								:options="PalletTypesOp"
								label="Pallet Type"
								emit-value
								map-options
							/>
							<q-select
								ref="OtherProductsID"
								class="col-3"
								standout="bg-teal text-white"
								v-model="pid.OtherProductsID"
								:options="OtherProductsOp"
								label="Other Product"
								:disable="!OtherProductsOp.length"
								emit-value
								map-options
							/>
							<q-btn
								size="22px"
								color="green"
								class="col-3"
								:label="`${pid.PalletID ? 'UPDATE PALLET' : 'CREATE PALLET'}`"
								@click="createPallet()"
								:disable="!pid.ProductTypesID && !pid.PalletTypesID"
							/>
						</div>
						<div v-else class="col-12 main titlePallet" style="padding-top: 10px; font-size: 2vw">
							{{ pid.Name }}
						</div>
						<q-separator spaced inset />
						<div class="row col-12" v-if="pid.PalletID">
							<q-input
								ref="Gruop"
								class="col-2"
								type="number"
								standout="bg-teal text-white"
								v-model="form.myGroup"
								label="Gruop"
							/>
							<q-toggle ref="cases" class="col-2" size="xl" v-model="cases" :val="true" label="Case" />
							<q-input
								ref="Product"
								class="col-3"
								standout="bg-teal text-white"
								v-model="form.Product"
								label="SKU/UPC"
								@input="upperCase('Product')"
							/>
							<q-input
								ref="Serial"
								v-if="!cases"
								class="col-3"
								standout="bg-teal text-white"
								v-model="form.Serial"
								label="Serial"
								@input="upperCase('Serial')"
								@keydown.enter="addItems"
								@keydown.tab="addItems"
								:disable="!form.Product"
							/>
							<q-input
								ref="Qty"
								v-if="cases"
								class="col-3"
								type="number"
								standout="bg-teal text-white"
								v-model="form.Qty"
								label="QTY"
								@keydown.enter="addItems"
								@keydown.tab="addItems"
								:disable="!form.Product"
							/>

							<div class="col-2">
								<q-btn
									size="22px"
									color="green"
									class="full-width"
									label="ADD"
									@click="addItems"
									:disable="tableLoading"
								/>
							</div>
						</div>
					</div>
					<div>
						<q-table
							style="height: calc(80.3vh - 56.57px)"
							title="Scanned Units"
							:data="palletData"
							:columns="columns"
							row-key="index"
							:rows-per-page-options="[0]"
							:loading="tableLoading"
						>
							<template v-slot:body-cell="props">
								<q-td :props="props" :key="props.col.name" :class="props.colAlignClass">
									<!-- Solo aplicamos el botón si la columna es 'Actions' -->
									<q-btn
										v-if="props.col.name === 'Actions'"
										icon="remove"
										@click="removeItem(props.row.InventoryID)"
										color="red"
									/>
									<!-- De lo contrario, simplemente mostramos el valor en la celda -->
									<div v-else>
										{{ props.value }}
									</div>
								</q-td>
							</template>
						</q-table>
					</div>
					<div style="position: absolute; bottom: 0; left: 0; right: 0">
						<q-btn
							size="22px"
							color="red"
							class="full-width"
							label="Close Pallet"
							:disable="!palletData.length"
							@click="closePallet"
						/>
					</div>
				</q-card>
			</div>
			<div class="col-3 q-pa-sm" name="items">
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
						<q-scroll-area style="height: 75vh; max-width: 100%">
							<q-list bordered separator v-for="(pallet, key) in filteredPallets" :key="key">
								<q-item clickable v-ripple @click="actionPallet(pallet.PalletID)">
									<q-item-section>{{ pallet.Name }}</q-item-section>
									<q-item-section side>{{ pallet.Status == 1 ? 'Open' : 'Closed' }}</q-item-section>
									<q-item-section side top>
										<q-badge color="teal" :label="pallet.Total" />
									</q-item-section>
									<q-menu touch-position context-menu>
										<q-list dense style="min-width: 100px">
											<q-item
												clickable
												v-close-popup
												@click="removePallet(pallet.PalletID, pallet.Total)"
												v-if="pallet.Total == 0 && pallet.Status == 1"
											>
												<q-item-section avatar>
													<q-icon color="primary" name="remove" />
												</q-item-section>
												<q-item-section>Remove Pallet</q-item-section>
											</q-item>
											<q-item
												clickable
												v-close-popup
												@click="report(pallet.PalletID, pallet.Name)"
												v-if="pallet.Total > 0 && pallet.Status == 0"
											>
												<q-item-section avatar>
													<q-icon color="primary" name="fa-solid fa-file-pdf" />
												</q-item-section>
												<q-item-section>Report Pallet</q-item-section>
											</q-item>
											<!-- <q-item clickable v-close-popup v-if="pallet.Total > 0 && pallet.Status == 0">
												<q-item-section avatar>
													<q-icon color="primary" name="fa-solid fa-file-excel" />
												</q-item-section>
												<q-item-section>Report Sales</q-item-section>
											</q-item>
											<q-item clickable v-close-popup v-if="pallet.Total > 0 && pallet.Status == 0">
												<q-item-section avatar>
													<q-icon color="primary" name="fa-solid fa-envelope" />
												</q-item-section>
												<q-item-section>Send by Email</q-item-section>
											</q-item> -->
										</q-list>
									</q-menu>
								</q-item>
							</q-list>
						</q-scroll-area>
					</q-card-section>
				</q-card>
			</div>
		</div>
	</q-page>
</template>

<script>
	import env from '../utils/env'
	import moment from 'moment'
	import pdfMake from 'pdfmake'
	import pdfFonts from 'pdfmake/build/vfs_fonts'
	import JsBarcode from 'jsbarcode'
	export default {
		data(r) {
			return {
				barImg: '',
				titleImg: '',
				PalletTypes: [],
				ProductTypes: [],
				OtherProducts: [],
				PalletTypesOp: [],
				OtherProductsOp: [],
				pallets: [],
				setting: [],
				pid: {
					PalletID: '',
					ProductTypesID: '',
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
					{ name: 'Group', label: 'Group', field: 'myGroup', sortable: true },
					{ name: 'Qty', label: 'Qty', field: 'Qty', sortable: true },
					{
						name: 'Case',
						label: 'Case',
						field: 'Case',
						sortable: true,
						format: (v) => (v ? 'YES' : 'NO'),
					},
					{ name: 'Operator', label: 'Operator', field: 'Operator', sortable: true },
					{
						name: 'LastScan',
						label: 'Date',
						field: 'LastScan',
						sortable: true,
						format: (v) => moment(v),
					},
					{
						name: 'Actions',
						label: 'Actions',
						align: 'center',
						field: 'InventoryID',
					},
				],
				palletData: [],
				tableLoading: false,
			}
		},
		computed: {
			filteredPallets() {
				if (this.search) {
					return this.pallets.filter((v) => v.Name.includes(this.search))
				} else {
					return this.pallets // Retorna todos los pallets si no hay término de búsqueda
				}
			},
		},
		methods: {
			upperCase(info) {
				this.form[info] = this.form[info].toUpperCase()
			},
			myUpc() {
				// Verificar si el valor es numérico y mayor a 12
				if (!isNaN(this.form.Product) && this.form.Product.length > 12) {
					// Eliminar el primer carácter
					this.form.Product = this.form.Product.substring(1)
				}
			},
			async removeItem(InventoryID) {
				console.log(`Remove item with PalletID: ${InventoryID}`)
				let r = await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
					.delete('LN_Inventory')
					.where(`InventoryID='${InventoryID}'`)
					.execute()
				console.log(r)
				if (r.status) {
					this.$q.notify({
						type: 'positive',
						message: `This palette was removed.`,
					})
					this.palletData = await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
						.select('*')
						.from('LN_Inventory')
						.where(`PalletID='${this.pid.PalletID}'`)
						.execute()
					await this.rsLoad()
					this.$refs.Product.focus()
				} else {
					this.$q.notify({
						type: 'negative',
						message: `The unit could not be removed.`,
					})
				}
			},
			filterOther(id) {
				if (!id) {
					console.error('this.pid is undefined')
					return
				}
				this.OtherProductsOp = this.OtherProducts.filter((v) => v.parent == id)
				this.PalletTypesOp = this.PalletTypes.filter((v) => v.parent == id)
			},
			async createPallet() {
				console.log(this.pid)
				let result = ''
				if (!this.pid.PalletID) {
					this.$q.loading.show()
					this.pid['PalletID'] = 'NEWID()'
					this.pid['LastScan'] = 'GETDATE()'
					this.pid['Operator'] = 'test'
					this.pid['Status'] = 1
					this.pid['Name'] = `${this.setting.PalletPrefix}-${await this.PalletTypes.find(
						(v) => v.value == this.pid.PalletTypesID
					).Code}${await this.formatID(this.setting.PalletNumber)}`
					console.log(this.pid)
					result = await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
						.insert('LN_InternalPallet')
						.fields(this.pid)
						.execute()
					this.setting.PalletNumber++
					await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
						.update('conf_Setting')
						.set(this.setting)
						.where(`SettingID='${this.setting.SettingID}'`)
						.execute()
					this.pid = (
						await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
							.select('*')
							.from('LN_InternalPallet')
							.where(`Name='${this.pid.Name}'`)
							.execute()
					)[0]
					console.log(this.pid)
					this.$refs.Product.focus()
					this.$q.loading.hide()
				}
			},
			async addItems() {
				this.tableLoading = true
				if (this.cases) this.form.Serial = ''
				if (this.palletData.some((v) => v.Serial == this.form.Serial) && !this.cases) {
					this.$q.notify({
						type: 'negative',
						message: `This serial: ${this.form.Serial} already exists.`,
					})
					this.tableLoading = false
					return
				}
				console.log(this.form)
				if (
					this.form.Product.length == 12 &&
					!this.form.Product.includes('#') &&
					!isNaN(this.form.Product)
				) {
					this.form['Type'] = 'UPC'
				} else this.form['Type'] = 'SKU'
				this.form['InventoryID'] = 'NEWID()'
				this.form['LastScan'] = 'GETDATE()'
				this.form['Operator'] = 'test'
				this.form['Cases'] = this.cases ? 1 : 0
				this.form['PalletID'] = this.pid.PalletID
				await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
					.insert('LN_Inventory')
					.fields(this.form)
					.execute()
				this.palletData = await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
					.select('*')
					.from('LN_Inventory')
					.where(`PalletID='${this.pid.PalletID}'`)
					.execute()
				this.tableLoading = false
				this.form = {
					Qty: 1,
					myGroup: this.form.myGroup ? this.form.myGroup : '',
				}
				this.$q.notify({
					type: 'positive',
					message: `Added serial...`,
				})
				this.$refs.Product.focus()
			},
			async removePallet(id, cant) {
				console.log(id, cant)
				if (cant == 0) {
					this.$q.loading.show()
					this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
						.delete('LN_InternalPallet')
						.where(`PalletID='${id}'`)
						.execute()
					this.$q.notify({
						type: 'positive',
						message: `This palette was removed.`,
					})
					await this.rsLoad()
					this.$q.loading.hide()
				} else {
					this.$q.notify({
						type: 'negative',
						message: `This palette isn't empty.`,
					})
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
				this.tableLoading = true
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
							this.actionPallet2()
							this.$q.loading.hide()
						})
						.onOk(() => {
							// console.log('>>>> second OK catcher')
						})
						.onCancel(() => {
							this.tableLoading = false
						})
						.onDismiss(() => {
							// console.log('I am triggered on both OK and Cancel')
						})
				} else {
					//await this.catalog()
					this.pid = this.pallets.find((v) => v.PalletID == id)
					this.filterOther(this.pid.ProductTypesID)
					console.log(this.pid)
					this.actionPallet2()
				}
			},
			async actionPallet2() {
				this.tableLoading = false
				this.form = {
					Qty: 1,
				}
				this.palletData = await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
					.select('*')
					.from('LN_Inventory')
					.where(`PalletID='${this.pid.PalletID}'`)
					.execute()
				this.$refs.Product.focus()
			},
			async closePallet() {
				if (this.palletData.length) {
					console.log(this.pid.PalletID)
					let r = await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
						.update('LN_InternalPallet')
						.set({ Status: 0 })
						.where(`PalletID='${this.pid.PalletID}'`)
						.execute()
					if (r.status)
						this.$q.notify({
							type: 'positive',
							message: `This palette is closed.`,
						})
					window.location.reload()
				} else {
					this.$q.notify({
						type: 'negative',
						message: `This palette is empty.`,
					})
				}
			},
			async rsLoad() {
				this.pallets = await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
					.myQuery(
						`SELECT
	LN_InternalPallet.PalletID,
	LN_InternalPallet.Name,
	LN_InternalPallet.Status,
	LN_InternalPallet.Operator,
	LN_InternalPallet.LastScan,
	LN_InternalPallet.PalletTypesID,
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
	LN_InternalPallet.LastScan,
	LN_InternalPallet.PalletTypesID,
	LN_InternalPallet.ProductTypesID,
	LN_InternalPallet.OtherProductsID`
					)
					.execute()
			},
			async catalog() {
				let pt = await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
					.select('*')
					.from('conf_PalletTypes')
					.execute()
				for (let x of pt) {
					this.PalletTypes.push({
						label: x.Description,
						value: x.PalletTypesID,
						parent: x.ProductTypesID,
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
			},
			async mainReport(title) {
				const text = title
				const textCanvas = document.createElement('canvas')
				const textCtx = textCanvas.getContext('2d')
				textCanvas.width = 200
				textCanvas.height = 50
				textCtx.font = '56px Arial'
				textCtx.fillStyle = 'black'
				textCtx.textAlign = 'center'
				textCtx.textBaseline = 'middle'
				textCtx.translate(textCanvas.width / 2, textCanvas.height / 2)
				textCtx.rotate(90)
				textCtx.fillText(text, 0, 0)

				// Convertir el texto en canvas a base64
				this.titleImg = textCanvas.toDataURL('image/png')

				// Generar el código de barras
				const barcodeCanvas = document.createElement('canvas')
				JsBarcode(barcodeCanvas, text, {
					format: 'CODE128',
					displayValue: false,
					width: 5,
					height: 200,
				})
				const rotatedBarcodeCanvas = document.createElement('canvas')
				rotatedBarcodeCanvas.width = barcodeCanvas.height
				rotatedBarcodeCanvas.height = barcodeCanvas.width
				const rotatedBarcodeCtx = rotatedBarcodeCanvas.getContext('2d')
				rotatedBarcodeCtx.translate(rotatedBarcodeCanvas.width, 0)
				rotatedBarcodeCtx.rotate(45)
				rotatedBarcodeCtx.drawImage(barcodeCanvas, 0, 0)
				// Convertir el código de barras en canvas a base64
				this.barImg = barcodeCanvas.toDataURL('image/png')
			},
			async report(id, name) {
				let tbGroups = []
				let tb = {
					style: 'tableExample',
					table: {
						headerRows: 1,
						widths: ['*', '*', '*', '*'],
						body: [
							[
								{ text: 'SKU/UPC', style: 'tableHeader' },
								{ text: 'SERIAL', style: 'tableHeader' },
								{ text: 'Type', style: 'tableHeader' },
								{ text: 'QTY', style: 'tableHeader' },
							],
						],
					},
					layout: 'lightHorizontalLines',
				}
				let units = await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY)
					.select('*')
					.from('LN_Inventory')
					.where(`PalletID='${id}'`)
					.execute()
				console.log(units)
				let total = 0
				for (let info of units) {
					total += info.Qty
					tb.table.body.push([info.Product, info.Serial, info.Type, info.Qty])
				}
				let groups = new Set(units.map((obj) => obj.myGroup))
				groups = [...groups]
				console.log(groups)
				for (let group of groups) {
					let spInf = []
					let mg = ''
					if (group) {
						let myinf = units.filter((v) => v.myGroup == group)
						let subtotal = 0
						for (let info of myinf) {
							spInf.push([info.Product, info.Serial, info.Type, info.myGroup, info.Qty])
							mg = info.myGroup
							subtotal += info.Qty
						}
						tbGroups.push(
							{
								text: `${name}-${mg} QTY = ${subtotal}`,
								fontSize: 36,
								style: 'header',
							},
							{
								style: 'tableExample',
								table: {
									headerRows: 1,
									widths: ['*', '*', '*', '*', '*'],
									body: [
										[
											{ text: 'SKU/UPC', style: 'tableHeader' },
											{ text: 'SERIAL', style: 'tableHeader' },
											{ text: 'Type', style: 'tableHeader' },
											{ text: 'Group', style: 'tableHeader' },
											{ text: 'QTY', style: 'tableHeader' },
										],
										...spInf,
									],
								},
								layout: 'lightHorizontalLines',
							},
							{ text: '', pageBreak: 'before' }
						)
					}
				}
				//console.log(JSON.stringify(tbGroups))
				await this.mainReport(name)
				var dd = {
					pageSize: 'letter',
					content: [
						// Texto
						/* { image: this.titleImg, width: 200, height: 50, alignment: 'center' },
						// Código de barras
						{ image: this.barImg, width: 200, height: 50, alignment: 'center' },
						{ text: '', pageBreak: 'before' }, */

						// Segunda página con orientación vertical
						// Contenido de la segunda página (puedes agregar más elementos según sea necesario)

						// Tercera página con la tabla
						...tbGroups,
						{
							text: `${name} - QTY = ${total}`,
							fontSize: 36,
							style: 'header',
						},
						tb,
					],
					styles: {
						header: {
							fontSize: 18,
							bold: true,
							margin: [0, 0, 0, 10],
						},
						subheader: {
							fontSize: 16,
							bold: true,
							margin: [0, 10, 0, 5],
						},
						tableExample: {
							margin: [0, 5, 0, 15],
						},
						tableHeader: {
							bold: true,
							fontSize: 13,
							color: 'black',
						},
					},
					defaultStyle: {
						fontSize: 12,
					},
				}

				console.log(JSON.stringify(dd))
				pdfMake.vfs = pdfFonts.pdfMake.vfs
				pdfMake.createPdf(dd).download(`${name}.pdf`)
				this.dd = dd
			},
		},
		async beforeCreate() {},
		async mounted() {
			const electron = require('electron')
			const remote = electron.remote
			const ventanaActual = remote.getCurrentWindow()
			ventanaActual.maximize()
			this.$q.loading.show()
			this.setting = (
				await this.$rsDB('LunaInventoryDB', env.DB_INVENTORY).select('*').from('conf_Setting').execute()
			)[0]
			await this.catalog()
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
