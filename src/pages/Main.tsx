import './Main.scss';
import '../variables.scss';
import logo from '../assets/mvn.webp';
import { useInputState, useIntegerState, useCheckboxState } from '../utils/hooks';
import { Calculator } from '../components/Calculator';
import { PermaCalculator } from '../components/PermaCalculator';
import React from 'react';
import { MULTIVERSE_NEXUS_EFFECT, DEATH_WAVE_SUBSTATS_COOLDOWN, GOLDEN_TOWER_SUBSTATS_COOLDOWN, BLACK_HOLE_SUBSTATS_COOLDOWN } from '../utils/values';
import { DEATH_WAVE, BLACK_HOLE, GOLDEN_TOWER } from 'tower-idle-toolkit';
import { sum, avg } from '../utils/utils';

const gtCooldowns = GOLDEN_TOWER.upgrades.Cooldown.values;
const dwCooldowns = DEATH_WAVE.upgrades.Cooldown.values;
const bhCooldowns = BLACK_HOLE.upgrades.Cooldown.values;
const mnEffects = Object.values(MULTIVERSE_NEXUS_EFFECT);

const VIEWS = {
  MVN_CALCULATOR: 'MVN Calculator',
  PERMA_CALCULATOR: 'Perma Calculator',
};

export const Main = () => {
  const [view, setView] = useInputState(VIEWS.MVN_CALCULATOR, 'view');

  const [mnEffect, setMnEffect] = useIntegerState(mnEffects[mnEffects.length - 1], 'calcMvnEffect', -10, 20);
  const [mnEnabled, setMnEnabled] = useCheckboxState(true, 'calcMvnEnabled')
  const [gtCooldown, setGtCooldown] = useIntegerState(gtCooldowns[gtCooldowns.length - 1].value, 'calcGtCooldown', 100, 300);
  const [gtEnabled, setGtEnabled] = useCheckboxState(true, 'calcGtEnabled');
  const [dwCooldown, setDwCooldown] = useIntegerState(dwCooldowns[dwCooldowns.length - 1].value, 'calcDwCooldown', 100, 300);
  const [dwEnabled, setDwEnabled] = useCheckboxState(true, 'calcDwEnabled');
  const [bhCooldown, setBhCooldown] = useIntegerState(bhCooldowns[bhCooldowns.length - 1].value, 'calcBhCooldown', 50, 200);
  const [bhEnabled, setBhEnabled] = useCheckboxState(true, 'calcBhEnabled');
  const [gtCooldownSubstat, setGtCooldownSubstat] = useIntegerState(0, 'calcGtCooldownSubstat', 0, 12);
  const [dwCooldownSubstat, setDwCooldownSubstat] = useIntegerState(0, 'calcDwCooldownSubstat', 0, 13);
  const [bhCooldownSubstat, setBhCooldownSubstat] = useIntegerState(0, 'setBhCooldownSubstat', 0, 4);


  const gtCooldownValues = gtCooldowns.map((levels, index) => {
    return levels.value;
  });
  const dwCooldownValues = dwCooldowns.map((levels, index) => {
    return levels.value;
  });
  const bhCooldownValues = bhCooldowns.map((levels, index) => {
    return levels.value;
  });


  const cds: number[] = [];
  if (gtEnabled) cds.push(gtCooldown - gtCooldownSubstat);
  if (dwEnabled) cds.push(dwCooldown - dwCooldownSubstat);
  if (bhEnabled) cds.push(bhCooldown - bhCooldownSubstat);
  const totalCooldown = cds.reduce((curr, next) => curr + next, 0);

  let averageCooldown = 0;
  let averageCooldownwithMN = 0;
  if (cds.length > 0) {
    averageCooldown = avg(cds);
    averageCooldownwithMN = sum([averageCooldown, mnEffect]);
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
        <img src={logo} alt="MVN Logo" />
      </div>
      <div className='controls'>
        <div className='controlGroup'>
          <div className='control'>
            <label>
              MN Effect
              <select value={mnEffect} onChange={setMnEffect}>
                {Object.entries(MULTIVERSE_NEXUS_EFFECT).map(([key, value]) => (
                  <option key={key} value={value}>
                    {key}
                  </option>
                ))}
              </select>
            </label>
            {view === VIEWS.PERMA_CALCULATOR && (
              <input type='checkbox' checked={mnEnabled} onChange={setMnEnabled} />
            )}
          </div>
        </div>
        <div className='controlGroup'>
          <div className='control'>
            <label>
              GT CD
              <input 
                type='number'
                min='100'
                max='300'
                step={10}
                value={gtCooldown}
                onChange={setGtCooldown}>
              </input>
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
              <input 
                type='number'
                min='100'
                max='300'
                step={10}
                value={dwCooldown}
                onChange={setDwCooldown}>
              </input>
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
              <input 
                type='number'
                min='50'
                max='200'
                step={10}
                value={bhCooldown}
                onChange={setBhCooldown}>
              </input>
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
            mnEnabled,
            averageCooldownwithMN,
          }}
        />
      )}
    </div>
  );
};

export default Main;
