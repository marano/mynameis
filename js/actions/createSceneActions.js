import { observable, toJS } from "mobx"
import { get, each, curry, startsWith, assign } from "lodash"
import { set, omit, prop, flow } from "lodash/fp"
import { range } from "ramda"
import { cross } from "d3-array"

import {
  createWorldObject,
  adjustViewportPositionForCameraMode
} from "./helpers"

export default function createSceneActions(state, computations, actions) {
  return {
    newSceneAdded() {
      const scene = createScene()
      const newScenePath = `scenes.${scene.id}`
      state.editor.scenePaths.push(newScenePath)
      state.viewport.currentScenePath = newScenePath
    },
    sceneChanged(scenePath) {
      state.viewport.currentScenePath = scenePath
    },
    sceneClosed(scenePath) {
      if (state.viewport.currentScenePath === scenePath) {
        state.viewport.currentScenePath = null
      }
      const scenePaths = state.editor.scenePaths
      const index = scenePaths.indexOf(scenePath)
      scenePaths.splice(index, 1)
      if (startsWith(scenePath, state.editor.selectedTilePath)) {
        state.ditor.selectedScenePath = null
      }
      const sceneId = get(state, scenePath).id
      delete state.scenes[sceneId]
    },
    sceneSizeChanged(scenePath, axis, delta, mode) {
      const scene = get(state, scenePath)
      changeSceneSize(scene, axis, delta, mode)
    },
    modeChanged(mode, scenePath) {
      switch (mode) {
        case "game":
          const sceneTemplate = flow(
            prop(scenePath),
            toJS,
            omit(["id"]),
            set("sourceScenePath", scenePath),
            set("currentMode", "game"),
            set("viewport.cameraLockMode", "locked")
          )(state)
          const newScene = createScene()
          each(
            sceneTemplate.tiles,
            eachTile => (eachTile.sceneId = newScene.id)
          )
          each(
            sceneTemplate.worldObjects,
            eachWorldObject => (eachWorldObject.sceneId = newScene.id)
          )
          assign(newScene, sceneTemplate)
          state.viewport.currentScenePath = `scenes.${newScene.id}`
          adjustViewportPositionForCameraMode(
            state.viewport,
            state,
            computations
          )
          break
        case "editor":
          const scene = get(state, scenePath)
          state.viewport.currentScenePath = scene.sourceScenePath
          if (startsWith(state.game.selectedWorldObjectPath, scenePath)) {
            state.game.selectedWorldObjectPath = null
          }
          delete state.scenes[scene.id]
          break
      }
    }
  }

  function createScene() {
    const id = actions.generateId("scene")
    const scene = observable({
      id,
      name: `Scene ${id}`,
      currentMode: "editor",
      tiles: {},
      worldObjects: {},
      playerCharacterWorldObjectIds: [],
      tickables: [],
      size: {
        x: 0,
        y: 0
      },
      viewport: {
        tileSize: 40,
        cameraLockMode: "locked",
        position: {
          x: 0,
          y: 0
        }
      }
    })
    state.scenes[id] = scene
    return scene
  }

  function changeSceneSize(scene, axis, delta, mode) {
    const sceneAxisSize = scene.size[axis]
    scene.size[axis] = sceneAxisSize + delta

    if (mode === "start") {
      each(scene.tiles, function(tile) {
        tile[axis] = tile[axis] + delta
      })
    }

    if (delta > 0) {
      const sceneSize = scene.size
      const deltaRange = {
        start: () => range(0, delta),
        end: () => range(sceneSize[axis] - 1, sceneSize[axis] + delta - 1)
      }[mode]()
      const otherAxisSizeRange = range(0, sceneSize[{ x: "y", y: "x" }[axis]])
      const createTileAt = curry(createSceneTile)(scene)
      ;({
        x: () => cross(deltaRange, otherAxisSizeRange, createTileAt),
        y: () => cross(otherAxisSizeRange, deltaRange, createTileAt)
      }[axis]())
    } else if (delta < 0) {
      const sceneSize = scene.size
      each(scene.tiles, function(tile, tileId) {
        const shouldRemove =
          tile.x < 0 ||
          tile.y < 0 ||
          tile.x >= sceneSize.x ||
          tile.y >= sceneSize.y
        if (shouldRemove) {
          each(tile.worldObjectIds.slice(), worldObjectId =>
            actions.removeWorldObject(scene.worldObjects[worldObjectId])
          )
          delete scene.tiles[tileId]
        }
      })
    }
  }

  function createSceneTile(scene, x, y) {
    const id = actions.generateId("tile")
    const tile = observable({
      sceneId: scene.id,
      id,
      x,
      y,
      worldObjectIds: [],
      isSelected: false,
      isDiscovered: false
    })

    scene.tiles[id] = tile

    const selectedEntityName = state.editor.objectPicker.selectedEntityName
    if (selectedEntityName) {
      const selectedEntity = state.definitions.entities[selectedEntityName]
      createWorldObject(selectedEntity, tile, scene, state, actions)
    }

    return tile
  }
}
