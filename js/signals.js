import {
  loadEntities,
  selectWorldObject,
  selectObjectPickerEntity,
  addWorldObject,
  selectSceneTile,
  changeMode,
  changeCameraMode,
  changeSceneSize,
  resizeViewport,
  handleKeyPress,
  moveViewport,
  addNewScene,
  changeScene,
  closeScene
} from "./sequences"

export default {
  entitiesLoaded: loadEntities,
  worldObjectSelected: selectWorldObject,
  objectPickerEntitySelected: selectObjectPickerEntity,
  worldObjectAdded: addWorldObject,
  sceneTileSelected: selectSceneTile,
  modeChanged: changeMode,
  cameraModeChanged: changeCameraMode,
  sceneSizeChanged: changeSceneSize,
  viewportResized: resizeViewport,
  keyPressed: handleKeyPress,
  viewportMoved: moveViewport,
  newSceneAdded: addNewScene,
  sceneChanged: changeScene,
  sceneClosed: closeScene
}
