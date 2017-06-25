import _ from 'lodash';

export function createWorldTiles({ props: { world } }) {
  world.tiles = [];
  _.times(world.dimension.height, (y) => {
    _.times(world.dimension.width, (x) => {
      world.tiles.push(createWorldTile(x, y));
    });
  });
}

export function fillWorldTiles({ props: { entities, uiElements, world: { tiles, filling: { floor } } } }) {
  tiles.forEach((tile) => {
    tile.worldObjects = [createWorldObject(floor, entities, uiElements)];
  });
}

export function fillWorldObjects({ props: { entities, uiElements, world } }) {
  world.filling.objects.forEach((object) => {
    tileAt(world, object.location.x, object.location.y)
      .worldObjects
      .push(createWorldObject(object.entity, entities, uiElements));
  })
}

function tileAt(world, x, y) {
  return world.tiles[(y * world.dimension.width) + x];
}

function createWorldTile(x, y) {
  return {
    x, y, worldObjects: []
  };
}

function createWorldObject(name, entities, uiElements) {
  const entity = _.find(entities.definitions, { name });
  return {
    name,
    uiElements: entity.uiElements.map((uiElement) => createUiElement(uiElement, uiElements))
  };
}

function createUiElement(name, uiElements) {
  const uiElement = _.find(uiElements.definitions, { name });
  return {
    name: uiElement.name,
    sprite: _.sample(uiElement.sprites),
    zIndex: uiElement.zIndex || 0
  };
}
