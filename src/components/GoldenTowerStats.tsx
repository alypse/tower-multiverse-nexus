import { useMemo } from 'react';
import { getInGameWaveTime } from '../utils/waveDuration';

export const GoldenTowerStats = ({ props }) => {

  const {
    packageCount,
    GT_COOLDOWN,
    GT_DURATION,
    isTournament,
    waveAcceleratorCard,
    galaxyCompressorEffect,
    gtDurationStonesLevel,
    gtDurationLabLevel,
    gtDurationSubstat,
    wavesToTest
  } = props;

  const GoldenTowerPermanence = (waves: number) => {
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
    const isPermanentGT = adjustedUptimeGT >= baseUptimeGT

    return {
      adjustedUptimeGT,
      totalWavesTime,
      isPermanentGT
    };
  };

  const GoldenTowerStats = useMemo(() => {
    return GoldenTowerPermanence(wavesToTest)
  },
    [
      packageCount,
      GT_COOLDOWN,
      isTournament,
      waveAcceleratorCard,
      galaxyCompressorEffect,
      gtDurationStonesLevel,
      gtDurationLabLevel,
      gtDurationSubstat
    ])

  return (
    <>
      <p>GT:</p>
      <p>Dur: {GT_DURATION(gtDurationStonesLevel, gtDurationLabLevel, gtDurationSubstat)}</p>
      <p>CD: {GT_COOLDOWN}</p>
      <p>Wave Time: {GoldenTowerStats.totalWavesTime.toLocaleString("en-US", { maximumSignificantDigits: 10 })}</p>
      <p>Uptime: {GoldenTowerStats.adjustedUptimeGT.toLocaleString("en-US", { maximumSignificantDigits: 10 })}</p>
      <p>Perma?: {GoldenTowerStats.isPermanentGT ? 'Yes' : 'No'}</p>
    </>
  )
}
