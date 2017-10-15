export default function Button({ isSelected, children, ...props }) {
  return (
    <div {...props} style={style(isSelected)}>
      {children}
    </div>
  );
}

function style(isSelected) {
  return {
    border: '1px white solid',
    backgroundColor: isSelected ? 'white' : 'black',
    color: isSelected ? 'black' : 'white',
    display: 'inline-block',
    padding: 5,
    fontFamily: 'monospace',
    cursor: 'pointer'
  };
}
