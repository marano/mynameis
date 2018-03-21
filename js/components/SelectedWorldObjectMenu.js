import { inject } from "mobx-react"
import { get, curry, map } from "lodash"

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
    roles: (entity.roles || []).slice()
  }
})(SelectedWorldObjectMenu)

function SelectedWorldObjectMenu(props) {
  return (
    <div style={style()}>{props.worldObjectPath ? content(props) : "-"}</div>
  )
}

function content({ worldObjectName, roles, worldObjectPath }) {
  return (
    <div>
      <div>{worldObjectName}</div>
      <div>{roles.map(curry(roleControls)(worldObjectPath))}</div>
    </div>
  )
}

function roleControls(worldObjectPath, role) {
  return map({ "player-character": [MoveControl] }[role], (Control, index) => (
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
