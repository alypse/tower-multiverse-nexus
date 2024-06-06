import {
    BLACK_HOLE,
    getInGameWaveTime,
    GOLDEN_TOWER,
    LabValues,
    maxLevel,
    WAVE_ACCELERATOR_CARD
} from "tower-idle-toolkit";
import {useCheckboxState, useIntegerState, useFloatState, useDropDownState, useSelectState} from "../utils/hooks";
import { DropdownFromObject, integerRange } from "../utils/utils";
import { GALAXY_COMPRESSOR_EFFECT, BLACK_HOLE_SUBSTATS_COOLDOWN, GOLDEN_TOWER_SUBSTATS_COOLDOWN, BLACK_HOLE_SUBSTATS_DURATION, GOLDEN_TOWER_SUBSTATS_DURATION } from "../utils/Values";
import { useState } from "react";

const GT_DURATION_STONES = GOLDEN_TOWER.upgrades["Duration"].values.map(i => i.value);
const GT_DURATION_LAB = integerRange(1,maxLevel("Golden Tower Duration")+1).map(i => LabValues["Golden Tower Duration"](i-1));
const BH_DURATION_STONES = BLACK_HOLE.upgrades["Duration"].values.map(i => i.value);

const GT_DURATION = (gtDurationStonesLevel, gtDurationLabLevel, gtDurationSubstat) => {
    return GT_DURATION_STONES[gtDurationStonesLevel] +  GT_DURATION_LAB[gtDurationLabLevel] + gtDurationSubstat; // fix me
}

const BH_DURATION = (bhDurationStones, bhDurationSubstat, bhPerk) => {
    return BH_DURATION_STONES[bhDurationStones] + parseInt(bhDurationSubstat, 10) + (bhPerk ? 12 : 0);
}



export const PermaCalculator = ({props}) => {
    const [waveAcceleratorCard, setWaveAcceleratorCard] = useState(WAVE_ACCELERATOR_CARD["7"]);
    const [galaxyCompressorEffect, setGalaxyCompressorEffect] = useState(GALAXY_COMPRESSOR_EFFECT.Ancestral);
    const [packageChance, setPackageChance] = useFloatState(80, 'packageChance', 0, 82);
    const [gtDurationStonesLevel, setGTDurationStonesLevel] = useIntegerState(GT_DURATION_STONES[GT_DURATION_STONES.length-1], 'gtDurationStonesLevel', 0, GT_DURATION_STONES.length-1);
    const [gtDurationLabLevel, setGTDurationLabLevel] = useIntegerState(0, 'gtDurationLabLevel', 0, GT_DURATION_LAB.length-1);
    const [gtDurationSubstat, setGTDurationSubstat] = useIntegerState(GOLDEN_TOWER_SUBSTATS_DURATION.Ancestral, 'gtDurationSubstat',0, 7);
    const [bhDurationStones, setBHDurationStones] = useIntegerState(0, 'bhDurationStones', 0, BH_DURATION_STONES.length-1);
    const [bhDurationSubstat, setBHDurationSubstat] = useSelectState(BLACK_HOLE_SUBSTATS_DURATION.Ancestral, 'bhDurationSubstat');
    const [bhPerk, setBHPerk] = useCheckboxState(false, 'bhPerk');

    // console.log(gtDurationSubstat,"gtDurationSubstat");
    // console.log(galaxyCompressorEffect,"galaxyCompressorEffect");
    // console.log(gtCooldownSubstat,"gtCooldownSubstat");


    const packageCheck = (wave) => {
        let rollPackage = Math.floor(Math.random() * 100);
        if (wave % 10 === 0) {
            return true;
        } else if (packageChance === 0) {
            return false;
        } else return rollPackage <= packageChance;
    };

    let packageCount = 0;
    const rollPackagesForWaves = (waves) => {
        let waveCount = waves ; // Imperfect, we are adding a guaranteed package on wave 100
        while (waveCount > 0) {
            if (packageCheck(waveCount)) {
                packageCount++;
            }
            waveCount--;
        }
    }

    const wavesToTest = 99;
    rollPackagesForWaves(wavesToTest);

    const checkBHPermanent = (waves) => {
        let waveCountBH = waves;
        let totalWavesTime = 0;
        while (waveCountBH > 0) {
            totalWavesTime += getInGameWaveTime(waveCountBH, waveAcceleratorCard,false);
            waveCountBH--;
        }
        const cdReductionTotal = totalWavesTime + (packageCount * galaxyCompressorEffect);
        const bhActivations = totalWavesTime / props.bhCooldown;
        const bhUptime = bhActivations * BH_DURATION(bhDurationStones, bhDurationSubstat, bhPerk);
        return (cdReductionTotal / totalWavesTime * bhUptime) >= (props.bhCooldown * bhActivations);
    }

    const checkGTPermanent = (waves) => {
        let waveCountGT = waves;
        let totalWavesTime = 0;
        while (waveCountGT > 0) {
            totalWavesTime += getInGameWaveTime(waveCountGT, waveAcceleratorCard, false);
            waveCountGT--;
        }
        const cdReductionTotal = totalWavesTime + (packageCount * galaxyCompressorEffect);
        const gtActivations = totalWavesTime / props.gtCooldown;
        const gtUptime = gtActivations * GT_DURATION(gtDurationStonesLevel, gtDurationLabLevel, gtDurationSubstat);
        return (cdReductionTotal / totalWavesTime * gtUptime) >= (props.gtCooldown * gtActivations);
    }

    return (
        <div className="main">
            <div className="controls">
            <div className="controlGroup">
                <div className="controls">
                    <DropdownFromObject controlName="GalComp Reduction" stateVariable={galaxyCompressorEffect}
                                        stateSetter={setGalaxyCompressorEffect} objectData={GALAXY_COMPRESSOR_EFFECT}/>
                    <DropdownFromObject controlName="Wave Accelerator Card" stateVariable={waveAcceleratorCard}
                                        stateSetter={setWaveAcceleratorCard} objectData={WAVE_ACCELERATOR_CARD}/>
                    <div className="control">
                        <label>Package Chance
                        <input type='number' min='0' max='82' step={0.2} value={packageChance} onChange={setPackageChance}/>
                        </label>
                    </div>
                </div>
            </div>
            <div className="controlGroup">
                <div className="controls">
                    <DropdownFromObject controlName="GT Duration Stones" stateVariable={gtDurationStonesLevel}
                                        stateSetter={setGTDurationStonesLevel} objectData={GT_DURATION_STONES}/>
                    <div className="control">
                        <label>GT Duration Lab
                        <input type="number" min='0' max={GT_DURATION_LAB.length - 1}
                               value={GT_DURATION_LAB[gtDurationLabLevel]} onChange={setGTDurationLabLevel}/>
                        </label>
                    </div>
                        <DropdownFromObject controlName="GT Duration Stat" stateVariable={gtDurationSubstat}
                                            stateSetter={setGTDurationSubstat} objectData={GOLDEN_TOWER_SUBSTATS_DURATION}/>
                </div>
            </div>
            <div className="controlGroup">
                <div className="controls">
                    <div className="control">
                        <label>BH Duration Stones
                        <input type="number" min='0' max='30'
                               value={bhDurationStones} onChange={setBHDurationStones}/>
                        </label>
                    </div>
                    <DropdownFromObject controlName="BH CD Substat" stateVariable={bhDurationSubstat}
                                        stateSetter={setBHDurationSubstat} objectData={BLACK_HOLE_SUBSTATS_COOLDOWN}/>
                    <div className="control">
                        <label>BH Perk
                        <input type="checkbox" checked={bhPerk} onChange={setBHPerk}/>
                    </label>
                    </div>
                </div>
            </div>
        </div>
        <div className="results">
        <span>Testing {wavesToTest} waves</span>
            <div className="result">
                <p>Packages:</p>
                <p>Total: {packageCount}</p>
                <p>Per wave: {(packageCount / wavesToTest).toFixed(2)}</p>
            </div>
            <div className="result">
                <p>GT:</p>
                <p>Duration: {GT_DURATION(gtDurationStonesLevel, gtDurationLabLevel, gtDurationSubstat)}</p>
                <p>Cooldown: {props.gtCooldown}</p>
                <p>Permanent?: {checkGTPermanent(wavesToTest) ? "Yes" : "No"}</p>
            </div>
            <div className="result">
                <p>BH:</p>
                <p>Duration: {BH_DURATION(bhDurationStones, bhDurationSubstat, bhPerk)}</p>
                {/*todo: include MN effect if enabled (for each of the CDs)*/}
                <p>Cooldown: {props.bhCooldown}</p>
                <p>Permanent?: {checkBHPermanent(wavesToTest) ? "Yes" : "No"}</p>
            </div>
        </div>
    </div>
    );
}