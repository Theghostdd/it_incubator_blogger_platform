import { SETTINGS } from "./settings"
import { app } from "./app"
import { startDB } from "./Applications/ConnectionDB/Connection"



const start = async () => {
  await startDB()
  app.listen(SETTINGS.PORT, () => {
    console.log(`App listening on port ${SETTINGS.PORT}`)
  })
}

start()