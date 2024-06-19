import {
    getInGameWaveTime,
    LabValues,
    maxLevel,
    WAVE_ACCELERATOR_CARD
} from "tower-idle-toolkit";
import { useCheckboxState, useIntegerState, useFloatState } from "../utils/hooks";
import {
    DropdownFromObjectShowKey,
    integerRange,
    InputFromArrayShowValue
} from "../utils/utils";
import { GALAXY_COMPRESSOR_EFFECT, BLACK_HOLE_SUBSTATS_COOLDOWN, BLACK_HOLE_SUBSTATS_DURATION, GOLDEN_TOWER_SUBSTATS_DURATION } from "../utils/Values";

const GT_DURATION_LAB = integerRange(1,maxLevel("Golden Tower Duration")+1).map(i => LabValues["Golden Tower Duration"](i-1));

const GT_DURATION = (gtDurationStonesLevel, gtDurationLabLevel, gtDurationSubstat) => {
    return gtDurationStonesLevel +  GT_DURATION_LAB[gtDurationLabLevel] + gtDurationSubstat;
}

const BH_DURATION = (bhDurationStones, bhDurationSubstat, bhPerk) => {
    return bhDurationStones + bhDurationSubstat + (bhPerk ? 12 : 0);
}

export const PermaCalculator = ({props}) => {
    const [waveAcceleratorCard, setWaveAcceleratorCard] = useIntegerState(WAVE_ACCELERATOR_CARD["7"], 'waveAcceleratorCard', 0, 7);
    const [galaxyCompressorEffect, setGalaxyCompressorEffect] = useIntegerState(GALAXY_COMPRESSOR_EFFECT.Ancestral, 'galaxyCompressorEffect', 0, 20);
    const [packageChance, setPackageChance] = useFloatState(80, 'packageChance', 0, 82);
    const [gtDurationStonesLevel, setGTDurationStonesLevel] = useIntegerState(45, 'gtDurationStonesLevel',0, 45);
    const [gtDurationLabLevel, setGTDurationLabLevel] = useIntegerState(20, 'gtDurationLabLevel', 0, GT_DURATION_LAB.length-1);
    const [gtDurationSubstat, setGTDurationSubstat] = useIntegerState(GOLDEN_TOWER_SUBSTATS_DURATION.None, 'gtDurationSubstat',0, 7);
    const [bhDurationStones, setBHDurationStones] = useIntegerState(30, 'bhDurationStones', 0, 30);
    const [bhDurationSubstat, setBHDurationSubstat] = useIntegerState(BLACK_HOLE_SUBSTATS_DURATION.None, 'bhDurationSubstat',0,4);
    const [bhPerk, setBHPerk] = useCheckboxState(true, 'bhPerk');
    const [isTournament, setIsTournament] = useCheckboxState(false, 'isTournament');

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

    const wavesToTest = 999;
    rollPackagesForWaves(wavesToTest);

    const checkBHPermanent = (waves) => {
        let waveCountBH = waves;
        let totalWavesTime = 0;
        while (waveCountBH > 0) {
            totalWavesTime += getInGameWaveTime(waveCountBH, waveAcceleratorCard, isTournament);
            waveCountBH--;
        }
        const cdReductionTotal = totalWavesTime + (packageCount * galaxyCompressorEffect);
        const bhActivations = totalWavesTime / props.bhCooldown;
        const bhUptime = bhActivations * BH_DURATION(bhDurationStones, bhDurationSubstat, bhPerk);
        return (cdReductionTotal / totalWavesTime * bhUptime) >= (props.bhCooldown * bhActivations);
    }
    console.log(waveAcceleratorCard);
    console.log(galaxyCompressorEffect);
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
                    <div className="control">
                        <label>Galaxy Compressor
                        <select value={galaxyCompressorEffect} onChange={setGalaxyCompressorEffect}>
                            {Object.entries(GALAXY_COMPRESSOR_EFFECT).map(([key, value]) => (
                                <option key={key} value={value}>{key}</option>
                            ))}
                        </select></label>
                    </div>
                    <div className="control">
                        <label>Wave Accelerator
                        <select value={waveAcceleratorCard} onChange={setWaveAcceleratorCard}>
                            {Object.entries(WAVE_ACCELERATOR_CARD).map((value,key) => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                        </select></label>
                    </div>
                    <div className="control">
                        <label>Package Chance
                        <input type='number' min='0' max='82' step={0.2} value={packageChance} onChange={setPackageChance}/>
                        </label>
                    </div>
                </div>
            </div>
            <div className="controlGroup">
                <div className="controls">
                    <InputFromArrayShowValue controlName="GT Dur Stones" stateVariable={gtDurationStonesLevel}
                                                stateSetter={setGTDurationStonesLevel}/>
                    <div className="control">
                        <label>GT Duration Lab
                        <input type="number" min='0' max={GT_DURATION_LAB.length - 1}
                               value={GT_DURATION_LAB[gtDurationLabLevel]} onChange={setGTDurationLabLevel}/>
                        </label>
                    </div>
                        <DropdownFromObjectShowKey controlName="GT Dur Stat" stateVariable={gtDurationSubstat}
                                                   stateSetter={setGTDurationSubstat} objectData={GOLDEN_TOWER_SUBSTATS_DURATION}/>
                </div>
            </div>
            <div className="controlGroup">
                <div className="controls">
                    <InputFromArrayShowValue controlName="BH Dur Stones" stateVariable={bhDurationStones} stateSetter={setBHDurationStones}/>
                    <DropdownFromObjectShowKey controlName="BH Dur Substat" stateVariable={bhDurationSubstat}
                                               stateSetter={setBHDurationSubstat} objectData={BLACK_HOLE_SUBSTATS_COOLDOWN}/>
                    <div className="control">
                        <label>BH Perk
                        <input type="checkbox" checked={bhPerk} onChange={setBHPerk}/>
                    </label>
                    </div>
                    <div className="control">
                        <label>Tournament
                        <input type="checkbox" checked={isTournament} onChange={setIsTournament}/>
                    </label>
                    </div>
                </div>
            </div>
        </div>
        <div className="results">
            <div className="result">
                <p>Packages:</p>
                <p>Total: {packageCount} from {wavesToTest} waves</p>
            </div>
            <div className="result">
                <p>GT:</p>
                <p>Dur: {GT_DURATION(gtDurationStonesLevel, gtDurationLabLevel, gtDurationSubstat)}</p>
                <p>CD: {props.gtCooldown}</p>
                <p>Perma?: {checkGTPermanent(wavesToTest) ? "Yes" : "No"}</p>
            </div>
            <div className="result">
                <p>BH:</p>
                <p>Dur: {BH_DURATION(bhDurationStones, bhDurationSubstat, bhPerk)}</p>
                <p>CD: {props.bhCooldown}</p>
                <p>Perma?: {checkBHPermanent(wavesToTest) ? "Yes" : "No"}</p>
            </div>
        </div>
    </div>
    );
}