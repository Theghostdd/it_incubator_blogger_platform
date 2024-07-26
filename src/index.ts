import { SETTINGS } from "./settings"
import { app } from "./app"
import { startDB } from "./internal/application/connection-db/connection"
import { clearRequestCollection } from "./internal/middleware/request-limit/request-limit"



const start = async () => {
  await startDB()
  app.listen(SETTINGS.PORT, () => {
    console.log(`App listening on port ${SETTINGS.PORT}`)
  })
}

start()

setInterval(async () => {
  await clearRequestCollection()
}, 259200)

