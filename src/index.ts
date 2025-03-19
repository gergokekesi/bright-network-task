import { getConfig } from "./utils/config.util"
import { logger } from "./utils/logger"

const main = async () => {
  try {
    logger.info("Running job recommender...\n")

    const config = getConfig()

    logger.info("Config loaded: ", config)
  } catch (error) {
    logger.error("An error occurred: ", error)
  }
}

main()
