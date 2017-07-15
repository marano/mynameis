import { connect } from 'cerebral/inferno';
import { state, props } from 'cerebral/tags';

import ObjectPickerEntity from './ObjectPickerEntity';

function ObjectPicker({ entitiesIndexes }) {
  return (
    <object-picker style={style()}>
      {entitiesIndexes.map((entityIndex) => <ObjectPickerEntity entityIndex={entityIndex} />)}
    </object-picker>
  );

  function style() {
    return {
      padding: 10
    };
  }
}

export default connect({
  entitiesIndexes: state`definitions.entities.*`
}, ObjectPicker);
