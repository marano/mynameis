import { inject } from "mobx-react"
import { linkEvent } from "inferno"

import ScenesMenuItem from "./ScenesMenuItem"
import Button from "./Button"
import hasKeyedChildren from "has-keyed-children"

export default inject(({ state: { editor: { scenePaths } }, actions }) => ({
  scenePaths,
  actions
}))(ScenesMenu)

function ScenesMenu({ scenePaths, scenePath, actions: { newSceneAdded } }) {
  return (
    <div>
      {scenePaths.map(eachScenePath => (
        <ScenesMenuItem
          key={eachScenePath}
          scenePath={eachScenePath}
          currentScenePath={scenePath}
          {...hasKeyedChildren}
        />
      ))}
      <Button onClick={linkEvent(newSceneAdded, onNewSceneButtonClick)}>
        New
      </Button>
    </div>
  )
}

function onNewSceneButtonClick(newSceneAdded) {
  newSceneAdded()
}
