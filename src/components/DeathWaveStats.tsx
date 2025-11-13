import { useMemo } from 'react';
import { getInGameWaveTime } from '../utils/waveDuration';

export const DeathWaveStats = ({ props }) => {

  const {
    wavesToTest,
    packageCount,
    DW_COOLDOWN,
    DW_DURATION,
    DEATH_WAVE_INTERVAL,
    dwEffectWavesCount,
    isTournament,
    waveAcceleratorCard,
    galaxyCompressorEffect,
    assistDwQuantitySubstat,
    substatEfficiency,
  } = props;

  // Calculate total DW quantity with assist module contribution (rounded down)
  const assistDwQuantityContribution = Math.floor(assistDwQuantitySubstat * substatEfficiency / 100);
  const totalDwQuantity = dwEffectWavesCount + assistDwQuantityContribution;

  const DeathWavePermanence = (waves: number) => {
    let waveCountDW = waves;
    let totalWavesTime = 0;
    while (waveCountDW > 0) {
      totalWavesTime += getInGameWaveTime(waveAcceleratorCard, isTournament);
      waveCountDW--;
    }
    const cdReductionTotal = totalWavesTime + packageCount * galaxyCompressorEffect;
    const dwActivations = totalWavesTime / DW_COOLDOWN;
    const dwUptime = dwActivations * DW_DURATION(totalDwQuantity, DEATH_WAVE_INTERVAL);

    const adjustedUptimeDW = (cdReductionTotal / totalWavesTime) * dwUptime;
    const baseUptimeDW = DW_COOLDOWN * dwActivations;
    const isPermanentDW = adjustedUptimeDW >= baseUptimeDW;
    const uptimePctDW = (adjustedUptimeDW / baseUptimeDW) * 100;

    return {
      adjustedUptimeDW,
      totalWavesTime,
      isPermanentDW,
      uptimePctDW,
    };
  };

  const DeathWaveStats = useMemo(() => {
      return DeathWavePermanence(wavesToTest)
    },
    [
      packageCount,
      DW_COOLDOWN,
      isTournament,
      waveAcceleratorCard,
      galaxyCompressorEffect,
      dwEffectWavesCount,
      assistDwQuantitySubstat,
      substatEfficiency,
    ])

  return (
    <>
      <p>DW:</p>
      <p>Dur: {DW_DURATION(totalDwQuantity, DEATH_WAVE_INTERVAL)}</p>
      <p>CD: {DW_COOLDOWN}</p>
      <p>Wave Time: {DeathWaveStats.totalWavesTime.toLocaleString('en-US', { maximumSignificantDigits: 7 })}</p>
      <p>Uptime: {DeathWaveStats.adjustedUptimeDW.toLocaleString('en-US', { maximumSignificantDigits: 7 })}</p>
      <p>Perma?: {DeathWaveStats.isPermanentDW ? 'Yes' : 'No'}</p>
      <p>Uptime: {DeathWaveStats.uptimePctDW.toLocaleString('en-US', { maximumSignificantDigits: 5 })}%</p>
    </>
  );
}
