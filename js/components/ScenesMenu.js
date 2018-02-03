import { inject } from "mobx-react"
import { linkEvent } from "inferno"

import ScenesMenuItem from "./ScenesMenuItem"
import Button from "./Button"
import hasKeyedChildren from "has-keyed-children"

// export default connect(
//   {
//     scenePaths: state`editor.scenePaths`,
//     newSceneAdded: signal`newSceneAdded`,
//     sceneChanged: signal`sceneChanged`
//   },
//   ScenesMenu
// )

export default inject(({ state: { editor: { scenePaths } } }) => ({
  scenePaths,
  newSceneAdded: () => {},
  sceneChanged: () => {}
}))(ScenesMenu)

function ScenesMenu({ scenePaths, scenePath, newSceneAdded, sceneChanged }) {
  return (
    <div>
      {scenePaths.map(eachScenePath => (
        <ScenesMenuItem
          key={eachScenePath}
          scenePath={eachScenePath}
          currentScenePath={scenePath}
          onClick={linkEvent(
            { sceneChanged, scenePath: eachScenePath },
            onSceneButtonClick
          )}
          {...hasKeyedChildren}
        />
      ))}
      <Button onClick={linkEvent(newSceneAdded, onNewSceneButtonClick)}>
        New
      </Button>
    </div>
  )
}

function onSceneButtonClick({ sceneChanged, scenePath }) {
  sceneChanged({ scenePath })
}

function onNewSceneButtonClick(newSceneAdded) {
  newSceneAdded()
}
