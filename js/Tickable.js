function Tickable(worldObject, duration, onDone) {
  this.worldObject = worldObject;
  this.duration = duration;
  this.onDone = onDone;

  this.elapsedTime = 0;

  this.worldObject.tickables.push(this);
}

Tickable.prototype.tick = function () {
  this.elapsedTime = this.elapsedTime + this.worldObject.world.tickInterval;
  if (this.elapsedTime >= this.duration) {
    this.worldObject.tickables.remove(this);
    this.onDone();
  }
};