import { css } from "emotion"

export const cursor = css`
  :before {
    position: absolute;
    z-index: 1000;
    box-shadow: inset 0px 0px 0px 1px white;
    content: "";
    width: var(--tile-size);
    height: var(--tile-size);
  }
`

export const cursorExpanded = css`
  :before {
    ${cursor};
    width: var(--tile-size) + 2;
    height: var(--tile-size) + 2;
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
