import { inject } from "mobx-react"
import { get, curry } from "lodash"

import MoveControl from "./MoveControl"

export default inject(({ state }) => {
  const worldObject = get(state, state.game.selectedWorldObjectPath)
  if (!worldObject) {
    return {}
  }
  const entity = state.definitions.entities[worldObject.entityName]
  return {
    worldObjectPath: state.game.selectedWorldObjectPath,
    worldObjectName: worldObject.entityName,
    agencies: (entity.agencies || []).slice()
  }
})(SelectedWorldObjectMenu)

function SelectedWorldObjectMenu(props) {
  return (
    <div style={style()}>{props.worldObjectPath ? content(props) : "-"}</div>
  )
}

function content({ worldObjectName, agencies, worldObjectPath }) {
  return (
    <div>
      <div>{worldObjectName}</div>
      <div>{agencies.map(curry(agencyControls)(worldObjectPath))}</div>
    </div>
  )
}

function agencyControls(worldObjectPath, agency) {
  return {
    "player-character": [MoveControl]
  }[agency].map((Control, index) => (
    <Control key={index} worldObjectPath={worldObjectPath} />
  ))
}

function style() {
  return {
    color: "white",
    fontFamily: "monospace",
    width: 100,
    minHeight: 100
  }
}
