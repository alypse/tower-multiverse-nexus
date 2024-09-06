import { useMemo } from 'react';
import { getInGameWaveTime } from '../utils/waveDuration';

export const GoldenTowerStats = ({ props }) => {

  const {
    isTournament,
    waveAcceleratorCard,
    galaxyCompressorEffect,
    gtDurationStonesLevel,
    gtDurationLabLevel,
    gtDurationSubstat,
    wavesToTest
  } = props;

  const GTPermanence = (waves: number) => {
    let waveCountGT = waves;
    let totalWavesTime = 0;
    while (waveCountGT > 0) {
      totalWavesTime += getInGameWaveTime(waveAcceleratorCard, isTournament);
      waveCountGT--;
    }
    const cdReductionTotal = totalWavesTime + props.packageCount * galaxyCompressorEffect;
    const gtActivations = totalWavesTime / props.GT_COOLDOWN;
    const gtUptime = gtActivations * props.GT_DURATION(gtDurationStonesLevel, gtDurationLabLevel, gtDurationSubstat);

    const adjustedUptimeGT = (cdReductionTotal / totalWavesTime) * gtUptime
    const baseUptimeGT = props.GT_COOLDOWN * gtActivations
    const isPermenant = adjustedUptimeGT >= baseUptimeGT

    return {
      adjustedUptimeGT,
      totalWavesTime,
      isPermenant
    };
  };

  const GTStatsMemo = useMemo(() => {
    return GTPermanence(wavesToTest)
  }, 
    [
      isTournament,
      waveAcceleratorCard,
      galaxyCompressorEffect,
      gtDurationStonesLevel,
      gtDurationLabLevel,
      gtDurationSubstat
    ])

  return (
    <>
      <p>Total Waves Time: {Math.round(GTStatsMemo.totalWavesTime)}</p>
      <p>Adjusted Uptime: {Math.round(GTStatsMemo.adjustedUptimeGT * 100) / 100}</p>
      <p>Perma?: {GTStatsMemo.isPermenant ? 'Yes' : 'No'}</p>
    </>
  )
}
