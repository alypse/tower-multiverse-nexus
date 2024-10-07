import './Main.scss';
import '../variables.scss';
import logo from '../assets/mvn.webp';
import { useInputState, useIntegerState, useCheckboxState } from '../utils/hooks';
import { Calculator } from '../components/Calculator';
import { PermaCalculator } from '../components/PermaCalculator';
import React from 'react';
import { MULTIVERSE_NEXUS_EFFECT, DEATH_WAVE_SUBSTATS_COOLDOWN, GOLDEN_TOWER_SUBSTATS_COOLDOWN, BLACK_HOLE_SUBSTATS_COOLDOWN } from '../utils/values';
import { sum, avg } from '../utils/utils';

const mnEffects = Object.values(MULTIVERSE_NEXUS_EFFECT);

const defaultCooldowns = {
  defaultGoldenTowerCD: 100,
  defaultDeathWaveCD: 100,
  defaultBlackHoleCD: 50
};

const cooldownRangeDWGT = Array.from({ length: 21 }, (_, index) => 100 + index * 10); // 100 to 300 in steps of 10
const cooldownRangeBH = Array.from({ length: 16 }, (_, index) => 50 + index * 10); // 50 to 200 in steps of 10

const VIEWS = {
  MVN_CALCULATOR: 'MVN Calculator',
  PERMA_CALCULATOR: 'Perma Calculator',
};

export const Main = () => {
  const [view, setView] = useInputState(VIEWS.MVN_CALCULATOR, 'view');

  const [MultiverseNexusEffect, setMultiverseNexusEffect] = useIntegerState(mnEffects[mnEffects.length - 1], 'calcMvnEffect', -10, 20);
  const [MultiverseNexusEnabled, setMultiverseNexusEnabled] = useCheckboxState(true, 'calcMvnEnabled');
  const [gtCooldown, setGtCooldown] = useIntegerState(defaultCooldowns.defaultGoldenTowerCD, 'calcGtCooldown', 100, 300);
  const [gtEnabled, setGtEnabled] = useCheckboxState(true, 'calcGtEnabled');
  const [dwCooldown, setDwCooldown] = useIntegerState(defaultCooldowns.defaultDeathWaveCD, 'calcDwCooldown', 100, 300);
  const [dwEnabled, setDwEnabled] = useCheckboxState(true, 'calcDwEnabled');
  const [bhCooldown, setBhCooldown] = useIntegerState(defaultCooldowns.defaultBlackHoleCD, 'calcBhCooldown', 50, 200);
  const [bhEnabled, setBhEnabled] = useCheckboxState(true, 'calcBhEnabled');
  const [gtCooldownSubstat, setGtCooldownSubstat] = useIntegerState(0, 'calcGtCooldownSubstat', 0, 12);
  const [dwCooldownSubstat, setDwCooldownSubstat] = useIntegerState(0, 'calcDwCooldownSubstat', 0, 13);
  const [bhCooldownSubstat, setBhCooldownSubstat] = useIntegerState(0, 'setBhCooldownSubstat', 0, 4);

  const cds: number[] = [];
  if (gtEnabled) cds.push(gtCooldown - gtCooldownSubstat);
  if (dwEnabled) cds.push(dwCooldown - dwCooldownSubstat);
  if (bhEnabled) cds.push(bhCooldown - bhCooldownSubstat);
  const totalCooldown = cds.reduce((curr, next) => curr + next, 0);

  let averageCooldown = 0;
  let averageCooldownwithMN = 0;
  if (cds.length > 0) {
    averageCooldown = avg(cds);
    averageCooldownwithMN = sum([averageCooldown, MultiverseNexusEffect]);
  }

  return (
    <div id='main'>
      <div className='header'>
        <div className='nav'>
          {Object.entries(VIEWS).map(([key, value]) => (
            <button
              style={view === value ? { border: '1px solid rgb(10, 200, 255)' } : { border: '1px solid rgb(100, 100, 120)' }}
              key={key}
              type='button'
              value={value}
              onClick={setView}
            >
              {value}
            </button>
          ))}
        </div>
        <a href='https://thetower.tools' target='_blank' rel='noopener noreferrer'>
          <img
            src={logo}
            alt='MVN Logo'
            style={{
              transition: 'filter 0.3s ease-in-out',
            }}
            onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.5) drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))')}
            onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
          />
        </a>
      </div>
      <div className='controls'>
        <div className='controlGroup'>
          <div className='control'>
            <label>
              MN Effect
              <select value={MultiverseNexusEffect} onChange={setMultiverseNexusEffect}>
                {Object.entries(MULTIVERSE_NEXUS_EFFECT).map(([key, value]) => (
                  <option key={key} value={value}>
                    {key}
                  </option>
                ))}
              </select>
            </label>
            {view === VIEWS.PERMA_CALCULATOR && <input type='checkbox' checked={MultiverseNexusEnabled} onChange={setMultiverseNexusEnabled} />}
          </div>
        </div>
        <div className='controlGroup'>
          <div className='control'>
            <label>
              GT CD
              <select value={gtCooldown} onChange={setGtCooldown}>
                {cooldownRangeDWGT.map(value => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <input type='checkbox' checked={gtEnabled} onChange={setGtEnabled} />
          </div>
          <div className='control'>
            <label>
              GT CD Stat
              <select value={gtCooldownSubstat} onChange={setGtCooldownSubstat}>
                {Object.entries(GOLDEN_TOWER_SUBSTATS_COOLDOWN).map(([key, value]) => (
                  <option key={key} value={value}>
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
              DW CD
              <select value={dwCooldown} onChange={setDwCooldown}>
                {cooldownRangeDWGT.map(value => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <input type='checkbox' checked={dwEnabled} onChange={setDwEnabled} />
          </div>
          <div className='control'>
            <label>
              DW CD Stat
              <select value={dwCooldownSubstat} onChange={setDwCooldownSubstat}>
                {Object.entries(DEATH_WAVE_SUBSTATS_COOLDOWN).map(([key, value]) => (
                  <option key={key} value={value}>
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
              BH CD
              <select value={bhCooldown} onChange={setBhCooldown}>
                {cooldownRangeBH.map(value => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <input type='checkbox' checked={bhEnabled} onChange={setBhEnabled} />
          </div>
          <div className='control'>
            <label>
              BH CD Stat
              <select value={bhCooldownSubstat} onChange={setBhCooldownSubstat}>
                {Object.entries(BLACK_HOLE_SUBSTATS_COOLDOWN).map(([key, value]) => (
                  <option key={key} value={value}>
                    {key}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
      {view === VIEWS.MVN_CALCULATOR && (
        <Calculator
          props={{
            totalCooldown,
            averageCooldown,
            averageCooldownwithMN,
          }}
        />
      )}
      {view === VIEWS.PERMA_CALCULATOR && (
        <PermaCalculator
          props={{
            gtCooldown: gtCooldown - gtCooldownSubstat,
            dwCooldown: dwCooldown - dwCooldownSubstat,
            bhCooldown: bhCooldown - bhCooldownSubstat,
            mnEnabled: MultiverseNexusEnabled,
            averageCooldownwithMN,
            gtEnabled,
            dwEnabled,
            bhEnabled
          }}
        />
      )}
      <p style={ { margin:'10px', fontSize:'smaller' } }>Inspired by Skye, created by Alypse. Thank you, Skye!</p>
    </div>
  );
};

export default Main;
