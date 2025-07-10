import { createService } from '@das-fed/utils/api-services'

const http = createService('/test')

export const getUser = http.get('/user')
export const addUser = http.post('/user')
