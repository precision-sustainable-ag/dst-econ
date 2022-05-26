# Cover Crops Economics DST

## Development ##
This is a React + Redux project.

To simplify Redux development, setters and getters are automatically created for everything in the store, including nested properties.

To read from the store:
```
import {get} from '../store/store';
const screen = useSelector(get.screen);
const total = useSelector(get.seedbed.total);
```

To write to the store:
```
import {set} from '../store/store';
const dispatch = useDispatch();
dispatch(set.screen('Seedbed'));
dispatch(set.seedbed.total(999));
```

### `<Input>` components ###

`<Input>` components interact with the store.  The type of the store's variable usually determines the `<Input>` type:

- If the store's variable is a string, the type will be `text`.
- If the store's variable is a Boolean, the type will be `checkbox`.
- If the store's variable is numeric or `undefined`, the type will be `number`.
- If the store's variable begins with a dollar sign, the type will be `number`, and a dollar sign will appear before the input.
  (If you want a "dollar" type for a variable that doesn't include `$` in its name, use `type="dollar"`.)

For example, this code creates a text input for `farm`, a numeric type for `acres`, and a numeric type for `labor` with a prepended dollar sign:
```
const initialState = {
  // ...
  farm: '',
  acres: undefined,
  $labor: undefined,
  species: [],
  // ...
}

import {Input} from './Inputs';
<Input id="farm" />
<Input id="acres" />
<Input id="$labor" />
```

If the store's variable is an array, include an `index` property:
```
<Input id="species" index={0} />
<Input id="species" index={1} />
<Input id="species" index={2} />
```

By default, changes to an `<Input>` are not committed to the store unless **Enter** is pressed or the `<Input>` component is blurred.  (This is in keeping with the Redux recommendation to [Avoid Putting Form State In Redux](https://redux.js.org/style-guide/#avoid-putting-form-state-in-redux).)

If changes should be committed immediately, include `immediate` as a property:
```
<Input id="farm" immediate />
```

If you want all `<Input>` elements to be committed to the store immediately, include `options="immediate"` on the form itself:
```
<form options="immediate">
```

#### Focusing `<Input>` ####
An `<Input>` can be focused like this:
```
dispatch(set.focus('farm'));
```

#### Radio groups ####
A radio group can be created like this:
```
<Input
  id="number"
  label="Pick a number"
  options={[1, 2, 3]}
  type="radio"
/>
```
![Output](https://raw.githubusercontent.com/rickhitchcock/redux-app/master/images/RadioButton1.png)

If the radio buttons' labels should be different from their values, do this:
```
<Input
  id="number"
  label="Pick a number"
  options={[1, 2, 3]}
  labels={['One', 'Two', 'Three']}
  type="radio"
/>
```
![Output](https://raw.githubusercontent.com/rickhitchcock/redux-app/master/images/RadioButton2.png)