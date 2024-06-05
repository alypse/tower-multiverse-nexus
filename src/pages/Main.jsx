import './Main.scss';
import { useInputState } from "../utils/hooks";
import { Calculator } from "../components/Calculator.jsx";
import { PermaCalculator } from "../components/PermaCalculator.jsx";
import React, { useState } from "react";
import { MULTIVERSE_NEXUS_EFFECT, DEATH_WAVE_SUBSTATS_COOLDOWN, GOLDEN_TOWER_SUBSTATS_COOLDOWN, BLACK_HOLE_SUBSTATS_COOLDOWN } from "../utils/Values.js";
import { DEATH_WAVE, BLACK_HOLE, GOLDEN_TOWER} from "tower-idle-toolkit";
import { sum, avg } from "../utils/utils";
import { useCheckboxState } from "../utils/hooks";

const gtCooldowns = GOLDEN_TOWER.upgrades.Cooldown.values;
const dwCooldowns = DEATH_WAVE.upgrades.Cooldown.values;
const bhCooldowns = BLACK_HOLE.upgrades.Cooldown.values;
const mnEffects = Object.values(MULTIVERSE_NEXUS_EFFECT);

export const VIEWS = {
    CALCULATOR: 'MN Calculator',
    PERMA_CALCULATOR: 'Perma Calculator',
}

const Main = () => {
    const [view, setView] = useInputState(VIEWS.CALCULATOR, 'view');

    const [mnEffect, setMnEffect] = useState(mnEffects[mnEffects.length - 1]);
    const [gtCooldown, setGtCooldown] = useState(gtCooldowns[gtCooldowns.length - 1].value);
    const [gtEnabled, setGtEnabled] = useCheckboxState(true, 'gt');
    const [dwCooldown, setDwCooldown] = useState(dwCooldowns[dwCooldowns.length - 1].value);
    const [dwEnabled, setDwEnabled] = useCheckboxState(true, 'dw');
    const [bhCooldown, setBhCooldown] = useState(bhCooldowns[bhCooldowns.length - 1].value);
    const [bhEnabled, setBhEnabled] = useCheckboxState(true, 'bh');
    const [gtCooldownSubstat, setGtCooldownSubstat] = useState(0);
    const [dwCooldownSubstat, setDwCooldownSubstat] = useState(0);
    const [bhCooldownSubstat, setBhCooldownSubstat] = useState(0);

    const gtCooldownValues = gtCooldowns.map((levels, index) => {return levels.value});
    const dwCooldownValues = dwCooldowns.map((levels, index) => {return levels.value});
    const bhCooldownValues = bhCooldowns.map((levels, index) => {return levels.value});

    const cds = []
    if (gtEnabled) cds.push(gtCooldown - gtCooldownSubstat)
    if (dwEnabled) cds.push(dwCooldown - dwCooldownSubstat)
    if (bhEnabled) cds.push(bhCooldown - bhCooldownSubstat)
    const totalCooldown = cds.reduce((curr, next) => curr + next, 0);

    let averageCooldown = 0;
    let averageCooldownwithMN = 0;
    if (cds.length > 0) {
        averageCooldown = avg(cds);
        averageCooldownwithMN = sum([averageCooldown, parseInt(mnEffect)]);
    }

    return (
        <div id='main'>
            <div className='nav'>
                {Object.entries(VIEWS).map(([key, value]) => (
                    <button key={key} type='button' value={value} onClick={setView}>
                        {value}
                    </button>
                ))}
            </div>
            <div className="controls">
                {(view === VIEWS.CALCULATOR) &&
                <div className="controlGroup">
                    <div className="control">
                        <label>MN Effect
                        <select value={mnEffect} onChange={e => setMnEffect(e.target.value)}>
                            {Object.entries(MULTIVERSE_NEXUS_EFFECT).map(([key, value]) => (
                                <option key={key} value={value}>{key}</option>
                            ))}
                        </select></label>
                    </div>
                </div>}
                <div className="controlGroup">
                    <div className="control">
                        <label>GT CD
                        <select value={gtCooldown} onChange={e => setGtCooldown(e.target.value)}>
                            {gtCooldownValues.map((value, index) => (
                                <option key={index} value={index}>{value}</option>
                            ))}
                        </select></label>
                        <input type="checkbox" checked={gtEnabled} onChange={setGtEnabled}/>
                    </div>
                    <div className="control">
                        <label>GT CD Stat
                        <select value={gtCooldownSubstat} onChange={e => setGtCooldownSubstat(e.target.value)}>
                            {Object.entries(GOLDEN_TOWER_SUBSTATS_COOLDOWN).map(([key,value]) => (
                                <option key={key} value={value}>{key}</option>
                            ))}
                        </select></label>
                    </div>
                </div>
                {(view === VIEWS.CALCULATOR) &&
                <div className="controlGroup">
                    <div className="control">
                        <label>DW CD
                        <select value={dwCooldown} onChange={e => setDwCooldown(e.target.value)}>
                            {dwCooldownValues.map((value, index) => (
                                <option key={index} value={value}>{value}</option>
                            ))}
                        </select></label>
                        <input type="checkbox" checked={dwEnabled} onChange={setDwEnabled}/>
                    </div>
                    <div className="control">
                        <label>DW CD Stat
                        <select value={dwCooldownSubstat} onChange={e => setDwCooldownSubstat(e.target.value)}>
                            {Object.entries(DEATH_WAVE_SUBSTATS_COOLDOWN).map(([key, value]) => (
                                <option key={key} value={value}>{key}</option>
                            ))}
                        </select></label>
                    </div>
                </div> }
                <div className="controlGroup">
                    <div className="control">
                        <label>BH CD
                        <select value={bhCooldown} onChange={e => setBhCooldown(e.target.value)}>
                            {bhCooldownValues.map((value, index) => (
                                <option key={index} value={value}>{value}</option>
                            ))}
                        </select></label>
                        <input type="checkbox" checked={bhEnabled} onChange={setBhEnabled}/>
                    </div>
                    <div className="control">
                        <label>BH CD Stat
                        <select value={bhCooldownSubstat} onChange={e => setBhCooldownSubstat(e.target.value)}>
                            {Object.entries(BLACK_HOLE_SUBSTATS_COOLDOWN).map(([key,value]) => (
                                <option key={key} value={value}>{key}</option>
                            ))}
                        </select></label>
                    </div>
                </div>
            </div>
            {view === VIEWS.CALCULATOR && <Calculator props={
                {
                    gtCooldown: gtCooldown - gtCooldownSubstat,
                    dwCooldown: dwCooldown - dwCooldownSubstat,
                    bhCooldown: bhCooldown - bhCooldownSubstat,
                    totalCooldown,
                    averageCooldown,
                    averageCooldownwithMN,
                }
            }/>}
            {view === VIEWS.PERMA_CALCULATOR && <PermaCalculator props={
                {
                    gtCooldown: gtCooldown - gtCooldownSubstat,
                    bhCooldown: bhCooldown - bhCooldownSubstat,
                    totalCooldown,
                    averageCooldown,
                    averageCooldownwithMN,
                }
            }/>}
        </div>
    );
};

export default Main;
