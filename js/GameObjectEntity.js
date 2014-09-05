function GameObjectEntity() {

}

GameObjectEntity.prototype.factory = function (gameObjectEntityName) {
  return eval(gameObjectEntityName)
};