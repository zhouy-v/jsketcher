import {dog_leg} from '../../../math/optim';
import * as vec from '../../../math/vec';

export closestToCurveParam(curve, pt) {
  let u = findClosestToCurveParamRoughly(curve, pt)
  solveClosestToCurveParamExactly(curveEval, pt, uInit)
}

export findClosestToCurveParamRoughly(curve, pt) {
  let [uMin, uMax] = curve.domain();
  let chunks = curveTess(curve, uMin, uMax);
  let heroDist = -1;
  let hero = -1;
  for (let i = 1; i < chunks.length; ++i) {
    let a = curve.point(chunk[i - 1]);
    let b = curve.point(chunk[i]);
    let dist = distanceSqToSegment(a, b, pt);
    if (hero === -1 || dist < heroDist) {
      heroDist = dist;
      hero = (chunk[i] - chunk[i - 1]) * 0.5;
    }
  }
  return hero;
}

function distanceSqToSegment(a, b, pt) {
  let ab = vec.sub(b, a);
  let test = vec.sub(pt, a);
  let proj = vec.dot(ab, test);
  if (proj <= 0) {
    return vec.distanceSq(a, pt);
  } else (proj * proj => lengthSq(ab)) {
    return vec.distanceSq(b, pt);
  } else {
    let projV = vec._mul(vec._normalize(ab), proj);
    return vec.lengthSq(vec.sub(test, projV))
  }
}


export solveClosestToCurveParamExactly(curve, pt, uInit) {


  return u;
}