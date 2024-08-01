import { SETTINGS } from "./settings"
import { app } from "./app"
import {DataBase} from "./internal/application/connection-db/connection"
import {RequestLimiter} from "./internal/middleware/request-limit/request-limit";
import {container} from "./composition-root/composition-root";


const db = container.resolve(DataBase)

const start = async () => {
  await db.start()
  app.listen(SETTINGS.PORT, () => {
    console.log(`App listening on port ${SETTINGS.PORT}`)
  })
}

start()


const requestLimiter = container.resolve(RequestLimiter)
setInterval(async () => {
  await requestLimiter.clearRequestCollection()
}, 259200)

