import Inferno from "inferno"

if (process.env.NODE_ENV === "development") {
  require("inferno-devtools")
}

Inferno.options.recyclingEnabled = true
