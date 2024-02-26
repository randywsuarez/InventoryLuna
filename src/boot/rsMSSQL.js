const sql = require('mssql')
export default async ({ Vue }) => {
	class RsDB {
		constructor(databaseName, db) {
			this.config = {
				user: db.user,
				password: db.password,
				server: db.server,
				database: databaseName,
				options: db.options || {},
			}

			this.idColumnName = '' // Inicializar idColumnName en el constructor
		}

		async executeQuery(query) {
			try {
				const pool = await new sql.ConnectionPool(this.config).connect()
				const request = pool.request()

				const result = await request.query(query)

				await pool.close()

				return result.recordset
			} catch (error) {
				throw new Error(`Error executing SQL query: ${error.message}`)
			}
		}

		myQuery(query, parameters) {
			if (!parameters) {
				this.query = query
			} else {
				this.query = {
					text: query,
					values: parameters,
				}
			}
			return this
		}

		select(fields) {
			this.query = `SELECT ${fields}`
			return this
		}

		from(table) {
			this.query += ` FROM ${table}`
			return this
		}

		where(conditions) {
			this.query += ` WHERE ${conditions}`
			return this
		}

		orderBy(orderBy) {
			this.query += ` ORDER BY ${orderBy}`
			return this
		}

		limit(limit) {
			this.query += ` ORDER BY 1 OFFSET 0 ROWS FETCH NEXT ${limit} ROWS ONLY`
			return this
		}

		insert(table) {
			this.query = `INSERT INTO ${table}`
			return this
		}

		valuesArray(arrayOfFields) {
			const fields = Object.keys(arrayOfFields[0]).join(', ')
			const values = arrayOfFields
				.map(
					(fieldsObj) =>
						'(' +
						Object.values(fieldsObj)
							.map((value) =>
								value === 'NEWID()' || value === 'GETDATE()'
									? value
									: typeof value === 'string'
									? `'${value}'`
									: value
							)
							.join(', ') +
						')'
				)
				.join(', ')

			this.query += ` (${fields}) VALUES ${values}`
			return this
		}

		update(table) {
			this.query = `UPDATE ${table}`
			return this
		}

		setArray(arrayOfFields) {
			const sets = arrayOfFields
				.map((fieldsObj) =>
					Object.entries(fieldsObj)
						.map(([field, value]) => `${field} = ${typeof value === 'string' ? `'${value}'` : value}`)
						.join(', ')
				)
				.join(', ')

			this.query += ` SET ${sets}`
			return this
		}
		set(fieldsObj) {
			const sets = Object.entries(fieldsObj)
				.map(([field, value]) => `${field} = ${typeof value === 'string' ? `'${value}'` : value}`)
				.join(', ')

			this.query += ` SET ${sets}`

			return this
		}

		delete(table) {
			this.query = `DELETE FROM ${table}`
			return this
		}

		value(value) {
			this.query += ` = ${typeof value === 'string' ? `'${value}'` : value}`
			return this
		}

		valuesArray(arrayOfFields) {
			const fields = Object.keys(arrayOfFields[0]).join(', ')
			const values = arrayOfFields
				.map(
					(fieldsObj) =>
						'(' +
						Object.values(fieldsObj)
							.map((value) =>
								value === 'NEWID()' || value === 'GETDATE()'
									? value
									: typeof value === 'string'
									? `'${value}'`
									: value
							)
							.join(', ') +
						')'
				)
				.join(', ')

			this.query += ` (${fields}) VALUES ${values}`
			console.log(this.query)
			return this
		}

		fields(fieldsObj) {
			const fields = Object.keys(fieldsObj).join(', ')
			const values = Object.values(fieldsObj)
				.map((value) =>
					value === 'NEWID()' || value === 'GETDATE()'
						? value
						: typeof value === 'string'
						? `'${value}'`
						: value
				)
				.join(', ')

			this.query += ` (${fields}) VALUES (${values})`

			return this
		}

		id(idColumnName) {
			// Método para especificar el nombre de la columna ID
			this.idColumnName = idColumnName
			return this
		}

		async execute() {
			try {
				const pool = await new sql.ConnectionPool(this.config).connect()
				const request = pool.request()

				const result = await request.query(this.query)

				await pool.close()

				if (this.query.toLowerCase().includes('insert')) {
					// Es una operación de inserción
					const insertedId = this.idColumnName ? result.recordset[0][this.idColumnName] : undefined

					return {
						status: true,
						operation: 'insert',
						insertedId: insertedId,
						affectedRows: result.rowsAffected[0],
					}
				} else if (this.query.toLowerCase().includes('update')) {
					// Es una operación de actualización
					return {
						status: true,
						operation: 'update',
						affectedRows: result.rowsAffected[0],
					}
				} else if (this.query.toLowerCase().includes('delete')) {
					// Es una operación de eliminación
					return {
						status: true,
						operation: 'delete',
						affectedRows: result.rowsAffected[0],
					}
				} else {
					// Es una consulta SELECT u otra operación no manejada específicamente
					return result.recordset
				}
			} catch (error) {
				console.error(error)
				return {
					status: false,
					error: `Error executing SQL query: ${error.message}`,
				}
			}
		}
	}
	Vue.prototype.$rsDB = (databaseName, db) => new RsDB(databaseName, db)
}
