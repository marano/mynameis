import Inferno from 'inferno';
import { Controller } from 'cerebral';
import { Container, connect } from 'cerebral/inferno';
import { state, props, signal } from 'cerebral/tags';
import { set } from 'cerebral/operators';

const controller = Controller({
  state: {
    items: ['a', 'b', 'c', 'd'],
    itemsIndexes: [0, 1, 2, 3]
  },
  signals: {
    keyPressedSignal: set(state`itemsIndexes`, [2, 3])
  }
});

const ListItem = connect(
  {
    item: state`items.${props`itemIndex`}`
  },
  function ListItem({ item  }) {
    return <div>{item}</div>;
  }
);

const List = connect(
  {
    itemsIndexes: state`itemsIndexes`,
    keyPressedSignal: signal`keyPressedSignal`
  },
  function List({ itemsIndexes, keyPressedSignal }) {
    return (
      <div>
        <button onclick={() => keyPressedSignal()}>Change list</button>

        {itemsIndexes.map((itemIndex) => <ListItem key={itemIndex} itemIndex={itemIndex} />)}
      </div>
    );
  }
);

Inferno.render(
  (
    <Container controller={controller}>
      <List />
    </Container>
  ),
  document.getElementById('root')
);
