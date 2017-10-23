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

export const cursorOnHover = css`
  :hover {
    ${cursor};
  }
`
