import { SETTINGS } from "./settings"
import { app } from "./app"
import { startDB } from "./Applications/ConnectionDB/Connection"
import { clearRequestCollection } from "./Applications/Middleware/request-limit/request-limit"



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