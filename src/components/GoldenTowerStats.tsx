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
    wavesToTest,
    assistGtDurationSubstat,
    substatEfficiency,
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
    const gtUptime = gtActivations * GT_DURATION(gtDurationStonesLevel, gtDurationLabLevel, gtDurationSubstat, assistGtDurationSubstat, substatEfficiency);

    const adjustedUptimeGT = (cdReductionTotal / totalWavesTime) * gtUptime;
    const baseUptimeGT = GT_COOLDOWN * gtActivations;
    const isPermanentGT = adjustedUptimeGT >= baseUptimeGT;
    const uptimePctGT = (adjustedUptimeGT / baseUptimeGT) * 100;

    return {
      adjustedUptimeGT,
      totalWavesTime,
      isPermanentGT,
      uptimePctGT,
    };
  };

  const GoldenTowerStats = useMemo(() => {
    return GoldenTowerPermanence(wavesToTest);
  }, [GoldenTowerPermanence, wavesToTest]);

  return (
    <>
      <p>GT:</p>
      <p>Dur: {GT_DURATION(gtDurationStonesLevel, gtDurationLabLevel, gtDurationSubstat, assistGtDurationSubstat, substatEfficiency)}</p>
      <p>CD: {GT_COOLDOWN}</p>
      <p>Wave Time: {GoldenTowerStats.totalWavesTime.toLocaleString('en-US', { maximumSignificantDigits: 7 })}</p>
      <p>Uptime: {GoldenTowerStats.adjustedUptimeGT.toLocaleString('en-US', { maximumSignificantDigits: 7 })}</p>
      <p>Perma?: {GoldenTowerStats.isPermanentGT ? 'Yes' : 'No'}</p>
      <p>Uptime: {GoldenTowerStats.uptimePctGT.toLocaleString('en-US', { maximumSignificantDigits: 5 })}%</p>
    </>
  );
};
