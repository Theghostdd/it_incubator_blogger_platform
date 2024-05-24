import { SETTINGS } from "./settings"
import { app } from "./app"

app.listen(SETTINGS.PORT, () => {
  console.log(`Example app listening on port ${SETTINGS.PORT}`)
})