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
  :after {
    transition: opacity 300ms linear;
    opacity: 1;
    border: 1px white solid;
    position: absolute;
    top: -1px;
    left: -1px;
    background-color: black;
    content: ' ';
    width: calc(var(--tile-size) - 2px);
    height: calc(var(--tile-size) - 2px);
    z-index 1000000000;
  }
`

const fogOfWarWithoutBorders = css`
  ${fogOfWar};

  :after {
    top: 0;
    left: 0;
    border: 0;
    width: var(--tile-size);
    height: var(--tile-size);
    @media screen and (-webkit-min-device-pixel-ratio: 0) and (min-resolution: 0.001dpcm) {
      // chrome only fix
      height: calc(var(--tile-size) + 0.5px);
    }
    pointer-events: none;
  }
`

export const fogOfWarRemoved = css`
  ${fogOfWarWithoutBorders};

  :after {
    opacity: 0;
  }
`

export const unwatched = css`
  ${fogOfWarWithoutBorders};

  :after {
    opacity: 0.7;
  }
`
