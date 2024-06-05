import { useCallback, useState } from 'react';

const versionCache = '1.1.0';

export const useInputEvent = setState => useCallback(({ target: { value } }) => setState(value), [setState]);

export const useUpdatedState = (initial, key) => {
    let fromStorage;
    const cacheKey = `${key}-${versionCache}`;
    try {
        const valueFromStorage = localStorage.getItem(cacheKey);
        if (valueFromStorage) fromStorage = JSON.parse(valueFromStorage);
    } catch (e) {
        // no storage;
    }
    const initialValue = fromStorage === null || fromStorage === undefined ? initial : fromStorage;
    const [state, setState] = useState(initialValue);

    const updateState = useCallback(
        newValue => {
            setState(oldValue => {
                const setValue = typeof newValue === 'function' ? newValue(oldValue) : newValue;
                try {
                    if (key) localStorage.setItem(cacheKey, JSON.stringify(setValue));
                } catch (e) {
                    // no storage;
                }
                return setValue;
            });
        },
        [key, cacheKey, setState],
    );
    return [state, updateState];
};

export const useInputState = (initial, key) => {
    const [state, setState] = useUpdatedState(initial, key);
    const updateState = useInputEvent(setState);
    return [state, updateState, setState];
};

export const useCheckboxEvent = setState => useCallback(({ target: { checked } }) => setState(checked), [setState]);

export const useCheckboxState = (initial, key) => {
    const [state, setState] = useUpdatedState(initial, key);
    const updateState = useCheckboxEvent(setState);
    return [state, updateState, setState];
};

export const useIntegerEvent = (setState, min, max) =>
useCallback(
    ({ target: { value } }) => {
        let newValue = value ? parseInt(value, 10) : 0;
        if (min != null && newValue < min) newValue = min;
        if (max != null && newValue > max) newValue = max;
        setState(newValue);
    },
    [setState, min, max],
);

export const useIntegerState = (initial, key, min, max) => {
    const [state, setState] = useUpdatedState(initial, key);
    const updateState = useIntegerEvent(setState, min, max);
    return [state, updateState, setState];
};

export const useFloatEvent = (setState, min, max) => useCallback(({ target: { value } }) => {
    let newValue = value ? parseFloat(value) : 0;
    if (min != null && newValue < min) newValue = min;
    if (max != null && newValue > max) newValue = max;
    setState(newValue);
}, [setState, min, max]);

export const useFloatState = (initial, key, min, max) => {
    const [state, setState] = useUpdatedState(initial, key);
    const updateState = useFloatEvent(setState, min, max);
    return [state, updateState, setState];
};

export const useSelectEvent = setState => useCallback(({ target: { value } }) => setState(value), [setState]);

export const useSelectState = (initial, key) => {
    const [state, setState] = useUpdatedState(initial, key);
    const updateState = useSelectEvent(setState);
    return [state, updateState, setState];
};

export const useDropDownEvent = setState => useCallback(({ target: { value } }) => setState(value), [setState]);

export const useDropDownState = (initial, key) => {
    const [state, setState] = useUpdatedState(initial, key);
    const updateState = useDropDownEvent(setState);
    return [state, updateState, setState];
};

