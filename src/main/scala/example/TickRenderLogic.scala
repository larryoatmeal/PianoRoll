package example

import scala.collection.immutable.IndexedSeq
import scala.scalajs.js.JSON

/**
 * Created by Larry on 7/12/15.
 */


/**
 *
 * @param beat
 * @param symbol If < 0, then a tick type such as eighth or sixteenth. Otherwise, the measure number
 */
case class TickMarker(beat: Int, symbol: Int)
object TickMarker{
  val MeasureTick = -1
  val QuarterTick = -2
  val EightTick = -3
  val SixteenthTick = -4
  val ThirtySecondTick = -5
}

class TickRenderLogic(song: Song){


//  val MeasureToBeatMap: Vector[Int] = Vector.range(0, song.measures).map(
//    measure => getBeatAtMeasure(measure)
//  )

  //val BeatToMeasureMap: Map[Int, Int] = MeasureToBeatMap.map(_.swap)

  //goal post (beatNumber, meter up to this point)
//  lazy val cumulativeMeasureMarker = getCumulativeMeasureMarker
//  val totalBeats = cumulativeMeasureMarker.last.beat

  //lazy val totalBeats = cumulativeMeasureMarker.last.beat

//  def getCumulativeMeasureMarker: Vector[MeasureMarker] = {
//    val meterChanges = song.meterChanges
//
//    //for the math
//    val lastMeterChange = meterChanges.last
//    val endCapMeterChange = lastMeterChange.copy(measure = song.measures)
//    val balancedMeterChanges = song.meterChanges :+ endCapMeterChange
//
//    //1: difference in measures
//    //2: meter that applies during that span
//    //3: ending measure number of that span
//    val deltaMeasures: Vector[(Int, Int, Int)] = (balancedMeterChanges, balancedMeterChanges drop 1).zipped.map({
//      (first, second) => (second.measure - first.measure, first.meter, second.measure)
//    })
//
//    deltaMeasures.map{
//      var accumulator = 0
//      d => {
//        val (deltaMeasures, meter, measure) = d
//        val deltaBeats = deltaMeasures*meter
//        accumulator += deltaBeats
//        MeasureMarker(measure, accumulator, meter)
//      }
//    }
//  }

//  def getMeasureClosestToBeat(desiredBeat: Int, roundUp: Boolean): Int ={
//    //find first measure marker that is greater
//    val endPost = cumulativeMeasureMarker.find({
//      measureMarker => {
//        measureMarker.beat > desiredBeat//beat which is greater
//      }
//    }).getOrElse(cumulativeMeasureMarker.last)//note, we should always be able to find this
//
//    //we are subtracting so roundUp is subtracting a floor, and vice versa
//    val deltaMeasure = if(roundUp){
//      (endPost.beat - desiredBeat)/endPost.meter
//    } else{
//      MyMath.ceil(endPost.beat - desiredBeat,endPost.meter)
//    }
//    endPost.measure - deltaMeasure
//  }
//
//  //TODO: refactor into above
//  def getMeasureMarkerBeatContainedIn(beat: Int) = {
//    cumulativeMeasureMarker.find({
//      measureMarker => {
//        measureMarker.beat > beat//beat which is greater
//      }
//    }).getOrElse(cumulativeMeasureMarker.last)
//  }
//
//
//  def getBeatAtMeasure(measure: Int): Int ={
//    //find first measure marker that is greater
//    val endPost = cumulativeMeasureMarker.find({
//      measureMarker => {
//        measureMarker.measure > measure//measure which is greater
//      }
//    }).getOrElse(cumulativeMeasureMarker.last)//note, we should always be able to find this
//
//    val offsetFromEndPost = (endPost.measure - measure)*endPost.meter
//    endPost.beat - offsetFromEndPost
//  }
//
//  /**
//   *
//   * @param startBeat Starting beat at left edge of window
//   * @param endBeat Starting beat at right edge of window
//   * @return List of tuples with measure numbers and the beats they correspond to
//   */
//  def getMeasureMarkers(startBeat: Int, endBeat: Int): Seq[(Int, Int)] = {
//    if(song.meterChanges.size == 1){
//      getMeasureMarkersNoMeterChange(startBeat, endBeat)
//    }else {
//      val width = endBeat - startBeat
//      val firstMeasure = getMeasureClosestToBeat(startBeat, roundUp = true)
//      val lastMeasure = getMeasureClosestToBeat(endBeat, roundUp = false)
//
//      val measureInterval = MyMath.ceil(lastMeasure - firstMeasure, PianoRollConfig.MaxMeasureTicksShownInRuler)
//
//      val range: Range = firstMeasure until lastMeasure+measureInterval by measureInterval
//
//      range.map {
//        measure => (measure, getBeatAtMeasure(measure))
//      }
//    }
//  }
//
//  private def getMeasureMarkersNoMeterChange(startBeat: Int, endBeat: Int): Seq[(Int,Int)] = {//more efficient implementation
//    val meter: Int = song.meterChanges.head.meter//only one meter
//
//    val firstMeasure = MyMath.ceil(startBeat,meter)
//    val lastMeasure = endBeat/meter
//    val measureInterval = MyMath.ceil(lastMeasure - firstMeasure, PianoRollConfig.MaxMeasureTicksShownInRuler)
//
//    val range: Range = firstMeasure until lastMeasure by measureInterval
//    range.map{
//      measure => (measure, measure * meter)
//    }
//  }

  /**
   *
   * @param startBeat Start beat of the window
   * @param widthBeat
   * @param maxTicksPerWindow Maximum number of ticks that should actually be drawn
   * @param subdivideMeasuresThresh Number above which don't attempt to subdivide measures
   * @return Iterator of TickMarkers, which specify a certain tick to display at a certain beat
   */
  def getTickMarkers(startBeat: Int, widthBeat: Int,
                     maxTicksPerWindow: Int = 100, subdivideMeasuresThresh: Int = 30): Iterator[TickMarker] = {
    val startMeasure = song.getMeasureClosestToBeat(startBeat, roundUp = false)
    val endBeat = startBeat + widthBeat//noninclusive
    val endMeasure = song.getMeasureClosestToBeat(endBeat, roundUp = false)

    val widthMeasures = endMeasure - startMeasure

    if(widthBeat > PianoRollConfig.BeatResolution * 30){//only display measure, don't bother with others
      val stepSize = MyMath.ceil(widthMeasures, 30)
      val adjustedStartMeasure = startMeasure/stepSize*stepSize
      val adjustedStartMeasureV2 =
        if(song.MeasureToBeatMap(adjustedStartMeasure) < startBeat) adjustedStartMeasure + stepSize
        else adjustedStartMeasure
      //bound issues, ensure start measure is actually visible
      for {
        measure <- Iterator.range(adjustedStartMeasureV2, endMeasure, stepSize)
      }yield TickMarker(song.MeasureToBeatMap(measure), measure)
    }else{
      val tickSize = MyMath.powerOfTwoAbove(widthBeat/maxTicksPerWindow)
      for{
        measure <- Iterator.range(startMeasure, endMeasure + 1)
        startBeatOfMeasure =song.MeasureToBeatMap(measure)
        beat <- Iterator.range(startBeatOfMeasure, song.MeasureToBeatMap(measure+1), tickSize)
        if beat >= startBeat && beat < endBeat
      } yield {
        TickMarker(beat, if(beat == startBeatOfMeasure) measure else getTickSymbol(beat, startBeatOfMeasure))
      }
    }
  }

  /**
   *
   * @param beat
   * @param startBeatOfMeasure
   * @return
   */
  def getTickSymbol(beat: Int, startBeatOfMeasure: Int): Int ={
    val deltaBeat = beat - startBeatOfMeasure
    if(deltaBeat % PianoRollConfig.BeatsInQuarter == 0){
      TickMarker.QuarterTick
    }else if(deltaBeat % PianoRollConfig.BeatsInEighth == 0){
      TickMarker.EightTick
    }else{
      TickMarker.SixteenthTick
    }
  }

  def nearestSnapBeat(beat: Double, beatsPerQuantize: Double) = {
    val measure = song.getMeasureClosestToBeat(beat.toInt, roundUp = false)
    val measureStartBeat = song.MeasureToBeatMap(measure)
    
    val unitsOfQuantize = (beat - measureStartBeat)/beatsPerQuantize
    measureStartBeat + unitsOfQuantize*beatsPerQuantize
  }

}





