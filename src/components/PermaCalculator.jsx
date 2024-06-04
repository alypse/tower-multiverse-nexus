import {
    BLACK_HOLE,
    getInGameWaveTime,
    GOLDEN_TOWER,
    LabValues,
    maxLevel,
    WAVE_ACCELERATOR_CARD
} from "tower-idle-toolkit";
import {useCheckboxState, useIntegerState, useFloatState} from "../utils/hooks";
import {DropdownFromObject, integerRange} from "../utils/utils";
import {GALAXY_COMPRESSOR_EFFECT} from "../utils/Values";
import {useState} from "react";

const GT_DURATION_STONES = GOLDEN_TOWER.upgrades["Duration"].values.map(i => i.value);
const GT_DURATION_LAB = integerRange(1,maxLevel("Golden Tower Duration")+1).map(i => LabValues["Golden Tower Duration"](i-1));
const BH_DURATION_STONES = BLACK_HOLE.upgrades["Duration"].values.map(i => i.value);
const GT_DURATION_SUBSTATS = [0,2,4,7];
const BH_DURATION_SUBSTATS = [0,2,3,4];

const GT_DURATION = (gtDurationStonesLevel, gtDurationLabLevel, gtDurationSubstat) => {
    return GT_DURATION_STONES[gtDurationStonesLevel] + GT_DURATION_LAB[gtDurationLabLevel] + GT_DURATION_SUBSTATS[gtDurationSubstat];
}

// console.log(GT_DURATION(30,20,2));
const BH_DURATION = (bhDurationStones, bhDurationSubstat, bhPerk) => {
    return BH_DURATION_STONES[bhDurationStones] + BH_DURATION_SUBSTATS[bhDurationSubstat] + (bhPerk ? 12 : 0);
}

// console.log(BH_DURATION(15,0, true));


export const PermaCalculator = ({props}) => {
    const [waveAcceleratorCard, setWaveAcceleratorCard] = useState(WAVE_ACCELERATOR_CARD["7"]);
    const [galaxyCompressorEffect, setGalaxyCompressorEffect] = useState(GALAXY_COMPRESSOR_EFFECT.Ancestral);
    const [packageChance, setPackageChance] = useFloatState(80, 'packageChance', 0, 82);
    const [gtDurationStonesLevel, setGTDurationStonesLevel] = useIntegerState(0, 'gtDurationStonesLevel', 0, GT_DURATION_STONES.length-1);
    const [gtDurationLabLevel, setGTDurationLabLevel] = useIntegerState(0, 'gtDurationLabLevel', 0, GT_DURATION_LAB.length-1);
    const [gtDurationSubstat, setGTDurationSubstat] = useIntegerState(0, 'gtDurationSubstat', 0, GT_DURATION_SUBSTATS.length-1);
    const [bhDurationStones, setBHDurationStones] = useIntegerState(0, 'bhDurationStones', 0, BH_DURATION_STONES.length-1);
    const [bhDurationSubstat, setBHDurationSubstat] = useIntegerState(0, 'bhDurationSubstat', 0, BH_DURATION_SUBSTATS.length-1);
    const [bhPerk, setBHPerk] = useCheckboxState(false, 'bhPerk');

    const packageCheck = (wave) => {
        let Package = true;
        let rollPackage = Math.floor(Math.random() * 100);
        if (wave % 10 === 0) {
            return Package = true;
        } else if (packageChance === 0) {
            return Package = false;
        } else if (rollPackage <= packageChance) {
            return Package = true
        } else return Package = false;
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
        let waveCount = waves;
        let totalWavesTime = 0;
        // let bhTotalDurationNoPackage = BH_DURATION(bhDurationStones, bhDurationSubstat, bhPerk)
        while (waveCount > 0) {
            totalWavesTime += getInGameWaveTime(waveCount, waveAcceleratorCard,false);
            waveCount--;
        }
        const cdReductionTotal = totalWavesTime + (packageCount * galaxyCompressorEffect);
        const bhActivations = totalWavesTime / props.bhCooldown;
        const bhUptime = bhActivations * BH_DURATION(bhDurationStones, bhDurationSubstat, bhPerk);
        return (cdReductionTotal / totalWavesTime * bhUptime) >= (props.bhCooldown * bhActivations);
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
                <div className="control">
                    <label>GT Duration Stones
                    <input type="number" min='0' max={GT_DURATION_STONES.length - 1}
                           value={GT_DURATION_STONES[gtDurationStonesLevel]} onChange={setGTDurationStonesLevel}/>
                    </label>
                </div>
                <div className="control">
                    <label>GT Duration Lab
                    <input type="number" min='0' max={GT_DURATION_LAB.length - 1}
                           value={GT_DURATION_LAB[gtDurationLabLevel]} onChange={setGTDurationLabLevel}/>
                    </label>
                </div>
                <div className="control">
                    <label>GT Duration Substat
                    <input type="number" min='0' max={GT_DURATION_SUBSTATS.length - 1}
                           value={GT_DURATION_SUBSTATS[gtDurationSubstat]} onChange={setGTDurationSubstat}/>
                    </label>
                </div>
            </div>
            </div>
            <div className="controlGroup">
                <div className="controls">
                    <div className="control">
                        <label>BH Duration Stones
                        <input type="number" min='0' max={BH_DURATION_STONES.length - 1}
                               value={BH_DURATION_STONES[bhDurationStones]} onChange={setBHDurationStones}/>
                        </label>
                    </div>
                    <div className="control">
                        <label>BH Duration Substat
                        <input type="number" min='0' max={BH_DURATION_SUBSTATS.length - 1}
                               value={BH_DURATION_SUBSTATS[bhDurationSubstat]} onChange={setBHDurationSubstat}/>
                        </label>
                    </div>
                    <div className="control">
                        <label>BH Perk
                        <input type="checkbox" checked={bhPerk} onChange={setBHPerk}/>
                    </label>
                    </div>
                </div>
            </div>
        </div>
        <div className="results">
        <span>Testing {wavesToTest} waves (note MVN disabled for now)</span>
            <div className="result">
                <p>BH Permanent:</p>
                <p>{checkBHPermanent(wavesToTest) ? "Yes" : "No"}</p>
            </div>
            <div className="result">
                <p>Packages:</p>
                <p>Total: {packageCount}</p>
                <p>Per wave: {(packageCount / wavesToTest).toFixed(2)}</p>
            </div>
            <div className="result">
                <p>GT:</p>
                <p>Duration: {GT_DURATION(gtDurationStonesLevel, gtDurationLabLevel, gtDurationSubstat)}</p>
                <p>Cooldown: {props.gtCooldown}</p>
            </div>
            <div className="result">
                <p>BH:</p>
                <p>Duration: {BH_DURATION(bhDurationStones, bhDurationSubstat, bhPerk)}</p>
                {/*todo: include MN effect if enabled (for each of the CDs)*/}
                <p>Cooldown: {props.bhCooldown}</p>
            </div>
        </div>
    </div>
    );
}