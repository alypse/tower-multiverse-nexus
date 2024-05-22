import { useState } from "react";
import './Calculator.scss';
import { MULTIVERSE_NEXUS_EFFECT, DEATH_WAVE_SUBSTATS_COOLDOWN, GOLDEN_TOWER_SUBSTATS_COOLDOWN, BLACK_HOLE_SUBSTATS_COOLDOWN } from "../utils/Values.js";
import { DEATH_WAVE, BLACK_HOLE, GOLDEN_TOWER} from "tower-idle-toolkit";
import { getSum } from "../utils/utils";

const gtCooldowns = GOLDEN_TOWER.upgrades.Cooldown.values;
const dwCooldowns = DEATH_WAVE.upgrades.Cooldown.values;
const bhCooldowns = BLACK_HOLE.upgrades.Cooldown.values;

export function Calculator() {
    const [gtCooldown, setGtCooldown] = useState(gtCooldowns[gtCooldowns.length - 1].value);
    const [dwCooldown, setDwCooldown] = useState(dwCooldowns[dwCooldowns.length - 1].value);
    const [bhCooldown, setBhCooldown] = useState(bhCooldowns[bhCooldowns.length - 1].value);
    const [mnEffect, setMnEffect] = useState(MULTIVERSE_NEXUS_EFFECT.Ancestral);
    const [gtCooldownSubstat, setGtCooldownSubstat] = useState(0);
    const [dwCooldownSubstat, setDwCooldownSubstat] = useState(0);
    const [bhCooldownSubstat, setBhCooldownSubstat] = useState(0);

    const gtCooldownValues = gtCooldowns.map((levels, index) => {return levels.value});
    const dwCooldownValues = dwCooldowns.map((levels, index) => {return levels.value});
    const bhCooldownValues = bhCooldowns.map((levels, index) => {return levels.value});

    const gtCooldownActual = getSum(gtCooldown, gtCooldownSubstat);
    const dwCooldownActual = getSum(dwCooldown, dwCooldownSubstat);
    const bhCooldownActual = getSum(bhCooldown, bhCooldownSubstat);

    const totalCooldown = gtCooldownActual + dwCooldownActual + bhCooldownActual;
    const averageCooldown = totalCooldown / 3;
    const totalCooldownWithEffect = getSum(totalCooldown, mnEffect);

    return (
        <div className="main">
            <div className="controls">
                <div className="control">
                    <label>GT Cooldown</label>
                    <select value={gtCooldown} onChange={e => setGtCooldown(e.target.value)}>
                        {gtCooldownValues.map((value, index) => (
                            <option key={index} value={value}>{value}</option>
                        ))}
                    </select>
                </div>
                <div className="control">
                    <label>DW Cooldown</label>
                    <select value={dwCooldown} onChange={e => setDwCooldown(e.target.value)}>
                        {dwCooldownValues.map((value, index) => (
                            <option key={index} value={value}>{value}</option>
                        ))}
                    </select>
                </div>
                <div className="control">
                    <label>BH Cooldown</label>
                    <select value={bhCooldown} onChange={e => setBhCooldown(e.target.value)}>
                        {bhCooldownValues.map((value, index) => (
                            <option key={index} value={value}>{value}</option>
                        ))}
                    </select>
                </div>
                <div className="control">
                    <label>MN Effect</label>
                    <select value={mnEffect} onChange={e => setMnEffect(e.target.value)}>
                        {Object.values(MULTIVERSE_NEXUS_EFFECT).map((effect, index) => (
                            <option key={index} value={effect}>{effect}</option>
                        ))}
                    </select>
                </div>
                <div className="control">
                    <label>GT Cooldown Substat</label>
                    <select value={gtCooldownSubstat} onChange={e => setGtCooldownSubstat(e.target.value)}>
                        {Object.values(GOLDEN_TOWER_SUBSTATS_COOLDOWN).map((substat, index) => (
                            <option key={index} value={substat}>{substat}</option>
                        ))}
                    </select>
                </div>
                <div className="control">
                    <label>DW Cooldown Substat</label>
                    <select value={dwCooldownSubstat} onChange={e => setDwCooldownSubstat(e.target.value)}>
                        {Object.values(DEATH_WAVE_SUBSTATS_COOLDOWN).map((substat, index) => (
                            <option key={index} value={substat}>{substat}</option>
                        ))}
                    </select>
                </div>
                <div className="control">
                    <label>BH Cooldown Substat</label>
                    <select value={bhCooldownSubstat} onChange={e => setBhCooldownSubstat(e.target.value)}>
                        {Object.values(BLACK_HOLE_SUBSTATS_COOLDOWN).map((substat, index) => (
                            <option key={index} value={substat}>{substat}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="results">
                Results
                <div className="result">
                    <p>Total Cooldown</p>
                    <p>{totalCooldown.toFixed(2)} seconds</p>
                </div>
                <div className="result">
                    <p>Average Cooldown</p>
                    <p>{averageCooldown.toFixed(2)} seconds</p>
                </div>
                <div className="result">
                    <p>Total Cooldown with Effect</p>
                    <p>{totalCooldownWithEffect.toFixed(2)} seconds</p>
                </div>
            </div>
        </div>
    );
}

