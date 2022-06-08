import {
	DefaultBodyType,
	PathParams,
	ResponseResolver,
	rest,
	RestContext,
	RestRequest,
} from 'msw'
import { createFile } from '../utils'
import { newAdminUser, newFileDataList } from '../factories'

const listResolver: ResponseResolver<
	RestRequest<never, PathParams<string>>,
	RestContext,
	DefaultBodyType
> = (req, res, ctx) => {
	return res(ctx.json(newFileDataList()))
}

const handlers = [
	rest.get('/api/whoami', (req, res, ctx) => {
		return res(ctx.json(newAdminUser(undefined, true)))
	}),
	rest.get('/api/files/list', listResolver),
	rest.delete('/api/files', (req, res, ctx) => {
		return res(ctx.status(200), ctx.json('true'))
	}),
	rest.get('/api/files', (req, res, ctx) => {
		const file = createFile('fakeReturn.txt', 1000, 'text')
		return res(
			ctx.status(200),
			ctx.set('Content-Length', file.size.toString()),
			ctx.set('Content-Type', 'text'),
			ctx.body(file),
		)
	}),
]

export { handlers, listResolver }
