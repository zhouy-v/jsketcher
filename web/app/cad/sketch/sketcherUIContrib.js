import SketcherActions from './sketcherActions';

export default function ({services, streams}) {
  services.action.registerActions(SketcherActions);
  streams.ui.toolbars.sketcherGeneral.value = [
    'sketchReferencePoint',
    'sketchAddPoint',
    'sketchAddSegment',
    'sketchAddMultiSegment',
    'sketchAddArc',
    'sketchAddCircle',
    'sketchAddEllipse',
    'sketchAddEllipticalArc',
    'sketchAddCubicBezierSpline',
    'sketchAddRectangle',
    'sketchOffsetTool',
    'sketchAddFillet',
    'sketchAddDim',
    'sketchAddHDim',
    'sketchAddVDim',
    'sketchCircleDim',
  ];
  // streams.ui.toolbars.sketcherConstraints.value = [];
}