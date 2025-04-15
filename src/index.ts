import express, { Router } from 'express'

const port = 8080
const router = Router()

const app = express() // <-- thiếu dòng này

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

router.get('/', (req, res) => {
  res.send('Hello World!')
})

router.get('/test', (req, res) => {
  res.send('Hello World2!')
})
app.use(router)
