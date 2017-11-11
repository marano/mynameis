export default function Button({ isSelected, children, onClick, ...props }) {
  if (isSelected) {
    onClick = null
  }
  return (
    <div style={style(isSelected)} onClick={onClick} {...props}>
      {children}
    </div>
  )
}

function style(isSelected) {
  return {
    border: "1px white solid",
    backgroundColor: isSelected ? "white" : "black",
    color: isSelected ? "black" : "white",
    display: "inline-block",
    padding: 5,
    fontFamily: "monospace",
    cursor: isSelected ? "auto" : "pointer"
  }
}
