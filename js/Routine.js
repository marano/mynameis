function Routine(steps) {
  this.steps = steps;
  this.remainingSteps = _.clone(steps);
  this.nextStep = this.remainingSteps.shift();
  this.actionPoints = 0;
  this.isDone = false;
}

Routine.prototype.tick = function () {
  this.actionPoints++;

  if (this.actionPoints >= this.nextStep.cost) {
    this.actionPoints = this.actionPoints - this.nextStep.cost;
    this.nextStep.perform();
    this.nextStep = this.remainingSteps.shift();
    console.log(this.nextStep);
  }

  if (this.remainingSteps.length === 0) {
    this.isDone = true;
  }
};