import { useMemo } from 'react';
import { getInGameWaveTime } from '../utils/waveDuration';

export const BlackHoleStats = ({ props }) => {

  const {
    wavesToTest,
    packageCount,
    BH_COOLDOWN,
    BH_DURATION,
    isTournament,
    waveAcceleratorCard,
    galaxyCompressorEffect,
    bhDurationStones,
    bhDurationSubstat,
    bhPerk,
  } = props;

  const BlackHolePermanence = (waves: number) => {
    let waveCountBH = waves;
    let totalWavesTime = 0;
    while (waveCountBH > 0) {
      totalWavesTime += getInGameWaveTime(waveAcceleratorCard, isTournament);
      waveCountBH--;
    }
    const cdReductionTotal = totalWavesTime + packageCount * galaxyCompressorEffect;
    const bhActivations = totalWavesTime / BH_COOLDOWN;
    const bhUptime = bhActivations * BH_DURATION(bhDurationStones, bhDurationSubstat, bhPerk);

    const adjustedUptimeBH = (cdReductionTotal / totalWavesTime) * bhUptime;
    const baseUptimeBH = BH_COOLDOWN * bhActivations;
    const isPermanentBH = adjustedUptimeBH >= baseUptimeBH;

    return {
      adjustedUptimeBH,
      totalWavesTime,
      isPermanentBH,
    };
  };

  const BlackHoleStats = useMemo(() => {
      return BlackHolePermanence(wavesToTest)
    },
    [
      packageCount,
      BH_COOLDOWN,
      isTournament,
      waveAcceleratorCard,
      galaxyCompressorEffect,
      bhDurationStones,
      bhDurationSubstat,
      bhPerk
    ])

  return (
    <>
      <p>BH:</p>
      <p>Dur: {BH_DURATION(bhDurationStones, bhDurationSubstat, bhPerk)}</p>
      <p>CD: {BH_COOLDOWN}</p>
      <p>Wave Time: {BlackHoleStats.totalWavesTime.toLocaleString('en-US', { maximumSignificantDigits: 7 })}</p>
      <p>Uptime: {BlackHoleStats.adjustedUptimeBH.toLocaleString('en-US', { maximumSignificantDigits: 7 })}</p>
      <p>Perma?: {BlackHoleStats.isPermanentBH ? 'Yes' : 'No'}</p>
    </>
  );
}
