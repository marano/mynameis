import { css } from "emotion"

export const cursor = css`
  :after {
    box-sizing: border-box;
    position: absolute;
    z-index: 1000;
    border: 1px solid white;
    content: "";
    width: var(--tile-size);
    height: var(--tile-size);
    top: 0;
    left: 0;
  }
`

export const cursorExpanded = css`
  ${cursor};
  :after {
    width: calc(var(--tile-size) + 2px);
    height: calc(var(--tile-size) + 2px);
    top: -1px;
    left: -1px;
  }
`

export const cursorOnHover = css`
  :hover {
    ${cursor};
  }
`

export const hiddenChild = css`
  visibility: hidden;
`

export const showHiddenChildOnHover = css`
  :hover {
    .${hiddenChild} {
      visibility: visible;
    }
  }
`

export const fogOfWar = css`
  pointer-events: none;
  transition: opacity 300ms;
  opacity: 0.2;
`

const fogOfWarWithoutBorders = css`
  ${fogOfWar};

  pointer-events: auto;
`

export const fogOfWarRemoved = css`
  ${fogOfWarWithoutBorders};

  opacity: 1;
`

export const unwatched = css`
  ${fogOfWarWithoutBorders};

  opacity: 0.5;
`
