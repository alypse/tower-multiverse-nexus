// Maths //
export const sum = (array) => array.reduce((curr, next) => curr + next, 0);

export const avg = (array) => sum(array) / array.length;

// Strings //
export const capitalize = string => (!string?.length ? '' : string.charAt(0).toUpperCase() + string.substring(1).toLowerCase());

export const capitalizeAll = string => (!string?.length ? '' : string.split(' ').map(capitalize).join(' '));

// JSX Helpers //
export const renderIf = (condition, render) => condition ? render : null;

export const renderIfElse = (condition, render, elseRender) => condition ? render : elseRender;

export const DropdownFromObject = (props) => {
    return (
        <div className="control">
            <label>{props.controlName}</label>
            <select value={props.stateVariable} onChange={e => props.stateSetter(e.target.value)}>
                {Object.entries(props.objectData).map(([key, value]) => (
                    <option key={value} value={value}>{key}</option>
                ))}
            </select>
        </div>
    )};

// Arrays //
export const unique = array => [...new Set(array)];

export const removeDuplicates = array => array.filter((value, index, self) => self.indexOf(value) === index);

// Objects //

export const objectFromEntries = entries => entries.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});



