<template>
	<q-layout view="lHh Lpr lFf" class="main-layout">
		<q-header class="main-header">
			<q-bar
				style="min-width: 250px"
				class="bg-teal text-white rounded-borders"
				@mousedown="startDrag"
			>
				<div class="cursor-pointer non-selectable">
					File
					<q-menu>
						<q-list dense style="min-width: 100%">
							<q-item clickable v-close-popup to="/">
								<q-item-section>Open...</q-item-section>
							</q-item>
							<q-item clickable v-close-popup>
								<q-item-section>New</q-item-section>
							</q-item>
							<q-separator />
							<q-item clickable>
								<q-item-section>Preferences</q-item-section>
								<q-item-section side>
									<q-icon name="keyboard_arrow_right" />
								</q-item-section>

								<q-menu anchor="top end" self="top start">
									<q-list dense>
										<q-item v-for="n in 3" :key="n" clickable>
											<q-item-section>Submenu Label</q-item-section>
											<q-item-section side>
												<q-icon name="keyboard_arrow_right" />
											</q-item-section>
											<q-menu auto-close anchor="top end" self="top start">
												<q-list dense>
													<q-item v-for="n in 3" :key="n" clickable>
														<q-item-section>3rd level Label</q-item-section>
													</q-item>
												</q-list>
											</q-menu>
										</q-item>
									</q-list>
								</q-menu>
							</q-item>
							<q-separator />
							<q-item clickable v-close-popup>
								<q-item-section>Quit</q-item-section>
							</q-item>
						</q-list>
					</q-menu>
				</div>
				<div class="cursor-pointer non-selectable">
					catalog
					<q-menu>
						<q-list dense style="min-width: 100px">
							<q-item clickable v-close-popup to="/typePallet">
								<q-item-section>Pallet Types</q-item-section>
							</q-item>
							<q-item clickable v-close-popup>
								<q-item-section>Product Types</q-item-section>
							</q-item>
							<q-item clickable v-close-popup>
								<q-item-section>Other Products</q-item-section>
							</q-item>
							<q-separator />
							<q-item clickable v-close-popup>
								<q-item-section>Setting</q-item-section>
							</q-item>
						</q-list>
					</q-menu>
				</div>
				<q-space />
				<q-btn dense flat icon="minimize" @click="minimizeWindow()" />
				<q-btn
					dense
					flat
					:icon="isMaximized ? 'fullscreen_exit' : 'crop_square'"
					@click="maximizeWindow"
				/>
				<q-btn dense flat icon="close" @click="closeWindow()" />
			</q-bar>
			<!-- <q-toolbar>
				<q-btn flat dense round icon="logout" @click="cerrarSesion" />

				<q-toolbar-title>Inventory - ISPT Services V{{ version }}</q-toolbar-title>
				<div class="close-button" @click="cerrarVentana">
					<q-icon name="close" size="24px" color="white" />
				</div>
			</q-toolbar> -->
		</q-header>

		<q-dialog v-model="isDialogVisible" class="login-card" persistent>
			<q-card>
				<q-card-section>
					<div class="text-h6">Without Internet</div>
				</q-card-section>

				<q-card-section>
					<div class="q-pa-md text-h6">
						There is no Internet conection. Please verify your connection.
					</div>
				</q-card-section>

				<!-- Puedes personalizar los botones según tus necesidades -->
				<q-card-actions align="right">
					<!-- <q-btn label="Cerrar" color="primary" @click="closeDialog" /> -->
				</q-card-actions>
			</q-card>
		</q-dialog>
		<q-dialog v-model="updt" persistent>
			<q-card>
				<q-card-section>
					<div class="text-h6">Update</div>
				</q-card-section>

				<q-separator />

				<q-card-section style="max-height: 50vh">
					<p>
						New version available! its current version is: {{ v.current }} and the new version is:
						{{ v.new }}
					</p>
				</q-card-section>
				<q-separator />

				<q-card-section style="max-height: 50vh" class="scroll">
					<h4>Changes</h4>
					<p>
						{{ v.body }}
					</p>
				</q-card-section>

				<q-separator />

				<q-card-actions align="right">
					<q-btn flat label="Accept" color="primary" @click="update" v-close-popup />
				</q-card-actions>
			</q-card>
		</q-dialog>

		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>
<script>
	import EssentialLink from 'components/EssentialLink.vue'
	import winDate from '../scripts/updateDate'
	import UpdateService from '../utils/updateService'
	import env from '../utils/env'
	const electron = require('electron')

	const linksData = [
		{
			title: 'Login',
			caption: 'Login',
			icon: 'school',
			link: '/login',
		},
	]

	export default {
		name: 'MainLayout',
		components: {
			EssentialLink,
		},
		data() {
			return {
				leftDrawerOpen: false,
				essentialLinks: linksData,
				test: { result: false },
				hasInternet: navigator.onLine,
				isDialogVisible: false,
				checkInterval: null,
				intervalId: null,
				updt: false,
				v: {},
				version: '',
				updateService: '',
				isMaximized: false,
			}
		},
		async created() {
			this.version = env.version
			this.startInternetCheckInterval()
			let credencialesGuardadas = await this.$rsNeDB('credenciales').findOne({})
			console.log('randy: ', credencialesGuardadas)
			//console.log(credencialesGuardadas)
			if (credencialesGuardadas == null) {
				console.log('sin registro')
				this.$q.loading.hide()
				this.$router.push('/login')
			} else {
				this.comprobarToken(credencialesGuardadas)
			}
		},
		methods: {
			closeWindow() {
				remote.getCurrentWindow().close()
			},
			quitApplication() {
				const { app } = remote
				app.quit()
			},
			minimizeWindow() {
				electron.remote.getCurrentWindow().minimize()
			},
			maximizeWindow() {
				const currentWindow = electron.remote.getCurrentWindow()

				if (currentWindow.isMaximized()) {
					currentWindow.unmaximize()
					this.isMaximized = false
				} else {
					currentWindow.maximize()
					this.isMaximized = true
				}
			},
			startDrag(event) {
				if (event.button === 0) {
					this.dragging = true
					this.offsetX = event.clientX
					this.offsetY = event.clientY

					window.addEventListener('mousemove', this.dragWindow)
					window.addEventListener('mouseup', this.stopDrag)
				}
			},
			startDrag(event) {
				if (event.button === 0) {
					this.dragging = true
					this.offsetX = event.screenX
					this.offsetY = event.screenY

					window.addEventListener('mousemove', this.dragWindow)
					window.addEventListener('mouseup', this.stopDrag)
				}
			},
			dragWindow(event) {
				if (this.dragging) {
					const currentWindow = electron.remote.getCurrentWindow()

					const newX = event.screenX - this.offsetX
					const newY = event.screenY - this.offsetY

					const [currentX, currentY] = currentWindow.getPosition()

					currentWindow.setPosition(currentX + newX, currentY + newY)

					this.offsetX = event.screenX
					this.offsetY = event.screenY
				}
			},
			stopDrag() {
				this.dragging = false
				window.removeEventListener('mousemove', this.dragWindow)
				window.removeEventListener('mouseup', this.stopDrag)
			},
			checkInternetConnection() {
				this.hasInternet = navigator.onLine

				if (!this.hasInternet && !this.isDialogVisible) {
					// Si no hay conexión y el diálogo no está visible, muestra el diálogo
					this.isDialogVisible = true
				} else if (this.hasInternet && this.isDialogVisible) {
					// Si hay conexión y el diálogo está visible, cierra el diálogo
					this.isDialogVisible = false
				}
			},
			closeDialog() {
				// Método para cerrar el diálogo manualmente
				this.isDialogVisible = false
			},
			startInternetCheckInterval() {
				// Inicia el intervalo para verificar la conexión cada 5 segundos (puedes ajustar el valor)
				this.checkInterval = setInterval(this.checkInternetConnection, 5000)
			},
			stopInternetCheckInterval() {
				// Detiene el intervalo cuando ya no es necesario
				clearInterval(this.checkInterval)
			},
			async comprobarToken() {
				let respuesta = await this.checkToken()
				//console.log(respuesta[0])
				if (respuesta.length && respuesta[0].estado === 'OK') {
					console.log('Usuario autenticado')
				} else {
					console.error('Token no válido, redirigiendo al LoginLayout')
					this.$q.loading.hide()
					this.$router.push('/login')
				}
			},
			async checkToken() {
				const checkTokenPromises = this.$env.project.map(async (s) => {
					try {
						let info = await this.$rsNeDB('credenciales').findOne({
							tenant: s.id,
						})
						const options = {
							method: 'GET',
							headers: {
								Authorization: info.AuthToken,
							},
						}

						const response = await fetch(`${s.url}/APP/Projects/ObtainProjects`, options)
						const data = await response.json()

						if (data.length) {
							//console.log(data)
							return { estado: 'OK' }
						} else {
							//throw new Error('Invalid response')
						}
					} catch (err) {
						//console.error(err)
						throw err
					}
				})
				return Promise.all(checkTokenPromises)
			},
			cerrarVentana() {
				// Cerrar la ventana en Electron
				const { remote } = require('electron')
				const ventanaActual = remote.getCurrentWindow()
				ventanaActual.close()
			},
			cerrarSesion() {
				this.$cmd.logout()
				this.$router.push('/login')
			},
			async update() {
				this.$q.loading.show({
					message: 'Downloading and updating...',
				})
				const exito = await this.updateService.descargarYDescomprimir(this.v.new)

				if (exito) {
					// Actualización exitosa, puedes realizar acciones adicionales si es necesario
					this.$q.loading.hide()
					//await this.$cmd.change()
					await this.$cmd.update()
					//await updateService.program()

					//window.location.reload(true) // Recargar la aplicación después de la actualización
				} else {
					this.$q.loading.hide()
					this.$q.notify({
						color: 'negative',
						message: 'Error downloading or unzipping the update.',
					})
				}
			},
		},
		async mounted() {
			this.updateService = new UpdateService(
				env.github.user,
				env.github.repository,
				env.version,
				env.token
			)

			/* const actualizacionDisponible = await this.updateService.verificarActualizacion()

			if (actualizacionDisponible.result) {
				clearInterval(this.intervalId)
				this.v['current'] = env.version
				this.v['new'] = actualizacionDisponible.version
				this.v['body'] = actualizacionDisponible.body
				this.updt = actualizacionDisponible.result
			} */
		},
		beforeDestroy() {},
	}
</script>
<style scoped>
	.main-layout {
		background: linear-gradient(45deg, #ffffff, #87cefa); /* Degradado entre blanco y azul pastel */
		transition: background 0.5s ease-in-out; /* Animación de cambio de fondo */
	}

	.main-header {
		background: rgba(255, 255, 255, 0.1); /* Fondo translúcido para el efecto de vidrio */
		backdrop-filter: blur(10px);
		transition: background 0.5s ease-in-out; /* Animación de cambio de fondo */
		border-bottom: 1px solid rgba(255, 255, 255, 0.2); /* Borde en la parte inferior */
	}

	.close-button {
		cursor: pointer;
		margin-left: auto;
		padding: 10px;
		transition: transform 0.3s ease-in-out; /* Animación de escala */
	}

	.close-button:hover {
		transform: scale(1.2); /* Efecto de escala al pasar el mouse */
	}
</style>
