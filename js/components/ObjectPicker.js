import { state, props } from 'cerebral/tags';

import ObjectPickerEntity from './ObjectPickerEntity';

export default connect({
  entitiesIndexes: state`definitions.entities.*`
}, ObjectPicker);

function ObjectPicker({ entitiesIndexes }) {
  return (
    <object-picker style={style()}>
      {
        entitiesIndexes.map(function (entityIndex) {
          return <ObjectPickerEntity key={entityIndex} entityIndex={entityIndex} />;
        })
      }
    </object-picker>
  );
}

function style() {
  return {
    padding: 10
  };
}
