import { WAVE_ACCELERATOR_CARD } from 'tower-idle-toolkit';
import { getInGameWaveTime} from '../utils/waveDuration';
import { useCheckboxState, useIntegerState, useFloatState } from '../utils/hooks';
import { integerRange, roundMidpointToEven } from '../utils/utils';
import { GALAXY_COMPRESSOR_EFFECT, BLACK_HOLE_SUBSTATS_COOLDOWN, BLACK_HOLE_SUBSTATS_DURATION, GOLDEN_TOWER_SUBSTATS_DURATION } from '../utils/values';

const GT_DURATION_LAB = integerRange(0,20);

export const PermaCalculator = ({ props }) => {
  const [waveAcceleratorCard, setWaveAcceleratorCard] = useIntegerState(WAVE_ACCELERATOR_CARD['7'], 'waveAcceleratorCard', 0, 7);
  const [galaxyCompressorEffect, setGalaxyCompressorEffect] = useIntegerState(GALAXY_COMPRESSOR_EFFECT.Ancestral, 'galaxyCompressorEffect', 0, 20);
  const [packageChance, setPackageChance] = useFloatState(80, 'packageChance', 0, 82);
  const [gtDurationStonesLevel, setGTDurationStonesLevel] = useIntegerState(45, 'gtDurationStonesLevel', 0, 53);
  const [gtDurationLabLevel, setGTDurationLabLevel] = useIntegerState(20, 'gtDurationLabLevel', 0, 20);
  const [gtDurationSubstat, setGTDurationSubstat] = useIntegerState(GOLDEN_TOWER_SUBSTATS_DURATION.None, 'gtDurationSubstat', 0, 7);
  const [bhDurationStones, setBHDurationStones] = useIntegerState(38, 'bhDurationStones', 0, 38);
  const [bhDurationSubstat, setBHDurationSubstat] = useIntegerState(BLACK_HOLE_SUBSTATS_DURATION.None, 'bhDurationSubstat', 0, 4);
  const [bhPerk, setBHPerk] = useCheckboxState(true, 'bhPerk');
  const [isTournament, setIsTournament] = useCheckboxState(false, 'isTournament');

  const GT_DURATION = (gtDurationStonesLevel: number, gtDurationLabLevel: number, gtDurationSubstat: number) => {
    return gtDurationStonesLevel + GT_DURATION_LAB[gtDurationLabLevel] + gtDurationSubstat;
  };

  const GT_COOLDOWN = props.mnEnabled ? roundMidpointToEven(props.averageCooldownwithMN) : props.gtCooldown;

  const BH_DURATION = (bhDurationStones: number, bhDurationSubstat: number, bhPerk: boolean) => {
    const bhPerkDuration = bhPerk && !isTournament ? 12 : 0;
    return bhDurationStones + bhDurationSubstat + bhPerkDuration;
  };

  const BH_COOLDOWN = props.mnEnabled ? roundMidpointToEven(props.averageCooldownwithMN) : props.bhCooldown;

  const packageCheck = (wave: number) => {
    let rollPackage = Math.floor(Math.random() * 100);
    if (wave % 10 === 0) {
      return true;
    } else if (packageChance === 0) {
      return false;
    } else return rollPackage <= packageChance;
  };

  let packageCount = 0;
  const rollPackagesForWaves = (waves: number) => {
    let waveCount = waves;
    while (waveCount > 0) {
      if (packageCheck(waveCount)) {
        packageCount++;
      }
      waveCount--;
    }
  };

  const wavesToTest = 10000;
  isTournament ? packageCount = wavesToTest : rollPackagesForWaves(wavesToTest);

  const checkBHPermanent = (waves: number) => {
    let waveCountBH = waves;
    let totalWavesTime = 0;
    while (waveCountBH > 0) {
      totalWavesTime += getInGameWaveTime(waveAcceleratorCard, isTournament);
      waveCountBH--;
    }
    const cdReductionTotal = totalWavesTime + packageCount * galaxyCompressorEffect;
    const bhActivations = totalWavesTime / BH_COOLDOWN;
    const bhUptime = bhActivations * BH_DURATION(bhDurationStones, bhDurationSubstat, bhPerk);

    const adjustedUptimeBH = (cdReductionTotal / totalWavesTime) * bhUptime ;
    const baseUptimeBH = BH_COOLDOWN * bhActivations;

    return adjustedUptimeBH >= baseUptimeBH;
  };

  const checkGTPermanent = (waves: number) => {
    let waveCountGT = waves;
    let totalWavesTime = 0;
    while (waveCountGT > 0) {
      totalWavesTime += getInGameWaveTime(waveAcceleratorCard, isTournament);
      waveCountGT--;
    }
    const cdReductionTotal = totalWavesTime + packageCount * galaxyCompressorEffect;
    const gtActivations = totalWavesTime / GT_COOLDOWN;
    const gtUptime = gtActivations * GT_DURATION(gtDurationStonesLevel, gtDurationLabLevel, gtDurationSubstat);

    const adjustedUptimeGT = (cdReductionTotal / totalWavesTime) * gtUptime
    const baseUptimeGT = GT_COOLDOWN * gtActivations

    return adjustedUptimeGT >= baseUptimeGT ;
  };

  return (
    <div className='main'>
      <div className='controls'>
        <div className='controlGroup'>
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
                {Object.entries(WAVE_ACCELERATOR_CARD).map((value, key) => (
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
              <input type='number' min='0' max='82' step={0.2} value={packageChance} onChange={setPackageChance} />
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
              Tournament
              <input type='checkbox' checked={isTournament} onChange={setIsTournament} />
            </label>
          </div>
          {!isTournament && (
            <div className='control'>
              <label>
                BH Perk
                <input type='checkbox' checked={bhPerk} onChange={setBHPerk} />
              </label>
            </div>
          )}
        </div>
      </div>
      <div className='results'>
        <div className='result'>
          <p>{props.mnEnabled ? 'MVN Enabled' : 'MVN Disabled'}</p>
          <p>{packageCount} packages from {wavesToTest} waves</p>
          <p>{isTournament ? 'Package each wave' : 'Simulated packages received'}</p>
        </div>
        <div className='result'>
          <p>GT:</p>
          <p>Dur: {GT_DURATION(gtDurationStonesLevel, gtDurationLabLevel, gtDurationSubstat)}</p>
          <p>CD: {GT_COOLDOWN}</p>
          <p>Perma?: {checkGTPermanent(wavesToTest) ? 'Yes' : 'No'}</p>
        </div>
        <div className='result'>
          <p>BH:</p>
          <p>Dur: {BH_DURATION(bhDurationStones, bhDurationSubstat, bhPerk)}</p>
          <p>CD: {BH_COOLDOWN}</p>
          <p>Perma?: {checkBHPermanent(wavesToTest) ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
};
