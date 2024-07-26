import { SETTINGS } from "./settings"
import { app } from "./app"
import { startDB } from "./internal/application/connection-db/connection"
import {requestLimiter} from "./composition-root/request-limiter-composition-root";



const start = async () => {
  await startDB()
  app.listen(SETTINGS.PORT, () => {
    console.log(`App listening on port ${SETTINGS.PORT}`)
  })
}

start()

setInterval(async () => {
  await requestLimiter.clearRequestCollection()
}, 259200)

