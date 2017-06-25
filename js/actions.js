import _ from 'lodash';

export function instantiateWorldObjects({ props: { entities, world, uiElements } }) {
  world.objects.forEach((object) => {
    const entity = _.find(entities.definitions, { name: object.entity });
    object.uiElements = entity.uiElements.map((uiElement) => {
      return _.find(uiElements.definitions, { name: uiElement });
    });
  })
}
