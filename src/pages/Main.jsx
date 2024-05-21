import './Main.scss';
import { useInputState, capitalizeAll } from "../utils/hooks";
import { Calculator } from "../components/Calculator.js";
import React from "react";


export const VIEWS = {
    CALCULATOR: 'Calculator',
}

const Main = () => {
    const [view, setView] = useInputState(VIEWS.CALCULATOR, 'view');
    return (
        <div id='main'>
            <div className='nav'>
                {Object.entries(VIEWS).map(([key, value]) => (
                    <button key={key} type='button' value={value} onClick={setView}>
                        {capitalizeAll(value)}
                    </button>
                ))}
            </div>
            {view === VIEWS.CALCULATOR && <Calculator />}
        </div>
    );
};

export default Main;
