import { WAVE_ACCELERATOR_CARD } from 'tower-idle-toolkit';
import { useCheckboxState, useIntegerState, useFloatState } from '../utils/hooks';
import { integerRange, roundMidpointToEven } from '../utils/utils';
import { GALAXY_COMPRESSOR_EFFECT, BLACK_HOLE_SUBSTATS_DURATION, GOLDEN_TOWER_SUBSTATS_DURATION, DEATH_WAVE_SUBSTATS_QUANTITY } from '../utils/values';
import { GoldenTowerStats } from './GoldenTowerStats';
import { BlackHoleStats } from './BlackHoleStats';
import { DeathWaveStats } from './DeathWaveStats';
import { useState } from 'react';

const GT_DURATION_LAB: number[] = integerRange(0, 20);
const WAVES_TO_TEST: number = 1000;
const DEATH_WAVE_INTERVAL: number = 4;

export const PermaCalculator = ({ props }) => {
  const [waveAcceleratorCard, setWaveAcceleratorCard] = useIntegerState(WAVE_ACCELERATOR_CARD['7'], 'waveAcceleratorCard', 0, 7);
  const [galaxyCompressorEffect, setGalaxyCompressorEffect] = useIntegerState(GALAXY_COMPRESSOR_EFFECT.Ancestral, 'galaxyCompressorEffect', 0, 20);
  const [packageChance, setPackageChance] = useFloatState(80, 'packageChance', 0, 100);
  const [packageChanceFixed, setPackageChanceFixed] = useCheckboxState(true, 'packageChanceFixed');
  const [gtDurationStonesLevel, setGTDurationStonesLevel] = useIntegerState(45, 'gtDurationStonesLevel', 0, 53);
  const [gtDurationLabLevel, setGTDurationLabLevel] = useIntegerState(20, 'gtDurationLabLevel', 0, 20);
  const [gtDurationSubstat, setGTDurationSubstat] = useIntegerState(GOLDEN_TOWER_SUBSTATS_DURATION.None, 'gtDurationSubstat', 0, 7);
  const [dwEffectWavesCount, setDWEffectWavesCount] = useIntegerState(1, 'dwEffectWavesCount', 0, 9);
  const [dwQuantitySubstat, setDWQuantitySubstat] = useIntegerState(DEATH_WAVE_SUBSTATS_QUANTITY.None, 'dwQuantitySubstat', 0, 3);
  const [dwPerk, setDWPerk] = useCheckboxState(false, 'dwPerk');
  const [bhDurationStones, setBHDurationStones] = useIntegerState(38, 'bhDurationStones', 0, 38);
  const [bhDurationSubstat, setBHDurationSubstat] = useIntegerState(BLACK_HOLE_SUBSTATS_DURATION.None, 'bhDurationSubstat', 0, 4);
  const [bhPerk, setBHPerk] = useCheckboxState(true, 'bhPerk');
  const [isTournament, setIsTournament] = useCheckboxState(false, 'isTournament');
  const [isUwBc, setIsUwBc] = useState(true);
  const [bossWaveInterval, setBossWaveInterval] = useIntegerState(10, 'bossWaveInterval', 1, 10);

  // Assist module substats for duration/quantity (editable in Perma Calculator)
  const [assistGtDurationSubstat, setAssistGtDurationSubstat] = useIntegerState(0, 'assistGtDurationSubstat', 0, 7);
  const [assistDwQuantitySubstat, setAssistDwQuantitySubstat] = useIntegerState(0, 'assistDwQuantitySubstat', 0, 3);
  const [assistBhDurationSubstat, setAssistBhDurationSubstat] = useIntegerState(0, 'assistBhDurationSubstat', 0, 4);

  // Substat efficiency from props
  const substatEfficiency = props.substatEfficiency;

  const GT_DURATION = (
    gtDurationStonesLevel: number,
    gtDurationLabLevel: number,
    gtDurationSubstat: number,
    assistGtDurationSubstat: number,
    substatEfficiency: number,
  ): number | undefined => {
    const assistGtDurationContribution = (assistGtDurationSubstat * substatEfficiency) / 100;
    return gtDurationStonesLevel + GT_DURATION_LAB[gtDurationLabLevel] + gtDurationSubstat + assistGtDurationContribution;
  };

  const GT_COOLDOWN: number | undefined = props.mnEnabled ? roundMidpointToEven(props.averageCooldownwithMN) : props.gtCooldown;

  const DW_DURATION = (dwEffectWavesCount: number, DEATH_WAVE_INTERVAL: number): number | undefined => {
    return dwEffectWavesCount * DEATH_WAVE_INTERVAL;
  };

  const DW_COOLDOWN: number | undefined = props.mnEnabled ? roundMidpointToEven(props.averageCooldownwithMN) : props.dwCooldown;

  const BH_DURATION = (
    bhDurationStones: number,
    bhDurationSubstat: number,
    bhPerk: boolean,
    isUwBc: boolean,
    assistBhDurationSubstat: number,
    substatEfficiency: number,
  ): number => {
    const bhPerkDuration = bhPerk && !isTournament ? 12 : 0;
    const bhDurationUwc = isUwBc ? -10 : 0;
    const assistBhDurationContribution = (assistBhDurationSubstat * substatEfficiency) / 100;
    console.log('isUwBc', isUwBc);
    console.log('tourney', isTournament);
    console.log('bhperk', bhPerk);
    console.log('bhDuration', bhDurationUwc);
    return bhDurationStones + bhDurationSubstat + bhPerkDuration + bhDurationUwc + assistBhDurationContribution;
  };

  // const BH_DURATION = useCallback((bhDurationStones: number, bhDurationSubstat: number, bhPerk: boolean, isUwc: boolean): number =>{
  //   const bhPerkDuration = bhPerk && !isTournament ? 12 : 0
  //   const bhDurationUwc = isUwc ? -10 : 0
  //   return bhDurationStones + bhDurationSubstat + bhPerkDuration + bhDurationUwc
  //   console.log(isUwc)
  // }, [bhDurationStones, bhDurationSubstat, bhPerk, isUwc])

  const BH_COOLDOWN: number | undefined = props.mnEnabled ? roundMidpointToEven(props.averageCooldownwithMN) : props.bhCooldown;

  const packageCheck = (wave: number): boolean => {
    let rollPackage = Math.floor(Math.random() * 100);
    if (wave % bossWaveInterval === 0) {
      return true;
    } else if (packageChance === 0) {
      return false;
    } else return rollPackage <= packageChance;
  };

  let packageCount = 0;

  const rollPackagesForWaves = (waves: number): number => {
    if (packageChanceFixed) {
      const bossWavePackages = Math.floor(WAVES_TO_TEST / bossWaveInterval);
      const fixedPackages = ((waves - bossWavePackages) * packageChance) / 100;
      return bossWavePackages + fixedPackages;
    }
    let packageCount = 0;
    let waveCount = waves;
    while (waveCount > 0) {
      if (packageCheck(waveCount)) {
        packageCount++;
      }
      waveCount--;
    }
    return packageCount;
  };

  packageCount = rollPackagesForWaves(WAVES_TO_TEST);

  return (
    <div className='main'>
      <div className='controls'>
        <div className='controlGroup'>
          <div className='control'>
            <label>
              Waves Per Boss
              <select value={bossWaveInterval} onChange={setBossWaveInterval}>
                {integerRange(1, 10).map(waves => (
                  <option key={waves} value={waves}>
                    {waves}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className='control'>
            <label>
              Compressor
              <select value={galaxyCompressorEffect} onChange={setGalaxyCompressorEffect}>
                {Object.entries(GALAXY_COMPRESSOR_EFFECT).map(([key, value]) => (
                  <option id={key} key={key} value={value}>
                    {key}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className='control'>
            <label>
              WA Card
              <select value={waveAcceleratorCard} onChange={setWaveAcceleratorCard}>
                {Object.keys(WAVE_ACCELERATOR_CARD).map(key => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className='control'>
            <label>
              PKG Chance
              <input type='number' min='0' max='100' step={0.2} value={packageChance} onChange={setPackageChance} />
              <span style={{ marginLeft: '10px' }}>Fixed rate</span>
              <input type='checkbox' value={packageChanceFixed} onChange={setPackageChanceFixed} />
            </label>
          </div>
        </div>
        <div className='controlGroup'>
          <div className='control'>
            <label>
              GT Dur Stones
              <select value={gtDurationStonesLevel} onChange={setGTDurationStonesLevel}>
                {integerRange(0, 53).map(seconds => (
                  <option key={seconds} value={seconds}>
                    {seconds}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className='control'>
            <label>
              GT Dur Lab
              <select value={gtDurationLabLevel} onChange={setGTDurationLabLevel}>
                {integerRange(0, 20).map(seconds => (
                  <option key={seconds} value={seconds}>
                    {seconds}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className='control'>
            <label>
              GT Dur Stat
              <select value={gtDurationSubstat} onChange={setGTDurationSubstat}>
                {Object.entries(GOLDEN_TOWER_SUBSTATS_DURATION).map(([key, value]) => (
                  <option id={key} key={key} value={value}>
                    {key}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className='control'>
            <label>
              Assist GT Dur Stat
              <select value={assistGtDurationSubstat} onChange={setAssistGtDurationSubstat}>
                {Object.entries(GOLDEN_TOWER_SUBSTATS_DURATION).map(([key, value]) => (
                  <option id={key} key={key} value={value}>
                    {key}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className='controlGroup'>
          {props.dwEnabled && (
            <>
              <div className='control'>
                <label>
                  DW Waves
                  <select value={dwEffectWavesCount} onChange={setDWEffectWavesCount}>
                    {integerRange(0, 5).map(value => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className='control'>
                <label>
                  DW Qty Stat
                  <select value={dwQuantitySubstat} onChange={setDWQuantitySubstat}>
                    {Object.entries(DEATH_WAVE_SUBSTATS_QUANTITY).map(([key, value]) => (
                      <option id={key} key={key} value={value}>
                        {key}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className='control'>
                <label>
                  Assist DW Qty Stat
                  <select value={assistDwQuantitySubstat} onChange={setAssistDwQuantitySubstat}>
                    {Object.entries(DEATH_WAVE_SUBSTATS_QUANTITY).map(([key, value]) => (
                      <option id={key} key={key} value={value}>
                        {key}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className='control'>
                <label>
                  DW Perk
                  <input type='checkbox' checked={dwPerk} onChange={setDWPerk} />
                </label>
              </div>
            </>
          )}
        </div>
        <div className='controlGroup'>
          <div className='control'>
            <label>
              BH Dur Stones
              <select value={bhDurationStones} onChange={setBHDurationStones}>
                {integerRange(0, 38).map(value => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className='control'>
            <label>
              BH Dur Stat
              <select value={bhDurationSubstat} onChange={setBHDurationSubstat}>
                {Object.entries(BLACK_HOLE_SUBSTATS_DURATION).map(([key, value]) => (
                  <option id={key} key={key} value={value}>
                    {key}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className='control'>
            <label>
              Assist BH Dur Stat
              <select value={assistBhDurationSubstat} onChange={setAssistBhDurationSubstat}>
                {Object.entries(BLACK_HOLE_SUBSTATS_DURATION).map(([key, value]) => (
                  <option id={key} key={key} value={value}>
                    {key}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className='control'>
            <label>
              Tournament
              <input type='checkbox' checked={isTournament} onChange={setIsTournament} />
            </label>
          </div>

          <div className='control'>
            <label>
              BH Perk
              <input type='checkbox' checked={bhPerk} onChange={setBHPerk} />
            </label>
          </div>

          {/*{console.log('isUwBc in render', isUwBc)}*/}

          <div className='control'>
            <label>
              UW BC
              <input type='checkbox' checked={isUwBc} onChange={() => setIsUwBc(isUwBc === true ? false : true)} />
            </label>
          </div>

          {/*{console.log('isUwBc in render', isUwBc)}*/}
        </div>
      </div>
      <div className='results'>
        <div className='result'>
          <p>{props.mnEnabled ? 'MVN Enabled' : 'MVN Disabled'}</p>
          <p>{(packageCount / WAVES_TO_TEST).toLocaleString('en-US')} packages/wave</p>
          <p>{packageChanceFixed ? 'Fixed Package rate' : 'Simulated packages received'}</p>
        </div>
        <div className='result'>
          {props.gtEnabled ? (
            <GoldenTowerStats
              props={{
                wavesToTest: WAVES_TO_TEST,
                packageCount,
                GT_COOLDOWN,
                GT_DURATION,
                isTournament,
                waveAcceleratorCard,
                galaxyCompressorEffect,
                gtDurationStonesLevel,
                gtDurationLabLevel,
                gtDurationSubstat,
                assistGtDurationSubstat,
                substatEfficiency,
              }}
            />
          ) : (
            <p>Golden Tower Disabled</p>
          )}
        </div>
        <div className='result'>
          {props.dwEnabled ? (
            <DeathWaveStats
              props={{
                wavesToTest: WAVES_TO_TEST,
                packageCount,
                DW_COOLDOWN,
                DW_DURATION,
                isTournament,
                waveAcceleratorCard,
                galaxyCompressorEffect,
                DEATH_WAVE_INTERVAL,
                dwEffectWavesCount,
                dwQuantitySubstat,
                dwPerk,
                assistDwQuantitySubstat,
                substatEfficiency,
              }}
            />
          ) : (
            <p>Death Wave Disabled</p>
          )}
        </div>
        <div className='result'>
          {props.bhEnabled ? (
            <BlackHoleStats
              props={{
                wavesToTest: WAVES_TO_TEST,
                packageCount,
                BH_COOLDOWN,
                BH_DURATION,
                isTournament,
                waveAcceleratorCard,
                galaxyCompressorEffect,
                bhDurationStones,
                bhDurationSubstat,
                bhPerk,
                isUwBc,
                assistBhDurationSubstat,
                substatEfficiency,
              }}
            />
          ) : (
            <p>Black Hole Disabled</p>
          )}
        </div>
      </div>
    </div>
  );
};
