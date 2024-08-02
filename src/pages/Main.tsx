import './Main.scss';
import '../variables.scss';
import { useInputState, useIntegerState } from '../utils/hooks';
import { Calculator } from '../components/Calculator';
import { PermaCalculator } from '../components/PermaCalculator';
import React, { useState } from 'react';
import { MULTIVERSE_NEXUS_EFFECT, DEATH_WAVE_SUBSTATS_COOLDOWN, GOLDEN_TOWER_SUBSTATS_COOLDOWN, BLACK_HOLE_SUBSTATS_COOLDOWN } from '../utils/Values';
import { DEATH_WAVE, BLACK_HOLE, GOLDEN_TOWER } from 'tower-idle-toolkit';
import { sum, avg } from '../utils/utils';
import { useCheckboxState } from '../utils/hooks';

const gtCooldowns = GOLDEN_TOWER.upgrades.Cooldown.values;
const dwCooldowns = DEATH_WAVE.upgrades.Cooldown.values;
const bhCooldowns = BLACK_HOLE.upgrades.Cooldown.values;
const mnEffects = Object.values(MULTIVERSE_NEXUS_EFFECT);

const VIEWS = {
  CALCULATOR: 'MN Calculator',
  PERMA_CALCULATOR: 'Perma Calculator',
};

export const Main = () => {
  const [view, setView] = useInputState(VIEWS.CALCULATOR, 'view');

  const [mnEffect, setMnEffect] = useIntegerState(mnEffects[mnEffects.length - 1], 'calcMvnEffect', -10, 20);
  const [gtCooldown, setGtCooldown] = useIntegerState(gtCooldowns[gtCooldowns.length - 1].value, 'calcGtCooldown', 100, 300);
  const [gtEnabled, setGtEnabled] = useCheckboxState(true, 'gt');
  const [dwCooldown, setDwCooldown] = useIntegerState(dwCooldowns[dwCooldowns.length - 1].value, 'calcDwCooldown', 300, 100);
  const [dwEnabled, setDwEnabled] = useCheckboxState(true, 'dw');
  const [bhCooldown, setBhCooldown] = useIntegerState(bhCooldowns[bhCooldowns.length - 1].value, 'calcBhCooldown', 50, 200);
  const [bhEnabled, setBhEnabled] = useCheckboxState(true, 'bh');
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
        <p style={{fontWeight: 'bolder'}}>Note: Values are not yet updated for V24</p>
      </div>
      <div className='controls'>
        {view === VIEWS.CALCULATOR && (
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
            </div>
          </div>
        )}
        <div className='controlGroup'>
          <div className='control'>
            <label>
              GT CD
              <select value={gtCooldown} onChange={setGtCooldown}>
                {gtCooldownValues.map((value, index) => (
                  <option key={index} value={value}>
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
        {view === VIEWS.CALCULATOR && (
          <div className='controlGroup'>
            <div className='control'>
              <label>
                DW CD
                <select value={dwCooldown} onChange={setDwCooldown}>
                  {dwCooldownValues.map((value, index) => (
                    <option key={index} value={value}>
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
        )}
        <div className='controlGroup'>
          <div className='control'>
            <label>
              BH CD
              <select value={bhCooldown} onChange={setBhCooldown}>
                {bhCooldownValues.map((value, index) => (
                  <option key={index} value={value}>
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
      {view === VIEWS.CALCULATOR && (
        <Calculator
          props={{
            gtCooldown: gtCooldown - gtCooldownSubstat,
            dwCooldown: dwCooldown - dwCooldownSubstat,
            bhCooldown: bhCooldown - bhCooldownSubstat,
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
            bhCooldown: bhCooldown - bhCooldownSubstat,
            totalCooldown,
            averageCooldown,
            averageCooldownwithMN,
          }}
        />
      )}
    </div>
  );
};

export default Main;
