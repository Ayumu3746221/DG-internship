// 2. セグメントを分ける境界値を定義します（後で調整可能）
const LTV_THRESHOLDS = {
    high: 10000,
    middle: 1000,
};
/**
 * LTVの数値に基づいて、ユーザーセグメントを判定する
 * @param {number} ltv - 計算されたLTVの値
 * @returns {LtvSegment} 'high', 'middle', 'low', または 'none'
 */
export function determineSegment(ltv) {
    if (ltv >= LTV_THRESHOLDS.high) {
        return "high";
    }
    if (ltv >= LTV_THRESHOLDS.middle) {
        return "middle";
    }
    return "low";
}
