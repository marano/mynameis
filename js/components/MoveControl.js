import { inject } from "mobx-react"

import Button from "./Button"

export default inject(({ state, actions }) => ({
  isPressed: state.game.isMoveControlPressed,
  actions
}))(MoveControl)

function MoveControl({ isPressed, actions: { moveControlPressed } }) {
  return (
    <Button isSelected={isPressed} onClick={moveControlPressed} allowUnselect>
      Move
    </Button>
  )
}
