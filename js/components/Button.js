export default function Button({
  isSelected,
  allowUnselect,
  children,
  onClick,
  ...props
}) {
  if (isSelected && !allowUnselect) {
    onClick = null
  }
  return (
    <div style={style(isSelected, allowUnselect)} onClick={onClick} {...props}>
      {children}
    </div>
  )
}

function style(isSelected, allowUnselect) {
  return {
    border: "1px white solid",
    backgroundColor: isSelected ? "white" : "black",
    color: isSelected ? "black" : "white",
    display: "inline-block",
    padding: 5,
    fontFamily: "monospace",
    cursor: isSelected && !allowUnselect ? "auto" : "pointer"
  }
}
