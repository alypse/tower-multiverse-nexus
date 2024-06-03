import { getInGameWaveTime, WAVE_ACCELERATOR_CARD } from "tower-idle-toolkit";
import { useIntegerState } from "../utils/hooks";
import {DropdownFromObject } from "../utils/utils";
import { GALAXY_COMPRESSOR_EFFECT } from "../utils/Values";
import {useState} from "react";

export const PermaCalculator = ({props}) => {
    const [waveAcceleratorCard, setWaveAcceleratorCard] = useState(WAVE_ACCELERATOR_CARD["7"]);
    const [galaxyCompressorEffect, setGalaxyCompressorEffect] = useState(GALAXY_COMPRESSOR_EFFECT.Ancestral);
    const [packageChance, setPackageChance] = useIntegerState(50, 'packageChance', 0, 81);

    const packageCheck = (wave) => {
        let Package = true;
        let rollPackage = Math.floor(Math.random() * 100);
        if (wave % 10 === 0) {
            return Package = true;
        } else if(rollPackage <= packageChance) {
            return Package = true
        } else return Package = false;
    };

    let packageCount = 0;
    const rollPackagesForWaves = (wave) => {
        let waveCount = wave;

        while (waveCount > 0) {
            if (packageCheck(waveCount)) {
                packageCount++;
            }
            waveCount--;
        }
    }
    const wavesToTest = 100;
    rollPackagesForWaves(wavesToTest);

    return (
        <div className="main">
            <div className="controls">
                <DropdownFromObject controlName="GalComp Reduction" stateVariable={galaxyCompressorEffect} stateSetter={setGalaxyCompressorEffect} objectData={GALAXY_COMPRESSOR_EFFECT}/>
                <DropdownFromObject controlName="Wave Accelerator Card" stateVariable={waveAcceleratorCard} stateSetter={setWaveAcceleratorCard} objectData={WAVE_ACCELERATOR_CARD}/>
                <div className="control">
                    <label>Package Chance</label>
                    <input type="number" min='0' max='81' value={packageChance} onChange={setPackageChance}/>
                </div>
                <div className="control">
                </div>
            </div>
            <div className="results">
                <p>Testing {wavesToTest} waves</p>
                <div className="result">
                    <p>Packages found:</p>
                    <p>{packageCount}</p>
                </div>
                <div className="result">
                    <p>Packages per wave:</p>
                    <p>{(packageCount / wavesToTest).toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
}