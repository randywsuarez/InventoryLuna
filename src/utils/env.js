export default {
	DB_ISPT: {
		server: 'sqlprodisp.database.windows.net',
		user: 'sfis',
		password: 'Sf1s@R3ad_1sp#2023prod',
	},
	DB_INVENTORY: {
		server: 'sqlprodisp.database.windows.net',
		user: 'sfis_inventory',
		password: 'sf1s_1nv3ntory#',
	},
	localDB: {
		server: '192.168.0.6',
		user: 'rsuarez',
		password: 'isp2023#',
		table: 'npi_06_test_snresults',
	},

	project: [
		/* {
			db: 'SFisDB_DEV',
			admin: 'SfisAdminDB_DEV',
			id: 'HPRefurbish',
			url: 'https://dev-sfis.ispt.app/api',
		}, */
		{
			db: 'SfisDB',
			admin: 'SfisAdminDB',
			id: 'HPRefurbish',
			url: 'https://sfis.ispt.app/api',
		},
		{
			db: 'Sfis_HP_RevenueDB',
			admin: 'Sfis_HP_RevenueAdminDB',
			id: 'ISP-PC',
			url: 'https://shared-revenue.ispt.app/api',
		},
	],
	mongodb: {
		dev: 'http://localhost:4500/api',
		server: 'http://192.168.0.2:4500/api',
	},
	version: '1.1.0',
	token: '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',
	github: {
		user: 'randywsuarez',
		repository: 'InventoryLuna',
	},
}
