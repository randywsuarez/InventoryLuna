const routes = [
	{
		path: '/',
		component: () => import('layouts/MainLayout.vue'),
		children: [{ path: '', component: () => import('pages/Index.vue') }],
	},
	{
		path: '/inventory',
		component: () => import('layouts/MainLayout.vue'),
		children: [{ path: '', component: () => import('pages/list/inventory.vue') }],
	},
	{
		path: '/new',
		component: () => import('layouts/MainLayout.vue'),
		children: [{ path: '', component: () => import('pages/Index.vue') }],
	},
	{
		path: '/palletTypes',
		component: () => import('layouts/MainLayout.vue'),
		children: [{ path: '/', component: () => import('src/pages/Catalog/palletTypes.vue') }],
	},
	{
		path: '/OtherProducts',
		component: () => import('layouts/MainLayout.vue'),
		children: [{ path: '/', component: () => import('src/pages/Catalog/otherProducts.vue') }],
	},
	{
		path: '/productTypes',
		component: () => import('layouts/MainLayout.vue'),
		children: [{ path: '/', component: () => import('src/pages/Catalog/productTypes.vue') }],
	},
	{
		path: '/login',
		component: () => import('layouts/LoginLayout.vue'),
		children: [{ path: '', component: () => import('layouts/LoginLayout.vue') }],
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: '*',
		component: () => import('pages/Error404.vue'),
	},
]

export default routes
