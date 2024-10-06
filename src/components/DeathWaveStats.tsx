import { useMemo } from 'react';
import { getInGameWaveTime } from '../utils/waveDuration';

export const DeathWaveStats = ({ props }) => {

  const {
    wavesToTest,
    packageCount,
    DW_COOLDOWN,
    DW_DURATION,
    isTournament,
    waveAcceleratorCard,
    galaxyCompressorEffect,
    dwQuantity,
    DW_EFFECT_WAVE_INTERVAL,
  } = props;

  const DeathWavePermanence = (waves: number) => {
    let waveCountDW = waves;
    let totalWavesTime = 0;
    while (waveCountDW > 0) {
      totalWavesTime += getInGameWaveTime(waveAcceleratorCard, isTournament);
      waveCountDW--;
    }
    const cdReductionTotal = totalWavesTime + packageCount * galaxyCompressorEffect;
    const dwActivations = totalWavesTime / DW_COOLDOWN;
    const dwUptime = dwActivations * DW_DURATION(
      dwQuantity,
      DW_EFFECT_WAVE_INTERVAL,
    );

    const adjustedUptimeDW = (cdReductionTotal / totalWavesTime) * dwUptime
    const baseUptimeDW = DW_COOLDOWN * dwActivations
    const isPermanentDW = adjustedUptimeDW >= baseUptimeDW
    const uptimePercentageDW = (adjustedUptimeDW / baseUptimeDW) * 100

    return {
      adjustedUptimeDW,
      totalWavesTime,
      isPermanentDW,
      uptimePercentageDW,
    };
  };

  const DeathWaveStats = useMemo(() => {
    return DeathWavePermanence(wavesToTest)
  },
    [
      packageCount,
      dwQuantity,
      isTournament,
      waveAcceleratorCard,
      galaxyCompressorEffect,
    ])

  return (
    <>
      <p>DW:</p>
      <p>Dur: {DW_DURATION(dwQuantity,DW_EFFECT_WAVE_INTERVAL)}</p>
      <p>CD: {DW_COOLDOWN}</p>
      <p>Wave Time: {DeathWaveStats.totalWavesTime.toLocaleString("en-US", { maximumSignificantDigits: 10 })}</p>
      <p>Uptime: {DeathWaveStats.adjustedUptimeDW.toLocaleString("en-US", { maximumSignificantDigits: 10 })}</p>
      <p>Perma?: {DeathWaveStats.isPermanentDW ? 'Yes' : 'No'}</p>
      <p>Uptime Pct: {DeathWaveStats.uptimePercentageDW.toLocaleString("en-US", { maximumSignificantDigits: 4 })}%</p>
    </>
  )
}
